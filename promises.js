// MyPromise constructor
function MyPromise (executor) {
  var value; // value to which the promise resolves/rejects
  var state = 'pending'; // current pending|resolved|rejected promise state
  var resolvers = []; // queued functions to be called once resolved
  var rejectors = []; // queued functions to be called once rejected

  function resolve (val) {
    // prevents state from being changed once resolved/rejected, as per A+ spec
    if (state !== 'pending') return;

    if (val.then) {
      //...
    }
    else {
      value = val; // store resolve value for future .then calls
      state = 'resolved';
    }
    // if there are resolvers waiting to be called, call each one
    if (resolvers.length) {
      resolvers.forEach( callback => setImmediate(callback) );
    }
  }

  function reject (val) {
    if (state !== 'pending') return;

    value = val;
    state = 'rejected';

    if (rejectors.length) {
      rejectors.forEach( callback => setImmediate(callback) );
    }
  }

  // This is where the magic happens
  this.then = function (successCB, failureCB) {
    return new MyPromise( function (thenResolve, thenReject) {

      if (state = 'pending') {
        resolvers.push( attempt(successCB, thenResolve, thenReject) );

        if (failureCB) {
          rejectors.push( () => thenReject(failureCB(value)) );
        }
        else {
          rejectors.push( () => thenReject(new Error(value)) );
        }
      }
      else if (state === 'resolved') {
        setImmediate( attempt(successCB, thenResolve, thenReject) );
      }
      else if (state === 'rejected') {
        setImmediate( () => {
          if (failureCB) thenReject(failureCB(value));
          else thenReject(new Error(value));
        });
      }
    });
  }

  // Packages a function call in a try/catch to decide if res should be called
  // with the return value, or if rej should be called with the thrown error.
  // Wraps the whole thing in an anonymous function and returns it.
  function attempt (func, res, rej) {
    return () => {
      try {
        res(func(value)); // calls func with the value of the current promise
      }
      catch (e) {
        rej(e);
      }
    }
  }

  // Finally, run the function which was passed to the constructor
  executor(resolve, reject);
}

// Creating my promise
var promise = new MyPromise( function (resolve, reject) {
  var val = Math.random();
  console.log(`Promise seeded with value: ` + val);

  if (val > 0.5) {
    setTimeout(
      () => resolve(val),
      Math.random() * 2000
    );
  }
  else {
    setTimeout(
      () => reject(val),
      Math.random() * 2000
    );
  }
});

// Using my promise chain
promise.then(
  val => {
    console.log(`Resolved:`, val);
    return val;
  },
  val => {
    console.log(`Rejected:`, val);
    return val;
  }
).then(
  val => console.log(`Truncated resolve value:`, truncate(val, 2)),
  val => console.log(`Truncated reject value:`, truncate(val, 2))
);

// Version of setTimeout with parameters reversed, which is wrapped in a
// MyPromise. This allows a return value from within the setTimeout callback to
// be passed down a promise chain, unlike the usual situation where the return
// value would be lost, forcing you to send the value to a second callback.
function setTimeoutPromise (delay, callback) {
  return new MyPromise( function (resolve, reject) {
    setTimeout(
      () => resolve( callback() ),
      delay
    );
  });
}

setTimeoutPromise(3000, () => 12345)
.then( val => console.log(`\nsetTimeoutPromise return value:`, val));

function truncate (value, numDigits) {
  var str = value.toString();
  return Number(str.substring(0, str.indexOf('.') + numDigits + 1));
}
