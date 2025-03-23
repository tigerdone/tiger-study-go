function isObj(item) {
  return Object.prototype.toString.call(item) === '[object Object]';
}

function isArr(item) {
  return Object.prototype.toString.call(item) === '[object Array]';
}

function deepClone(obj, mapBox = new WeakMap()) {
  let res = {};
  if (!isObj(obj) && !isArr(obj)) return obj;

  if (mapBox.get(obj)) {
    return null;
  }
  mapBox.set(mapBox, true);

  console.log(isObj(obj), isArr(obj));

  const keys = Object.keys(obj);
  for(let key of keys) {
    if (isObj(obj[key])) {
      res[key] = deepClone(obj[key]);
    } else {
      
    }

    if (isArr(obj[key])) {
      // res[key] = [...obj[key]];
      res[key] = '23';
      console.log()
    }
    res[key] = obj[key];
  }

  return res;
}

const obj = {
  a: 1,
  b: '2',
  c: null,
  d: Symbol('11'),
  f: [1,2,3, {a: 1}],
  g: undefined,
  h: NaN
}

const obj2 = deepClone(obj);
obj['a'] = 'a';
obj['f'][1] = 2000;

console.log(obj);
console.log(obj2);

