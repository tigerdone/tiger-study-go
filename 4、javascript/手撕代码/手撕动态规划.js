
function numSquares(n) {
  const arr = new Array(n+1).fill(0);

  for (let i = 1 ; i < n + 1; i++) {
    let mini = Number.MAX_VALUE;
    for (let j = 1; j * j <= i; j++) {
      mini = Math.min(mini, arr[i - j*j]);
    }
    arr[i] = mini + 1
  }
  return arr[n];
}

const arr = numSquares(6);
console.log(arr);


