
import './App.css';

import LoadDataAndRunScenario from './LoadDataAndRunScenario';
import {money} from "./Helpers";

//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import recentMarketDays from './data/voo.json';

let muffinPrice = 3050.00; // why if I change this to 6K do my profits tank? TEST!!!!
let tradeFrequency = 7;
let spendinglimit = 50000.00;
const startDate = Date.parse('2/16/2022');
const endDate = Date.parse('2/15/2023');
// the percent above purchase price before muffin is removed from the oven
const saleThreshold = 0.020; 
const sellAllAtSaleThreshold = true;

// make this a web form
function App() {

  return (
    <div className="App">
      <header className="App-header">
      <h1 className="app-title">🧁 Muffins Scenario Runner</h1>
      <h2>Config</h2>
      <ul>
        <li>
          <em>Start date</em>: {`${new Date(startDate).toDateString()}`}
        </li>
        <li>
         <em>End date:</em> {`${new Date(endDate).toDateString()}`}
        </li>
        <li>
          <em>Muffin price:</em> {`${money.format(muffinPrice)}`}
        </li>
        <li>
          <em>Spending limit:</em> {`${money.format(spendinglimit)}`}
        </li>
        <li>
          <em>Trade frequency:</em> {`${tradeFrequency} days`}
        </li>
      </ul>
      </header>

      <LoadDataAndRunScenario          
        muffinPrice={muffinPrice}
        startDate={startDate}
        endDate={endDate}
        spendinglimit={spendinglimit}
        tradeFrequency={tradeFrequency}
        saleThreshold={saleThreshold}
        sellAllAtSaleThreshold={sellAllAtSaleThreshold}
      />

    </div>
  );
}

export default App;
