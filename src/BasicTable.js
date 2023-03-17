import React from "react";
import BasicTableRow from './BasicTableRow';
import ConfigDisplay from './TableConfigDisplay';
import TableSummaryDisplay from './TableSummaryDisplay';

import {
  getSumsFromOutcomes,
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
    const {tradeFrequency, spendinglimit, muffinCost, saleThreshold} = {...config};
    const maxMuffins = Math.floor(spendinglimit/muffinCost);

    // Use data converted to maps for quick lookups
    const dataMap = getOpenPriceMap(items);

    const yearPeriods = getYearPeriodSets(dataMap, false);

    let outcomes = [];

    for(let j=0; j < yearPeriods.length; j++) {
      const tradeDaysByYearPeriod = getTradeDays(dataMap, yearPeriods[j][0], yearPeriods[j][1], tradeFrequency, false);

      const outcome = runBasicScenario(dataMap, tradeDaysByYearPeriod, maxMuffins, muffinCost, saleThreshold); // test this.

      const adjustedStart = yearPeriods[j][0];
      const adjustedEnd = yearPeriods[j][1];

      outcome.duration = (adjustedEnd - adjustedStart)/(1000*60*60*24);
      outcome.avgInvestmentPct = (outcome.averageInvestment/spendinglimit)*100;
      outcome.firstDayPrice = getPrice(dataMap, adjustedStart);
      outcome.lastDayPrice = getPrice(dataMap, adjustedEnd);;

      const maxStartShares = (spendinglimit/outcome.firstDayPrice);
      const maxWorthOnLastDay = maxStartShares * outcome.lastDayPrice;
      const maxReturnHypothetical = maxWorthOnLastDay - spendinglimit;
      outcome.maxReturnHypothetical = maxReturnHypothetical;
      outcome.tradeDaysLength = tradeDaysByYearPeriod.length;

      outcomes.push(outcome);
    }

    const sums = getSumsFromOutcomes(outcomes);

    return (
      <div>
        <p>Edit config.js to adjust muffin cost, spending limit, threshold.</p>
        <h2>Basic Scenario Table</h2>
        <p>Like <a href="/basic">Basic Scenario</a> but run for every year in dataset.</p>
        <p>
          Choose some muffin cost and buy/sell (trade) frequency, and make a limit you can spend on muffins. 
          Every week at the same time -- I imagined Open price but I haven't tested it -- buy a muffin if you haven't
          reached the limit and sell muffins that have gained above sale threshold -- something like 2%.
        </p>
        <ConfigDisplay {...config} />
        <hr />
        {/* <TableSummaryDisplay {...getSumsFromOutcomes(outcomes)} /> */}
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
              <th>Max invested</th>
              <th className="table-integer">Unsold</th>
              <th className="table-integer">Shutouts</th>
              <th className="text-center">Period type</th>
              <th className="table-integer">🧁</th>
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