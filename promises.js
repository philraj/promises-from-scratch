// MyPromise constructor
function MyPromise (executor) {
  var value; // promise is resolved/rejected with this value/reason
  var state = 'pending'; // current pending|resolved|rejected promise state
  var resolvers = []; // queued functions to be called once resolved
  var rejectors = []; // queued functions to be called once rejected

  function resolve (val) {
    // prevents state from being changed once resolved/rejected
    if (state !== 'pending') return;
    // if val is promise-like, handle resolution within its then()
    if (typeof val.then === 'function') {
      val.then(resolve, reject);
      return;
    }

    value = val; // promise is now permanently resolved to this value
    state = 'resolved';
    // if there are resolvers waiting to be called, call each one
    if (resolvers.length) {
      resolvers.forEach( callback => setImmediate(callback) );
    }
  }

  function reject (val) {
    if (state !== 'pending') return;

    if (typeof val.then === 'function') {
      val.then(resolve, reject);
      return;
    }

    value = val;
    state = 'rejected';

    if (rejectors.length) {
      rejectors.forEach( callback => setImmediate(callback) );
    }
  }

  // This is where the magic happens
  this.then = function (successCB, failureCB) {
    return new MyPromise( function (thenResolve, thenReject) {
      var resolver, rejector;

      if (typeof successCB === 'function') {
        resolver = () => {
          try {
            thenResolve(successCB(value));
          }
          catch (e) {
            thenReject(e);
          }
        }
      }
      else {
        resolver = () => thenResolve(value);
      }

      if (typeof failureCB === 'function') {
        rejector = () => {
          try {
            thenReject(failureCB(value));
          }
          catch (e) {
            thenReject(e);
          }
        }
      }
      else {
        rejector = () => thenReject(value);
      }

      if (state = 'pending') {
        resolvers.push(resolver);
        rejectors.push(rejector);
      }
      else if (state === 'resolved') {
        setImmediate(resolver);
      }
      else if (state === 'rejected') {
        setImmediate(rejector);
      }
    });
  }
  //
  // function attempt (callback, onSuccess, onException) {
  //   if (typeof callback === 'function') {
  //     return () => {
  //       try {
  //         onSuccess(callback(value));
  //       }
  //       catch (e) {
  //         onException ? onException(e) : onSuccess(e);
  //       }
  //     }
  //   }
  //   else {
  //     return () => onSuccess(value);
  //   }
  // }
  // Finally, run the function which was passed to the constructor
  executor(resolve, reject);
}

// Creating my promise
var promise = new MyPromise( function (resolve, reject) {
  try {
    var val = Math.random();
    console.log(`Promise seeded with: ${val}`);

    if (val > 0.3) {
      setTimeout(
        () => resolve(val),
        Math.random() * 1000 + 500
      );
    }
    else {
      setTimeout(
        () => { throw `Rejected, value too low: ${val}` },
        Math.random() * 1000 + 500
      );
    }
  }
  catch (e) {
    reject(e);
  }
});

// Using my promise chain
promise.then(
  val => {
    var truncated = truncate(val, 3);
    console.log(`Truncated resolve value: ${truncated}`);
    return truncated;
  }
).then(
  val => {
    var delay = Math.random() * 1000 + 500;

    return setTimeoutPromise(delay, () => {
      if (delay > 1000) throw `Delay too high: ${delay} ms`;
      return val;
    });
  }
).then(
  val => {
    console.log(`Resolve value * 1000 = ${val * 1000}`);
  },
  err => {
    console.log(err);
  }
);

// Version of setTimeout with parameters reversed, which is wrapped in a
// MyPromise. This allows a return value from within the setTimeout callback to
// be passed down a promise chain, unlike the usual situation where the return
// value would be lost, forcing you to send the value to a second callback.
function setTimeoutPromise (delay, callback) {
  return new MyPromise( function (resolve, reject) {
    try {
      setTimeout(
        () => resolve( callback() ),
        delay
      );
    }
    catch (e) {
      reject(e);
    }
  });
}

function truncate (value, numDigits) {
  var str = value.toString();
  return Number(str.substring(0, str.indexOf('.') + numDigits + 1));
}
