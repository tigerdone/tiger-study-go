

function myPromise(execFun) {
  let resolveFunList = [];
  let rejectFunList = [];
  let state = 'pendding';
  let resolvedData = null;
  let rejectedData = null;

  function resolve(data) {
    if (state === 'pendding') {
      state = 'resolved';
      resolvedData = data;
      resolveFunList.forEach(funItem => funItem(resolvedData))
    }
  }

  function reject(err) {
    if (state === 'pendding') {
      state = 'rejected';
      rejectedData = err;
      rejectFunList.forEach(funItem => funItem(rejectedData))
    }

  }

  execFun(resolve, reject)

  return {
    then(resolveFun, rejectFun) {
      if (state === 'resolved') {
        resolveFun();
        return this;
      }
      if (state === 'rejected') {
        rejectFun();
        return this;
      }
      resolveFun && resolveFunList.push(resolveFun);
      rejectFun && rejectFunList.push(rejectFun);
      return this;
    },
    catch(catchFun) {
      if (state === 'rejected') {
        catchFun();
        return this;
      }
      catchFun && rejectFunList.push(catchFun);
      return this;
    },
    finally(finallyFun) {
      finallyFun();
      return this;
    }
  }
}

function test() {
  const testPromise = new myPromise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve('ok') : reject('err')
    }, 2000);
  })

  testPromise.then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log('err', err)
  });
}

test()
test()
test()
test()
test()
