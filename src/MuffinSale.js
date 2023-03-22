import React from 'react';
import {money} from './util/MoneyHelpers';
import {getPriceChangePercent} from './util/LogicHelpers'

// 🛒 🧊 💸 🥮 👩🏻‍🍳 🎂 🙅🏻‍♀️ 🌞 📈 📉 🚫 🔴 🎉 🥳

class MuffinSale extends React.Component {
  render() {
    return (  
      <li>
        (😋) 🧁 #{`${this.props.id} ${getPriceChangePercent(this.props.purchasePrice, this.props.salePrice).toFixed(4)} (${this.props.purchasePrice.toFixed(2)}/${this.props.salePrice.toFixed(2)})`}
        &nbsp;&#8212;&gt; <span className="positive"> {money.format(this.props.profit)}</span>
      </li>
    );
  }
}

export default MuffinSale;
