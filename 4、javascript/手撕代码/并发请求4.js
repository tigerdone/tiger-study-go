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
    }, 2000 * num);
  })
}

function queryList(urls, limits) {
  return new Promise((resolve) => {
    const resList = [];
    let pendingNum = 0;
    let currentIndex = 0;
    let finishCount = 0;

    function startList() {
      if (finishCount === urls.length) {
        resolve(resList)
      }
      while (currentIndex < urls.length && pendingNum <= limits ) {
        // 注意这里需要记录下当前的索引，方便接口的回调把数据填入对应的索引
        const index = currentIndex;
        const url = urls[currentIndex];
        resList[currentIndex] = { status: 'pending', data: null }
        
        currentIndex++;
        pendingNum++;
        queryUrl(url).then((data) => {
          resList[index] = { status: 'success', data }
        }).catch(err => {
          resList[index] = { status: 'failure', data: err }
        }).finally(() => {
          finishCount++;
          pendingNum--;
          startList()
        })
      }
    }
    startList();
  })
}

async function go() {
  const data = await queryList(['1', '2', '3', '4', '5', '6', '7', '8', '9'], 4);
  console.log('data', data)
}
go();

