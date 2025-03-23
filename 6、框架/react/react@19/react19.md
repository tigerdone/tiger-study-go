

## useActionState

整合了异步逻辑所需要的状态管理，自动管理挂起状态，错误，form

## form组件
添加action函数，用于提交表单

### useFormStatus
用于获取form的状态

## useOptimistic
乐观更新，用于提交数据时，可以先将提交内容展示出来，会在提交函数执行完毕后更新（一般为异步函数），如果失败则回退，成功则更新为成功状态

## use
读取promise或者context中的数据，如果在suspense子组件中使用，会渲染suspense的fallback内容直到获取到数据

## 静态api

## ref可使用props传递
不用再使用forwardRef