import {
    getPrice,
  } from './DataHelpers';
  
  const DAY_IN_MS = 60 * 60 * 24 * 1000;
  
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
  
  const canSellMuffin = (data, day, muffin, thresholdBasedOnNumberOfMuffins) => {
    // can't sell muffin that is only one week old. IMPLEMENT
    // priceChangePercent must be above dynamic threshold
    const priceChangePercent = getPriceChangePercent(muffin.purchasePrice, getPrice(data, day));
    return priceChangePercent > thresholdBasedOnNumberOfMuffins;
  };
  
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
  
  export const getProfit = (muffinPrice, percentChange) => {
    return (muffinPrice * percentChange);
  }
  
  export const getPriceChangePercent = (x, y) => {
    return (y-x)/x;
  }