
// 有 2、3、7克重的砝码，返回称重最少的砝码数

function getWeightNums(weight) {
    const weightList = [2,3,7];
    const weightStepList = Array.from({ length: weight });
    weightStepList[0] = 0;
    for (let i = 1; i <= weight; i++) {
        const nextStepNums = weightList.map(itemWeight => {
            if (weightStepList[i - itemWeight] !== undefined && weightStepList[i - itemWeight] !== Infinity) {
                return weightStepList[i - itemWeight] + 1;
            }
            return Infinity;
        })
        weightStepList[i] = Math.min(...nextStepNums);
    }
    if (weightStepList[weight] === Infinity) {
        throw new Error('无法使用砝码衡量')
    }
    return weightStepList[weight];
}

const nums = getWeightNums(13);
