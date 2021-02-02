function middleNum(nums1,nums2) {
    let centerNum = 0;
    if((nums1.length === 1 &&  nums2.length ===0) || (nums1.length === 0 &&  nums2.length ===1) ) {
        centerNum = nums1[0] || nums2[1]
    }

    

    return centerNum;
}