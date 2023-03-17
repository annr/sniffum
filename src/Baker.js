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
    getUnsoldMuffinsCount,
    getNewMuffin,
    getNewEvent,
    getCostUnsoldMuffins,
    updateAgeOfMuffins,
    updateGainOfMuffins,
    getUnsoldMuffinsProfit,
    getPriceChangePercent,
} from "./util/MuffinsHelpers";
  
 import {
  getReturn,
  getAverageInvestment,
} from "./util/MoneyHelpers";

export const getSumsFromOutcomes = (o) => {
  const sums = o.reduce((prev, curr) => {
    return {
      scenarioReturn: prev.scenarioReturn + curr.scenarioReturn,
      averageInvestment: prev.averageInvestment + curr.xaverageInvestmentxxx,
      avgInvestmentPercent: prev.avgInvestmentPercent + curr.avgInvestmentPercent,
      marketGrowthOfPeriod: prev.marketGrowthOfPeriod + curr.marketGrowthOfPeriod,
      maximumInvestedAtAnyTime: prev.maximumInvestedAtAnyTime + curr.maximumInvestedAtAnyTime,
      remainingUnsoldMuffins: prev.remainingUnsoldMuffins + curr.remainingUnsoldMuffins,
      scenarioReturn: prev.scenarioReturn + curr.scenarioReturn,
      shutOutDays: prev.shutOutDays + curr.shutOutDays,
      totalProfit: prev.totalProfit + curr.totalProfit,
      totalSales: prev.totalSales + curr.totalSales,
      unsoldGainsOrLosses: prev.unsoldGainsOrLosses + curr.unsoldGainsOrLosses,
    }
  }, {
    averageInvestment: 0,
    avgInvestmentPercent: 0,
    marketGrowthOfPeriod: 0,
    maximumInvestedAtAnyTime: 0,
    remainingUnsoldMuffins: 0,
    scenarioReturn: 0,
    shutOutDays: 0,
    totalProfit: 0,
    totalSales: 0,
    unsoldGainsOrLosses: 0,
  })

  // const summary = {
  //   avgScenarioReturn: 4,
  //   avgProfit: 5003,
  //   avgGainsAboveTotalAnnualPercent: 2.03,
  //   avgGainsDuringGrowth: -3.03,
  //   avgGainsDuringStagnation: 4.85,
  //   avgGainsDuringDecline: -3.03,
  //   avgValueUnsold: 3034,
  //   avgInvested: 45000,
  //   avgInvestedPercentOfMax: .440,
  //   avgSalePriceDifference: 0.00,
  //   avgDaysShutOut: 3,
  //   avgTurbulence: "TBD",
  //   successString: "✅ ✅ ✅ ✅ ✅ ✅",
  // }
  return sums;
};

// The basic scenario doesn't do anything dynamic.
// It just takes an action once a week if it can.
// It uses open price on that day in any case.
export const runBasicScenario = (data, days, maxMuffins, muffinCost, saleThreshold, isDynamic = false) => {

  let muffins = [];
  let events = [];
  let profitAccumulator = 0;
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
        profitAccumulator += profit;
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
  o.totalSales = profitAccumulator;
  o.totalProfit = profitAccumulator + o.unsoldGainsOrLosses;
  o.marketGrowthOfPeriod = getPriceChangePercent(firstDayPrice, lastDayPrice)*100;
  o.averageInvestment = getAverageInvestment(investedAmountByDay);
  o.remainingUnsoldMuffins = getUnsoldMuffinsCount(muffins); // maybe indicate if these are in the red and by how much.

  o.scenarioReturn = getReturn(o.totalProfit, averageInvestment);
  o.maximumInvestedAtAnyTime = Math.max(...investedAmountByDay);
  o.shutOutDays = shutOutDays.length;
  o.muffins = muffins;
  o.events = events;
  return o;
}