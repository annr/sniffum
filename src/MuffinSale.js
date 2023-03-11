import React from 'react';
import {money} from './util/MoneyHelpers';
import {getPriceChangePercent} from './util/MuffinsHelpers'

// 🛒 🧊 💸 🥮 👩🏻‍🍳 🎂 🙅🏻‍♀️ 🌞 📈 📉 🚫 🔴 🎉 🥳

class MuffinSale extends React.Component {
  render() {
    return (  
      <li className="muffin" >
        <span className="positive">OUT </span>
        🧁 #{`${this.props.id} ${getPriceChangePercent(this.props.purchasePrice, this.props.salePrice).toFixed(4)} (${this.props.purchasePrice}/${this.props.salePrice})`}
        &nbsp;&#8212;&gt; <span className="positive"> {money.format(this.props.profit)}</span>
      </li>
    );
  }
}

export default MuffinSale;
