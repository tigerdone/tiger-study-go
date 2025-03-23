# webpack 配置有哪些？
entry
指定webpack打包的入口文件，可以是单个或多个JavaScript文件。这个配置决定了webpack从哪个模块开始生成依赖关系图。
output
设置Webpack打包后输出的目录和文件名称
module
配置了不同的loader来处理不同的模块，例如对于CSS文件，可以使用css-loader和style-loader
resolve
设置webpack如何解析模块依赖，包括别名、扩展名
plugin
使用不同的插件可以增强webpack的功能，例如使用html-webpack-plugin可以将打包后的js文件自动引用到HTML文件中
devServer
提供一个简单的web服务器和实时重载功能，可以通过devserver进行配置
optimization
可以使用optimization.splitChunks和optimization.runTimeChunk配置代码拆分和运行时代码提取等优化策略
externals
用于排除打包的模块，例如可以将jQuery作为外置扩展，避免将其打包到应用进程中
devtool
配置source-map类型
context
webpack配置的根目录，string类型必须是绝对路径
target
指定webpack编译的目标环境
noParse
不用解析和处理的模块
stats
控制台输出日志控制


# 有哪些常见的loader和plugin
loader
- balel-loader：将ES6+的代码转换成ES5的代码
- css-loader：解析CSS文件，并处理CSS中的依赖关系，支持css模块化
- style-loader：将CSS代码注入到HTML文档中
- file-loader：解析文件路径，将文件赋值到输出目录，并返回文件路径
- url-loader：可以将小于指定大小的文件转成base64编码的Data URL格式
- sass-loader：将Sass文件编译成CSS文件
- less-loader：将less文件编译成css文件
- postcss-loader：自动添加css前缀，优化css代码
- vue-loader：将Vue文件组件编译成JavaScript代码

plugin：
- HtmlWebpackPlugin：生成HTML文件，并自动将打包后的javaScript和CSS文件引入到HTML文件中
- cleanWebPlugin：清除输出目录
- ExtractTextWebpackPlugin：将CSS代码提取到单独的CSS文件中。
- DefinePlugin：定义全局变量
- UglifyJsWebpackPlugin：压缩JavaScript代码
- HotModuleReplacementPlugin：模块热替换，用于在开发环境实现热更新。
- MiniCssExtractPlugin：与ExtractTextWebpackPlugin类似，将CSS代码提取到单独的CSS文件中。
- BundleAnalyzerPlugin：分析打包后的文件大小和依赖关系

# Loader和Plugin的区别
功能不同：
Loader本质是一个函数，他是一个转换器，webpack只能解析原生js文件，对于其他类型文件就需要loader进行转换

Plugin它是一个插件，用于增强webpack功能。webpack在运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。

用法不同：
Loader的配置是在module.rules下进行。类型为数组，每一项都是一个Object，里面描述了对于什么类型的文件，使用什么加载器，和参数

Plugin的配置在plugin下，类型为数组，每一项是一个Plugin的实例，参数都通过构造函数传入。

# webpack的构造流程
webpack的构建流程主要包括：
0、初始化参数，解析webpack配置参数，合并shell传入和webpack.config.js文件配置的参数，形成最终的配置结果。
1、开始编译，使用参数初始化compiler对象，注册所有配置的插件，插件监听Webpack构建生命周期的事件节点，作出相应的反应，执行compiler对象的run方法开始执行编译
2、确定过入口。从配置的entry入口，开始解析文件构建AST语法树。找出依赖，递归下去。
3、编译模块。递归中根据文件类型和loader配置看，调用所有配置的loader对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
4、完成模块编译。在经过第四步使用loader翻译完所有的模块后，得到了每个模块被翻译的最终内容以及他们之间的依赖关系
5、输出资源。根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成单独的文件加入到输出列表，这步是可以修改输出内容的最后的机会。
6、输出完成。在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

这个流程是个串行的过程，webpack的运行流程是一个串行的过程。他的工作流程流失哥哥插件串联起来。在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条webpack机制中，去改变webpack的运作，使得整个系统扩展性良好。

# 什么是webpack的热更新，原理是
webpack的热更新，在不刷新页面的前提下，将新代码替换掉旧代码。
HMR的原理是 webpack-dev-server和浏览器之间维护了一个webpack服务。当本地资源发生变化后，webpack会先将打包生成新的模块代码放入内存中，然后WDS向浏览器推送更新。并附带上构建时的hash，让客户端和上一次资源进行对比。 

# 流程细节
Webpack的构建流程可以分为以下三大阶段
1、初始化：启动构建，读取与合并配置参数，加载Plugin，实例化Compiler
2、编译：从Entry发出，针对每个module串行调用对应的Loader去翻译文件内容。再找到该Module依赖的Module。递归地进行编译处理。
3、输出：对编译后的Module组合成Chunk，把Chunk转换成文件，输出到文件系统。

如果只执行一次构建：以上阶段将会按照顺序各执行一次，但在开启监听模式下，流程将变为如下

初始化 -》编译 -》 输出 -》文件发生变化再次编译

每个大阶段中又会发生很多事件，webpack会把这些事件广播出来供给Plugin使用

## 初始化阶段
#### 初始化参数
从配置文件和Shell语句中读取与合并参数，得出最终的参数，这个过程中还会执行配置文件中的插件实例化 语句 new Plugin() 生成插件实例

#### 实例化Compiler
用上一步得到的参数初始化Compiler实例，Compiler负责文件监听和启动编译，Compiler实例中包含了完整的webpack配置，全局只有一个Compiler实例

#### 加载插件
依次调用插件的apply方法，让插件可以监听后续的所有事件节点，同时给插件传入compiler实例的引用，以方便插件通过compiler调用Webpack提供的API

#### environment
配置文件中初始化插件之后，在编译器准备环境时掉用。

#### entry-option
读取配置的Entry，为每个Entry实例化一个对应的EntryPlugin，为后面该Entry的递归解析工作做准备。

#### after-plugin
调用完所有内容和配置的插件的apply方法之后

#### after-resolve
根据配置初始化完resolver，resolver负责在文件系统中寻找指定路径的文件。

## 编译阶段
#### run
启动一次新的编译

#### watch-run
和run类似，区别在于它是在监听模式下启动的编译，在这个事件中可以获取到是哪些文件发生了变化导致重新启动一次新的编译

#### compile
该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上compiler对象

#### compilation
当webpack以开发模式运行时，每当检测到文件变化，一次新的Compilation将被创建。一个Compilation对象包含了当前的模块资源、编译生成资源，变化的文件等。compilation对象也提供了很多事件回调供插件做扩展

#### make
一个新的compilation创建完毕，即将从Entry开始读取文件，根据文件类型和配置的Loader对文件进行编译，编译完后再找出该文件依赖的文件，递归的编译和解析

#### after-compile
一次Compilation执行完成

### invalid
当遇到文件不存在，文件编译错误等异常时，会触发该事件，该事件不会导致Webpack退出

在编译阶段中，最重要的要数compilation事件，因为在compilation阶段掉用了loader完成了每个模块的转换操作，在compilation阶段又包含很多小的事件，分别是：

#### build-module
使用对应的loader去转换一个模块

#### normal-module-loader
在用Loader对一个模块转换完后，使用acorn解析转换后的内容，输出对应的抽象语法树（AST），以方便Webpack后面对代码的分析。

#### program
从配置的入口模块开始，分析其AST，当遇到require等导入其他模块语句时，便将其加入到模块

#### seal
所有模块及其依赖的模块都通过Loader转换完成后，根据依赖关系开始生成chunk

## 输出阶段
#### should-emit 
所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些文件不许要输出

#### emit 
确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容

#### after-emit
文件输出完毕

#### done
成功完成一次完整的编译和输出流程
#### failed
如果编译和输出流程中遇到一场导致webpack退出时，就会直接跳转到本步骤，插件

在输出阶段已经得到了各个模块经过转换后到结果和其依赖关系，并且把相关模块组合在一起形成一个个chunk。在输出阶段会根据chunk的类型，使用对应的模版生成最终要输出的文件内容。

# 优化方案

## 缩小文件的搜索范围
Webpack 启动后会从配置的Entry出发，解析出文件中的导入语句，再递归的解析。再遇到导入语句时Webpack会做两件事情：
1、根据导入语句去寻找对应的要导入的文件。例如**require("react")**导入语句对应的文件是**./node_modules/react/react.js** require('./util')对应的文件是'./utils.js'

2、根据找到的要导入文件的后缀，使用配置的中的Loader去处理文件，例如使用ES6开发的JavaScript文件需要使用“babel-loader”去处理

以上两件事情虽然对于处理一个文件非常快，但是当项目大了以后文件量会变的非常多，这时候构建速度慢的问题就会暴露出来。虽然以上两件事情无法避免，但是需要尽量减少以上两件事情的发生，以提高速度

#### 优化loader配置
由于Loader对文件的转换操作很耗时，需要让尽可能少的文件被Loader处理。

可以适当的调整项目的目录结构，以方便在配置Loader时通过include去缩小命中范围。
在使用Loader时可以通过，test、include、exclude三个配置项来命中Loader要应用规则的文件。为了尽可能少的让文件被Loader处理，可以通过include去命中只有哪些文件需要被处理

#### 优化 resolve.modules 配置
resolve.module 的默认值是['node_module']，含义是先去当前目录下的'./node_module'目录下去找想找的模块，如果没找到就去上一级目录的'./node_module'中找，依次往上，这和Node.js的模块寻找机制很相似。

当安装的第三方模块都放在项目根目录下的 './node_module'目录下时，没有必要按照默认的方式一层层的去寻找，可以指明存放第三方模块的绝对路径，以减少寻找

```js
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')]
  }
}
```

#### 优化resolve.mainFields配置
resolve.mainFields用于配置第三方模块使用哪个入口文件

安装的第三方模块都会有package文件用于描述这个模块的属性，其中有些字段用于描述入口文件在哪里，resolve.mainFields用于配置采用哪个字段作为入口文件的描述

可以存在多个字段描述的入口文件的原因是因为有些模块可以同时用在多个环境中，针对不同的运行环境需要使用不同的代码。以 isomorphic-fetch为例，它是fetch API的一个实现，但可同时用于浏览器和Nodejs环境，他的package文件中就有2个入口描述字段：
```js
{
  "browser": 'fetch-npm-browserify.js',
  "main": "fetch-npm-node.js"

}
```
isomorphic-fetch在不同的运行环境下使用不同的代码是因为fetchAPI实现机制不一样，在浏览器中通过原生的fetch或者XMLHttpRequest实现，在Nodejs中通过Http模块实现。
resolve.mainFields的默认值和当前的target配置有关系，对应关系如下：
- 当target为web或者webworker时，值是["browser", "module", "main"]

- 当target为其他情况是，值是["module", "main"]

以target等于web为例，Webpack会先采用第三方模块中的browser字段去寻找模块的入口文件，如果不存在就采用module字段，以此类推



## 优化构建结果文件
#### webpack包分析工具
#### 抽取css样式文件
#### 压缩css文件
#### 压缩js文件
#### 合理配置打包文件hash
项目维护的时候，一般只会修改一部分代码，可以合理配置文件缓存，来提升前端加载页面的速度和减少服务器压力，而**hash**就是浏览器缓存策略很重要的一部分，webpack打包的hash分为三种：

- hash：跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值
- chunkhash：不同的入口文件进行依赖文件解析、构建对应的chunk，生成对应的哈希值，文件本身修改或者依赖文件修改，chunkhash值会变化
- contenthash：每个文件自己单独的hash值，文件的改动只会影响自身的hash值

hash是在输出文件时配置的，格式是filename:"[name].[chunkhash:8][ext]",[xx]格式是webpack提供的占位符，:8是生成hash的长度

- ext 文件后缀名
- name 文件名
- path 文件的相对路径
- folder 文件所在文件夹
- hash 每次构建生成的唯一hash值
- chunkhash 根据chunk生成的hash值
- content 根据文件内容生成的hash值

因为js我们在生成环境里会把一些公共库和程序入口文件区分开发，单独打包构建，采用chunkhash的方式生成hash值，那么只要我们不改动公共库的代码，就可以保证其hash值不受影响，可以继续使用浏览器缓存，所以js适合chunkhash

公共库和业务代码文件区分开，生成不同的chunk，生成不同的文件，使用chunkhash可以合理使用浏览器缓存

css和图片资源媒体资源一般都是单独存在的，可以采用contenthash，只有文件本身变化后会生成新的hash值

#### 代码分割第三方包和公共模块
一般第三方包的代码变化频率比较小，可以单独把node_modules中的代码单独打包，当第三方包代码没变化时，对应chunkhash值也不会变化，可以有效利用浏览器缓存，还有公共的模块也可以提取出来，避免重复打包加大代码体积，webpack提供了代码分隔功能，需要我们手动在优化项optimization中手动配置下代码分隔splitChunk规则。


#### 资源预加载
上面配置了资源懒加载后，虽然提升了首屏渲染速度，但是加载到资源的时候会有一个去请求资源的延时，如果资源比较大会出现延迟卡顿现象，可以借助link标签的ref属性prefetch与preload，link标签除了加载css之外也可以加载js资源，设置rel属性可以规定link提取加载资源，但是加载资源后不执行，等用到了再执行


#### 打包时生成gzip文件
前端代码在浏览器运行，需要从服务器把HTML。css，js资源下载执行，下载的资源体积越小，页面加载速度就越快，一般采用gzip压缩，现在大部分浏览器和服务器都支持gzip，可以有效减少静态资源文件大小，压缩率在70%左右

nginx可以配置gzip：on，来开启压缩，但是只在nginx层面开启，会在每次请求资源时都对资源进行压缩，压缩文件会需要占用服务器cpu资源，更好的方式是前端在打包的时候直接生成gzip资源，服务器收到请求，可以直接把对应压缩好的gzip文件返回给浏览器，节省时间和cpu

webpack可以借助compression-webpack-plugin插件在打包时生成gzip文

