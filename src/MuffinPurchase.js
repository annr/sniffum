import React from 'react';
import {money} from "./util/MoneyHelpers";

// 🛒 🧊 💸 🥮 👩🏻‍🍳 🎂 🙅🏻‍♀️ 🌞 📈 📉 🚫 🔴

class MuffinPurchase extends React.Component {
  render() {
    return (this.props.id) ? (
        <span> 🧁 #{`${this.props.id}`} </span>
    ) : (
        <span>🚫 Limit Reached.</span>
    );
  }
}

export default MuffinPurchase;
