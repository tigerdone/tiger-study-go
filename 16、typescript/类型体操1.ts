/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface type1 {
  name: string;
  age: number;
}

type A = MyPick<type1, "name">



type About = String | Number;
type About2 = {
  age: number;
} & {
  name: string;
};

const a: About = 1;
const b: About2 = {
  age: 20,
  name: 'tiger'
};