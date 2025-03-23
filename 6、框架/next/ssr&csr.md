# 前言

Next.js V13 推出了基于React Server Component的App Router路由解决方案。对于Next.js 而言是一个颠覆式更新，更是将React一直宣传的React Server Component这个概念真正推进并落实到项目中。

因为React Server Component 的引入，Next.js中的组件开始区分客户端组件还是服务端组件，但考虑到部分同学对React Server Component并不熟悉，本篇我们会先从React Server Component的出现背景开始讲起，并将其与常混淆的SSR概念做区分，为大家理解和使用服务端组件和客户端组件打下基础

# React Server Components
应用开发的三个注意要点：
Good user experience
Cheap maintenance
Fast performance

这三点分别是好的用户体验、易于维护、和高性能，但是这三点很难兼顾，

我们从顶层获取数据，然后传给需要的子组件，虽然一次请求就可以解决，但是这样的代码并不易于维护

比如在以后的迭代中删除了某个UI组件，但是对应数据没有从接口中删除，这就造成了冗余的数据，又比如你在接口里添加了一个字段，然后在某个组件里使用，但是你忘记了另一个引用该组件中传入这个字段，这可能就导致了错误。

为了易于维护，我们就会想回归到刚才简单的结构中，然后每个组件负责各自的数据请求

但是这样就慢了，本来一个请求就能解决，现在拆分为了三个请求，难道就不能全兼顾吗？

我们分析下原因，将数据请求拆分到各个组件中为什么会慢？本质上还是客户端发起了多次HTTP请求， 如果这些请求是串行的，那就更慢了，为了解决这个问题，便有了React Server Component

React Server Component 把数据请求的部分放在服务端，由服务端直接给客户端返回带数据的组件

最终的目标是：在原始只有Client Component的情况下，一个React 树的结构如下（全蓝色节点的树）


在使用React server Component 后，React 就会变成：（部分黄色节点的一颗树）



其中黄色节点表示React Server Component。在服务端，React会将其渲染回一个包含基础HTML标签和客户端组件占位的树，它的结构类似于：

黄色节点替换成HTML标签，蓝色节点为客户端组件对象

因为客户端组件的数据和结构在客户端渲染的时候才知道，所以客户端组件此时在树中使用特殊的占位进行替代

当然这个树不可能直接就发给客户端，React会做序列化处理，客户端收到后会在客户端根据这个数据重构React 树，然后用真正的客户端组件填充占位，渲染最终的结果。（黄色的节点为html标签，蓝色的节点为客户端组件）

使用React Server Component ，因为服务端组件的代码不会打包到客户端代码中，它可以减少包的大小，且在React Server Component中，可以直接访问后端资源，当然因为在服务器运行，对应也有一些限制，比如不能使用useEffect和客户端事件等。


# Server-side Rendering

Server-side Rendering，中文译为“服务端渲染”，

这样渲染出来的HTML是没有交互性的（non-interactive UI），客户端渲染出HTML后，还要等待JavaScript完全下载并执行。JavaScript会赋予HTML交互性，这个阶段被称为水合，此时内容变成为可交互的

从这个过程中，我们可以看出SSR的几个缺点：


1、SSR的数据获取必须在组件渲染之前
2、组件的JavaScript必须先加载到客户端，才能开始水合
3、所有组件必须先水合，然后才能跟其中任意一个组件交互

可以看出SSR这种技术“大开大合”，加载整个页面的数据，加载整个页面的JavaScript，水合整个页面，还必须按按此顺序串行执行，如果有某些部分慢了，都会导致整体效率降低

此外，SSR只用与页面的初始加载，对于后续的交互、页面更新、数据更改、SSR并无作用


# RSC 与 SSR
了解了这两个概念，现在让我们回顾下React Server Component和Server-side Rendering，表面上看，RSC和SSR非常相似，都发生在服务端的，都涉及到渲染，目前都是更快呈现内容，但实际上，这两个技术概念是相互独立的。RSC和SSR既可以各自单独使用，又可以搭配在一起使用（搭配在一起使用的时候是互补的）

正如它们名字所表名的那样，Server-side Rendering的重点在于Rendering，React Server Component 的重点在于Components

简单来说，RSC提供了更细粒度的组件渲染方式，可以在组件中直接获取数据，而非像Next.js 12中的SSR 顶层获取渲染数据。RSC在服务端进行渲染，组件依赖的代码不会打包的到bundle中，而SSR需要将组件的所有依赖都打包到bundle中。

最大区别：
SSR是在服务端将组件渲染成HTML发送给客户端，而RSC是将组件渲染成一种特殊的格式，我们称之为RSC Payload。这个RSC Payload的渲染是在服务端，但不会一开始就返回给客户端，而是在客户端请求相关的组件的时候才返回给客户端，RSC Payload会包含组件渲染后的数据和样式，客户端收到RSC Payload后会重建React 树，修改页面的DOM





