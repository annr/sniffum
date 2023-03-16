import React from "react";
import BasicTableRow from './BasicTableRow';

import {
  runBasicScenario
} from './Baker';

import {
  getOpenPriceMap,
  getPrice,
  getTradeDays,
  getYearPeriodSets,
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

    const yearPeriods = getYearPeriodSets(dataMap, true);

    let outcomes = [];

    const tradeDays = getTradeDays(dataMap, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);

    for(let j=0; j < yearPeriods.length; j++) {
      const tradeDaysByYearPeriod = getTradeDays(dataMap, yearPeriods[j][0], yearPeriods[j][1], tradeFrequency);

      const outcome = runBasicScenario(dataMap, tradeDaysByYearPeriod, maxMuffins, muffinCost, saleThreshold); // test this.

      // the following vars are more config than outcome. Clean this up.
      outcome.startDate = yearPeriods[j][0];
      outcome.endDate = yearPeriods[j][1];

      outcome.avgInvestmentPct = Math.round((outcome.averageInvestment/spendinglimit)*100) + "%";
      outcome.firstDayPrice = getPrice(dataMap, yearPeriods[j][0]);
      outcome.lastDayPrice = getPrice(dataMap, yearPeriods[j][1]);;

      const maxStartShares = (spendinglimit/outcome.firstDayPrice);
      const maxWorthOnLastDay = maxStartShares * outcome.lastDayPrice;
      const maxReturnHypothetical = maxWorthOnLastDay - spendinglimit;
      outcome.maxReturnHypothetical = maxReturnHypothetical;

      outcomes.push(outcome);
    }

    return (
      <div>
        <p>Edit config.js to adjust muffin cost, spending limit, threshold.</p>
        <h2>Basic Scenario Table</h2>
        <p>Like <a href="/basic">Basic Scenario</a> but run for every year.</p>
        <p>
          Choose some muffin cost and trading period, and make a limit you can spend on muffins. 
          Every week at the same time -- I imagined morning but I haven't tested it -- buy a muffin if you haven't
          reached the limit and sell muffins that have gained above the threshold in the config -- something like 2%.
        </p>
        <hr />
        <table className="table table-striped">
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
            {outcomes.map((outcome, index) =>
              <BasicTableRow {...outcome} key={index} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default BasicTable;