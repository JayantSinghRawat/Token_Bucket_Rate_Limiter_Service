import { fixedWindowLimiter } from "./fixedWindowLimiter.js";
import { SlidingWindowLogLimiter } from "./SlidingWindowLogLimiter.js";

// const limiter = new fixedWindowLimiter(3, 4);
const limiter = new SlidingWindowLogLimiter(3,4)

// First 3 requests should be allowed
console.log(limiter.allow("user1" )); // true
console.log(limiter.allow("user1" )); // true
console.log(limiter.allow("user1" )); // true

// 4th request should be blocked
console.log(limiter.allow("user1")); // false

// Different user has a separate counter
console.log(limiter.allow("user2")); // true

// New time window: requests should be allowed again
console.log(limiter.allow("user1")); // true