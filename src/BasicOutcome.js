import React from 'react';
import TradeDay from "./TradeDay";
import {money, formatPercent} from "./util/MoneyHelpers";

class Outcome extends React.Component {
  render() {
    const {
      totalProfits, 
      totalSales,
      unsoldGainsOrLosses,
      scenarioReturn,
      lastDayPrice,
      firstDayPrice,
      averageInvestment,
      avgInvestmentPct,
      startDate,
      endDate,
      marketGrowthOfPeriod,
      maximumInvestedAtAnyTime,
      remainingUnsoldMuffins,
      cupcakes,
      shutOutDays,
      events,
    } = this.props;

    const duration = (endDate - startDate)/(1000*60*60*24);
    // const avgInvestmentPct = Math.round((averageInvestment/spendinglimit)*100) + "%";
    const returnsClassName = scenarioReturn > 0 ? "positive" : "negative";
    return (  
        <div>
        <h2>Outcome</h2>
        <ul>
          <li>
            <em>Profit: </em>
            <span className={(totalProfits > 0) ? 'profit positive' : 'profit negative'}>{`${money.format(totalProfits)}`}</span>
          </li>
          <li>
            <em>Sales: </em>
            {`${money.format(totalSales)}`}
          </li>
          <li>
            <em>Unsold muffins gains or losses: </em>
            {`${money.format(unsoldGainsOrLosses)}`}
          </li>
          <li>
            <em>Scenario start price: </em>
            {`${money.format(firstDayPrice)} `}
            <span className="dim">{`(${new Date(startDate).toDateString()})`}</span>
          </li>
          <li>
            <em>Scenario end price: </em>
            {`${money.format(lastDayPrice)} `}
            <span className="dim">{`(${new Date(endDate).toDateString()})`}</span>
          </li>
          <li>
            <em>Start date</em>: {`${new Date(startDate).toDateString()}`}
          </li>
          <li>
            <em>End date:</em> {`${new Date(endDate).toDateString()}`}
          </li>
          <li>
            <em>Length of run:</em> {`${(duration/365).toFixed(2)} years`}
          </li>
          <li>
            <em>Market growth of scenario period: </em>
            <span className={(firstDayPrice < lastDayPrice) ? 'positive' : 'negative'}>{`${marketGrowthOfPeriod}`}</span>
          </li>
          <li>
            <em>Average investment over period: </em>
            {`${money.format(averageInvestment)} (${avgInvestmentPct})`}
          </li>
          <li>
            <em>Scenario (short-term) gains: </em>
            <span className={`${returnsClassName}`}>{`${formatPercent(scenarioReturn)}`} </span>
            <span className="dim">(profit/average-investment) </span>
          </li>
          <li>
            <em>Maximum invested at any time: </em>
            {`${maximumInvestedAtAnyTime}`}
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

export default Outcome;
