import React from 'react';
import {money, formatPercent} from "./util/MoneyHelpers";

class TableConfigDisplay extends React.Component {
  render() {
    return (
      <div>
        <ul className="summary-list">
          <li>
            <span className="label">Avg gains: </span>
            <span className={(this.props.scenarioReturn > 0) ? 'profit positive' : 'profit negative'}>{formatPercent(this.props.scenarioReturn)}</span>
          </li>
          <li>
            <span className="label">Avg market growth: </span>
            <span className={(this.props.marketGrowthOfPeriod > 0) ? 'positive' : 'negative'}>{formatPercent(this.props.marketGrowthOfPeriod)}</span>
          </li>
          <li>
            <span className="label">Avg profits: </span>
            <span className="profit">{money.format(this.props.totalProfit)}</span>
          </li>
          <li><span className="label">Avg sales:</span> {formatPercent(this.props.totalSales)}</li>
          <li><span className="label">Avg unsold gains or losses: </span> 
          <span className={(this.props.unsoldGainsOrLosses > 0) ? 'positive' : 'negative'}>{money.format(this.props.unsoldGainsOrLosses)}</span>
          </li>
          </ul>
          <ul className="summary-list">

          <li><span className="label"> <span className='positive'>↗ </span> During growth <span className="dim"> (mkt &gt; 3%)</span>:</span> TBD</li>
          <li><span className="label">
            <strong>〰️ </strong> 
            During stagnation
            <span className="dim"> (mkt &gt; -3%, mkt &lt; 3%):</span></span> TBD</li>
          <li>
            <span className="label"> <span className='negative'>↘ </span>
            During decline <span className="dim"> (mkt &lt; -3%)</span>:</span>  TBD</li>
          </ul>
        <ul className="summary-list">
          <li>
            <span className="label">Avg invested at any time (% of max): </span> 
            {money.format(this.props.averageInvestment)} ({formatPercent(this.props.avgInvestmentPct)})
          </li>
          <li><span className="label">Avg unsold muffins:</span> {this.props.remainingUnsoldMuffins.toFixed(2)}</li>
          <li><span className="label">Avg days shut out:</span> {this.props.shutOutDays.toFixed(2)}</li>
          <li><span className="label">Avg sale percent over:</span> TBD</li>
          <li><span className="label">Avg turbulence:</span> TBD</li>
        </ul>
      </div>
    );
  }
}

export default TableConfigDisplay;