

function getDeepNum(node, num = 0) {
  let leftNum = 0;
  let rightNum = 0;
  if (node.left) {
    leftNum = getDeepNum(node.left, num)
  }
  if (node.right) {
    rightNum = getDeepNum(node.right, num)
  }
  return Math.max(leftNum, rightNum) + 1;
}


// function reverseList(list) {
//   const flagA = list.next;
//   const flagA = list;

// }


const node = {
  left: {
    left: {
      left: null,
      right: null
    },
    right: null
  },
  right: {
    left: {
      left: {
        left: null,
        right: null
      },
      right: null
    },
    right: {
      left: {
        left: {
          left: null,
          right: null
        },
        right: null
      },
      right: null
    }
  }
}

console.log(getDeepNum(node));

function reverseList(list) {
  let flagA = null;
  let flagB = list;
  let flagC = flagB.next;
  while(flagB) {
    flagB.next = flagA;
    flagA = flagB;
    flagB = flagC;
    flagC = flagC?.next;
  }
  return flagA;
}

const list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: {
          value: 5,
          next: {
            value: 6,
            next: null,
          },
        },
      }
    },
  },
}
// const reversed = reverseList(list);
function logList(list) {
  let node = list;
  while(node) {
    console.log(node.value);
    node = node.next;
  }
}
logList(list);
