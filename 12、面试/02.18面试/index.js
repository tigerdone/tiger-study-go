
function execQuery(query, times) {
  return new Promise((resolve, reject) => {
    function execWithTimes(query, times) {
      const control = new AbortController();

      const id =setTimeout(() => {
        control.abort()
      }, 3000);
  
      query({
        signal: control.signal,
      }).then((data) => {
        clearTimeout(id)
        resolve(data);
      }).catch(() => {
          if(times > 0){
            execWithTimes(query, times-1)
          } else {
            clearTimeout(id)
            reject({
              msg: '已达最大重试次数'
            })
          }
      })
    }
    execWithTimes(query, times)
  })
}


const controller = new AbortController();
const API_URL = '<http://127.0.0.1:3000/datat>';
void (async function () {
    const response = await axios.get(API_URL, {
        signal: controller.signal,
    });
    const { data } = response;
})();
setTimeout(() => {
    controller.abort();
}, 1000);

// execQuery()
// <!-- React + next 
// AI = chartting
// = wirzzle pc + 移动 -->

function execQueryRight(query, times) {
  const control = new AbortController();
  
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      control.abort(); // 正确调用实例的 abort 方法
    }, 3000);

    query({ signal: control.signal })
      .then(data => {
        clearTimeout(id);
        resolve(data);
      })
      .catch(error => {
        clearTimeout(id); // 确保清除当前定时器
        if (times > 0) {
          // 递归重试并传递结果
          execQuery(query, times - 1).then(resolve).catch(reject);
        } else {
          reject(error); // 重试耗尽后拒绝
        }
      });
  });
}