import React from "react";
import BasicOutcome from './OutcomeBody';
import ConfigDisplay from './ConfigDisplay';

import {
  runBasicScenario
} from './Baker';

import {
  getPriceMap,
  getPrice,
  getTradeDays,
} from "./util/DataHelpers";

const {config} = require('./config');

class Outcome extends React.Component {

  render() {
    const items = this.props.data;
    const {startDate, endDate, tradeFrequency, spendinglimit, muffinCost, saleThreshold, tradeAtStartOfWeekFlag} = {...config};
    const maxMuffins = Math.floor(spendinglimit/muffinCost);

    // Use data converted to maps for quick lookups
    const data = getPriceMap(items);

    const tradeDays = getTradeDays(data, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);

    const adjustedStart = tradeDays[0];
    const adjustedEnd = tradeDays[tradeDays.length - 1];

    const firstDayPrice = getPrice(data, adjustedStart);
    const lastDayPrice = getPrice(data, adjustedEnd);

    // outcome
    const o = runBasicScenario(data, tradeDays, maxMuffins, muffinCost, saleThreshold); // test this.

    o.duration = (adjustedEnd - adjustedStart)/(1000*60*60*24);
    o.firstDayPrice = firstDayPrice;
    o.lastDayPrice = lastDayPrice;

    o.avgInvestmentPct = (o.averageInvestment/spendinglimit)*100;

    const maxStartShares = (spendinglimit/firstDayPrice);
    const maxWorthOnLastDay = maxStartShares * lastDayPrice;
    const maxReturnHypothetical = maxWorthOnLastDay - spendinglimit;
    o.maxReturnHypothetical = maxReturnHypothetical;

    return (
      <div>
        <p>Edit config.js to change any variables</p>
        <h2>Basic (Coarse) Scenario</h2>
        <p>
          The first scenario I thought to test. I wanted to to see if this coarse, low-effort plan would yield
          something in a down market, do well in a sideways market, and do okay in an up market.
        </p>
        <p>
          <b>Algorithm:</b> Choose some muffin cost and trading period, and make a limit you can spend on muffins.
          Every week at the same time -- I imagined morning but I haven't tested it -- buy a muffin if you haven't
          reached the limit, and sell ALL muffins that have gained above the threshold in the config -- something like 2%. If you reach the spendingLimit, you can't do anything until
          you sell.
        </p>
        <ConfigDisplay {...config} />
        <hr />
        <BasicOutcome {...o} />
      </div>
    );
  }
}

export default Outcome;