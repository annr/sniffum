import React from 'react';
import TradeDay from "./TradeDay";
import {money, formatPercent} from "./util/MoneyHelpers";

class BasicOutcome extends React.Component {
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
      cupcakes,
      shutOutDays,
      events,
      maxReturnHypothetical,
    } = this.props;

    const returnsClassName = scenarioReturn > 0 ? "positive" : "negative";
    const maxReturnsClassName = maxReturnHypothetical > 0 ? "positive" : "negative";
    return (  
        <div>
        <h2>Outcome <span className="dim">(config.js)</span></h2>
        <ul>
          <li>
            <em>Profit: </em>
            <span className={(totalProfit > 0) ? 'profit positive' : 'profit negative'}>{`${money.format(totalProfit)}`}</span>
          </li>
          <li>
            <em>Sales: </em>
            {`${money.format(totalSales)}`}
          </li>
          <li>
            <em>Unsold muffins gains or losses: </em>
            <span className={(unsoldGainsOrLosses > 0) ? 'positive' : 'negative'}>{`${money.format(unsoldGainsOrLosses)}`}</span>
          </li>
          <li>
            <em>Start price: </em>
            {`${money.format(firstDayPrice)} `}
          </li>
          <li>
            <em>End price: </em>
            {`${money.format(lastDayPrice)} `}
          </li>
          <li>
            <em>Length of run:</em> {`${(duration/365).toFixed(2)} year(s)`}
          </li>
          <li>
            <em>Market growth of scenario period: </em>
            <span className={(firstDayPrice < lastDayPrice) ? 'positive' : 'negative'}>{`${formatPercent(marketGrowthOfPeriod)}`}</span>
          </li>
          <li>
            <em>Average investment over period: </em>
            {`${money.format(averageInvestment)} (${Math.round(avgInvestmentPct)+"%"})`}
          </li>
          <li>
            <em>Scenario (short-term) gains: </em>
            <span className={`${returnsClassName}`}>{`${formatPercent(scenarioReturn)}`} </span>
            <span className="dim">(profit/average-investment) </span>
          </li>
          <li>
            <em>Maximum invested at any time: </em>
            {`${money.format(maximumInvestedAtAnyTime)}`}
          </li>
          <li>
            <em>Remaining unsold muffins (including cupcakes): </em>
            {`${remainingUnsoldMuffins.length}`}
          </li>
          <li>
            <em>Number of cupcakes: </em>
            {`${cupcakes.length}`}
          </li>
          <li>
            <em>Shut out of purchases: </em>
            {`${shutOutDays.length} `}
          </li>
        </ul>
        <p>Gain or loss of 100% of spendingLimit invested in market as reference:
        <span className={`profit ${maxReturnsClassName}`}> {`${money.format(maxReturnHypothetical)}`} </span>
        </p>
        <h2>Trade Days</h2>
        <div>
        {events.map(event => (
          <TradeDay key={event.eventId} {...event} />
        ))}
        </div>
      </div>
    );
  }
}

export default BasicOutcome;
