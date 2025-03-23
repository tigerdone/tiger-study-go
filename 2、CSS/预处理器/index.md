# 预处理器提供哪些功能

变量，嵌套，混入，函数，运算

css 语法简单，不方便维护和扩展，不利于复用，很难写出组织良好且易于维护的css代码

扩充了css语言，增加了变量，嵌套，混入，函数，运算，模块化

嵌套

```less
.main {
  & .header {
    backGroundColor: #fff;
  }
}
```
变量、混入
```less
@fontSize: 40px;

.header {
  background-color: @red;
  height: 50px;
  & p {
    color: aqua;
  }
  & .special {
    color: red;
    font-size: @fontSize;
  }
}
```

函数
```scss
@use "@/common/special";

$fontSize: 40px;

.header {
  background-color: special.$red;
  height: 50px;
  & p {
    color: aqua;
    @include special.setStrong(#fff);
  }
  & .special {
    color: red;
    font-size: $fontSize;
  }
}
```

运算
```less
.header {
  background-color: @red;
  height: 50px;
  width:  200px*3;
}
```