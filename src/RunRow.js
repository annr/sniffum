import React from "react";
import MuffinSale from './MuffinSale';
import MuffinPurchase from './MuffinPurchase';
import {money} from "./util/MoneyHelpers";

class RunRow extends React.Component {

  render() {

    const {
      eventId,
      date,
      muffinsBought,
      muffinsSold,
      costUnsoldMuffins,
      totalSalesAtDate,
      unsoldMuffinsValueChange,
      dayPositions,
      isOpenMarketDay,
    } = this.props;

    const bought = muffinsBought.map((muffin, index) =>
      <MuffinPurchase {...muffin} key={index} />
    );
    const sold = muffinsSold.map((muffin, index) =>
      <MuffinSale {...muffin} key={index} />
    );

    // lazy!!! abstract such stuff
    const totalProfit = totalSalesAtDate + unsoldMuffinsValueChange;
    const unsoldValueStyle = (unsoldMuffinsValueChange > 0) ? "positive" : "negative";
    const salesStyle = (totalSalesAtDate > 0) ? "positive" : "negative";
    const totalProfitStyle = (totalProfit > 0) ? "positive" : "negative";

    return (
      <tr>
        <td>{eventId}{isOpenMarketDay ? '**' : ''}</td>
        <td>{new Date(date).toDateString()}</td>
        <td className="fixed-width">{money.format(dayPositions.open)} - {money.format(dayPositions.high)}</td>
        <td>
          <ul className='muffins-list'>
            {(bought) ? bought : <li>-</li>}
          </ul>
          <ul className='muffins-list'>
            {(sold) ? sold : <li>-</li>}
          </ul>
        </td>
        <td>{money.format(costUnsoldMuffins)}</td>
        <td className="table-integer"><span className={unsoldValueStyle}>{(unsoldMuffinsValueChange) ? money.format(unsoldMuffinsValueChange) : ""}</span></td>
        <td className="table-integer"><span className={salesStyle}>{(totalSalesAtDate) ? money.format(totalSalesAtDate) : ""}</span></td>
        <td className="table-integer"><span className={totalProfitStyle}>{(totalProfit) ? money.format(totalProfit) : ""}</span></td>
      </tr>
    );
  }
}

export default RunRow;
