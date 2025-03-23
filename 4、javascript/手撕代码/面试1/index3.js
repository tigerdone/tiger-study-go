function isObject (item) {
  return Object.prototype.toString.call(item) === '[object Object]' || Object.prototype.toString.call(item) === '[object Array]'
}
console.log(Object.prototype.toString.call([]))

function deepClone(obj, hash = new WeakMap()) {
  if (!isObject(obj)) return isObject;
  if (hash.has(obj)) return hash.get(hash);

  var target = Array.isArray(obj) ? [] : {};
  hash.set(obj, target);

  for(let key in obj) {
    console.log('isObject(obj[key])', key, isObject(obj[key]))
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (isObject(obj[key])) {
        target[key] = deepClone(obj[key]);
      } else {
        target[key] = obj[key];
      }
    }
  }
  return target;
}

var obj = {
  a: 1,
  c: [1,2,3, {i: 1}],
  d: 'apple',
  e: Symbol('ss'),
  f: false,
  g: undefined,
  h: obj
}

const obj2 = deepClone(obj)
obj.c[2] = 10
console.log(obj);
console.log(obj2);


var obj4 = {
  a: 1,
  c: [1,2,3, {i: 1}],
  d: 'apple',
  e: Symbol('ss'),
  f: false,
  g: undefined,
  h: obj4
}
console.log('obj4', obj4)