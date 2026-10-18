export class SlidingWindowLogLimiter{
    private  limit:number;
    private  windowSeconds : number;
    private  events : Map<string,number[]>;

    constructor(limit:number, windowSeconds:number){
        this.limit = limit;
        this.windowSeconds = windowSeconds;
        this.events = new Map();
    }

    allow(key:string , now?:number) : boolean{
        const current = now === undefined  ?Date.now()/1000.0:now;
        const cutoff = current - this.windowSeconds;
        let timestamps = this.events.get(key);
        if(timestamps === undefined){
            timestamps = [];
            this.events.set(key,timestamps);
        }

        while(timestamps.length>0 && timestamps[0] <=cutoff){
            timestamps.shift();
        }

        if(timestamps.length >=this.limit){
            return false;
        }

        timestamps.push(current);
        return true;
    }

}