import React from "react";
import TableRow from './TableRow';
import ConfigDisplay from './TableConfigDisplay';
import TableSummaryDisplay from './TableSummaryDisplay';

import {
  getAveragesFromOutcomes,
  runDynamicScenario,
} from './Baker';

import {
  getPriceMap,
  getPrice,
  getTradeDays,
  getYearPeriodSets,
  getDatesWithIndices,
} from "./util/DataHelpers";

const {config} = require('./config');

class DynamicTable extends React.Component {

  render() {
    const items = this.props.data;
    const {tradeFrequency, spendinglimit, muffinCost, saleThreshold} = {...config};
    const maxMuffins = Math.floor(spendinglimit/muffinCost);

    // Use data converted to maps for quick lookups
    const data = getPriceMap(items);

    const yearPeriods = getYearPeriodSets(data, false);

    let outcomes = [];

    for(let j=0; j < yearPeriods.length; j++) {
      const tradeDaysByYearPeriod = getTradeDays(data, yearPeriods[j][0], yearPeriods[j][1], tradeFrequency, false);

      // outcome
      const outcome = runDynamicScenario(getDatesWithIndices(items), data, tradeDaysByYearPeriod, maxMuffins, muffinCost, saleThreshold); // test this.

      outcome.adjustedStart = yearPeriods[j][0];
      outcome.adjustedEnd = yearPeriods[j][1];
      outcome.duration = (outcome.adjustedEnd - outcome.adjustedStart)/(1000*60*60*24);

      outcome.avgInvestmentPct = (outcome.averageInvestment/spendinglimit)*100;
      outcome.firstDayPrice = getPrice(data, outcome.adjustedStart);
      outcome.lastDayPrice = getPrice(data, outcome.adjustedEnd);;

      const maxStartShares = (spendinglimit/outcome.firstDayPrice);
      const maxWorthOnLastDay = maxStartShares * outcome.lastDayPrice;
      const maxReturnHypothetical = maxWorthOnLastDay - spendinglimit;
      outcome.maxReturnHypothetical = maxReturnHypothetical;
      outcome.tradeDaysLength = tradeDaysByYearPeriod.length;
      outcomes.push(outcome);
    }

    const averages = getAveragesFromOutcomes(outcomes);

    return (
      <div>
        <h2>Dynamic Scenario Table</h2>
        <p>
          Similar approach as basic, but it sells smarter and may buy more often to accomplish more trades.
        </p>
        <ConfigDisplay {...config} />
        <hr />
        <TableSummaryDisplay {...averages} />
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
              <th className="table-integer">🚫</th>
              <th className="text-center">Period type</th>
              <th className="table-integer">🧁</th>
            </tr>
          </thead>
          <tbody className="table-striped">
            {outcomes.map((outcome, index) =>
              <TableRow {...outcome} key={index} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DynamicTable;