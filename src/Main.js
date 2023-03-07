import LoadDataAndRunScenario from './LoadDataAndRunScenario';
import {money} from "./Helpers";

//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import recentMarketDays from './data/voo.json';

// If I change muffinPrice to 1/10 spendingLimit my profits TANK.
//   Profits go from 16.14% to 9.71% and there are 20 shutout days.
//   The shutout days are killer for profit.
//
//   One QUESTION to ask is what for the whole of history is the
//   muffinPrice/spendingLimit balance with manaerd risk? For the
//   year 2022, it's over 1/10. The perfect price/limit for 2022
//   is 3/48 or 1/16

let muffinPrice = 5000.00;

let tradeFrequency = 7;
let spendinglimit = 80000.00;
const startDate = Date.parse('2/18/2022');
const endDate = Date.parse('2/26/2023');
// the percent above purchase price before muffin is removed from the oven

// Sale threshold can also wildly influence profit, of course.
//   Another QUESTION: what threshold is on average the most profitable?
//     Note that we need to look at average investment and total profit as well maybe.
//     Average investment goes down if you go below 0.02.
//     Also, trade shut-out days should be considered.
//     This should be redone in a table to accurate practical sweet spots over more time

//   Exploring most profitable (with 1/16 price/limit):
//       2018: 0.020 (profit: 13.85% - market: -14.49% DOWN)
//       // for 2018, 0.036 makes more money because of more exposure, but 11.54%

//       2019: 0.0222 (profit: 26.64% - market: 25.08%)
//       // for 2019, 0.036 makes more money because of more exposure, but 22.09%

//       2020: 0.022 (profit: 39.26% - market: 13.34%)
//       // for 2020, 0.0166 has a bit higher % but poorer returns du to less exposure
//
//       2021: 0.02 (profit: 31.00% - market: 24.56%)
//       // for 2021, 0.015 has a bit higher % but poorer returns...
//
//       2022: 0.02 (profit: 00.00% - market: 00.00%)
//       // for 2022, 0.000 has a bit higher % but poorer returns...

const saleThreshold = 0.022;
const sellAllAtSaleThreshold = true;

// release muffins if they become X months old. Then keep them until birthdays
// this is hard-coded for now. See Helpers.js
// const graduationAge = 9 * 30;

// make this a web form
export function Main() {

  return (
    <div className="App">
      <header className="App-header">
      <h1 className="app-title">🧁 Basic Muffins Scenario Runner</h1>

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
        <li>
          <em>Sale threshold:</em> {`${(saleThreshold*100).toFixed(2)}`}%
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