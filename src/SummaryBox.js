import React from 'react';
import {money, formatPercent} from "./util/MoneyHelpers";

class SummaryBox extends React.Component {

  render() {

  const {
    totalProfit,
    totalSales,
    unsoldGainsOrLosses,
    scenarioReturn,
    lastDayPrice,
    firstDayPrice,
    duration,
    averageInvestment,
    avgInvestmentPct,
    marketGrowthOfPeriod,
    maximumInvestedAtAnyTime,
    remainingUnsoldMuffins,
    shutOutDays,
    maxReturnHypothetical,
  } = this.props;

  const returnsClassName = scenarioReturn > 0 ? "positive" : "negative";
  const maxReturnsClassName = maxReturnHypothetical > 0 ? "positive" : "negative";

  return (
    <>
      <ul className='summary-list'>
      <li>
          <span className="label">Scenario (short-term) gains: </span>
          <span className={`profit ${returnsClassName}`}>{`${formatPercent(scenarioReturn)}`} </span>
          <span className="dim">(profit/avg-investment) </span>
        </li>
        <li>
          <span className="label">Profit: </span>
          <span className={(totalProfit > 0) ? 'profit positive' : 'profit negative'}>{`${money.format(totalProfit)}`}</span>
        </li>
        <li>
          <span className="label">Sales: </span>
          {`${money.format(totalSales)}`}
        </li>
        <li>
          <span className="label">Unsold muffins gains or losses: </span>
          <span className={(unsoldGainsOrLosses > 0) ? 'positive' : 'negative'}>{`${money.format(unsoldGainsOrLosses)}`}</span>
        </li>
        </ul>
      <ul className='summary-list'>
      <li>
          <span className="label">Market growth of scenario period: </span>
          <span className={(firstDayPrice < lastDayPrice) ? 'positive' : 'negative'}>{`${formatPercent(marketGrowthOfPeriod)}`}</span>
        </li>
      <li>
          <span className="label">Start price: </span>
          {`${money.format(firstDayPrice)} `}
        </li>
        <li>
          <span className="label">End price: </span>
          {`${money.format(lastDayPrice)} `}
        </li>
        <li>
          <span className="label">Length of run:</span> {`${Math.round((duration/365))} year(s)`}
        </li>
        </ul>
      <ul className='summary-list'>
        <li>
          <span className="label">Avg investment over period: </span>
          {`${money.format(averageInvestment)} (${Math.round(avgInvestmentPct)+"%"})`}
        </li>
        <li>
          <span className="label">Max invested at any time: </span>
          {`${money.format(maximumInvestedAtAnyTime)}`}
        </li>
        <li>
          <span className="label">Unsold muffins at end (shutouts): </span>
          {`${remainingUnsoldMuffins} (${shutOutDays})`}
        </li>
        <li><span className="label">Max market return with limit:</span>
        <span className={`profit ${maxReturnsClassName}`}> {`${money.format(maxReturnHypothetical)}`} </span>
        </li>
      </ul>
    </>
    )
  }
}

export default SummaryBox;