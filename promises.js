//promise constructor
function MyPromise (executor) {
  var value;
  var state = 'pending';
  var resolveCallbacks = [];
  var rejectCallbacks = [];

  function resolve (val) {
    if (state === 'resolved') return;

    value = val;
    state = 'resolved';

    if (resolveCallbacks.length) {
      resolveCallbacks.forEach( callback => callback(value) );
    }
  }

  function reject (val) {
    if (state === 'rejected') return;

    value = val;
    state = 'rejected';

    if (rejectCallbacks.length) {
      rejectCallbacks.forEach( callback => callback(value) );
    }
  }

  this.then = function (resolveCB, rejectCB) {
    // return new MyPromise( function(resolve, reject) {
    //
    // });
    if (state = 'pending') {
      resolveCallbacks.push(resolveCB);

      if (rejectCB) rejectCallbacks.push(rejectCB);
      else rejectCallbacks.push( () => { throw new Error(value) });
    }
    else if (state === 'resolved') {
      resolveCB(value);
    }
    else if (state === 'rejected') {
      if (rejectCB) rejectCB(value);
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
