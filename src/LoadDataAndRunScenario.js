import React from "react";
import Outcome from './Outcome';

import {
  runBasicScenario
} from './Baker';

import {
  getFirstMarketDaysOfWeekOverPeriod,
  getDaysTradeFrequencyApart,
  convertData,
  checkLogicOfDates,
  adjustDayToWeekBeginning,
  getPrice,
  getValidMarketDay,
} from "./Helpers";

//https://reactjs.org/docs/faq-ajax.html

class LoadDataAndRunScenario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
        };
      }
    
      componentDidMount() {
        fetch("http://localhost:3000/sp.json")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.items
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }
    
      render() {
        const { error, isLoaded, items } = this.state;
        const {startDate, endDate, tradeFrequency, spendinglimit, muffinPrice, saleThreshold, tradeAtStartOfWeekFlag} = this.props;
        const maxMuffins = Math.floor(spendinglimit/muffinPrice);

        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {


          const dataMap = convertData(items);
          const data = items;

          checkLogicOfDates(dataMap, startDate, endDate);

          let newStartDate;
          let newEndDate;

          // Date variables and generally passed around as timestamps not Date objects
          if (tradeAtStartOfWeekFlag) { // override with start of market week
            newStartDate = adjustDayToWeekBeginning(dataMap, startDate);
            newEndDate = adjustDayToWeekBeginning(dataMap, endDate);
          } else {
            newStartDate = getValidMarketDay(dataMap, startDate, 1);
            newEndDate = getValidMarketDay(dataMap, endDate, -1);
          }

          let tradeDays = getDaysTradeFrequencyApart(dataMap, newStartDate, newEndDate, tradeFrequency);

          if (tradeAtStartOfWeekFlag) { // override with start of market week
            tradeDays = getFirstMarketDaysOfWeekOverPeriod(dataMap, newStartDate, newEndDate, tradeFrequency);
          }
          const firstDayPrice = getPrice(dataMap, tradeDays[0]);
          const lastDayPrice = getPrice(dataMap, tradeDays[tradeDays.length - 1]);

          // outcome
          const o = runBasicScenario(dataMap, tradeDays, maxMuffins, muffinPrice, saleThreshold); // test this.

          // the following vars are more config than outcome. Clean this up.
          o.startDate = newStartDate;
          o.endDate = newEndDate;
          o.duration = (newEndDate - newStartDate)/(1000*60*60*24);
          o.avgInvestmentPct = Math.round((o.averageInvestment/spendinglimit)*100) + "%";
          o.firstDayPrice = firstDayPrice;
          o.lastDayPrice = lastDayPrice;

          return (
            <Outcome {...o} />
          );
          
        }
      }

}

export default LoadDataAndRunScenario;