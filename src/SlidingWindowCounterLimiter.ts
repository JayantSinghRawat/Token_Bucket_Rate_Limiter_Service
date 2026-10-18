interface State{
    currentStart : number;
    previousCount : number;
    currentCount : number;
}
export class slidingWindowCounterLimiter{
    private readonly limit : number;
    private readonly windowSeconds : number;
    private readonly state : Map<string , State>;

    constructor(limit : number, windowSeconds : number){
        this.limit = limit;
        this.windowSeconds = windowSeconds;
        this.state = new Map();
    }
    
    allow(key : string) : boolean{
        return this.allowWithNow(key, Date.now()/1000.0); 
    }
    allowWithNow(key : string, now : number): boolean{
        const windowStart = now - (now % this.windowSeconds);

        let s = this.state.get(key);
        if(!s){
            s = {currentStart:windowStart, previousCount : 0, currentCount : 0};
        }

        if(windowStart > s.currentStart){
            const windowPassed = Math.floor((windowStart-s.currentCount) / this.windowSeconds);
            s.previousCount = windowPassed === 1 ? s.currentCount : 0;
            s.currentCount = 0;
            s.currentStart = windowStart;
        }

        const elapsed = now - s.currentStart;
        const previousWeight = (this.windowSeconds - elapsed) /this.windowSeconds;
        const estimatedCount = s.previousCount * previousWeight + s.currentCount;

        if(estimatedCount+1 > this.limit){
            this.state.set(key,s);
            return false;
        }

        s.currentCount += 1;
        this.state.set(key,s);
        return true;
    }
}