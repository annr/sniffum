export const convertData = (items) => {
  const convertedMap = new Map();

  items.forEach(element => {
    const key = Object.keys(element)[0];
    convertedMap.set(key, element[key]);
  });
  return convertedMap;
}

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

const buyMuffin = (data, day) => {
  return {
    'purchaseDate': new Date(day).toDateString(),
    'purchasePrice': getPrice(data,day),
    'saleDate': null,
    'salePrice': null,
    'profit': null,
    'age': null,
  };
};

    // Lots of logic here.
export const runScenario = (data, days, maxMuffins, muffinPrice, saleThreshold) => {

  let muffins = [];

  let totalProfits = 0;
  let shutOutDays = 0;
  let unsoldMuffins;

  days.forEach(day => {
    // As we buy muffins and go through time, we need to check
    //   if we can buy a muffine and sell a single muffin

    // Selecting which muffin to sell is tricky. Would it be the 
    //   one that has gained the most or just the oldest one? I think
    //   it might be the oldest one, as long as the global config sell
    //   threshhold is met

    // Sell a muffin if possible first, because if we sell a muffin we
    //   can buy a muffin on the same day (muffins.length - 1)

    const dayPrice = getPrice(data, day);

    // Changed to sell all at threshold for a moment
    //let highestChange = null;

    let saleIndexes = []
    unsoldMuffins = 0;

    // loop through muffins to see if any sale thresholds are met.
    for (let i = 0; i < muffins.length; i++) {
      if (muffins[i].profit == null) {
        const priceChangePercent = getPriceChangePercent(muffins[i].purchasePrice, dayPrice);
        if (priceChangePercent > saleThreshold) {
          // if (!highestChange || priceChangePercent > highestChange) {
          //   highestChange = priceChangePercent;
            saleIndexes.push(i);
            console.log(`Muffin ${i} will sell ${priceChangePercent} higher`)
          // }
        }
  
        // also count unsold muffins for limit.
        if (!muffins[i].profit) unsoldMuffins++;
      }
    }

    // If we can sell a muffin, select a muffin and sell it. Could be the oldest,
    //   but at the moment it's the muffin that has made the most profit that 
    //   makes the most sense to sell. This might be obvious, but I don't want
    //   choice to ever be a part of this strategy.

    if (muffins.length && saleIndexes.length) {
      // Update one muffin with sale date and price

      for (let j = 0; j < saleIndexes.length; j++) {
        muffins[saleIndexes[j]].saleDate = new Date(day).toDateString();
        muffins[saleIndexes[j]].salePrice = dayPrice;
        const profit = getProfit(muffinPrice, getPriceChangePercent(muffins[saleIndexes[j]].purchasePrice, getPrice(data, day)));
        muffins[saleIndexes[j]].profit = profit;
        muffins[saleIndexes[j]].age = null; // implement
        totalProfits += profit;
      }

      console.log(`Sold ${saleIndexes.length} muffin(s) on ${new Date(day).toDateString()}`)
    }

    if (unsoldMuffins >= maxMuffins) {
      shutOutDays++;
      console.log(`NOT ABLE to buy a muffin on ${new Date(day).toDateString()}`);
    }

    // if we sold some today, or we have less than maxMuffins unsold, buy.
    if(saleIndexes.length || unsoldMuffins < maxMuffins) {
      muffins.push(buyMuffin(data, day))
    }

  });

  console.log(`TOTAL PROFIT FOR SCENARIO: ${totalProfits}`);
  // would be nice to know how much of the period you couldn't do anything. 
  console.log(`Shut out events ${shutOutDays}`);
  console.log(`Unsold muffins last day ${unsoldMuffins}`);
  return muffins;
}

const getPrice = (data, day) => {
  return data.get(new Date(day).toDateString());
};

const getProfit = (muffinPrice, percentChange) => {
  return (muffinPrice * percentChange);
}

const getPriceChangePercent = (x, y) => {
  return (y-x)/x;
}

const comparePrices = (x, y, saleThreshold = 0.02) => {
  return (y < x) && getPriceChangePercent(x, y)  > saleThreshold;
};

// const canPurchaseMuffin = (muffins, tradeDay) => {
//   return true;
// };

const canSellMuffin = (muffinPurchasePrice, dayPrice) => {
  return false;
};

export const isCloseToBirthday = (muffins, tradeDay) => {
  // determine if muffin is almost a year old and should be let go.
  return false;
};




