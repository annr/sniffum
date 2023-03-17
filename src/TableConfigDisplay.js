import React from 'react';
// import {money} from "./util/MoneyHelpers";

class TableConfigDisplay extends React.Component {
  render() {
    return (
      <ul className="config-list">
        <li><span className="label">tradeFrequency:</span> {`${this.props.tradeFrequency}`}</li>
        <li><span className="label">spendinglimit:</span> {`${this.props.spendinglimit}`}</li>
        <li><span className="label">muffinCost:</span> {`${this.props.muffinCost}`}</li>
        <li><span className="label">saleThreshold:</span> {`${this.props.saleThreshold}`}</li>
        <li><span className="label">tradeAtStartOfWeekFlag:</span> {`${this.props.tradeAtStartOfWeekFlag}`}</li>
      </ul>
    );
  }
}

export default TableConfigDisplay;