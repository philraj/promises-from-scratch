//promise constructor
function MyPromise (executor) {
  var value;
  var state = 'pending';
  var resolveCallback, rejectCallback;

  function resolve (val) {
    if (resolveCallback) {
      resolveCallback(val);
    }
    else {
      value = val;
      state = 'resolved';
    }
  }

  function reject (val) {
    if (rejectCallback) {
      rejectCallback(val);
    }
    else {
      value = val;
      state = 'rejected';
    }
  }

  this.then = function(res, rej) {
    if (state = 'pending') {
      resolveCallback = res;
      rejectCallback = rej;
    }
    else if (state === 'resolved') {
      res(value);
    }
    else {
      rej(value);
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
      Math.random() * 1000);
  }
  else {
    setTimeout(
      () => reject("Rejected:" + val),
      Math.random() * 1000);
  }
})

promise.then(
  val => {
    setTimeout(
      () => console.log(val),
      Math.random() * 2000);
  },
  val => {
    setTimeout(
      () => console.log(val),
      Math.random() * 2000);
  }
);