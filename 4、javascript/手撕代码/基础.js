function go () {
  try {
    return 200;
  } finally {
    console.log('finally');
  }
  
}

console.log(go())