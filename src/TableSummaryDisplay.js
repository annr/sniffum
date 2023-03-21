import React from 'react';
import {money, formatPercent} from "./util/MoneyHelpers";

const {config} = require('./config');
const gmd = ((config.growthMarketDefinition)*100).toFixed(1);

class TableConfigDisplay extends React.Component {
  render() {

    const {
      averageInvestment,
      avgInvestmentPct,
      marketGrowthOfPeriod,
      maximumInvestedAtAnyTime,
      remainingUnsoldMuffins,
      scenarioReturn,
      shutOutDays,
      totalProfit,
      totalSales,
      unsoldGainsOrLosses,
      marketTypes,
    }  = this.props;

    return (
      <div>
        <ul className="summary-list">
          <li>
            <span className="label">Avg gains: </span>
            <span className={(scenarioReturn > 0) ? 'profit positive' : 'profit negative'}>{formatPercent(scenarioReturn)}</span>
          </li>
          <li>
            <span className="label">Avg market growth: </span>
            <span className={(marketGrowthOfPeriod > 0) ? 'positive' : 'negative'}>{formatPercent(marketGrowthOfPeriod)}</span>
          </li>
          <li>
            <span className="label">Avg profits: </span>
            <span className="profit">{money.format(totalProfit)}</span>
          </li>
          <li><span className="label">Avg sales:</span> {formatPercent(totalSales)}</li>
          <li><span className="label">Avg unsold gains or losses: </span> 
          <span className={(unsoldGainsOrLosses > 0) ? 'positive' : 'negative'}>{money.format(unsoldGainsOrLosses)}</span>
          </li>
          </ul>
          <ul className="summary-list">

          <li>
            <span className="label">
              <span className="count">{marketTypes.growthPeriodsCount}</span>&nbsp;
              <span className='positive'>↗ </span> During growth 
              <span className="dim"> {`(mkt > ${gmd}%)`}</span>:
            </span>&nbsp;
            {(!marketTypes.growthPeriodsCount) ? 'N/A' : `${formatPercent(marketTypes.runGrowthGains)} (vs. ${formatPercent(marketTypes.growthGains)})`}
          </li>
          <li>
            <span className="label">
              <span className="count">{marketTypes.stagnationPeriodsCount}</span>&nbsp;
              <strong>〰️ </strong> 
              During stagnation
              {/* <span className="count"> {marketTypes.stagnationPeriodsCount}</span> */}
              <span className="dim"> {`(-${gmd}% mkt ${gmd}%)`}:</span>&nbsp;
            </span>
            {(!marketTypes.stagnationPeriodsCount) ? 'N/A' : `${formatPercent(marketTypes.runStagnationGains)} (vs. ${formatPercent(marketTypes.stagnationGains)})`}
          </li>
          <li>
            <span className="count">{marketTypes.declinePeriodsCount}</span>&nbsp;
            <span className="label"> <span className='negative'>↘ </span>
            During decline <span className="dim"> {`(mkt < -${gmd}%)`}</span>:</span>&nbsp;
            {(!marketTypes.declinePeriodsCount) ? 'N/A' : `${formatPercent(marketTypes.runDeclineGains)} (vs. ${formatPercent(marketTypes.declineGains)})`}
             </li>
          </ul>
        <ul className="summary-list">
          <li>
            <span className="label">Avg invested at any time (% of max): </span> 
            {money.format(averageInvestment)} ({formatPercent(avgInvestmentPct)})
          </li>
          <li><span className="label">Avg unsold muffins (Avg shut outs):</span> {remainingUnsoldMuffins.toFixed(2)} ({shutOutDays.toFixed(2)})</li>
          <li><span className="label">Avg sale percent over:</span> TBD</li>
          <li><span className="label">Avg turbulence:</span> TBD</li>
        </ul>
      </div>
    );
  }
}

export default TableConfigDisplay;