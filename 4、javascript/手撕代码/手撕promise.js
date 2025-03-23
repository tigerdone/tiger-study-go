

function MyPromise(fn) {
  let data;
  let error;
  let status = 'pending';
  let origin_resolve; // []
  let origin_reject; // []

  function reject(err) {
    status = 'failure'
    data = err
    if (origin_reject) {
      origin_reject();
    }
  }
  function resolve(resData) {
    status = 'success'
    data = resData
    if (origin_resolve) {
      origin_resolve();
    }
  }
  fn(resolve, reject);

  return {
    then: (fn) => {
      if (status === 'success') {
        fn({
          data,
          status,
        })
      } else {
        origin_resolve = () => fn({
          data,
          status,
        })
      }
    },

    catch: (fn) => {
      if (status === 'failure') {
        fn({
          data: error,
          status,
        })
      } else {
        origin_reject = () => fn({
          data: error,
          status,
        })
      }
    },
  }
}

const promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 2000)
}).then()


