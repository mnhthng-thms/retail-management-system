const json = { name: "Hoang Minh Tu", tags: ["code all day", "coding spree"], price: "25-90" };

const urlQueryToDbQuery = (queryObj) => {
  return Object.keys(queryObj)
    .reduce((acc, cur) => {
      const originalCurValue = queryObj[cur];
      if (originalCurValue.constructor === Array) {
        acc[cur] = { $in: originalCurValue };
        return acc;
      }
      else if (!!parseInt(originalCurValue)) {
        const numsForRange = originalCurValue.split('-');
        acc[cur] = { $gte: numsForRange[0], $lte: numsForRange[1] };
        return acc;
      }
      else {
        acc[cur] = originalCurValue;
        return acc;
      }
    }, {})
};

console.log(JSON.stringify(urlQueryToDbQuery(json)));

module.exports = urlQueryToDbQuery; 