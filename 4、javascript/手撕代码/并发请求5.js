
function queryUrl(url) {
  return new Promise((resole, reject) => {
    const num = Math.random();
    setTimeout(() => {
      if (num > 0.5) {
        resole(url + '-' + num)
      } else {
        reject(url + '-' + num)
      }
      console.log(`请求：${url}，执行完成，数据是`, url + '-' + num);
    }, 4000 * num);
  })
}

function queryList(urls, limits) {
  const queryBox = urls.map((url) => {
    let resolve;
    let reject;
    const promiseBox = new Promise((res, rej) => {
      resolve = res;
      reject = rej
    })
    return {
      query: promiseBox,
      resolve,
      reject,
      status: 'pending'
    }
  })

  let currentIndex = 0;
  let pendingNum = 0;
  let finishNum = 0;

  function run() {
    while(currentIndex < urls.length && pendingNum <= limits){
      const { resolve } = queryBox[currentIndex];
      pendingNum++;

      queryUrl(urls[currentIndex++]).then(data => {
        resolve({
          data,
          status: 'success',
        })
      }).catch((err) => {
        resolve({
          data: err,
          status: 'failure',
        })
      }).finally(() => {
        pendingNum--;
        finishNum++;

        run();
      })
    }
  }

  run();
  return queryBox.map(c => c.query);
}

async function go() {
  const list =  queryList(['1', '2', '3', '4', '5', '6', '7', '8', '9'], 4);
  console.log('list', list);
  const data = await Promise.all(list);
  console.log('data', data)
}
go();

