// var promise = new Promise(function(resolve, reject){
//   //...
// });
// //if operation is successful, resolve is called
// //otherwise, reject is called

//promise constructor
function MyPromise (executor) {
  function resolve (val) {

  }

  function reject (err) {

  }

  executor(resolve, reject)

  this.then = function (callback) {
    callback(val)
  },
  this.catch = function (callback) {
    callback()
  }
}
