import { fixedWindowLimiter } from "./fixedWindowLimiter.js";
import { slidingWindowLogLimiter } from "./SlidingWindowLogLimiter.js";
import { slidingWindowCounterLimiter } from "./SlidingWindowCounterLimiter.js";
import { tokenBucketLimiter } from "./TokenBucketLimiter.js";
import { leakyBucketLimiter } from "./leakyBucketLimiter.js";
// const limiter = new fixedWindowLimiter(3, 4);
// const limiter = new SlidingWindowLogLimiter(3,4);
// const limiter = new SlidingWindowCounterLimiter(3,4)
// const limiter = new tokenBucketLimiter(3,1);
const limiter = new leakyBucketLimiter(3,1);

// First 3 requests should be allowed
console.log(limiter.allow("user1" )); // true
console.log(limiter.allow("user1" )); // true
console.log(limiter.allow("user1" )); // true

// 4th request should be blocked
console.log(limiter.allow("user1")); // false

setTimeout(() => {
    console.log("Hello after 2 seconds");
}, 1000);
console.log(limiter.allow("user1")); // false
console.log(limiter.allow("user1")); // false
console.log(limiter.allow("user1")); // false
console.log(limiter.allow("user1")); // false

// Different user has a separate counter
console.log(limiter.allow("user2")); // true

// New time window: requests should be allowed again
console.log(limiter.allow("user1")); // true