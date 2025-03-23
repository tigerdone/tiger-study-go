<!-- 性能优化 -->


<!-- 实现fetch函数 -->
function execQuery(query, times) {
    new AbortController()
    
    return new Promise((resolve, rej) => {
        let res;
        const id =setTimeout(() => {
            AbortController.abort()
        }, 3000);
        query().then((data) => {
            clearTimeout(id)
            res = data;
        resolve(res);
        }).catch(()=>{
            if(times>0){
                return execQuery(...,times-1)
            }else{
            clearTimeout(id)
                re()
            }
        })
    })
<!-- React + next 
AI = chartting
 = wirzzle pc + 移动 -->
}