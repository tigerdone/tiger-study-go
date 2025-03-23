/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
class MyPromise {
  constructor(exec) {
    this.status = 'pending';
    this.success = null;
    this.reject = null;
    this.successCallbacks = [];
    this.rejectCallBacks = [];

    const resolve = (data) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.success = data;
        this.successCallbacks.forEach((item) => {
          item();
        })
      }
    }

    const reject = (data) => {
      if (this.status === 'pending') {
        this.status = 'reject';
        this.reject = data;
        this.rejectCallBacks.forEach((item) => {
          item();
        })
      }
    }

    try {
      exec(resolve, reject);
    } catch(err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = onFulfilled ? onFulfilled : success => success;
    onRejected = onRejected ? onRejected : fail => {throw fail};

    return new MyPromise((resolve, reject) => {
      const fulfilledFun = () => queueMicrotask(() => {
        try {
          const x = onFulfilled(this.success)
          resolve(x);
        } catch(err) {
          reject(err);
        }
      });
      const rejectFun = () => queueMicrotask(() => {
        try {
          const x = onRejected(this.reject)
          resolve(x);
        } catch(err) {
          reject(err);
        }
      });
      if (this.status === 'fulfilled') {
        fulfilledFun();
      }
      if (this.status === 'reject') {
        rejectFun();
      }
      if (this.status === 'pending') {
        this.successCallbacks.push(fulfilledFun)
        this.rejectCallBacks.push(rejectFun)
      }
    })
  }

  static resolve (success) {
    if (success instanceof MyPromise) {
      return success;
    }
    return new MyPromise((resolve) => {
      resolve(success)
    })
  }
  static reject (failure) {
    if (failure instanceof MyPromise) {
      return failure;
    }
    return new MyPromise((resolve, reject) => {
      reject(failure)
    })
  }

  static finally (fn) {
    return this.then((success) => {
      fn();
      return success
    }, (failure) => {
      fn();
      throw failure
    })
  }

  static catch(onReject) {
    return this.then(null, onReject)
  }

  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      let resList = [];
      let finishCount = 0;
      if (promiseList.length === 0) {
        resolve([])
        return;
      }

      for(let i = 0; i < promiseList.length; i++) {
        const index = i;
        const item = promiseList[i];
        item().then((data) => {
          resList[index] = data;
          if (++finishCount === promiseList.length) {
            resolve(resList);
          }
        }, (err) => {
          reject(err)
        })
      }
    })
  }

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (promiseList.length === 0) {
        resolve()
        return;
      }

      for(let i = 0; i < promiseList.length; i++) {
        const item = promiseList[i];
        item().then((data) => {
          resolve(data);
        }, (err) => {
          reject(err)
        })
      }
    })
  }
}

// 测试 promise.all
function factor() {
  let res = [];

  for(let i = 0; i < 10; i++) {
    res.push(() => new MyPromise((resolve, reject) => {
      setTimeout(() => {
        const numberFlag = Math.random();
        console.log('numberFlag', numberFlag);
        if (numberFlag > 0.5) {
          resolve(numberFlag)
        } else {
          reject(numberFlag)
        }
      }, 1000);
    }))
  }
  return res;
}

async function testPromiseAll() {
  MyPromise.all(factor()).then(data => {
    console.log('data', data);
  }, err => {
    console.log(err);
  });
}

testPromiseAll();


// const promise1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(1)
//   }, 1000);
// })

// promise1.then((data) => {
//   console.log('then1', data)
//   return 'then1'
// }, (data) => {
//   console.log('reject1', data)
// }).then((data) => {
//   console.log('then2', data)
// }, (data) => {
//   console.log('reject2', data)
// }).then((data) => {
//   console.log('then3', data)
// }, (data) => {
//   console.log('reject3', data)
// })

// const promise2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject(1)
//   }, 1000);
// })

// console.log('----------')

// promise2.then((data) => {
//   console.log('then1', data)
//   return 'then1data'
// }, (data) => {
//   console.log('reject1', data)
//   return 'reject1data'
// }).then((data) => {
//   console.log('then2', data)
// }, (data) => {
//   console.log('reject2', data)
//   return 'reject2data'
// }).then((data) => {
//   console.log('then3', data)
//   return 'resolve3data'
// }, (data) => {
//   console.log('reject3', data)
//   return 'reject3data'
// }).finally((data) => {
//   console.log('data', data);

// })
