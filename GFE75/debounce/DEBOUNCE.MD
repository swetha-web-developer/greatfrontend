Debouncing is a technique used to control how many times we allow a function to be executed over time. When a JavaScript function is debounced with a wait time of X milliseconds, it must wait until after X milliseconds have elapsed since the debounced function was last called.

You almost certainly have encountered debouncing in your daily lives before (e.g. when entering an elevator). Only after X duration of not pressing the "Door open" button (the debounced function not being called) will the elevator door actually close (the callback function is executed).

Implement debounce(func, wait) so that func is called only after wait milliseconds have passed since the most recent call. The returned function should not invoke func immediately. When the delayed call finally runs, it should use the latest arguments and preserve the this value from the most recent call.

Arguments
func (Function): The callback to debounce.
wait (number): The number of milliseconds to wait after the latest call.
Returns
(Function): Returns the debounced function.

Examples

let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.

// t = 100: increment() was invoked and i is now 1.
debouncedIncrement() is called multiple times.


let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
//  Call debouncedIncrement() again.
debouncedIncrement(); // i = 0

// t = 100: i is still 0 because it has only
//  been 50ms since the last debouncedIncrement() at t = 50.

// t = 150: Because 100ms have passed since
//  the last debouncedIncrement() at t = 50,
//  increment was invoked and i is now 1 .
Follow up
Debounce with a cancel() method to cancel delayed invocations and a flush() method to immediately invoke them.
Implement throttle, which is similar to debounce but a little different.

Debounce is about keeping only the latest scheduled call. Every new invocation resets the waiting period, so the callback runs only after calls stop for wait milliseconds.

Solution
The recommended implementation keeps one timeout ID in a closure and returns a normal function wrapper around func.

1. Schedule the trailing call
Use setTimeout to delay the actual func call by wait.
Store the returned timeout ID so the next invocation can cancel it with clearTimeout.
Each new call replaces the previous timer with a fresh one.
2. Preserve the original call shape
The debounced function should behave like the original one, just later. That means forwarding both the arguments and the caller's this.

Calling func(...args) would lose the dynamic this value, so the callback should be invoked with Function.prototype.apply() or Function.prototype.call().


JavaScript

TypeScript

Open files in workspace

/**
 * @param {(...args: Array<unknown>) => unknown} func
 * @param {number} wait
 * @returns {(...args: Array<unknown>) => void}
 */
export default function debounce(func, wait = 0) {
  let timeoutID = null;
  return function (...args) {
    // Keep a reference to `this` so that
    // func.apply() can access it.
    const context = this;
    clearTimeout(timeoutID);

    timeoutID = setTimeout(function () {
      timeoutID = null; // Not strictly necessary but good to do this.
      func.apply(context, args);
    }, wait);
  };
}
Edge cases
The main pitfall is preserving the correct this when the callback finally runs inside the timeout.

One option is to save this into another variable before scheduling the timeout and read it back later.
Another option is to use an arrow function for the setTimeout callback, because arrow functions capture this lexically from the surrounding wrapper function.

Open files in workspace

export default function debounce(func: Function, wait: number = 0): Function {
  let timeoutID: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Array<any>) {
    clearTimeout(timeoutID ?? undefined);

    timeoutID = setTimeout(() => {
      timeoutID = null; // Not strictly necessary but good to include.
      // Has the same `this` as the outer function's
      // as it's within an arrow function.
      func.apply(this, args);
    }, wait);
  };
}
The returned debounced function itself should not be an arrow function. Its this must be determined when callers invoke it.