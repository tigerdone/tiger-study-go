async function sendRequest(requestList,limits,callback){

  // 维护一个promise队列

  const promises = []

  // 当前的并发池,用Set结构方便删除

  const pool = new Set() // set也是Iterable<any>[]类型，因此可以放入到race里

  // 开始并发执行所有的任务

  for(let request of requestList){

      // 开始执行前，先await 判断 当前的并发任务是否超过限制

      if(pool.size >= limits){

          // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行


          await Promise.race(pool)

          .catch(err=>err)

      }

      const promise = request()// 拿到promise

      // 删除请求结束后，从pool里面移除

      const cb = ()=>{

          pool.delete(promise)

      }

      // 注册下then的任务

      promise.then(cb,cb)

      pool.add(promise)

      promises.push(promise)

  }

  // 等最后一个for await 结束，这里是属于最后一个 await 后面的 微任务

  // 注意这里其实是在微任务当中了，当前的promises里面是能确保所有的promise都在其中(前提是await那里命中了if)


  Promise.allSettled(promises).then(callback,callback)

}



function query(index) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      
      Math.random() > 0.8 ? resolve('query'+index) : reject('query'+index);
      console.log('resolve', index);
    }, 1000);
  });
}

// sendRequest([
//   () => query(1),
//   () => query(2),
//   () => query(3),
//   () => query(4),
//   () => query(5),
// ], 2, (res) => {
//   console.log('res', res);
// })

// sendRequestWithRetry2([
//   () => query(1),
//   () => query(2),
//   () => query(3),
//   () => query(4),
//   () => query(5),
// ], 2, 2, (res) => {
//   console.log('res', res);
// });

function sendRequestWithRetry(requestList, limits, retryTimes, callback) {
  let currentNum = Math.min(limits, requestList.length);
  const requestListWrapList = [];
  const returnPromise = [];
  let currentCount = 0;

  function wrapRequest(requestItem) {
    return new Promise((resolve, reject) => {
      requestListWrapList.push({
        request: requestItem,
        resolve,
        reject,
        retryTimes,
      });
    })
  }

  function runTaskNeed() {
    let i = 0;
    while(i < currentNum) {
      runTask();
      i++;
    }
  }

  function runTask() {
    const task = requestListWrapList.shift();
    task && runner(task);
  }

  async function runner(task) {
    const { request, resolve, reject, retryTimes } = task;
    try {
      currentCount++;
      const res = await request();
      resolve(res);
    } catch (err) {
      if (retryTimes > 0) {
        task.retryTimes--;
        requestListWrapList.push(task);
      } else {
        reject(err);
      }
    } finally {
      currentCount--;
      picker();
    }
  }

  function picker() {
    if(currentCount < currentNum && requestListWrapList.length > 0) {
      runTask();
    }
  }

  function init() {
    requestList.forEach(request => {
      returnPromise.push(wrapRequest(request));
    });
  }

  function start() {
    init();
    runTaskNeed();
  }

  start()

  return Promise.allSettled(returnPromise).then(callback, callback);

}

function sendRequestWithRetry2(requestList, limits, retryTimes, callback) {
  let currentNum = Math.min(limits, requestList.length);
  let currentCount = 0;
  const requestListWrapList = [];
  const returnPromise = [];

  function wrapTaskRequest(task) {
    return new Promise((resolve, reject) => {
      requestListWrapList.push({
        request: task,
        resolve,
        reject,
        retryTimes
      })
    })
  }

  function init() {
    requestList.forEach(request => {
      const wrapRequest = wrapTaskRequest(request);
      returnPromise.push(wrapRequest);
    })
  }
  function runTaskNeed() {
    let i = 0;
    while(i < currentNum) {
      runTask();
      i++;
    }
  }
  function runTask() {
    const task = requestListWrapList.shift();
    task && runner(task);
  }
  async function runner(task) {
    const { request, resolve, reject, retryTimes } = task;
    try {
      currentCount++;
      const res = await request();
      resolve(res);
    } catch (err) {
      if (retryTimes > 0) {
        task.retryTimes--;
        requestListWrapList.push(task);
      } else {
        reject(err);
      }
    } finally {
      currentCount--;
      picker();
    }
  }

  function picker() {
    if (currentCount < currentNum && requestListWrapList.length > 0) {
      runTask();
    }
  }
  function start() {
    init();
    runTaskNeed();
  }
  start();

  Promise.allSettled(returnPromise).then(callback, callback);
}

function sendRequestWithRetry3(requestList, limits, retryTimes) {
  let returnPromise = [];
  let currentNum = Math.min(requestList.length, limits);
  let currentCount = 0;
  let wrapRequestList = [];

  function wrapPromise(request) {
    return new Promise((resolve, reject) => {
      wrapRequestList.push({
        query: request,
        reject,
        resolve,
        retryTimes
      })
    })
  }

  function runTaskNeed() {
    let i = 0;
    while(i < currentNum) {
      i++;
      runTask();
    }
  }

  function runTask() {
    const task = wrapRequestList.shift();
    task && runner(task);
  }

  async function runner(task) {
    const { query, reject, resolve, retryTimes } = task;
    try {
      currentCount++;
      const res = await query();
      resolve(res);
    } catch (err) {
      if (retryTimes > 0) {
        task.retryTimes--;
        wrapRequestList.push(task);
      } else {
        reject(err);
      }

    } finally {
      currentCount--;
      picker();
    }
  }

  function picker() {
    if (currentCount < currentNum && wrapRequestList.length > 0) {
      runTask()
    }
  }

  function init() {
    requestList.forEach(item => {
      returnPromise.push(wrapPromise(item))
    })
  }

  function start() {
    init();
    runTaskNeed();
  }

  start()

  return Promise.any(returnPromise);
}

// sendRequestWithRetry2([
//   () => query(1),
//   () => query(2),
//   () => query(3),
//   () => query(4),
//   () => query(5),
// ], 2, 2, (res) => {
//   console.log('res', res);
// });

sendRequestWithRetry3([
  () => query(1),
  () => query(2),
  () => query(3),
  () => query(4),
  () => query(5),
], 2, 2).then((res) => {
  console.log('res', res);
}, (res) => {
  console.log('reject', res);
});