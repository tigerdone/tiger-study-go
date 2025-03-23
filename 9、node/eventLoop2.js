async function async1() {
  console.log("async1 start");  // 2
  await async2();
  console.log("async1 end"); // 8
}

async function async2() {
  console.log("async2");  // 3
}

console.log("script start"); // 1

setTimeout(function () {
  console.log("setTimeout0"); // 10
}, 0);

setTimeout(function () {
  console.log("setTimeout3"); // 12
}, 3);

setImmediate(() => console.log("setImmediate"));  // 11

process.nextTick(() => console.log("nextTick"));  // 7

async1();

new Promise(function (resolve) {
  console.log("promise1"); // 4
  resolve();
  console.log("promise2");  // 5
}).then(function () {
  console.log("promise3");  // 9
});

console.log("script end");  // 6

// 输出结果依次为：
// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nextTick
// async1 end
// promise3
// 剩下的 setTimeout0、setTimeout3、setImmediate 顺序不定
// 唯一能确定的是 setTimeout0 在 setTimeout3 前输出
// 而 setImmediate 可能在 setTimeout0 前也可能在 setTimeout3 之后，也可能在两者中间
