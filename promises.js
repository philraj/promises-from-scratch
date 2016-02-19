// MyPromise constructor
function MyPromise (executor) {
  var value; // value to which the promise resolves/rejects
  var state = 'pending'; // current pending|resolved|rejected promise state
  var resolvers = []; // queued functions to be called on success
  var rejectors = []; // queued functions to be called on failure

  function resolve (val) {
    // prevents state from being changed once resolved/rejected, as per A+ spec
    if (state !== 'pending') return;

    value = val; // store resolve value for future .then calls
    state = 'resolved';

    // if there are resolvers waiting to be called, call each one
    if (resolvers.length) {
      resolvers.forEach( callback => callback() );
    }
  }

  function reject (val) {
    if (state !== 'pending') return;

    value = val;
    state = 'rejected';

    if (rejectors.length) {
      rejectors.forEach( callback => callback() );
    }
  }

  // This is where the magic happens
  this.then = function (successCB, failureCB) {
    return new MyPromise( function (resolve, reject) {
      if (state = 'pending') {
        resolvers.push( () => {
          setImmediate( () => resolve(successCB(value)) );
        });

        if (failureCB) {
          rejectors.push( () => {
            setImmediate( () => reject(failureCB(value)) );
          });
        }
        else {
          rejectors.push( () => {
            setImmediate( () => reject(new Error(value)) );
          });
        }
      }
      else if (state === 'resolved') {
        setImmediate( () => resolve(successCB(value)) );
      }
      else if (state === 'rejected') {
        setImmediate( () => {
          if (failureCB) reject(failureCB(value));
          else reject(new Error(value));
        });
      }
    });
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

setTimeoutPromise(3000, () => 1012121323243435454)
.then( val => console.log(`\nsetTimeoutPromise return value:`, val));

function truncate (value, numDigits) {
  var str = value.toString();
  return Number(str.substring(0, str.indexOf('.') + numDigits + 1));
}
