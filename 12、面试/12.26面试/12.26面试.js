
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
// var merge = function(intervals) {
//   let res = [];
//   let currentFlag = intervals[0];

//   for(let i = 1; i < intervals.length ;i++){
//       let [left, right] = currentFlag;
//       while ( i < intervals.length ) {
//           let [newLeft, newRight] = intervals[i]
//           if (right >= newLeft) {
//               right = newRight;
//               i++;
//               if (i === intervals.length ) {
//                   res.push([left, right]);
//               }
//           } else {
//               res.push([left, right]);
//               currentFlag = intervals[i];
//               break;
//           }
//       }
//   }
//   return res;
// };

function customPromiseAll(iterable) {
  // todo
  let resolveCount = 0
  if (iterable.length === 0) {
    return Promise.resolve([])
  }

  return new Promise((resolve, reject) => {
    let resList = []
    iterable.forEach((item,index) => {
        item.then((res) => {
            resList[index] = res;
            resolveCount++;
            if (resolveCount === iterable.length) {
                resolve(resList)
            }
        }, err => {
          resList[index] = err;
          reject(err)
        })
    })
  })

}

// 示例用法：
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(3);
  }, 1500);
})
const promise4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(4);
  }, 1000);
})

customPromiseAll([promise1, promise2, promise3, promise4])
.then((results) => {
  console.log('result', results); // 输出 [1, 2, 3]
})
.catch((error) => {
  console.log('error')
  console.error(error);
});




