## typescript 与静态类型语言的区分和联系

## ts类型与其他语言类型的差异

## sass 与 tailwindcss 区别于联系，tailwind发展，unocss与tailwindcss区别，性能差异

## sass 怎么解决样式类冲突

## 打包生成的commonjs模块，与es6模块，commonjs模块不能使用怎么办

## react 如何避免无效或者重复的渲染问题

## react 状态管理库

## react 调度的优先级
react的触发的事件都有一个update对象，对象上会有这个事件的优先级
触发事件后，react会触发一个任务调度

react的任务调度流程是一个wookloop，循环从一个小顶堆里面取出堆顶事件，堆顶事件是优先级最高的事件

每次取出一个任务来执行，执行完成后再取出下一个任务，如果任务没到过期时间，且无剩余可执行时间时，就跳出循环，
然后判断hasMoreTask，如果为true则创建一个宏任务，推送到任务队列，让出主线程，让浏览器处理高优先级任务

## 浏览器一对多通信api

## react-native线程间的通信

## 版本更新的全局通知

## 日志上报

## es6、commonjs 格式不一样导致不能使用，怎么使用

## 为什么选择tsup

## nestjs搭建微服务，调用rpc

## 项目怎么配置的


