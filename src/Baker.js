import {
    getDynamicThreshold,
} from './util/LogicHelpers';

import {
    getPrice,
} from './util/DataHelpers';

import {
  getMarketType,
} from './util/LogicHelpers';

  // "Dynamic" approaches to explore:
  //
  // - make threshold dynamic based on number of unsold muffins and sell with price alerts
  // - make sales dynamic ""
  // - buy to replace muffin when selling with price alerts
  // - would there be any value to dynamic muffinCost? i don't think so; what would that look like?
  // - is there a benefit to smaller muffins purchased more often? probably in certain markets.
  //     (maybe experiment with agreesive muffin purchases and sales)
  // - can moving average be useful?
  // - Are there ANY pattern in turbulence?

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
    getIndicesOfMuffinsToBeSoldWithTiers,
} from "./util/MuffinsHelpers";
  
 import {
  getAverageInvestment,
} from "./util/MoneyHelpers";

const {config} = require('./config');

export const getAveragesFromOutcomes = (o) => {
  const sums = o.reduce((prev, curr) => {
    return {
      averageInvestment: prev.averageInvestment + curr.averageInvestment,
      avgInvestmentPct: prev.avgInvestmentPct + curr.avgInvestmentPct,
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
    avgInvestmentPct: 0,
    marketGrowthOfPeriod: 0,
    maximumInvestedAtAnyTime: 0,
    remainingUnsoldMuffins: 0,
    scenarioReturn: 0,
    shutOutDays: 0,
    totalProfit: 0,
    totalSales: 0,
    unsoldGainsOrLosses: 0,
  });

  const marketTypes = getMarketTypesFromOutcomes(o);

  // Note that we don't simply divide total scenarioReturn by outcome length for total average gain
  // We must use the sum of profits and the sum of invested for some reason that I can't understand right now
  const avgs = {
    averageInvestment: sums.averageInvestment/o.length,
    avgInvestmentPct: sums.avgInvestmentPct/o.length,
    marketGrowthOfPeriod: sums.marketGrowthOfPeriod/o.length,
    maximumInvestedAtAnyTime: sums.maximumInvestedAtAnyTime/o.length,
    remainingUnsoldMuffins: sums.remainingUnsoldMuffins/o.length,
    scenarioReturn: (sums.totalProfit/sums.averageInvestment)*100,
    shutOutDays: sums.shutOutDays/o.length,
    totalProfit: sums.totalProfit/o.length,
    totalSales: sums.totalSales/o.length,
    unsoldGainsOrLosses: sums.unsoldGainsOrLosses/o.length,
  };

  return avgs;
};

export const runBasicScenario = (data, days, maxMuffins, muffinCost, saleThreshold) => {

  let events = [];
  let muffins = [];

  let profitAccumulator = 0;
  let shutOutDays = [];
  let investedAmountByDay = [];
  const o = {};

  days.forEach((day,index) => {
    // As we buy muffins and go through time, we need to check
    //   if we can sell any muffins. We sell muffins first,
    //   because it will determine if we can buy a muffin on this day.

    // const dynamicThreshold = getDynamicThreshold(saleThreshold, muffins.length, maxMuffins);

    let dynamicSaleThreshold = saleTiers.regular;
    if (muffins.length > 10) {
      dynamicSaleThreshold = saleTiers.discount;
    }
    if (muffins.length < 6) {
      dynamicSaleThreshold = saleTiers.premium;
    }

    const saleIndexes = getIndicesOfMuffinsToBeSold(data, day, muffins, defaultSaleThreshold, dynamicSaleThreshold);

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
        getCostUnsoldMuffins(muffins, muffinCost),
        profitAccumulator,
        getUnsoldMuffinsProfit(getPrice(data, day), unsoldMuffins)
      ));

    } else {
      shutOutDays.push(day);
      events.push(getNewEvent(
        data,
        day,
        ++index,
        null,
        [],
        getCostUnsoldMuffins(muffins, muffinCost),
        profitAccumulator,
        getUnsoldMuffinsProfit(getPrice(data, day), unsoldMuffins),
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

  o.scenarioReturn = (o.totalProfit/averageInvestment)*100;
  o.maximumInvestedAtAnyTime = Math.max(...investedAmountByDay);
  o.shutOutDays = shutOutDays.length;
  o.muffins = muffins;
  o.events = events;
  return o;
}
