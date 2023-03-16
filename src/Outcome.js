import React from "react";
import BasicOutcome from './BasicOutcome';

import {
  runBasicScenario
} from './Baker';

import {
  getOpenPriceMap,
  getPrice,
  getTradeDays,
} from "./util/DataHelpers";

const {config} = require('./config');

class Outcome extends React.Component {

  render() {
    // this was my first pass: it's sloppy. 
    const items = this.props.data;
    const {startDate, endDate, tradeFrequency, spendinglimit, muffinCost, saleThreshold, tradeAtStartOfWeekFlag} = {...config};
    const maxMuffins = Math.floor(spendinglimit/muffinCost);

    // Use data converted to maps for quick lookups
    const dataMap = getOpenPriceMap(items);

    const tradeDays = getTradeDays(dataMap, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);

    const firstDayPrice = getPrice(dataMap, tradeDays[0]);
    const lastDayPrice = getPrice(dataMap, tradeDays[tradeDays.length - 1]);

    // outcome
    const o = runBasicScenario(dataMap, tradeDays, maxMuffins, muffinCost, saleThreshold); // test this.

    // the following vars are more config than outcome. Clean this up.
    o.startDate = tradeDays[0];
    o.endDate = tradeDays[tradeDays.length - 1];
    o.duration = (o.startDate - o.endDate)/(1000*60*60*24);
    o.avgInvestmentPct = Math.round((o.averageInvestment/spendinglimit)*100) + "%";
    o.firstDayPrice = firstDayPrice;
    o.lastDayPrice = lastDayPrice;

    const maxStartShares = (spendinglimit/firstDayPrice);
    const maxWorthOnLastDay = maxStartShares * lastDayPrice;
    const maxReturnHypothetical = maxWorthOnLastDay - spendinglimit;
    o.maxReturnHypothetical = maxReturnHypothetical;

    return (
      <div>
        <p>Edit config.js to change any variables</p>
        <h2>Basic Scenario</h2>
        <p>
          This scenario is the first I thought to test, and it is the least amount of effort I can imagine.</p>
        <p>
          I wanted to to see if this easy, low effort strategy would yield
          something in a down market, do well in a sideways market and do okay in an up market. I'll have to 
          make a big table will periods of a year to test, but that's not a perfect test as we'll see. 
        </p>
        <p>
          Choose some muffin cost and trading period, and make a limit you can spend on muffins. 
          Every week at the same time -- I imagined morning but I haven't tested it -- buy a muffin if you haven't
          reached the limit and sell muffins that have gained above the threshold in the config -- something like 2%.
        </p>
        <p>
          That's it. You will have to take action at most 52 times. If you reach the spending limit you can't do anything until
          you can sell muffins again.
        </p>

        <hr />
        <BasicOutcome {...o} />
      </div>
    );
  }
}

export default Outcome;