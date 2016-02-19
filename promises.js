//promise constructor
function MyPromise (executor) {
  var value;
  var state = 'pending';
  var resolvers = [];
  var rejectors = [];

  function resolve (val) {
    if (state === 'resolved') return;

    value = val;
    state = 'resolved';

    if (resolvers.length) {
      resolvers.forEach( callback => callback() );
    }
  }

  function reject (val) {
    if (state === 'rejected') return;

    value = val;
    state = 'rejected';

    if (rejectors.length) {
      rejectors.forEach( callback => callback() );
    }
  }

  this.then = function (successCB, failureCB) {
    return new MyPromise( function (resolve, reject) {
      if (state = 'pending') {
        resolvers.push( () => {
          resolve(successCB(value));
        });

        if (failureCB) {
          rejectors.push( () => {
            reject(failureCB(value));
          });
        }
        else {
          rejectors.push( () => {
            reject(new Error(value));
          });
        }
      }
      else if (state === 'resolved') {
        resolve(successCB(value));
      }
      else if (state === 'rejected') {
        if (failureCB) reject(failureCB(value));
        else reject(new Error(value));
      }
    });
  }

  executor(resolve, reject);
}

var promise = new MyPromise( (resolve, reject) => {
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
  val => {
    setImmediate( () => console.log(`Truncated value: ` + val.toFixed(2)) );
  },
  val => {
    setImmediate( () => console.log(`Truncated value: ` + val.toFixed(2)) );
  }
);

function setTimeoutPromise (delay, callback) {
  return new MyPromise ( function (resolve, reject) {
    setTimeout(
      () => resolve(callback()),
      delay
    );
  });
}

setTimeoutPromise(4000, () => {
  return 123456789;
}).then( val => console.log(`setTimeoutPromise return value:`, val));
