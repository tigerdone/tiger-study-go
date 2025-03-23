async function async1() {
  console.log("async1 start");
  await async3();
  console.log("async1 end");
  await async3();
  console.log("async1 end end");
  await async3();
  console.log("async1 end end end");
}

async function async2() {
  console.log("async2 start");
  await async3();
  console.log("async2 end");
  await async3();
  console.log("async2 end end");
  await async3();
  console.log("async2 end end end");
}

async function async3() {
  // console.log("async3");
}
async1();
async2();