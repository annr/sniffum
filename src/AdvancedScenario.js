import React from "react";

import Outcome from './Outcome';

import TradeDay from "./TradeDay";
import {
  getTradeDays,
  runBasicScenario,
  money,
  formatPercent,
  convertBasicData,
  adjustStartToMarketDay,
  adjustEndToMarketDay
} from "./Helpers";

//https://reactjs.org/docs/faq-ajax.html

class AdvancedScenario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
        };
      }
    
      componentDidMount() {
        fetch("http://localhost:3000/sp-highs.json")
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
        const {startDate, endDate, tradeFrequency, spendinglimit, muffinPrice, saleThreshold} = this.props;

        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {

          const data = convertBasicData(items);
          // all date values assigned to variables and passed around are timestamps not Date objects
          const newStartDate = adjustStartToMarketDay(data, startDate);
          const newEndDate = adjustEndToMarketDay(data, endDate);
          if (newEndDate < newStartDate) {
            console.error('newEndDate is before newStartDate');
          }
          const tradeDays = getTradeDays(data, newStartDate, newEndDate, tradeFrequency);

          const maxMuffins = Math.floor(spendinglimit/muffinPrice);
          // outcome
          const o = runBasicScenario(data, tradeDays, maxMuffins, muffinPrice, saleThreshold); // test this.
          o.startDate = newStartDate;
          o.endDate = newEndDate;
          o.duration = (newEndDate - newStartDate)/(1000*60*60*24);
          o.avgInvestmentPct = Math.round((o.averageInvestment/spendinglimit)*100) + "%";

          return (
            <Outcome {...o} />
          );
        }
      }

}

export default AdvancedScenario;