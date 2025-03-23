function throttle(fn, delay) {
    let lastRunTime = 0;
    return function(...args) {
        const dateNow = Date.now();
        const that = this;
        let timeFlag;

        if (dateNow - lastRunTime > delay) {
            fn.apply(that, args);
            lastRunTime = dateNow;
        } else {
            clearTimeout(timeFlag);
            timeFlag = setTimeout(() => {
                fn.apply(that, args)
                lastRunTime = dateNow;
            }, delay)
        }
    }
}

