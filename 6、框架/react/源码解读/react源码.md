# 理念篇

## React理念

### 理念介绍

React是用JavaScript构建快速响应的大型Web应用程序的首选方式。他在Facebook和Instagram上表现优秀

ui = render（data）-> 单向数据流

如何提升页面响应交互
CPU卡顿：大量计算操作导致的性能问题
IO卡顿：网络请求延时的，无法快速响应

1、CPU卡顿
- 在浏览器刷新频率为60HZ的情况下（即1000ms/60HZ=16.6ms）浏览器刷新一次
- 浏览器里JS线程与GUI线程是互斥的，不可同时执行，所以JS脚本和浏览器的render、painting不能同时执行，所以执行顺序为：JS脚本执行 - 样式布局 - 样式绘制，JS执行时间超过16.6ms，就不会执行render与painting

React是如何解决这个问题

在浏览器每一帧时间中，预留一些时间给JS线程，React


#### React Fiber如何更新DOM

使用“双缓存”

在内存中绘制当前的fiber dom，绘制完毕后直接替换上一帧的fiber dom，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况

在React中最多会同时存在两颗Fiber树。当前屏幕上显示内容对应的Fiber树成为current Fiber，正在内存中构建的Fiber树称为workInProgress Fiber，两者通过alternate连接
```js
currentFiber.alternate === workInProgressFiber
workInProgressFiber.alternate === currentFiber
```
React应用的根节点通过current指针指向不同的fiber dom切换，当update时，workInProgressFiber render完成后会跟currentFiber替换，下一次更新会将当前currentFiber替换

- mount

- 1、首次执行ReactDOM.render会创建fiberRootNode（源码中叫fiberRoot）和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是<App />所在组件树的根节点；
a、区分fiberRootNode与rootFiber：因为在应用中我们可以多次调用ReactDOM.render渲染不同的组件树，他们会拥有不同的rootFiber。但是整个应用的根节点只有一个，那就是fiberRootNode
b、fiberRootNode的current


## 整体流程

### 启动流程


#### 初始化流程
ReactDOM.createRoot
- createRootImpl
  - createContainer
    - createFiberRoot
    - createHostRootFiber
    - initializeUpdateQueue > *fiber.updateQueue = queue;*
  - ReactDOMRoot
    - render
      这里挂载应用root**<App/>**，执行createElement，创建元素挂载到fiberRoot的updateQueue上面
      注意
      -- createElement和fiber没有关系，fiber是调和过程中生成的
    - updateContainer
      - enqueueUpdate
        初始化一个update，将更新入队，放全局concurrentQueues队列中
      - scheduleUpdateOnFiber


然后执行ReactDOMRoot的render方法再执行updateContainer

```js
// updateContainer
// 取出fiberRoot上的HostRootFiber，赋值current
// 获取优先级

// context相关初始逻辑

// 准备update对象
// 将update对象添加到HostRootFiber上

// 调用scheduleUpdateOnFiber开启一个调度
```
#### 调度流程
触发 scheduleUpdateOnFiber
调度流程就是按钮lane模型调度出最高优的任务来执行

- scheduleUpdateOnFiber
  - markRootUpdated
  - ensureRootIsScheduled 传入performConcurrentWorkOnRoot，作为创建的任务的callback
  - scheduleCallback
  - unstable_scheduleCallback 初始化任务，用performConcurrentWorkOnRoot作为新任务callback，新任务入堆，这里用到堆的逻辑
  - requestHostCallback    参数 flushWork 赋值给scheduledHostCallback
  - schedulePerformWorkUntilDeadline  setImmediate 类似于postMessage，在当前栈代码逻辑执行完成之后执行传入的函数performWorkUntilDeadline
  - setImmediate
  - **这里发生调度**
  - performWorkUntilDeadline 执行scheduledHostCallback执行requestHostCallback赋值的函数flushWork
  - flushWork
  - workLoop
    - peek 取出任务
    - 取任务的callback执行
  - performConcurrentWorkOnRoot
  - renderRootSync 挂载的调和流程是同步的，执行renderRootSync
    - prepareFreshStack
      - 创建hostFiber，并通过alternate与current相互连接形成如图结构，FiberRoot rootFiber rootFiber
      ![alt text](image.png)
      - 将hostFiber赋值给workInProgress，是第一个执行beginWork工作的节点。
      - 本次更新的优先级Lanes赋值给全局变量subtreeRenderLanes，并且此变量将在执行beginWork工作时作为本次更新的renderLanes参数传递

  - workLoopSync
  - performUnitOfWork
  - **beginWork**  创建rootFiber下面的app的Fiber节点
    - 根据workInProgress.tag进行switch判断执行updateHostRoot
  - updateHostRoot
  - reconcileChildren
  - reconcileChildFibers
    - reconcileSingleElement
      - createFiberFromElement
        - createFiberFromTypeAndProps 
          - 初始fiberTag为IndeterminateComponent，函数组件没有更新tag
          - 如果是类组件更新为ClassComponent
        - createFiber
        - FiberNode
      - coerceRef
      - created.return = returnFiber; returnFiber为父亲节点，挂载时create为app函数的fiber，return为hostFiber，workInProgress
    - placeSingleChild
      - 给新建的Fiber节点设置flags属性值为Placement【插入的标识，用于commit阶段的逻辑执行】。
    - 函数执行完成，退到performUnitOfWork 判断next不为null，则执行workInProgress = next;

  - workInProgress不为null，继续执行workLoopSync
  - workLoopSync
  - performUnitOfWork
  - **beginWork**  创建App里面的多个元素
  - mountIndeterminateComponent 这一次走mountIndeterminateComponent，跟之前走updateHostRoot不一样
    - 执行renderWithHooks
    - workInProgress.tag = FunctionComponent;
  - reconcileChildren
  - reconcileChildFibers mountChildFibers被赋值为reconcileChildFibers
  - reconcileChildrenArray 多子节点 兄弟节点通过sibling连接，返回第一个节点，作为父亲节点的child
    - 依次向上返回，返回给
    - 返回workInProgress.child;
    - 更新为workInProgress
    - workLoopSync 判断workInProgress是否为null继续执行
  - performUnitOfWork

```js
// 主要有两个任务
// 1,标记root有更新任务，将本次更新的优先级赋值给fiberRoot
markRootUpdated(root, lane, eventTime);

// 2，开始调度
ensureRootIsScheduled(root, eventTime);
// 
```




创建FiberRootNode
```
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;

  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  this.identifierPrefix = identifierPrefix;
  this.onRecoverableError = onRecoverableError;

  if (enableCache) {
    this.pooledCache = null;
    this.pooledCacheLanes = NoLanes;
  }

  if (supportsHydration) {
    this.mutableSourceEagerHydrationData = null;
  }

  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }

  if (enableTransitionTracing) {
    this.transitionCallbacks = null;
    const transitionLanesMap = (this.transitionLanes = []);
    for (let i = 0; i < TotalLanes; i++) {
      transitionLanesMap.push(null);
    }
  }
```
![alt text](image.png)



```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  this.alternate = null;

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).
    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }
}
```

```js
// workInProgress tag类型
// packages\react-reconciler\src\ReactWorkTags.js
export const FunctionComponent = 0; // 函数组件
export const ClassComponent = 1; // 类组件
export const IndeterminateComponent = 2; // 待定的类型 
export const HostRoot = 3; // 根节点类型
export const HostPortal = 4; 
export const HostComponent = 5; // 指的是原生dom 标签元素
export const HostText = 6; // 文本类型
export const Fragment = 7; // 片段
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11; // forwardRef组件
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14; // memo组件
export const SimpleMemoComponent = 15; // sinpleMemo组件


```

```js
// exitStatus
var RootIncomplete = 0;
var RootFatalErrored = 1;
var RootErrored = 2;
var RootSuspended = 3;
var RootSuspendedWithDelay = 4;
var RootCompleted = 5;
```



## 整体框架

createRoot创建新应用根节点，fiberRoot，用于挂载生成好的fiber树，和当前更新的优先级

在创建了一个ReactDomRoot，然后调用原型上面的render，

render函数中创建更新函数，并调用scheduleUpdateOnFiber开启调度

调度器取出最高优任务执行，为上面生成的更新函数

启动协调流程，找出组件的变化，并生成更新


协调流程分beginWork和completeWork，beginWork生成fiber节点，completeWork生成DOM节点

## 两个核心调度过程
在React源码中，有两个核心调度过程非常重要，

- Scheduler workLoop 负责任务的调度和优先级管理，确保高优先级任务优先执行，低优先级任务在空闲时间执行
- Reconciler workLoop 负责协调组件的更新，找出组件树中的变化，并生成更新

### Scheduler的workLoop
Scheduler的workLoop是一个用于调度任务的循环。它会根据任务的优先级决定执行哪些任务，并在适当的时候暂停或中断，以确保用户体验的流程性。下面是一个简化版的workLoop实现，并解释其工作原理：
```js

function workLoop() {
  let currentTime = initialTime;
  let currentTask = firstTask;

  // 判断是否应该放弃控制权回到浏览器。以确保不会阻塞主线程
  while(currentTask !== null && !shouldYieldToHost()) {
    if (currentTask.expirationTime <= currentTime) {
      // 任务过期。立即执行
      currentTask.callback();
      currentTask = currentTask.next;
    } else {
      currentTask = currentTask.next;
    }
  }
  
  // 将剩余任务保存在队列中
  firstTask = currentTask;
}

```


### Reconciler的workLoop
Reconciler的workLoop是协调组件更新的核心循环。它遍历组件树，找出需要更新的组件，并生成更新。这是一个递归的过程，通过Fiber数据结构来实现。下面伪代码解释
```js
function workLoop(){
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
    workInProgress = getNextWorkInProgress();
  }
}

function performUnitOfWork(fiber) {
  const next = beginWork(fiber);
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber) {
  // 完成当前 fiber 的工作，并移动到父fiber
  // completeWork(fiber);

  let returnFiber = fiber.return;
  let siblingFiber = fiber.sibling;
  if (siblingFiber !== null) {
    workInProgress = siblingFiber;
  } else {
    workInProgress = returnFiber;
  }
}

function getNextWorkInProgress() {
  return workInProgress.child;
}

```





