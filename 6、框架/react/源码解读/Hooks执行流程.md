
启动流程

CreateRoot，创建fiberRoot和hostFiber

render
准备流程，创建任务，创建任务优先级，
开启任务调度循环
然后通过postMessage发起一个宏任务，宏任务执行
取出小顶堆最顶层任务，执行

开启协调流程，深度优先遍历

创建fiber树
先执行beginWork

beginWork里面执行

renderWithHooks
createElement
创建fiber节点

执行hooks函数，形成一个单链表挂载到memorizeState属性上
同时把副作用挂载到upDateQueue上

有副作用的fiber添加对应的flag，并依次向上层传递到HostFiber，用于检查是否需要执行副作用

常见hooks原理
useEffect，
在render
执行useEffect时，创建副作用并放入updateQueue



