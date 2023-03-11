import React from 'react';
import './TradeDay.css';
import {money} from "./util/MoneyHelpers";

import MuffinPurchase from './MuffinPurchase';
import MuffinSale from './MuffinSale';

class TradeDay extends React.Component {
  render() {
    const sold = this.props.soldMuffins.map((muffin) =>
       <MuffinSale {...muffin} />
    );
    return (
      <div className="trade-day">
        <h3 className="trade-date"> {`Day ${this.props.eventId} - ${new Date(this.props.date).toDateString()} - ${money.format(this.props.price)}`} ...<MuffinPurchase {...this.props.purchasedMuffin} /></h3>
        <ul>
          {/* <MuffinPurchase {...this.props.purchasedMuffin} /> */}
          {sold}
          <li>Invested on this day: {money.format(this.props.costUnsoldMuffins)}</li>
        </ul>
      </div>
    );
  }
}

export default TradeDay;
