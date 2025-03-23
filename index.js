
// function getUrlParams( url ,  key ) {
//   // write code here
//   const params = url.split('?')[1];
//   if (!params) return '';
//   const paramArr = params.split('&');
//   for (let i = 0; i < paramArr.length ; i++) {
//       const param = paramArr[i].split('=');
//       if (param[0] === key) {
//           return param[1];
//       }
//   }
//   return '';

// }


// const url = getUrlParams('https://www.happyelements.com/index.html?act=1&t=1582303492&refer=1', 't');

// console.log('url', url)


function hasCycle( head ) {
  // write code here
  const box = new Set();
  let flag = head;
  while(flag !== null) {
      if (box.has(flag)) {
          return true
      } else {
          box.add(flag)
      }
      flag = flag.next;
  }
  return false

}

const 

const flag = hasCycle({
  next: null
})

console.log('flag', flag);