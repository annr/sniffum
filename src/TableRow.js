import React from 'react';
import {money, formatPercent} from "./util/MoneyHelpers";

class BasicTableRow extends React.Component {
  render() {
    const {
      totalProfit,
      totalSales,
      unsoldGainsOrLosses,
      scenarioReturn,
      lastDayPrice,
      firstDayPrice,
      averageInvestment,
      avgInvestmentPct,
      adjustedStart,
      adjustedEnd,
      marketGrowthOfPeriod,
      maximumInvestedAtAnyTime,
      remainingUnsoldMuffins,
      shutOutDays,
      maxReturnHypothetical,
    } = this.props;

    const returnsClassName = scenarioReturn > 0 ? "positive" : "negative";
    const shutOutDaysClassName = shutOutDays < 20 ? "" : "negative";
    const maxReturnsClassName = maxReturnHypothetical > 0 ? "dim positive" : "dim negative";

    let yearType = <strong>〰️</strong>;
    if(marketGrowthOfPeriod > 3) {
      yearType = <span className='positive'>↗</span>;
    }
    if(marketGrowthOfPeriod < -3) {
      yearType = <span className='negative'>↘</span>;
    }

    let outcomeEmoji = "🥱";
    const runVsMarket = scenarioReturn - marketGrowthOfPeriod;
    if(runVsMarket > 2) {
      outcomeEmoji = "✅";
    }
    if(runVsMarket < 0.5) {
      outcomeEmoji = "⛔️";
    }
    // console.log(`run ${scenarioReturn} market ${marketGrowthOfPeriod} difference ${scenarioReturn - marketGrowthOfPeriod}`)
    return (
    <tr>
      <td>{`${new Date(adjustedStart).toDateString()} - ${new Date(adjustedEnd).toDateString()}`}</td>
      <td><span className={(totalProfit > 0) ? 'profit positive' : 'profit negative'}>{`${money.format(totalProfit)}`}</span></td>
      <td>{`${money.format(totalSales)}`}</td>
      <td>{<span className={(unsoldGainsOrLosses > 0) ? 'positive' : 'negative'}>{`${money.format(unsoldGainsOrLosses)}`}</span>}</td>
      <td className="muffins-return profit"><span className={`${returnsClassName}`}>{`${formatPercent(scenarioReturn)}`} </span></td>
      <td><span className={(firstDayPrice < lastDayPrice) ? 'positive' : 'negative'}>{`${formatPercent(marketGrowthOfPeriod)}`}</span> <span className={maxReturnsClassName}>({money.format(maxReturnHypothetical)})</span></td>
      <td>{`${money.format(averageInvestment)} (${Math.round(avgInvestmentPct)+"%"})`}</td>
      <td>{`${money.format(maximumInvestedAtAnyTime)}`}</td>
      <td className="table-integer">{`${remainingUnsoldMuffins}`}</td>
      <td className="table-integer"><span className={`${shutOutDaysClassName}`}>{`${(shutOutDays > 0) ? shutOutDays : ''}`} </span></td>
      <td className="text-center">{yearType}</td>
      <td className="table-integer"><span className="dim">{runVsMarket.toFixed(2)}</span> {`${outcomeEmoji}`}</td>
    </tr>
    );
  }
}

export default BasicTableRow;
