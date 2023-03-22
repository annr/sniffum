// import {
//     getDynamicThreshold,
// } from './util/LogicHelpers';

import {
    getPrice,
    getRangeOfMarketDays,
    getDayPositions,
} from './util/DataHelpers';

import {
  getMarketTypeSwitch,
  getDynamicSaleThreshold,
  getPriceChangePercent,
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
    getIndicesOfMuffinsAtThreshold,
    getSalePriceEstimate,

} from "./util/MuffinsHelpers";
  
import {
  getAverageInvestment,
  getAverageInvestmentFromEvents,
} from "./util/MoneyHelpers";

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
    marketTypes,
  };

  return avgs;
};

// CLEAN THIS UP!!!
const getMarketTypesFromOutcomes = (o) => {
  // add additional sum values. Not elegnat.
  let sumGrowthPeriods = 0;
  let growthPeriodsCount = 0;
  let sumRunGrowthPeriods = 0;

  let sumStagnationPeriods = 0;
  let stagnationPeriodsCount = 0;
  let sumRunStagnationPeriods = 0;

  let sumDeclinePeriods = 0;
  let declinePeriodsCount = 0;
  let sumRunDeclinePeriods = 0;

  for (let i = 0; i < o.length; i++) {

    switch (getMarketTypeSwitch(o[i].marketGrowthOfPeriod)) {
      case ('decline'):
        sumDeclinePeriods += o[i].marketGrowthOfPeriod;
        sumRunDeclinePeriods += o[i].scenarioReturn;
        declinePeriodsCount++;
        break;
      case ('growth'):
        sumGrowthPeriods += o[i].marketGrowthOfPeriod;
        sumRunGrowthPeriods += o[i].scenarioReturn;
        growthPeriodsCount++;
        break;
      case ('stagnation'):
        sumStagnationPeriods += o[i].marketGrowthOfPeriod;
        sumRunStagnationPeriods += o[i].scenarioReturn;
        stagnationPeriodsCount++;
        break;
      default:
        console.error('No valid market type');
    }
  }

  return {
    growthGains: growthPeriodsCount ? (sumGrowthPeriods/growthPeriodsCount) : null,
    growthPeriodsCount,
    runGrowthGains: growthPeriodsCount ? (sumRunGrowthPeriods/growthPeriodsCount) : null,
    stagnationGains: stagnationPeriodsCount ? (sumStagnationPeriods/stagnationPeriodsCount) : null,
    stagnationPeriodsCount,
    runStagnationGains: stagnationPeriodsCount ? (sumRunStagnationPeriods/stagnationPeriodsCount) : null,
    declineGains: declinePeriodsCount ? (sumDeclinePeriods/declinePeriodsCount) : null,
    declinePeriodsCount,
    runDeclineGains: declinePeriodsCount ? (sumRunDeclinePeriods/declinePeriodsCount) : null,
  };

};

export const runBasicScenario = (data, days, maxMuffins, muffinCost, defaultSaleThreshold, saleTiers) => {

  let events = [];
  let muffins = [];

  let profitAccumulator = 0;
  let shutOutDays = [];
  let investedAmountByDay = [];
  const o = {};

  days.forEach((day,index) => {

    let muffinsBought = [];
    let muffinsSold = [];
    // As we buy muffins and go through time, we need to check
    //   if we can sell any muffins. We sell muffins first,
    //   because it will determine if we can buy a muffin on this day.

    // const dynamicThreshold = getDynamicThreshold(saleThreshold, muffins.length, maxMuffins);

    let dynamicSaleThreshold = getDynamicSaleThreshold(muffins.length);
    // console.log(`Is dynamic: ${isDynamic} and sale indices: ${saleIndexes} and muffins ${muffins.length} length`);

    const saleIndexes = getIndicesOfMuffinsToBeSold(data, day, muffins, defaultSaleThreshold, dynamicSaleThreshold);

    // Sell all muffins that have gained saleThreshold
    if (saleIndexes.length) {
      for (let j = 0; j < saleIndexes.length; j++) {
        muffins[saleIndexes[j]].saleDate = new Date(day).toDateString();
        muffins[saleIndexes[j]].salePrice = getPrice(data, day);
        // console.log(`Selling at ${getPrice(highPriceMap, day)} (high price) vs ${getPrice(data, day)} (open price)`)
        const profit = getProfit(muffinCost, getPriceChangePercent(muffins[saleIndexes[j]].purchasePrice, getPrice(data, day)));
        muffins[saleIndexes[j]].profit = profit;
        profitAccumulator += profit;
        muffinsSold.push(muffins[saleIndexes[j]]);
      }
    }

    let unsoldMuffins = getUnsoldMuffins(muffins);
    // if we sold some today, or we have less than maxMuffins unsold, buy.

    if(unsoldMuffins.length < maxMuffins) {
      // For this version of muffins, each of the days is a possible muffin purchase day

      const newMuffin = getNewMuffin(data, day, index+1, muffinCost);
      muffinsBought.push(newMuffin);
      muffins.push(newMuffin);

    } else {
      shutOutDays.push(day);
    }

    events.push(getNewEvent(
      day,
      getPrice(data, day),
      ++index,
      muffinsBought,
      muffinsSold,
      getCostUnsoldMuffins(muffins, muffinCost),
      profitAccumulator,
      getUnsoldMuffinsProfit(getPrice(data, day), unsoldMuffins),
      getDayPositions(data, day),
      true,
    ));

    // update ages of UNSOLD muffins
    // currently this would not need to be in the loop
    // muffins = updateAgeOfMuffins(day, muffins);

    // replace muffins with updated records
    muffins = updateGainOfMuffins(data, day, muffins);
    investedAmountByDay.push(getCostUnsoldMuffins(muffins, muffinCost));

  });

  const firstDayPrice = getPrice(data, days[0]);
  const lastDayPrice = getPrice(data, days[days.length - 1]);

  o.unsoldGainsOrLosses = getUnsoldMuffinsProfit(lastDayPrice, muffins);
  o.totalSales = profitAccumulator;
  o.totalProfit = profitAccumulator + o.unsoldGainsOrLosses;

  o.marketGrowthOfPeriod = getPriceChangePercent(firstDayPrice, lastDayPrice)*100;

  o.averageInvestment = getAverageInvestment(investedAmountByDay);
  o.remainingUnsoldMuffins = getUnsoldMuffinsCount(muffins); // maybe indicate if these are in the red and by how much.

  o.scenarioReturn = (o.totalProfit/o.averageInvestment)*100;
  o.maximumInvestedAtAnyTime = Math.max(...investedAmountByDay);
  o.shutOutDays = shutOutDays.length;
  o.muffins = muffins;
  o.events = events;
  return o;
};


export const runDynamicScenario = (items, data, potentialPurchaseDays, maxMuffins, muffinCost, defaultSaleThreshold, saleTiers) => {

  let events = [];
  let muffins = [];
  let profitAccumulator = 0;
  let muffinsSoldCountTotal = 0;
  let shutOutDays = [];
  let investedAmountByDay = [];
  const o = {};

  // get all market days between potentialPurchaseDays
  const days = getRangeOfMarketDays(items, potentialPurchaseDays[0], potentialPurchaseDays[potentialPurchaseDays.length-1]);

  days.forEach((day,index) => {
    // first of all, if it's a potentialPurchaseDays and you can buy a muffin, do so

    let muffinsSoldDay = [];
    let muffinsBoughtDay = [];
    let unsoldMuffins = []; // all of the unsold

    const isOpenMarketDay = potentialPurchaseDays.includes(Date.parse(day));

    let dynamicSaleThreshold = getDynamicSaleThreshold(muffins.length);
    const threshold = dynamicSaleThreshold;

    // See if, on this day, defaultSaleThreshold is met for any muffins and then sell for defaultSaleThreshold (not high price)
    const saleIndexes = getIndicesOfMuffinsAtThreshold(data, day, muffins, threshold);

    // console.log(`Is dynamic: ${isDynamic} and sale indices: ${saleIndexes} and muffins ${muffins.length} length`);

    // Sell all muffins that have gained saleThreshold
    if (saleIndexes.length) {
      // Update one muffin with sale date and price
      for (let j = 0; j < saleIndexes.length; j++) {
        muffins[saleIndexes[j]].saleDate = new Date(day).toDateString();
        muffins[saleIndexes[j]].salePrice = getSalePriceEstimate(muffins[saleIndexes[j]].purchasePrice, threshold);

        // the profit it always going to be the same when selling at threshold!!!
        const profit = getProfit(muffinCost, getPriceChangePercent(muffins[saleIndexes[j]].purchasePrice, muffins[saleIndexes[j]].salePrice));
        muffins[saleIndexes[j]].profit = profit;

        muffinsSoldDay.push(muffins[saleIndexes[j]]);
        profitAccumulator += profit;
        muffinsSoldCountTotal++;


        if (getUnsoldMuffinsCount(muffins) < maxMuffins-3) {
          let newMuffin = getNewMuffin(data, day, muffins.length+1, muffinCost);
          muffinsBoughtDay.push(newMuffin);
          muffins.push(newMuffin);
        }
      }
      // replace sold muffins unless we need to throttle sales
    }


    if (getUnsoldMuffinsCount(muffins) < maxMuffins) {
      if (isOpenMarketDay) {
        let newMuffin = getNewMuffin(data, day, muffins.length+1, muffinCost);
        muffinsBoughtDay.push(newMuffin);
        muffins.push(newMuffin);
      }
    } else {
      shutOutDays.push(day);
    }

    // update ages of UNSOLD muffins
    // currently this would not need to be in the loop
    muffins = updateAgeOfMuffins(day, muffins);
    muffins = updateGainOfMuffins(data, day, muffins);

    investedAmountByDay.push(getCostUnsoldMuffins(muffins, muffinCost));

    // every day will have an "event" even if nothing happened that day
    events.push(getNewEvent(
      day,
      getPrice(data, day),
      ++index,
      muffinsBoughtDay,
      muffinsSoldDay,
      getCostUnsoldMuffins(muffins, muffinCost),
      profitAccumulator,
      getUnsoldMuffinsProfit(getPrice(data, day), muffins),
      getDayPositions(data, day),
      isOpenMarketDay,
    ));

  });

  const firstDayPrice = getPrice(data, days[0]);
  const lastDayPrice = getPrice(data, days[days.length - 1]);

  o.unsoldGainsOrLosses = getUnsoldMuffinsProfit(lastDayPrice, muffins);

  o.totalSales = profitAccumulator;
  o.totalProfit = profitAccumulator + o.unsoldGainsOrLosses;
  o.marketGrowthOfPeriod = getPriceChangePercent(firstDayPrice, lastDayPrice)*100;
  o.averageInvestment = events.length && getAverageInvestmentFromEvents(events);
  o.remainingUnsoldMuffins = getUnsoldMuffinsCount(muffins); // maybe indicate if these are in the red and by how much.

  o.scenarioReturn = (o.totalProfit/o.averageInvestment)*100;
  o.maximumInvestedAtAnyTime = Math.max(...investedAmountByDay);
  o.shutOutDays = shutOutDays.length;
  o.muffins = muffins;
  o.events = events;

  console.log("MUFFINS SOLD TOTAL: " + muffinsSoldCountTotal)
  return o;

};
