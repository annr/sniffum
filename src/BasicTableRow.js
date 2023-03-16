import React from 'react';
import TradeDay from "./TradeDay";
import {money, formatPercent} from "./util/MoneyHelpers";

class BasicTableRow extends React.Component {
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
      shutOutDays,
      events,
      maxReturnHypothetical,
    } = this.props;

    // const avgInvestmentPct = Math.round((averageInvestment/spendinglimit)*100) + "%";
    const returnsClassName = scenarioReturn > 0 ? "positive" : "negative";
    const maxReturnsClassName = maxReturnHypothetical > 0 ? "dim positive" : "dim negative";
    return (  
    <tr>
      <td>{`${new Date(startDate).toLocaleDateString("en-US")} - ${new Date(endDate).toLocaleDateString("en-US")}`}</td>
      <td><span className={(totalProfits > 0) ? 'profit positive' : 'profit negative'}>{`${money.format(totalProfits)}`}</span></td>
      <td>{`${money.format(totalSales)}`}</td>
      <td>{`${money.format(unsoldGainsOrLosses)}`}</td>
      <td className="muffins-return"><span className={`${returnsClassName}`}>{`${formatPercent(scenarioReturn)}`} </span></td>
      <td><span className={(firstDayPrice < lastDayPrice) ? 'positive' : 'negative'}>{`${marketGrowthOfPeriod}`}</span> <span className={maxReturnsClassName}>({money.format(maxReturnHypothetical)})</span></td>
      <td>{`${money.format(averageInvestment)} (${avgInvestmentPct})`}</td>
      <td>{`${maximumInvestedAtAnyTime}`}</td>
      <td className="table-integer">{`${remainingUnsoldMuffins.length}`}</td>
      <td className="table-integer">{`${shutOutDays.length} `}</td>
      <td className="table-integer">{`${events.length} `}</td>
    </tr>
    );
  }
}

export default BasicTableRow;
