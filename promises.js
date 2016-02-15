//promise constructor
function MyPromise (executor) {
  console.log('entering mypromise constructor!');
  var value
  var isResolved = false
  var isRejected = false

  function resolve (val) {
    value = val
    isResolved = true
  }

  function reject (val) {
    value = val
    isRejected = true
  }

  executor(resolve, reject)

  this.then = function thenFunc (resolveCallback, rejectCallback) {
    if (isResolved) {
      resolveCallback(value)
    }
    else if (isRejected) {
      rejectCallback(value)
    }
    else {
      setTimeout(thenFunc.bind(null, resolveCallback, rejectCallback), 500)
    }
  }
}

var promise = new MyPromise( function (resolve, reject) {
  var val = Math.random()
  console.log(val);
  if (val > 0.5) {
    setTimeout( function() {
      resolve("Resolved:" + val)
    }, 1000)
  }
  else {
    setTimeout( function() {
      reject("Rejected:" + val)
    }, 1000)
  }
})

promise.then( function (val) {
  setTimeout( function () {
    console.log(val)
  }, Math.random() * 2000)
}, function (val) {
  setTimeout( function () {
    console.log(val, "...Sorry!")
  }, Math.random() * 2000)
})
