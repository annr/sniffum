import React from "react";
import OutcomeBody from './OutcomeBody';
import ConfigDisplay from './ConfigDisplay';

import {
  runBasicScenario
} from './Baker';

import {
  getOpenPriceMap,
  getPrice,
  getTradeDays,
} from "./util/DataHelpers";

const {config} = require('./config');

class Dynamic extends React.Component {

  render() {
    // this was my first pass: it's sloppy. 
    const items = this.props.data;
    const {startDate, endDate, tradeFrequency, spendinglimit, muffinCost, saleThreshold, tradeAtStartOfWeekFlag} = {...config};
    const maxMuffins = Math.floor(spendinglimit/muffinCost);

    // Use data converted to maps for quick lookups
    const dataMap = getOpenPriceMap(items);

    const tradeDays = getTradeDays(dataMap, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);

    const adjustedStart = tradeDays[0];
    const adjustedEnd = tradeDays[tradeDays.length - 1];

    const firstDayPrice = getPrice(dataMap, adjustedStart);
    const lastDayPrice = getPrice(dataMap, adjustedEnd);

    // outcome
    const o = runBasicScenario(dataMap, tradeDays, maxMuffins, muffinCost, saleThreshold); // test this.

    o.duration = (adjustedEnd - adjustedStart)/(1000*60*60*24);
    o.firstDayPrice = firstDayPrice;
    o.lastDayPrice = lastDayPrice;

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