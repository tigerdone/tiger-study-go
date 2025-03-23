
# react-router
history是封装的浏览器history的api，抹平了不同浏览器之间的差异
react-router
路由核心库，提供了路由的核心功能，不依赖于具体的平台，可以在任何平台下实现路由功能

react-router-dom
基于react-router，专门为web环境设计，包含BrowserRouter、HashRouter等适用于浏览器的组件

react-router-native
基于react-router，专门为react-native环境设计，包含NativeRouter等适用于移动应用的组件

# 设计原因
模块化设计，将核心功能与平台特定实现分离，使得react-router能够独立于平台工作，增强了灵活性和可移植性。
复用核心逻辑：通过共享react-router的核心逻辑，react-router-dom，react-router-native，能否复用基本的路由逻辑，减少了重复代码，提高了维护性

# 适应不同环境
不同平台有不同的需求，例如浏览器需要处理URL，而移动应用处理组件状态，将平台特定实现分离出来，使得每个模块可以专注解决特定的环境问题


# react-router，几种不同的模式
## Browser History
Browser History 使用的是HTML5的History.pushState和History.replaceState API。这种模式能够创建真实的URL结构。而不会重新加载页面。

实现原理：
#### 用户页面链接点击跳转
history.pushState用于向历史堆栈中添加一个新条目，并跳转到对应URL，包里面处理页面渲染逻辑
history.replaceState用于替换当前的历史条目，而不会创建新的记录，同时包里面处理页面渲染

#### 用户浏览器前进后退跳转
popState当用户点击浏览器前进后退按钮时触发，React-Router会监听这个事件并更新页面

优点：
URL与服务器路由一致，利于SEO和用户体验
可以使用浏览器的前进和后退功能

缺点：
需要服务器配置以支持所有应用内路由

Hash History
Hash History使用URL的hash部分来模拟不同的路径（例如：http://example.com/#/home）。这种模式不需要服务器配置，因为hash部分不会传到服务器。

实现原理：
window.location.hash用于获取和设置URL的hash部分
hashChange事件：当URL的hash部分变化时触发，React Router会监听这个事件并相应地更新页面

优点：
简单易用，不需要服务器配置
在老旧浏览器上兼容性良好

Memory History
Memory History将历史记录保存在内存中，而不与浏览器地址栏同步。通常用于非浏览器环境，如React Native或测试环境
实现原理：
维护一个内部堆栈来管理历史记录
无需依赖浏览器的历史api，完全是内存中操作

优点：
适用于非浏览器环境
不依赖URL，可以自由操作历史记录

缺点：
不能通过地址栏直接访问特定页面

Static History
Static History 为了支持SSR而引入的一种历史模式，主要运用在服务端渲染应用中，与前端的Browser Router不同的是，主要应用于服务端生成页面时模拟浏览器的行为。

实现原理：
createStaticHandle和createStaticRouter提供了静态版本的路由处理和路由器配置，专为SSR设计






