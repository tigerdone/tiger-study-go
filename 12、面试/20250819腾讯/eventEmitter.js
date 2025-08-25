// 尝试实现一个简单的事件发射器，它具有以下行为：

// once 方法：接收一个事件名称和一个回调函数。当指定名称的事件被触发时，该回调函数只应执行一次。
// async wait 方法：接收一个事件名称，并在事件被触发时返回该事件的负载数据。
// emit 方法：接收一个事件名称和一个负载数据。它会触发所有通过 once 方法为指定事件注册的回调函数，并返回所有针对同一事件名称的 wait 方法（的结果）。

export class SimpleEventEmitter {
    constructor() {
        this.eventList = new Map();
        this.waiters = new Map();
    }

    once(name, callback) {
        if (this.eventList.has(name)) {
            this.eventList.get(name).push(callback)
        } else {
            this.eventList.set(name, [callback])
        }
    }

    await(name) {
        return new Promise((resolve) => {
            if (this.waiters.has(eventName)) {
                this.waiters.get(name).push(resolve);
            } else {
                this.waiters.set(name, [resolve]);
            }
        })
    }

    emit(name, payload) {
        const results = [];

        if (this.eventList.has(name)) {
            const callbacks = this.eventList.get(name);
            callbacks.forEach(callback => {
                results.push(callback(payload));
            });
            this.eventList.delete(name);
        }

        if (this.waiters.has(name)) {
            const resolvers = this.waiters.get(name);
            resolvers.forEach(resolve => {
                resolve(payload);
            });
            this.waiters.delete(name);
        }

        return results;
    }
}