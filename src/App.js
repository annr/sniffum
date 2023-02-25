
import './App.css';

import LoadDataAndRunScenario from './LoadDataAndRunScenario';

//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import recentMarketDays from './data/voo.json';

let muffinPrice = 3100.00;
let tradeFrequency = 7;
let spendinglimit = 50000.00;
const startDate = Date.parse('2/13/2020');
const endDate = Date.parse('2/13/2021');
const duration = (endDate - startDate)/(1000*60*60*24);
// the percent above purchase price before muffin is removed from the oven
const saleThreshold = 0.020; 
const sellAllAtSaleThreshold = true;

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
          <em>Muffin price:</em> {`${muffinPrice}`}
        </li>
        <li>
          <em>Trade frequency:</em> {`${tradeFrequency} days}`}
        </li>

        <li>
          <em>Length of run:</em> {`${duration.toString()} days`}
        </li>
      </ul>
      </header>

      <h2>Outcome</h2>

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
