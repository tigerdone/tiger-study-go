1. 深拷贝的实现
题目描述：
对于深拷贝的功能，我们可以简单通过JSON.parse(JSON.stringify(obj))来实现，但这种方法存在种种缺陷。请用javascript尽可能完整实现深拷贝的功能。

Answer (作答)：

function isObject (item) {
  return Object.prototype.toString.call(item) === '[Object Object]'

}

function deepClone(obj, hash = new WeakMap()) {
  if (!isObject) return isObject;
  if (hash.has(obj)) return hash.get(hash);

  var target = Array.isArray(obj) ? [] : {};
  hash.set(obj, target);
  
  for(let key in obj) {
    if (Object.prototype.hasOwnProperty(obj, key)) {
      if (isObject(obj[key])) {
        target[key] = deepClone(obj[key]);
      } else {
        target[key] = obj[key];
      }
    }
  }
  return target;
}

2. 合并两个有序数组
题目描述
给你两个数组按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

示例 1：
输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
解释：需要合并 [1,2,3] 和 [2,5,6] 。
合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
示例 2：
输入：nums1 = [1], m = 1, nums2 = [], n = 0
输出：[1]
解释：需要合并 [1] 和 [] 。
合并结果是 [1] 。
示例 3：
输入：nums1 = [0], m = 0, nums2 = [1], n = 1
输出：[1]
解释：需要合并的数组是 [] 和 [1] 。
合并结果是 [1] 。
注意，因为 m = 0 ，所以 nums1 中没有元素。nums1 中仅存的 0 仅仅是为了确保合并结果可以顺利存放到 nums1 中。
 
提示：
- nums1.length == m + n
- nums2.length == n
- 0 <= m, n <= 200
- 1 <= m + n <= 200
- -10^9 <= nums1[i], nums2[j] <= 10^9
 
进阶：你可以设计实现一个时间复杂度为 O(m + n) 的算法解决此问题吗？

Answer（作答）：
//输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
//输出：[1,2,2,3,5,6]

function merge(nums1, nums2, m, n) {
  // please implement
  let i = 0;
  let j = 0;
  let setIndex = 0;
  let nums1Value = nums1.slice(0, m);

  while(i < m || j < n){
    if (i === m) {
      nums1[setIndex] = nums2[j];
      j++;
    } else if (j === n) {
      nums1[setIndex] = nums1Value[i];
      i++;
    }
    if (i !== m && j !== n ){
      if (nums1Value[i] < nums2[j]) {
        nums1[setIndex] = nums1Value[i];
        i++;
      } else {
        nums1[setIndex] = nums2[j];
        j++;
      }
    }
    setIndex++
  }
 }


3. 前端实现并行接口请求的控制函数
题目描述：
在访问电子商务类网站的首页场景时，由于商品信息繁多，前端侧往往需要在访问过程中并行请求大量接口，对网站加载性能和体验带来压力。现在希望你按照要求，设计一个能帮助优化这个问题的接口请求控制函数。
要求：
1. 实现function concurrentRequest(urls: string[], maxConcurrent: number): Promise<Result<T>>[] 函数；函数返回 Promise 数组，每个 Promise 对应一个接口的响应结果Result，类型定义如下：
interface Result<T> {
    status: 'success' | 'failure';
    data: T | Error;
}
2. 考虑到首页同时需要请求商品、轮播图、优惠券等多个接口，要求最大并发请求数不超过 maxConcurrent，避免对服务器造成过大压力；
3. 当任一接口请求完成后，即可立即发起下一个待处理的接口请求，确保接口请求队列高效运转；
4. 考虑到首页数据的后续处理和渲染上有顺序的要求（如轮播图必须优先显示），所有接口返回的数据需要按照 urls 数组中的原始顺序依次返回；
调用示例：
const urls = ["url1", "url2", "url3", 'url4','url5','url6', 'url7','url8'];
const maxNum = 3;

concurrentRequest(urls, maxConcurrent)
  .then(results => {
    console.log("API results: ", results);
  });

Answer（作答）：

function concurrentRequest(urls, maxConcurrent) {
  function wrapPromise(url) {
    let res = []
    const query = new Promise((resolve, reject) => {
      res.push(fetch(url), resolve, reject);
    })
    return res;
  }

  let queryList = urls.map(url => {
    // let res = []
    // const query = () => {
    //   return new Promise((resolve, reject) => {
    //     res.push(fetch(url), resolve, reject);
    //     // fetch(url).then(resolve).catch(reject);
    //   })
    // }
    // return query;
    return () => {
      new Promise((resolve, reject) => {
        wrapPromise(fetch(url))
      })
    }
  });

  let currentCount = 0;
  for(let i = 0; currentCount < maxConcurrent; i++) {
    execOneQuery();
  }

  function getOneQuery() {
    if (currentCount < maxConcurrent) {
      return queryList.pop();
    }
  }

  function execOneQuery() {
    const query = getOneQuery();
    // query().then(execOneQuery).ca
  }

}



// 对于深拷贝的功能，我们可以简单通过JSON.parse(JSON.stringify(obj))来实现，但这种方法存在种种缺陷。请用javascript尽可能完整实现深拷贝的功能。

function deepClone(obj) {
  if (obj === null) return null;
  const keys = Object.keys(obj);

  let res = {}
  keys.forEach(key => {
    const type = Object.prototype.toString.call(obj[key]);
    if(type === "[Object Object]") {
      res[key] = deepClone(obj[key]);
    }
    if(type === "[Object String]" || type === "[Object BigNumber]" || type === "[Object Number]" || type === "[Object Boolean]") {
      res[key] = obj[key];
    }
    if(type === "[Object NaN]") {
      res[key] = NaN;
    }
    if(type === "[Object Array]") {
      res[key] = obj[key].contact([]);
    }
  })
  return res;
}

// 给你两个数组按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
// 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
// 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。


function merge(nums1, nums2, m, n) {
  // please implement
  let i = 0;
  let j = 0;
  let setIndex = 0;
  let nums1Value = nums1.slice(0, m);

  while(i < m || j < n){
    if (i === m) {
      nums1[setIndex] = nums2[j];
      j++;
    } else if (j === n) {
      nums1[setIndex] = nums1Value[i];
      i++;
    }
    if (i !== m && j !== n ){
      if (nums1Value[i] < nums2[j]) {
        nums1[setIndex] = nums1Value[i];
        i++;
      } else {
        nums1[setIndex] = nums2[j];
        j++;
      }
    }
    setIndex++
  }
 }


//  在访问电子商务类网站的首页场景时，由于商品信息繁多，前端侧往往需要在访问过程中并行请求大量接口，对网站加载性能和体验带来压力。现在希望你按照要求，设计一个能帮助优化这个问题的接口请求控制函数。
//  要求：
const urls = ["url1", "url2", "url3", 'url4','url5','url6', 'url7','url8'];
const maxNum = 3;

concurrentRequest(urls, maxConcurrent)
  .then(results => {
    console.log("API results: ", results);
  });

function concurrentRequest(urls, maxConcurrent) {
  function wrapPromise(url) {
    let res = []
    const query = new Promise((resolve, reject) => {
      res.push(fetch(url), resolve, reject);
    })
    return res;
  }

  let queryList = urls.map(url => {
    // let res = []
    // const query = () => {
    //   return new Promise((resolve, reject) => {
    //     res.push(fetch(url), resolve, reject);
    //     // fetch(url).then(resolve).catch(reject);
    //   })
    // }
    // return query;
    return () => {
      new Promise((resolve, reject) => {
        wrapPromise(fetch(url))
      })
    }
  });

  let currentCount = 0;
  for(let i = 0; currentCount < maxConcurrent; i++) {
    execOneQuery();
  }

  function getOneQuery() {
    if (currentCount < maxConcurrent) {
      return queryList.pop();
    }
  }


  function execOneQuery() {
    const query = getOneQuery();
    // query().then(execOneQuery).ca
  }


}