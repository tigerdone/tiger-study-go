/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

type Arrayish = { [n: number]: unknown };
type A1 = keyof Arrayish;
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;


var box = {
  name: 'tiger'
}
type A3 = keyof typeof box;

interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
 
let a31 = createLabel("typescript");
   
 
let b2 = createLabel(2.8);
   
 
let c3 = createLabel(Math.random() ? "hello" : 42);


type Flatten<T> = T extends any[] ? T[number] : T;
 
// Extracts out the element type.
type Str = Flatten<(string | number)[]>;
    
type Num = Flatten<number>;

type ToArray<Type> = Type extends any ? Type[] : never;
 
// string[] | number[]
type StrArrOrNumArr = ToArray<string | number>;