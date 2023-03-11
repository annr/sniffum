import {
    getDynamicThreshold,
    getIndicesOfMuffinsToBeSold,
    getPrice,
    getProfit,
    getUnsoldMuffins,
    getNewMuffin,
    getNewEvent,
    getCostUnsoldMuffins,
    updateAgeOfMuffins,
    updateGainOfMuffins,
    getReturn,
    money,
    getMaximumInvested,
    getPriceChangePercent,
    getAverageInvestment,
    getUnsoldMuffinsProfit,
    formatPercent,
    getCupcakes,
  } from "./Helpers";
  
  
  export const runBasicScenario = (data, days, maxMuffins, muffinPrice, saleThreshold, isDynamic = false) => {

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
    //   We will also throttle the muffin sales somehow.
    let dynamicThreshold = getDynamicThreshold(saleThreshold, muffins.length, maxMuffins);
  
    const o = {};
  
    days.forEach((day,index) => {
      // As we buy muffins and go through time, we need to check
      //   if we can sell any muffins. We sell muffins first,
      //   because it will determine if we can by a muffin on this day.
  
      const saleIndexes = getIndicesOfMuffinsToBeSold(data, day, muffins, isDynamic ? dynamicThreshold : saleThreshold);
  
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
  
      let unsoldMuffins = getUnsoldMuffins(muffins);
      // if we sold some today, or we have less than maxMuffins unsold, buy.
      if(unsoldMuffins.length < maxMuffins) {
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
    o.maximumInvestedAtAnyTime = money.format(getMaximumInvested(investedAmountByDay));
    o.shutOutDays = shutOutDays;
    o.muffins = muffins;
    o.events = events;
    return o;
  }