const DAY_IN_MS = 60 * 60 * 24 * 1000;

// pluck Open price for now.
export const convertData = (items) => {

  // make the more complex imported data into a simple map for lookups.
  const convertedMap = new Map();

  items.forEach(element => {
    const key = element.Date;
    convertedMap.set(key, element.Open);
  });
  return convertedMap;
}

export const massageData = (items) => {
  // the data has several prices per day. we just need "High"

  let newData = [];

  items.forEach((element, index) => {
    // get the date as a standard string.
    // for some reson dates in this format 2022-02-18 get saved as teh day before.
    // add one day to these to move
    const dateObj = new Date(element.Date)
    const key = new Date(dateObj.getTime() + DAY_IN_MS).toDateString();

    const price = element.High;
    let number;

    if (!price.replace) {
      // assume it's a number already
      number = price;
    } else {
      number = Number(price.replace(/[^0-9.-]+/g,""));
    }
    const tempObj = {};
    tempObj[key] = number
    newData[index] = tempObj;
  });
  debugger;
  return newData;
}

// returns an array on which day trades happen, and so they need to be real days and in the data
const getDatasetStartDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  const firstDay = data.keys().next().value;
  return new Date(firstDay);
};

const getDatasetEndDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  return new Date(Array.from(data.keys()).pop());
};

export const getValidMarketDay = (data, from, directionSwtich) => {
  let currentDay = from;
  if (isMarketDayWithinData(data, currentDay)) {
    return currentDay;
  }
  // otherwise search for and return first market day in direction
  do {
    currentDay += (DAY_IN_MS * directionSwtich);
    if (currentDay > getDatasetEndDay(data)) {
       return null;
    }
  } while (!isMarketDayWithinData(data, currentDay));

  return currentDay;
};

const isMarketDayWithinData = (data, day) => {
  return data.has(new Date(day).toDateString());
};

const isWithinStartRangeButNotMarketDay = (data, day) => {
  return !isMarketDayWithinData(data, day) && day < getDatasetEndDay(data);
};

const isWithinEndRangeButNotMarketDay = (data, day) => {
  return !isMarketDayWithinData(data, day) && day > getDatasetStartDay(data)
};

// get the next Monday, or if a holiday, Tuesday
export const adjustDayToWeekBeginning = (data, day) => {
  if (isMarketDayWithinData(data, day) && new Date(day).getDay() == 1) {
    return day;
  }
  let failSafe = 0;
  let adjustedDay;

  const mondayOffset = new Date(day).getDay() == 0 ? DAY_IN_MS : (-(new Date(day).getDay() - 8) * DAY_IN_MS);
  adjustedDay = day + mondayOffset;

  // if that Monday is not in dataset, try the next day, Tuesday
  if (!isMarketDayWithinData(data, day)) {
    return adjustedDay += DAY_IN_MS;
  }
  // if Tues is also not a market day, bust out, something is wrong
  if (!isMarketDayWithinData(data, day)) {
    console.error('Tuesday not a market day!?');
  }
  return adjustedDay;
};

export const checkLogicOfDates = (data, startDate, endDate) => {
  if ((startDate || endDate) < getDatasetStartDay(data) || (startDate || endDate) > getDatasetEndDay(data)) {
    console.error("Selected date outside of data set.");
  }
};

// these two functions may be combined and written more elegantly
export const adjustStartToMarketDay = (data, startDate) => {
  if (startDate < getDatasetStartDay(data)) {
    return getDatasetStartDay(data);
  }
  if (startDate > getDatasetEndDay(data)) {
    console.error("Selected start date is greater than last day of data set.")
    return null;
  }
  if (!isMarketDayWithinData(data, startDate)) {
    // return next closest date after the requested startDate
    return getNextClosestMarketDay(data, startDate, true);
  }
  return startDate;
};

export const adjustEndToMarketDay = (data, endDate) => {
  if (endDate > getDatasetEndDay(data)) {
    return getDatasetEndDay(data);
  }
  if (endDate < getDatasetStartDay(data)) {
    console.error("Selected end date is less than first day of data set.")
    return null;
  }
  if (!isMarketDayWithinData(data, endDate)) {
    // return next closest date after the requested startDate
    return getNextClosestMarketDay(data, endDate, false);
  }
  return endDate;
};

const getNextClosestMarketDay = (data, date, ascFlag, forceWeekStart) => {
  // Find next market day without reaching endDate or last day of data
  // (TODO: add check for startDate < endDate. I'm skipping that for now.)
  let newDate = date;
  let failSafe = 0;
  // failsafe will swallow an error, but you'll figure it out.
  if (ascFlag) {
    while (isWithinStartRangeButNotMarketDay(data, newDate) && failSafe < 20) {
      failSafe++;
      newDate = new Date(newDate).getTime() + DAY_IN_MS;
    }
  } else {
    while (isWithinEndRangeButNotMarketDay(data, newDate) && failSafe < 20) {
      failSafe++;
      newDate = new Date(newDate).getTime() - DAY_IN_MS;
    }
  }
  return newDate;
};

export const getFirstMarketDaysOfWeekOverPeriod = (data, startDate, endDate, tradeFrequency) => {
  // dates have been adjusted, so just make sure that it's a Monday is not a holiday
  let days = [];
  let currentDay = startDate;
  if (isMarketDayWithinData(data, currentDay)) {
    days.push(currentDay);
  } else {
    // Assume it is holiday, and push the next day without augmenting
    days.push(currentDay + DAY_IN_MS);
  }

  do {
    currentDay += (DAY_IN_MS * tradeFrequency);
    if (isMarketDayWithinData(data, currentDay)) {
      days.push(currentDay);
    } else {
      // Assume it is holiday, and push the next day without augmenting
      days.push(currentDay + DAY_IN_MS);
    }

  } while ((currentDay + (DAY_IN_MS * tradeFrequency) < endDate));

  return days;
};

// we validate startDate and endDate upstream
export const getDaysTradeFrequencyApart = (data, startDate, endDate, tradeFrequency) => {
  const period = (DAY_IN_MS * tradeFrequency);
  let days = [];
  let currentDay = startDate;
  days.push(getValidMarketDay(data, currentDay, 1));
  while (currentDay + period < endDate) {
    currentDay += period;
    days.push(getValidMarketDay(data, currentDay, 1));
  }
  return days;
};

export const getNewMuffin = (data, day, index, muffinPrice) => {
  // Event day is unique identifier. This is fine for now.
  return {
    'id': index,
    'cost': muffinPrice,
    'purchaseDate': new Date(day).toDateString(),
    'purchasePrice': getPrice(data,day),
    'saleDate': null,
    'salePrice': null,
    'profit': null,
    'age': null,
    'currentGain': null,

  };
};

export const getNewEvent = (data, day, index, newMuffin, soldMuffins, costUnsoldMuffins) => {
  // Event day is unique identifier. This is fine for now.
  return {
    'eventId': index,
    'date': day,
    'price': getPrice(data,day),
    'purchasedMuffin': newMuffin,
    'soldMuffins': soldMuffins,
    'costUnsoldMuffins': costUnsoldMuffins,
  };
};

// const canSellMuffin = (data, day, muffin, muffinsLength, threshold, maxMuffins) => {
//   // can't sell muffin that is only one week old. IMPLEMENT
//   // priceChangePercent must be above dynamic threshold
//   const priceChangePercent = getPriceChangePercent(muffin.purchasePrice, getPrice(data, day));
//   return priceChangePercent > threshold;
// };

const canSellMuffin = (data, day, muffin, thresholdBasedOnNumberOfMuffins) => {
  // can't sell muffin that is only one week old. IMPLEMENT
  // priceChangePercent must be above dynamic threshold
  const priceChangePercent = getPriceChangePercent(muffin.purchasePrice, getPrice(data, day));
  return priceChangePercent > thresholdBasedOnNumberOfMuffins;
};


// We want sale price to go down with number of muffins: supply and demand!
// Aim for high first muffin threshold ~(baseThreshold * 3). This would be a rate of around ~5.5
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

export const getIndicesOfMuffinsToBeSold = (data, day, muffins, saleThreshold) => {
  // loop through muffins to see if any sale thresholds are met for any muffins.
  // and count total unsold muffin value
  let saleIndexes = []

  for (let i = 0; i < muffins.length; i++) {
    if (muffins[i].profit == null) {
      const priceChangePercent = getPriceChangePercent(muffins[i].purchasePrice, getPrice(data, day));
      if (priceChangePercent > saleThreshold) {
        // yay! we can sell.
          saleIndexes.push(i);
          muffins[i].saleGain = priceChangePercent;
      }
    }
  }
  return saleIndexes;
}

export const getUnsoldMuffins = (muffins) => {
  const unsold = (element) => !element.saleDate;
  return muffins.filter(unsold);
};

export const getCupcakes = (muffins) => {
  const cupcakes = (m) => !m.saleDate && m.age > (9 * 30); // hard-coded age for cupcakes
  return muffins.filter(cupcakes);
};

export const updateAgeOfMuffins = (day, muffins) => {
  for (var i in muffins) {
    if (!muffins[i].saleDate) {
      const age = getAgeInDays(day, muffins[i]);
      muffins[i].age  = Math.round(age);
    }
  }
  return muffins;
};

export const updateGainOfMuffins = (data, day, muffins) => {
  for (var i in muffins) {
    if (!muffins[i].saleDate) {
      const gain = getPercentValueToday(getPrice(data, day), muffins[i]);
      muffins[i].currentGain  = gain;
    }
  }
  return muffins;
};

export const getUnsoldMuffinsProfit = (currentPrice, muffins) => {
  let profit = 0;
  for (var i in muffins) {
    if (!muffins[i].saleDate) { // count only unsold
      profit += getDollarValueToday(currentPrice, muffins[i]);
    }
  }
  return profit;
};

export const getCostUnsoldMuffins = (muffins, muffinPrice) => {
  return getUnsoldMuffins(muffins).length * muffinPrice;
};

const getAgeInDays = (day, muffin) => {
  return (new Date(day) - new Date(muffin.purchaseDate))/(1000*60*60*24);
};

const getPercentValueToday = (currentPrice, muffin) => {
  return getPriceChangePercent(muffin.purchasePrice, currentPrice);
};

const getDollarValueToday = (currentPrice, muffin) => {
  return getPercentValueToday(currentPrice, muffin) * muffin.cost;
};

export const getPrice = (data, day) => {
  return data.get(new Date(day).toDateString());
};

export const getProfit = (muffinPrice, percentChange) => {
  return (muffinPrice * percentChange);
}

export const getPriceChangePercent = (x, y) => {
  return (y-x)/x;
}

export const getReturn = (totalProfits, averageInvestment) => {
  return (totalProfits/averageInvestment)*100;
}

export const getMaximumInvested = (investedAmountByDay) => {
  let max = 0;
  // There is a better way to do this
  investedAmountByDay.forEach(invested => {
    max = Math.max(max, invested)
  });
  // investedAmountByDay.length is also number trade days
  return max;
};

export const getAverageInvestment = (investedAmountByDay) => {
  let total = 0;
  // There is a better way to do this
  investedAmountByDay.forEach(invested => {
    total += invested;
  });
  // investedAmountByDay.length is also number trade days
  return total/investedAmountByDay.length;
};

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatPercent = (num) => {
  return Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
};

export const isCloseToBirthday = (muffins, tradeDay) => {
  // determine if muffin is almost a year old and should be let go.
  return false;
};




