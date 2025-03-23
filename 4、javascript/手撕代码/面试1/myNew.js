
function New(func) {
  var res = {}
  if (func.prototype !== null) {
    res.__proto__ = func.prototype;
  }
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
  if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
    return ret;
  }

  return res;
}

var obj = New(function(age, money) {
  this.age = age;
  this.money = money
}, 20, 20)

// console.log(obj)


function testValue(value) {
  switch (value) {
    case '1':
      console.log('值为1')
      break
    case '2':
      console.log('值为2')
      break
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':      
      console.log('值为3到7之间')
      break
    default:
      console.log('值为undefined')
  }
}

// testValue('6')

function testArgument() {
  const data = Array.prototype.slice.call(arguments, 2, 4);
  console.log('argument', arguments)
  console.log('data', data);
}

const b1 = 'helloworld';
testArgument('sfs', 23, 99, 'sdf', b1);


console.log(JSON.stringify({
  age: 18,
  value: undefined,
  box: [18, '18', Symbol(18), undefined]
}))

console.log( typeof undefined)

