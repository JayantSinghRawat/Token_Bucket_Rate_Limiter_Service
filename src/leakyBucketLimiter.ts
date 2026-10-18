export class leakyBucketLimiter{
    private readonly capacity : number;
    private readonly interval : number;
    private readonly queues : Map<string, number[]>;

    constructor(capacity : number , leakRatePerSecond : number){
        this.capacity = capacity;
        this.interval = 1/leakRatePerSecond;
        this.queues = new Map();
    }

    allow(key : string, now?:number): boolean{
        const current = now === undefined ? Date.now()/1000 : now;
        let queue = this.queues.get(key);
        if(queue === undefined){
            queue = [];
            this.queues.set(key,queue);
        }

        while(queue.length >0 && queue[0]<=current){
            queue.shift();
        }

        if(queue.length >= this.capacity){
            return false;
        }

        const lastScheduled = queue.length === 0 ? current : queue[queue.length -1];
        queue.push(Math.max(current,lastScheduled)+this.interval);
        return true;
        
    }
}