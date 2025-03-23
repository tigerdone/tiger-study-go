
function throttle(fn, delay) {
  let timer = null;
  let lastRunFlag = Date.now();
  
  return function (...params) {
      let dateNow = Date.now();
      let hasDelayTime = dateNow - lastRunFlag;
      if (hasDelayTime > delay) {
          fn.apply(this, params);
          lastRunFlag = Date.now();
      } else {
          if (timer) {
              clearTimeout(timer);
              timer = null;
          }
          timer = setTimeout(() => {
              fn.apply(this, params);
              lastRunFlag = Date.now();
          }, delay - hasDelayTime);
      }
  }
}

// 网上实现
function throttle2(fun, delay) {
  let last, deferTimer
  return function (args) {
      let that = this
      let _args = arguments
      let now = +new Date()
      if (last && now < last + delay) {
          clearTimeout(deferTimer)
          deferTimer = setTimeout(function () {
              last = now
              fun.apply(that, _args)
          }, delay)
      }else {
          last = now
          fun.apply(that,_args)
      }
  }
}
