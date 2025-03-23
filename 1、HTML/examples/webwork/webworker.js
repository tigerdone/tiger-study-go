// 监听主线程发送过来的消息
self.onmessage = function (e) {
  if (e.data === 'start') {
      setTimeout(() => {
        self.postMessage(Math.random());
        
      }, 2000);
      // 将任务结果发送回主线程
  }
};