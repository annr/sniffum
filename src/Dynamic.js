import React from "react";
import OutcomeBody from './OutcomeBody';
import ConfigDisplay from './ConfigDisplay';

import {
  runDynamicScenario
} from './Baker';

import {
  getPriceMap,
  getPrice,
  getTradeDays,
  getDatesWithIndices,
} from "./util/DataHelpers";

const {config} = require('./config');

class Dynamic extends React.Component {

  render() {
    const items = this.props.data;
    const {startDate, endDate, tradeFrequency, spendinglimit, muffinCost, saleThreshold, tradeAtStartOfWeekFlag} = {...config};
    const maxMuffins = Math.floor(spendinglimit/muffinCost);

    // Use data converted to maps for quick lookups
    const data = getPriceMap(items);

    const potentialPurchaseDays = getTradeDays(data, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);

    const adjustedStart = potentialPurchaseDays[0];
    const adjustedEnd = potentialPurchaseDays[potentialPurchaseDays.length - 1];

    const firstDayPrice = getPrice(data, adjustedStart);
    const lastDayPrice = getPrice(data, adjustedEnd);

    // outcome
    const o = runDynamicScenario(getDatesWithIndices(items), data, potentialPurchaseDays, maxMuffins, muffinCost, saleThreshold); // test this.

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
        <h2>Dynamic Scenario</h2>
        <p>
          Algorithm TBD
        </p>
        <ConfigDisplay {...config} />
        <hr />
        <OutcomeBody {...o} />
      </div>
    );
  }
}

export default Dynamic;