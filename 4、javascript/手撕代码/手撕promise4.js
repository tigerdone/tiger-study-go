/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
// Promise.resolve(1).then(() => {
//   return 200
// }).then(console.log); // 1
// Promise.reject(1).then(() => {
//   return 200
// }, 2).then(console.log, console.log); // 1

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, "two");
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
}, (value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// Expected output: "two"
