/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

// 关闭代码推荐

class MyPromise {
  constructor(exec) {
    this.status = 'pending';
    this.success = null;
    this.failure = null;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];

    const resolve = (data) => {
      if (this.status === 'pending') {
        this.status = 'success';
        this.success = data;
        this.resolveCallbacks.forEach(resolveCallback => {
          resolveCallback(this.success);
        });
      }
    }

    const reject = (err) => {
      if (this.status === 'pending') {
        this.status = 'failure';
        this.failure = err;
        this.rejectCallbacks.forEach(rejectCallback => {
          rejectCallback(this.failure);
        });
      }
    }
    try {
      exec(resolve, reject);
    } catch(err) {
      reject(err);
    }

  }


  then(onFulfilled, onRejected) {
    const resolveCallback = onFulfilled ? onFulfilled : data => data;
    const rejectCallback = onRejected ? onRejected : err => {throw err};

    return new MyPromise((resolve, reject) => {
      const fulfilledFun = () => queueMicrotask(() => {
        try {
          const x = resolveCallback(this.success);
          resolve(x)
        } catch (err) {
          reject(err)
        }
      })
      const rejectFun = () => queueMicrotask(() => {
        try {
          const x = rejectCallback(this.failure);
          resolve(x)
        } catch (err) {
          reject(err)
        }
      })
      if (this.status === 'success') {
        fulfilledFun();
      }

      if (this.status === 'failure') {
        rejectFun();
      }
      if(this.status === 'pending') {
        this.resolveCallbacks.push(fulfilledFun);
        this.rejectCallbacks.push(rejectFun);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(fn) {
    return this.then(
      value => MyPromise.resolve(fn()).then(() => value),
      err => MyPromise.resolve(fn()).then(() => {throw err})
    )
  }

  static resolve(temp) {
    if (temp instanceof MyPromise) {
      return temp;
    }
    return new MyPromise((resolve) => {
      resolve(temp)
    })
  }

  static reject(temp) {
    if (temp instanceof MyPromise) {
      return temp;
    }
    return new MyPromise((resolve, reject) => {
      reject(temp)
    })
  }

  static all(arr) {
    return new MyPromise((resolve, reject) => {
      let finishNum = 0;
      let resList = [];
      let currentIndex = 0;
      if (arr.length === 0) resolve([]);
      
      arr.forEach(promiseItem => {
        let index = currentIndex;

        currentIndex++;
        MyPromise.resolve(promiseItem).then((data) => {
          resList[index] = data;
          finishNum++;
          if (finishNum === arr.length) {
            resolve(resList);
          }
        }, (err) => {
          reject(err)
        })
      })
    })
  }
  static race(promiseList) {
    let isFinish = false;
    return new MyPromise((resolve, reject) => {
      promiseList.forEach(promiseItem => {
        MyPromise.resolve(promiseItem).then(data => {
          if (!isFinish) {
            resolve(data);
          }
        },
        err => {
          if (!isFinish) {
            reject(err);
          }
        })
      })
    });
  }
}


const promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('promise go');
    resolve(2000)
  }, 1000)
});

const promise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('promise go');
    resolve(4000)
  }, 1000)
});

promise1.then((data) => {
  console.log('第一个then', data)
}).then((data) => {
  console.log('链式第二个then',data)
})

promise1.then((data) => {
  console.log('并行第一个then', data)
})

Promise.all([promise1, promise2]).then(data => {
  console.log('all', data);
})


