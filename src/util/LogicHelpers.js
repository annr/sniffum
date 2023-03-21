
// We want sale price to go down with number of muffins: supply and demand!
// Aim for high first muffin threshold ~(baseThreshold * 3). This would be a rate of around ~5.5
//
//    dynamicThreshold doesn't look curvy, it looks steppy-y
//    also, first thresholds too high.
//
// #### Formula to muffin clearance mark (oven three-quarters full):
// We will multiply this number with base threshold.
//
//       maxMuffins + (1 - i)
//          ------------
//              rate
// 
// #### Muffin clearance formula
//
//    ((muffinsLength - (maxMuffins - rate)) * 0.05) - 1
//
//  Example. muffinsLength = 13, we will multiply base threhold by 0.95 to reduce it a bit.  
//

const {config} = require('../config');

export const getMarketType = (gains) => {
    // returns "growth" | "stagnation" | "decline"
    switch (true) {
      case (gains < -(config.growthMarketDefinition*100)):
        return "growth";
      case (gains >= config.growthMarketDefinition*100):
        return "decline";
      default:
        return "stagnation";
    }
};

export const getDynamicThreshold = (threshold, muffinsLength, maxMuffins) => {

  // muffinsLength: 1, Threshold: 6.4
  // muffinsLength: 2, Threshold: 5.999999999999999
  // muffinsLength: 3, Threshold: 5.6
  // muffinsLength: 4, Threshold: 5.2
  // muffinsLength: 5, Threshold: 4.8
  // muffinsLength: 6, Threshold: 4.3999999999999995
  // muffinsLength: 7, Threshold: 3.9999999999999996
  // muffinsLength: 8, Threshold: 3.5999999999999996
  // muffinsLength: 9, Threshold: 3.2
  // muffinsLength: 10, Threshold: 2.8
  // muffinsLength: 11, Threshold: 2.4
  // muffinsLength: 12, Threshold: 2.1999999999999997
  // muffinsLength: 13, Threshold: 2.09
  // muffinsLength: 14, Threshold: 1.9799999999999998
  // muffinsLength: 15, Threshold: 1.8699999999999999
  // muffinsLength: 16, Threshold: 1.76

  if (muffinsLength > maxMuffins) {
      console.error(`What happened?!??`);
  }

  if (!muffinsLength) return 0.99; // there are no muffins. Price is very high!
  const limitRatio = maxMuffins/muffinsLength; // 16, 8, 

  const rate = 5.5;
  const saleSteps = 4;

  let adjuster = (maxMuffins + (1 - muffinsLength))/rate;

  if (muffinsLength == (maxMuffins*0.75)) {
      adjuster = 1;
  }

  if (muffinsLength > (maxMuffins*0.75)) {
      // modify adjuster
      adjuster = 1 - (((saleSteps - (maxMuffins - muffinsLength)) * 0.05));
      // reality check:
      if (muffinsLength == 13 && adjuster != 0.95) {
          console.error(`Something is wrong with getDynamicThreshold`);
      }
  }
  //console.log(`muffinsLength: ${muffinsLength}, Threshold: ${(adjuster * threshold)*100}`)

  if ((adjuster * threshold) < 0.017) {
      console.error(`Something is wrong with getDynamicThreshold`);
  }

  return adjuster * threshold;
}






  