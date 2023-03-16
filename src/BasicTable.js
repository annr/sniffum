import React from "react";
import BasicTableRow from './BasicTableRow';

import {
  runBasicScenario
} from './Baker';

import {
  getOpenPriceMap,
  getHighPriceMap,
  getPrice,
  getTradeDays,
} from "./util/DataHelpers";

const {config} = require('./config');

class BasicTable extends React.Component {

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
    o.avgInvestmentPct = Math.round((o.averageInvestment/spendinglimit)*100) + "%";
    o.firstDayPrice = firstDayPrice;
    o.lastDayPrice = lastDayPrice;

    const maxStartShares = (spendinglimit/firstDayPrice);
    const maxWorthOnLastDay = maxStartShares * lastDayPrice;
    const maxReturnHypothetical = maxWorthOnLastDay - spendinglimit;
    o.maxReturnHypothetical = maxReturnHypothetical;

    return (
      <div>
        <p>Edit config.js to adjust muffin cost, spending limit, threshold.</p>
        <p>
          Choose some muffin cost and trading period, and make a limit you can spend on muffins. 
          Every week at the same time -- I imagined morning but I haven't tested it -- buy a muffin if you haven't
          reached the limit and sell muffins that have gained above the threshold in the config -- something like 2%.
        </p>
        <hr />
        <table className="table">
          <thead>
            <tr>
              <th>Run</th>
              <th>Profit</th>
              <th>Sales</th>
              <th>Unsold gains or losses</th>
              <th>Run return <span className="dim">(short-term)</span></th>
              <th>Market growth <span className="dim">(max at limit)</span></th>
              <th>Avg. invested</th>
              <th>Max invested at any time</th>
              <th className="table-integer"># Unsold</th>
              <th className="table-integer">Shutout days</th>
              <th className="table-integer"># Events</th>
            </tr>
          </thead>
          <tbody className="table-striped">
            <BasicTableRow {...o} />
          </tbody>
        </table>
      </div>
    );
  }
}

export default BasicTable;