interface Bucket{
    tokens : number;
    lastRefill : number;
}
export class TokenBucketLimiter{
    private readonly capacity : number;
    private readonly refillRate : number;
    private readonly bucket : Map< string ,Bucket>;

    constructor(capacity:number , refillRate : number){
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.bucket = new Map();
    }

    allow(key : string) : boolean{
        return this.allowCost(key,1,-1);
    }
    allowCost(key : string, cost : number, now : number) : boolean{
        const current = now <0? Date.now()/1000 : now;
        const bucket = this.bucket.get(key) ?? {tokens : this.capacity, lastRefill:current};

        const elapsed = Math.max(0,current - bucket.lastRefill);
        let tokens = Math.min(this.capacity , bucket.tokens + elapsed * this.refillRate);

        if(tokens<cost){
            this.bucket.set(key,{tokens, lastRefill:current});
            return false;
        }

        tokens -= cost;
        this.bucket.set(key,{tokens , lastRefill:current});
        return true;
    }
}