# 注入式


方案	兼容性	性能	参数长度限制
拦截式	无兼容性问题	较差，安卓端尤为明显	有限制
注入式	安卓4.2+ 和 iOS 7+以上可用	较好	无

# 拦截式
Web 端发出请求的方式非常多样，例如 <a/> 、iframe.src、location.href、ajax 等，但 <a/> 需要用户手动触发，location.href 可能会导致页面跳转，安卓端拦截 ajax 的能力有所欠缺，因此绝大多数拦截式实现方案均采用iframe 来发送请求。
## 缺点
  1. 连续发送时可能会造成消息丢失（可以使用消息队列解决该问题）
  2. URL字符串长度有限制
  3. 性能一般，URL request 创建请求有一定的耗时（Android 端 200-400ms）

# 如何执行回调
```js
// Web
const uniqueID = 1 // 为防止事件名冲突，给每个 callback 设置一个唯一标识
function webCallNative(event, params, callback) {
    if (typeof callback === 'Function') {
        const callbackID = 'jsb_cb_' + (uniqueID++) + '_' + Date.now();
        window[callbackID] = callback
    }
    const params = {callback: callbackID}
    // 构造 url scheme
    const src = 'bytedance://getAppInfo?' + JSON.stringify(params)
    ...
}
```

// Native
1. 解析传入的参数 'getAppInfo' 得知 Web 希望获取 AppInfo
2. 执行端逻辑获取 AppInfo
3. 执行参数中挂载在全局的 callback 方法，AppInfo 作为回调方法的参数
