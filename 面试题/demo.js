/**
 * 
 * @param {*} array as Array
 * @param {*} k as number
 */
function findNumByIdx(array,k){
    return  Array.from(new Set(array)).sort((a,b)=> b - a )(k-1)
}

console.log(findNumByIdx( [3,1,3,2,5,4,5],3))