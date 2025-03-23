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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var queryOne = function (url) {
    return new Promise(function (resolve, reject) {
        var val = Math.random();
        setTimeout(function () {
            if (val > 0.5) {
                resolve(val);
            }
            else {
                reject(val);
            }
            console.log('exec finish', url, val);
        }, 1000 * val);
    });
};
function queryList2(urls, limit) {
    return new Promise(function (resolve) {
        var pendingNum = 0;
        var currentIndex = 0;
        // const results: Result<any>[] = [];
        var results = [];
        function startRequest() {
            return __awaiter(this, void 0, void 0, function () {
                var _loop_1;
                return __generator(this, function (_a) {
                    if (currentIndex === urls.length) {
                        resolve(results);
                    }
                    _loop_1 = function () {
                        var index = currentIndex;
                        results.push({ data: null, status: 'pending' });
                        var currentUrl = urls[index];
                        pendingNum++;
                        currentIndex++;
                        queryOne(currentUrl).then(function (data) {
                            results[index] = { data: data, status: 'success' };
                        }).catch(function (err) {
                            results[index] = { data: err, status: 'failure' };
                        }).finally(function () {
                            pendingNum--;
                            startRequest();
                        });
                    };
                    while (currentIndex < urls.length && pendingNum < limit) {
                        _loop_1();
                    }
                    return [2 /*return*/];
                });
            });
        }
        startRequest();
    });
}
var data = queryList2(['1', '2', '3', '1', '2', '3', '1', '2', '3'], 4);
console.log('data', data);
