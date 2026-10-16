export class fixedWindowLimiter{
    private readonly limit : number;
    private readonly windowSeconds : number;
    private readonly counts : Map<string,number>;

    constructor(limit:number, windowSeconds:number){
        this.limit = limit;
        this.windowSeconds = windowSeconds;
        this.counts = new Map<string,number>();
    }

    allow(key:string, now:number | null = null):boolean{
        const current = now === null? Date.now()/1000 : now;
        const window = Math.floor(current/this.windowSeconds);
        const counterKey = key + "#" + window;

        const count = (this.counts.get(counterKey) ?? 0)+1;
        this.counts.set(counterKey,count);

        return  count <= this.limit;
    }
}

