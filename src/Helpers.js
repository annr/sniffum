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

const getNewMuffin = (data, day, index) => {
  // Event day is unique identifier. This is fine for now.
  return {
    'id': index,
    'purchaseDate': new Date(day).toDateString(),
    'purchasePrice': getPrice(data,day),
    'saleDate': null,
    'salePrice': null,
    'profit': null,
    'age': null,
  };
};

const recordEvent = () => { // inddex will be day number
  return {
    'muffinsBought': [], // stores indices
    'muffinsSold': [], // stores indices
  };
};

// Lots of logic here.
// "days" is a little confusing. It's actually a trade event, not every day.
export const runScenario = (data, days, maxMuffins, muffinPrice, saleThreshold) => {

  let muffins = [];
  let events = [];
  let totalProfits = 0;
  let shutOutDays = [];
  let unsoldMuffins;

  const o = {
    firstDayPrice: getPrice(data, days[0]),
    lastDayPrice: getPrice(data, days[days.length - 1]),
  };

  // make an array of amounts invested and then divide by trade events
  let investedAmountByDay = [];

  days.forEach((day,index) => {
    // As we buy muffins and go through time, we need to check
    //   if we can buy a muffine and sell a single muffin

    // Selecting which muffin to sell is tricky. Would it be the 
    //   one that has gained the most or just the oldest one? I think
    //   it might be the oldest one, as long as the global config sell
    //   threshhold is met

    // Sell a muffin if possible first, because if we sell a muffin we
    //   can buy a muffin on the same day (muffins.length - 1)

    const dayPrice = getPrice(data, day);

    let valueUnsoldMuffins = 0; // value of muffins on this day

    // Changed to sell all at threshold for a moment
    //let highestChange = null;

    let saleIndexes = []
    unsoldMuffins = 0;

    // loop through muffins to see if any sale thresholds are met,
    // and count total unsold muffin value
    for (let i = 0; i < muffins.length; i++) {
      if (muffins[i].profit == null) {
        const priceChangePercent = getPriceChangePercent(muffins[i].purchasePrice, dayPrice);
        if (priceChangePercent > saleThreshold) {
            saleIndexes.push(i);
            console.log(`Muffin ${i+1} will sell ${priceChangePercent} higher DAY ${index}`)
          // }
        } else {
          // muffin will not sell. Add value of it to investedAmountByDay
          valueUnsoldMuffins += muffinPrice;
          // also count unsold muffins for limit.
          unsoldMuffins++;
        }
  
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

    // if we sold some today, or we have less than maxMuffins unsold, buy.
    if(saleIndexes.length || unsoldMuffins < maxMuffins) {
      const newMuffin = getNewMuffin(data, day, index+1);
      muffins.push(newMuffin);

      const soldMuffins = [];
      saleIndexes.forEach((sale) => {
        soldMuffins.push(muffins[sale]);
      });

      console.log(`Muffins for sale on ${new Date(day).toDateString()}: ${soldMuffins.length}`)
      // since a new one is added, include the value in investedAmountByDay
      valueUnsoldMuffins += muffinPrice;
      // now there is one more that is unsold
      unsoldMuffins++;

      events.push({
        'eventId': ++index,
        'date': day,
        'price': getPrice(data,day),
        'purchasedMuffin': newMuffin,
        'soldMuffins': soldMuffins,
        'valueUnsoldMuffins': valueUnsoldMuffins,
      });

    } else {
      shutOutDays.push(day);
      events.push({
        'eventId': ++index,
        'date': day,
        'price': getPrice(data,day),
        'purchasedMuffin': null,
        'soldMuffins': [],
        'valueUnsoldMuffins': valueUnsoldMuffins,
      });
    }

    investedAmountByDay.push(valueUnsoldMuffins);
  });

  const averageInvestment = getAverageInvestment(investedAmountByDay); //as number

  o.totalProfits = money.format(totalProfits);
  o.marketGrowthOfPeriod = formatPercent(getPriceChangePercent(o.firstDayPrice, o.lastDayPrice)*100);
  o.averageInvestment = money.format(getAverageInvestment(investedAmountByDay));
  o.remainingUnsoldMuffins = unsoldMuffins; // maybe indicate if these are in the red and by how much.
  o.scenarioReturn = formatPercent((totalProfits/averageInvestment)*100);
  o.maximumInvestedAtAnyTime = money.format(getMaximumInvested(investedAmountByDay));
  o.shutOutDays = shutOutDays;
  o.muffins = muffins;
  o.events = events;
  return o;
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

const comparePrices = (x, y, saleThreshold = 0.02) => {
  return (y < x) && getPriceChangePercent(x, y)  > saleThreshold;
};

// const canPurchaseMuffin = (muffins, tradeDay) => {
//   return true;
// };

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatPercent = (num) => {
  return Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
};

const canSellMuffin = (muffinPurchasePrice, dayPrice) => {
  return false;
};

export const isCloseToBirthday = (muffins, tradeDay) => {
  // determine if muffin is almost a year old and should be let go.
  return false;
};




