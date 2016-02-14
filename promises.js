//promise constructor
function MyPromise (resolver) {
  console.log('constructing promise');
  var resolveCallback;

  function resolve (val) {
    resolveCallback(val)
  }
  console.log('calling resolver')
  resolver(resolve)

  this.then = function (callback) {
    console.log('calling then');
    resolveCallback = callback
    return new MyPromise(callback)
  }
}

var promise = new MyPromise(function(resolve){
  setTimeout(function(){
    resolve("Resolved.")
  }, 1000)
})

promise.then(function(val){
  console.log('test');
  console.log(val)
})
// var promise = new Promise( function(resolve, reject) {
//   var random = Math.random()
//   console.log("made random value:", random)
//
//   if (random > 0.5) {
//     setTimeout( function() {
//       resolve(random)
//     }, 1000)
//   } else {
//     setTimeout( function() {
//       reject(random)
//     }, 1000)
//   }
// })
//
// promise.then( function (val) {
//   console.log("resolved val:", val)
// }).then( function (val) {
//   console.log("???", val)
// })
