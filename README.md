# promises-from-scratch
The goal was to build a very basic promises library to gain a deeper understanding of promises. Several iterations later, the base functionality was there, and the goal is now to meet the A+ spec 100%.

Implemented functionality:
- .then(), with full chaining capability, and handling returned promises just as easily as returned values (from within the callbacks passed to .then)
- setTimeoutPromise, a setTimeout wrapper which provides a promise interface, so that .then can be called to retrieve the return value of the callback passed to setTimeout, which is then passed down the chain

