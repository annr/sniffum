// remove this after replacing BASIC with better data
export const convertBasicData = (items) => {
  const convertedMap = new Map();

  items.forEach(element => {
    const key = Object.keys(element)[0];
    convertedMap.set(key, element[key]);
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
    const oneDay = 60 * 60 * 24 * 1000;
    const dateObj = new Date(element.Date)
    const key = new Date(dateObj.getTime() + oneDay).toDateString();

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
  console.log("First day: " + firstDay)
  return new Date(firstDay);
};

const getDatasetEndDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  return new Date(Array.from(data.keys()).pop());
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
      const oneDay = 60 * 60 * 24 * 1000;
      newDate = new Date(newDate).getTime() + oneDay;
    }
  } else {
    while (isWithinEndRangeButNotMarketDay(data, newDate) && failSafe < 20) {
      failSafe++;
      const oneDay = -(60 * 60 * 24 * 1000);
      newDate = new Date(newDate).getTime() + oneDay;
    }
  }
  return newDate;
};

export const getTradeDays = (data, startDate, endDate, tradeFrequency) => {
  let days = [];
  let currentDay = startDate;
  let price = null;
  do {
    price = getPrice(data, currentDay);
    let failSafe = 0;
    while(!price && failSafe < 100) {
      failSafe++;
      //add days until you find a day when the market is open
      currentDay += ((1000*60*60*24) * tradeFrequency);

      // is current date still less than end date? If not, break.
      if (currentDay > endDate) {
        console.log('how far does this break out of?');
        break;
      }
      price = getPrice(data, currentDay);
    }

    days.push(currentDay);
    currentDay += ((1000*60*60*24) * tradeFrequency);
    price = null;

  } while (currentDay + ((1000*60*60*24) * tradeFrequency) < endDate); //hacky

  return days;
};

const getNewMuffin = (data, day, index, muffinPrice) => {
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

const getNewEvent = (data, day, index, newMuffin, soldMuffins, costUnsoldMuffins) => {
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

const recordEvent = () => { // inddex will be day number
  return {
    'muffinsBought': [], // stores indices
    'muffinsSold': [], // stores indices
  };
};

// "days" is a little confusing. It's actually a trade event, not every day.
export const runBasicScenario = (data, days, maxMuffins, muffinPrice, saleThreshold) => {

  let muffins = [];
  let events = [];
  let totalProfits = 0;
  let shutOutDays = [];

  const o = {
    firstDayPrice: getPrice(data, days[0]),
    lastDayPrice: getPrice(data, days[days.length - 1]),
  };

  // make an array of amounts invested and then divide by trade events
  let investedAmountByDay = [];

  days.forEach((day,index) => {
    // As we buy muffins and go through time, we need to check
    //   if we can buy a muffin and sell a single muffin

    // Selecting which muffin to sell is tricky. Would it be the 
    //   one that has gained the most or just the oldest one? I think
    //   it might be the oldest one, as long as the global config sell
    //   threshhold is met

    // Sell a muffin if possible first, because if we sell a muffin we
    //   can buy a muffin on the same day (muffins.length - 1)

    // Changed to sell all at threshold for a moment
    //let highestChange = null;

    let saleIndexes = []

    // loop through muffins to see if any sale thresholds are met,
    // and count total unsold muffin value
    for (let i = 0; i < muffins.length; i++) {
      if (muffins[i].profit == null) {
        const priceChangePercent = getPriceChangePercent(muffins[i].purchasePrice, getPrice(data, day));
        if (priceChangePercent > saleThreshold) {
            saleIndexes.push(i);
            //console.log(`Muffin ${i+1} will sell ${priceChangePercent} higher DAY ${index}`)
          // }
        }
      }
    }

    // Sell all muffins that have gained saleThreshold
    if (muffins.length && saleIndexes.length) {
      // Update one muffin with sale date and price

      for (let j = 0; j < saleIndexes.length; j++) {
        muffins[saleIndexes[j]].saleDate = new Date(day).toDateString();
        muffins[saleIndexes[j]].salePrice = getPrice(data, day);
        const profit = getProfit(muffinPrice, getPriceChangePercent(muffins[saleIndexes[j]].purchasePrice, getPrice(data, day)));
        muffins[saleIndexes[j]].profit = profit;
        totalProfits += profit;
      }

      //(`Sold ${saleIndexes.length} muffin(s) on ${new Date(day).toDateString()}`)
    }

    // if we sold some today, or we have less than maxMuffins unsold, buy.
    if(saleIndexes.length || getUnsoldMuffins(muffins).length < maxMuffins) {
      const newMuffin = getNewMuffin(data, day, index+1, muffinPrice);
      muffins.push(newMuffin);

      const soldMuffins = [];
      saleIndexes.forEach((sale) => {
        soldMuffins.push(muffins[sale]);
      });

      // now there is one more that is unsold

      events.push(getNewEvent(
        data,
        day,
        ++index,
        newMuffin,
        soldMuffins,
        getCostUnsoldMuffins(muffins, muffinPrice)
      ));

    } else {
      shutOutDays.push(day);
      events.push(getNewEvent(
        data,
        day,
        ++index,
        null,
        [],
        getCostUnsoldMuffins(muffins, muffinPrice)
      ));
    }

    // update ages of UNSOLD muffins
    // currently this would not need to be in the loop
    muffins = updateAgeOfMuffins(day, muffins);
    muffins = updateGainOfMuffins(data, day, muffins);

    investedAmountByDay.push(getCostUnsoldMuffins(muffins, muffinPrice));
  });

  const averageInvestment = getAverageInvestment(investedAmountByDay); //as number

  o.unsoldGainsOrLosses = getUnsoldMuffinsProfit(o.lastDayPrice, muffins);
  o.totalSales = totalProfits;
  o.totalProfits = totalProfits + o.unsoldGainsOrLosses;
  o.marketGrowthOfPeriod = formatPercent(getPriceChangePercent(o.firstDayPrice, o.lastDayPrice)*100);
  o.averageInvestment = getAverageInvestment(investedAmountByDay);
  o.remainingUnsoldMuffins = getUnsoldMuffins(muffins); // maybe indicate if these are in the red and by how much.

  // Cupcakes are muffins nearing their birthday and won't be sold until after their birthday.
  o.cupcakes = getCupcakes(o.remainingUnsoldMuffins);
  o.scenarioReturn = getReturn(o.totalProfits, averageInvestment);
  o.maximumInvestedAtAnyTime = money.format(getMaximumInvested(investedAmountByDay));
  o.shutOutDays = shutOutDays;
  o.muffins = muffins;
  o.events = events;
  return o;
}

const getUnsoldMuffins = (muffins) => {
  const unsold = (element) => !element.saleDate;
  return muffins.filter(unsold);
};

const getCupcakes = (muffins) => {
  const cupcakes = (m) => !m.saleDate && m.age > (9 * 30); // hard-coded age for cupcakes
  return muffins.filter(cupcakes);
};

const updateAgeOfMuffins = (day, muffins) => {
  for (var i in muffins) {
    if (!muffins[i].saleDate) {
      const age = getAgeInDays(day, muffins[i]);
      muffins[i].age  = Math.round(age);
    }
  }
  return muffins;
};

const updateGainOfMuffins = (data, day, muffins) => {
  for (var i in muffins) {
    if (!muffins[i].saleDate) {
      const gain = getPercentValueToday(getPrice(data, day), muffins[i]);
      muffins[i].currentGain  = gain;
    }
  }
  return muffins;
};

const getUnsoldMuffinsProfit = (currentPrice, muffins) => {
  let profit = 0;
  for (var i in muffins) {
    if (!muffins[i].saleDate) { // count only unsold
      profit += getDollarValueToday(currentPrice, muffins[i]);
    }
  }
  return profit;
};

const getCostUnsoldMuffins = (muffins, muffinPrice) => {
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

const getPrice = (data, day) => {
  return data.get(new Date(day).toDateString());
};

const getProfit = (muffinPrice, percentChange) => {
  return (muffinPrice * percentChange);
}

export const getPriceChangePercent = (x, y) => {
  return (y-x)/x;
}

const getReturn = (totalProfits, averageInvestment) => {
  return (totalProfits/averageInvestment)*100;
}

const getMaximumInvested = (investedAmountByDay) => {
  let max = 0;
  // There is a better way to do this
  investedAmountByDay.forEach(invested => {
    max = Math.max(max, invested)
  });
  // investedAmountByDay.length is also number trade days
  return max;
};

const getAverageInvestment = (investedAmountByDay) => {
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




