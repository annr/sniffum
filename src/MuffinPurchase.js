import React from 'react';
import {money} from "./util/MoneyHelpers";

// 🛒 🧊 💸 🥮 👩🏻‍🍳 🎂 🙅🏻‍♀️ 🌞 📈 📉 🚫 🔴

class MuffinPurchase extends React.Component {
  render() {
    return (
    <li className="">
    (👩‍🍳) 🧁 #{`${this.props.id} @ ${money.format(this.props.purchasePrice)}`}
    </li>
    )
  }
}

export default MuffinPurchase;
