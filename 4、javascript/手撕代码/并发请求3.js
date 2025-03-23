
// const queryOne = () => {
//   return new Promise((resolve, reject) => {
//     const val = Math.random();
//     setTimeout(() => {
//       if (val > 0.5) {
//         resolve(val)
//       } else {
//         reject(val)
//       }
//     }, 1000 * val)
//   })
// }


// function queryList(urls, limits) {
//   // 思路，要返回结果的list，正确的值或者错误的值
//   // 所以可以将请求包裹成一个promise列表，这个promise列表可以不用按照顺序，而请求列表是按顺序排列的
//   const wrapList = [];
//   const resultList = [];
//   let currentNum = 0

//   urls.forEach(url => {
//     const item = new Promise((resolve, reject) => {
//       wrapList.push({
//         query: queryOne,
//         resolve,
//         reject,
//       })
//     });
//     resultList.push(item);
//   });


//   for(let i = 0; i < limits; i++) {
//     execQuery()
//   }

//   function execQuery() {
//     if (currentNum < limits) {
//       runner();
//     }
//   }

//   async function runner() {
//     const wrapItem = wrapList.pop();
//     if (!wrapItem) {
//       return;
//     }
//     const { query, resolve, reject } = wrapItem;
//     try {
//       currentNum++;
//       const data = await query();
//       resolve({
//         status: 'success',
//         data
//       });
//     } catch (err) {
//       resolve({
//         status: 'failure',
//         data: err
//       });
//     } finally {
//       currentNum--;
//       execQuery();
//     }
//   }

//   return resultList;
// }

// const data = queryList(['1', '2', '3', '1', '2', '3', '1', '2', '3'], 4);

// console.log('da')

// Promise.allSettled().then(data => {
//   console.log('data', data);
// })
// interface Result<T> {
//   status: 'success' | 'failure' | 'pending',
//   data: T | Error
// }

// 思路
// 要输出Promise<Result<T>[]>
// 输入的是url列表和限制
// 我们就去依次循环url，将结果存在一个数组中，用一个索引定位元素的位置，因为请求的结果返回的顺序是不一样的


const queryOne = (url) => {
  return new Promise((resolve, reject) => {
    const val = Math.random();
    setTimeout(() => {
      if (val > 0.5) {
        resolve(val)
      } else {
        reject(val)
      }
      console.log('exec finish', url, 2000 * val)
    }, 2000 * val)
  })
}


function queryList2(urls, limit) {
  return new Promise(resolve => {
    let pendingNum = 0;
    let currentIndex = 0;
    let completeCount = 0;
    const results = [];

    function startRequest() {
      if (completeCount === urls.length) {
        resolve(results);
      }

      while (currentIndex < urls.length && pendingNum < limit) {
        let index = currentIndex;
        results.push({ data: null, status: 'pending'});
        const currentUrl = urls[index];
        pendingNum++;
        currentIndex++;

        queryOne(currentUrl).then(data => {
          results[index] = { data, status: 'success' }
        }).catch(err => {
          results[index] = { data: err, status: 'failure' }
        }).finally(() => {
          pendingNum--;
          completeCount++;
          startRequest();
        })
      }
    }
    startRequest();
  })
}

async function go() {
  const data = queryList2(['1', '2', '3', '4', '5', '6', '7', '8', '9'], 4);
  console.log('data', data)

}
go();
