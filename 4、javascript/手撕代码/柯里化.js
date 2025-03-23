/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

function hyCurrying(fn, length) {
  length = length || fn.length;
  return function (...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return hyCurrying(fn.bind(this, ...args), length - args.length)
    }
  }
}

function sum(num1,num2,num3,num4,num5,num6) {
  return num1+num2+num3+num4+num5+num6;

}
const newSum = hyCurrying2(sum);
console.log(newSum(1,2,3,4,5,6));
console.log(newSum(1,2,3)(4,5,6));
console.log(newSum(1,2,3,4)(5,6));
console.log(newSum(1,2,3,4,5)(6));




function hyCurrying2(fn, length) {
  length = length || fn.length;
  return function(...args) {
    if (args.length >= length) {
      return fn.apply(this, args)
    } else {
      return hyCurrying(fn.bind(this, ...args), length - args.length);
    }
  }
  
}