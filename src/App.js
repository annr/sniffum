
import './App.css';

import Action from './Action';

import LoadDataAndProcess from './LoadDataAndProcess';

//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import recentMarketDays from './data/voo.json';

let muffinPrice = 2500.00;
let buyRateDays = 7;
let spendinglimit = 50000.00;
const startDateString = Date.parse('2018-02-06');
const endDateString = Date.parse('2019-02-24');
const duration = (endDateString - startDateString)/(1000*60*60*24);

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
          Muffins Scenarios
      </header>
      <h1>Log</h1>
      <h2>Config</h2>
      <dl>
        <dt>XXXX:</dt>
        <dd>OOOO</dd>
        <dt>Muffin price:</dt>
        <dd>{`${muffinPrice}`}</dd>
        <dt>Action rate:</dt>
        <dd>{`${buyRateDays} days`}</dd>
        <dt>Start date</dt>
        <dd>{`${new Date(startDateString).toDateString()}`}</dd>
        <dt>End date</dt>
        <dd>{`${new Date(endDateString).toDateString()}`}</dd>
        <dt>Limit:</dt><dd>{`${spendinglimit}`}</dd>
        <dt>Length of run:</dt>
        <dd>{`${duration.toString()} days`}</dd>
        <dt>Single purchase profit or loss comparison:</dt>
        <dd>TBD</dd>
      </dl>

      <LoadDataAndProcess             
        muffinPrice={muffinPrice}
        startDateString={startDateString}
        endDateString={endDateString}
        spendinglimit={spendinglimit}
      />

    </div>
  );
}

export default App;
