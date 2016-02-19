//promise constructor
function MyPromise (executor) {
  var value;
  var state = 'pending';
  var successCallbacks = [];
  var failureCallbacks = [];

  function resolve (val) {
    if (state === 'resolved') return;

    value = val;
    state = 'resolved';

    if (successCallbacks.length) {
      successCallbacks.forEach( callback => callback(value) );
    }
  }

  function reject (val) {
    if (state === 'rejected') return;

    value = val;
    state = 'rejected';

    if (failureCallbacks.length) {
      failureCallbacks.forEach( callback => callback(value) );
    }
  }

  this.then = function (successCB, failureCB) {
    // return new MyPromise( function(resolve, reject) {
    //
    // });
    if (state = 'pending') {
      successCallbacks.push(successCB);

      if (failureCB) failureCallbacks.push(failureCB);
      else failureCallbacks.push( () => { throw new Error(value) });
    }
    else if (state === 'resolved') {
      successCB(value);
    }
    else if (state === 'rejected') {
      if (failureCB) failureCB(value);
      else throw new Error(value);
    }
  }

  executor(resolve, reject);
}

var promise = new MyPromise( function(resolve, reject) {
  var val = Math.random();
  console.log(val);

  if (val > 0.5) {
    setTimeout(
      () => resolve("Resolved:" + val),
      Math.random() * 1000
    );
  }
  else {
    setTimeout(
      () => reject("Rejected:" + val),
      Math.random() * 1000
    );
  }
});

promise.then(
  val => {
    setTimeout(
      () => console.log(val),
      Math.random() * 2000
    );
  },
  val => {
    setTimeout(
      () => console.log(val),
      Math.random() * 2000
    );
  }
);
