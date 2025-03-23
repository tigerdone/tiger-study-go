/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

type GetArrayType<T> = T extends (infer U)[] ? U : any;

type GetArrayType2<T> = T extends [] ? number : string;

type myArray = GetArrayType2<[]>

const a1: myArray = 2




type GetArrayType4<T> = T extends (infer U)[] ? U : any;


let x = Math.random() < 0.5 ? 10 : "hello world!";
   
x = 1;
 
console.log(x);
           
x = "goodbye!";
 
console.log(x);

let a2: string | number;

interface type1 {
  name: string;
  age: number;
}
interface type2 {
  money: number;
}

let a3: type1 & type2 = {
  age: 2,
  name: '2',
  money: 2
}; // 

function fn(x: string): void;
function fn(x1: string, y1: string): void;
function fn(x1: string, y1?: string): void {
  
}
// Expected to be able to call with zero arguments
fn('1');
fn('1', '2');

function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
// const d3 = makeDate(1, 3);
