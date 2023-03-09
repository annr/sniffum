import {money} from "./Helpers";
const {config} = require('./config');

export default function Settings() {

  return (
    <div className="Settings">
      <h2>Settings</h2>
      <ul>
        <li>
          <em>Muffin price:</em> {`${money.format(config.muffinPrice)}`}
        </li>
        <li>
          <em>Spending limit:</em> {`${money.format(config.spendinglimit)}`}
        </li>
        <li>
          <em>Trade frequency:</em> {`${config.tradeFrequency} days`}
        </li>
        <li>
          <em>Sale threshold:</em> {`${(config.saleThreshold*100).toFixed(2)}`}%
        </li>
        <li>
          <em>Unadjusted start</em>: {`${new Date(config.startDate).toDateString()}`}
        </li>
        <li>
         <em>Unadjusted end:</em> {`${new Date(config.endDate).toDateString()}`}
        </li>
      </ul>
    </div>
  );
}