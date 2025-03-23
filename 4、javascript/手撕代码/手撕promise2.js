/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

function MyPromise(fn) {
  this.status = 'pending'; // fulfilled reject
  this.PromiseResult = null;

  const self = this;
  function resolve(data) {
    if (self.status !== 'pending') {
      return
    }

    this.status = 'fulfilled';
    this.PromiseResult = data;
  }

  function reject(data) {
    if (self.status !== 'pending') {
      return
    }

    this.status = 'reject';
    this.PromiseResult = data;
  }

  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err)
  }
}


MyPromise.prototype.then = () => {

}


MyPromise.prototype.catch = () => {
  
}
