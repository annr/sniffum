import React from 'react';
import {money, formatPercent} from "./util/MoneyHelpers";

class TableConfigDisplay extends React.Component {
  render() {
    return (
      <div>
        <ul className="summary-list">
          <li><span className="label">Avg % gains over market:</span> {formatPercent(this.props.avgGainsPercent)}</li>
          <li><span className="label">Avg gains:</span> {money.format(this.props.avgProfit)}</li>
          <li><span className="label">Avg profits:</span> {formatPercent(this.props.avgGainsAboveTotalAnnualPercent)}</li>
          <li><span className="label"> <span className='positive'>↗</span> During growth:</span> {formatPercent(this.props.avgGainsDuringGrowth)}</li>
          <li><span className="label"> <strong>〰️</strong> During stagnation:</span> {formatPercent(this.props.avgGainsDuringStagnation)}</li>
          <li><span className="label"> <span className='negative'>↘</span> During decline:</span> {formatPercent(this.props.avgGainsDuringDecline)}</li>
        </ul>
        <ul className="summary-list">
          <li><span className="label">Avg unsold gains or losses:</span> {money.format(this.props.avgValueUnsold)}</li>
          <li>
            <span className="label">Avg of average invested (% of max): </span> 
            {money.format(this.props.avgInvested)} ({formatPercent(this.props.avgInvestedPercentOfMax)})
          </li>
          <li><span className="label">Avg days shut out:</span> {this.props.avgDaysShutOut}</li>
          <li><span className="label">Avg sale percent gain:</span> {formatPercent(this.props.avgSalePriceDifference*100)}</li>
          <li><span className="label">Avg turbulence:</span> {this.props.avgTurbulence}</li>
          <li><span className="label">Success:</span> <span className="dim">{this.props.successString}</span></li>
        </ul>
      </div>
    );
  }
}

export default TableConfigDisplay;