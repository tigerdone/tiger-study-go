
# 声明一个getArrayType类型，能够推断出数组类型

```ts
// type getArrayType<T> = T extends (infer U)[] ? U : T extends Array<infer U> ? U : never;

type GetArrayType<T> = T extends (infer U)[] ? U : any;

type myArray = GetArrayType<number[]>


function test() {
  let a1: myArray;
}
```

```ts
type GetArrayType<T> = T extends (infer U)[] ? U : any;

type GetArrayType2<T> = T extends [] ? number : string;

type myArray = GetArrayType<number[]>

```