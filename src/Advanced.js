import AdvancedScenario from './AdvancedScenario';
import {money} from "./Helpers";

let muffinPrice = 5000.00;

let tradeFrequency = 7;
let spendinglimit = 80000.00;
const startDate = Date.parse('2/18/2022');
const endDate = Date.parse('2/26/2023');

const thresholdBase = 0.022;
const saleThreshold = 0.022;

// make this a web form
export function Advanced() {

  return (
    <div className="App">
      <header className="App-header">
      <h1 className="app-title">👩🏻‍🍳 Advanced Muffins Scenario Runner</h1>

      <h2>Config</h2>
      <ul>
        <li>
          <em>Start date</em>: {`${new Date(startDate).toDateString()}`}
        </li>
        <li>
         <em>End date:</em> {`${new Date(endDate).toDateString()}`}
        </li>
        <li>
          <em>Initial muffin price:</em> {`${money.format(muffinPrice)}`}
        </li>
        <li>
          <em>Spending limit:</em> {`${money.format(spendinglimit)}`}
        </li>
        <li>
          <em>Trade frequency:</em> {`${tradeFrequency} days`}
        </li>
        <li>
          <em>Base threshold:</em> {`${(saleThreshold*100).toFixed(2)}`}%
        </li>
      </ul>
      </header>

      <AdvancedScenario          
        muffinPrice={muffinPrice}
        startDate={startDate}
        endDate={endDate}
        spendinglimit={spendinglimit}
        tradeFrequency={tradeFrequency}
        saleThreshold={saleThreshold}
      />

    </div>
  );
}