import React from "react";
import MuffinSale from './MuffinSale';
import {money} from "./util/MoneyHelpers";

class RunRow extends React.Component {

  render() {

    const {
      date,
      eventId,
      price,
      purchasedMuffin,
      costUnsoldMuffins,
      soldMuffins,
      totalSalesAtDate,
      unsoldMuffinValueChange,
    } = this.props;

    const sold = soldMuffins.map((muffin, index) =>
      <MuffinSale {...muffin} key={index} />
    );

    // lazy!!! abstract this:
    const totalProfit = totalSalesAtDate + unsoldMuffinValueChange;
    const unsoldValueStyle = (unsoldMuffinValueChange > 0) ? "positive" : "negative";
    const salesStyle = (totalSalesAtDate > 0) ? "positive" : "negative";
    const totalProfitStyle = (totalProfit > 0) ? "positive" : "negative";

    return (
      <tr>
        <td>{eventId}</td>
        <td>{new Date(date).toDateString()}</td>
        <td>{(purchasedMuffin) ? '🧁': '🚫'} @ {price}</td>
        <td>{money.format(costUnsoldMuffins)}</td>
        <td><ul className='sold-muffins'>{(sold) ? sold : <li>-</li>}</ul></td>
        <td className="table-integer"><span className={unsoldValueStyle}>{(unsoldMuffinValueChange) ? money.format(unsoldMuffinValueChange) : ""}</span></td>
        <td className="table-integer"><span className={salesStyle}>{(totalSalesAtDate) ? money.format(totalSalesAtDate) : ""}</span></td>
        <td className="table-integer"><span className={totalProfitStyle}>{(totalProfit) ? money.format(totalProfit) : ""}</span></td>
      </tr>
    );
  }
}

export default RunRow;
