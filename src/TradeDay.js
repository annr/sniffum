import React from 'react';
import './TradeDay.css';

import Muffin from './Muffin';


class TradeDay extends React.Component {
  render() {
    return (
      <div className="trade-day">
        {`${new Date(this.props.id).toDateString()}`}
        <br></br>
        <Muffin />
      </div>
    );
  }
}

export default TradeDay;
