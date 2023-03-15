import {
    getDynamicThreshold,
} from './util/LogicHelpers';

import {
    getPrice,
} from './util/DataHelpers';

import {
    getIndicesOfMuffinsToBeSold,
    getProfit,
    getUnsoldMuffins,
    getNewMuffin,
    getNewEvent,
    getCostUnsoldMuffins,
    updateAgeOfMuffins,
    updateGainOfMuffins,
    getUnsoldMuffinsProfit,
    getCupcakes,
    getPriceChangePercent,
} from "./util/MuffinsHelpers";
  
 import {
  getReturn,
  money,
  getAverageInvestment,
  formatPercent,
} from "./util/MoneyHelpers";

// The basic scenario doesn't do anything dynamic.
// It just takes an action once a week if it can.
// It uses open price on that day in any case.

export const runBasicScenario = (data, days, maxMuffins, muffinCost, saleThreshold, isDynamic = false) => {

  let muffins = [];
  let events = [];
  let totalProfits = 0;
  let shutOutDays = [];

  // make an array of amounts invested and then divide by trade events
  let investedAmountByDay = [];

  // dynamicThreshold:
  //   When dynamically smoothing out the sale threshold, the dynamic base is the number that
  //   we get to when we want to start clearing muffins. For now, we are using saleThreshold.
  // 

  const o = {};

  days.forEach((day,index) => {
    // As we buy muffins and go through time, we need to check
    //   if we can sell any muffins. We sell muffins first,
    //   because it will determine if we can by a muffin on this day.

    // const dynamicThreshold = getDynamicThreshold(saleThreshold, muffins.length, maxMuffins);

    const saleIndexes = getIndicesOfMuffinsToBeSold(data, day, muffins, saleThreshold);

    // console.log(`Is dynamic: ${isDynamic} and sale indices: ${saleIndexes} and muffins ${muffins.length} length`);

    // Sell all muffins that have gained saleThreshold
    if (muffins.length && saleIndexes.length) {
      // Update one muffin with sale date and price

      for (let j = 0; j < saleIndexes.length; j++) {
        muffins[saleIndexes[j]].saleDate = new Date(day).toDateString();

        muffins[saleIndexes[j]].salePrice = getPrice(data, day);
        // console.log(`Selling at ${getPrice(highPriceMap, day)} (high price) vs ${getPrice(data, day)} (open price)`)
        const profit = getProfit(muffinCost, getPriceChangePercent(muffins[saleIndexes[j]].purchasePrice, getPrice(data, day)));
        muffins[saleIndexes[j]].profit = profit;
        totalProfits += profit;
      }

      //(`Sold ${saleIndexes.length} muffin(s) on ${new Date(day).toDateString()}`)
    }

    let unsoldMuffins = getUnsoldMuffins(muffins);
    // if we sold some today, or we have less than maxMuffins unsold, buy.
    if(unsoldMuffins.length < maxMuffins) {
      const newMuffin = getNewMuffin(data, day, index+1, muffinCost);
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
        getCostUnsoldMuffins(muffins, muffinCost)
      ));

    } else {
      shutOutDays.push(day);
      events.push(getNewEvent(
        data,
        day,
        ++index,
        null,
        [],
        getCostUnsoldMuffins(muffins, muffinCost)
      ));
    }

    // update ages of UNSOLD muffins
    // currently this would not need to be in the loop
    muffins = updateAgeOfMuffins(day, muffins);
    muffins = updateGainOfMuffins(data, day, muffins);

    investedAmountByDay.push(getCostUnsoldMuffins(muffins, muffinCost));
  });

  const averageInvestment = getAverageInvestment(investedAmountByDay); //as number
  const firstDayPrice = getPrice(data, days[0]);
  const lastDayPrice = getPrice(data, days[days.length - 1]);

  o.unsoldGainsOrLosses = getUnsoldMuffinsProfit(lastDayPrice, muffins);
  o.totalSales = totalProfits;
  o.totalProfits = totalProfits + o.unsoldGainsOrLosses;
  o.marketGrowthOfPeriod = formatPercent(getPriceChangePercent(firstDayPrice, lastDayPrice)*100);
  o.averageInvestment = getAverageInvestment(investedAmountByDay);
  o.remainingUnsoldMuffins = getUnsoldMuffins(muffins); // maybe indicate if these are in the red and by how much.

  // Cupcakes are muffins nearing their birthday and won't be sold until after their birthday.
  o.cupcakes = getCupcakes(o.remainingUnsoldMuffins);

  o.scenarioReturn = getReturn(o.totalProfits, averageInvestment);
  o.maximumInvestedAtAnyTime = money.format(Math.max(...investedAmountByDay));
  o.shutOutDays = shutOutDays;
  o.muffins = muffins;
  o.events = events;
  return o;
}