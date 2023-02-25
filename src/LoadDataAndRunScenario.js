import React from "react";

import TradeDay from "./TradeDay";
import {convertData, getTradeDays, runScenario} from "./Helpers";

//https://reactjs.org/docs/faq-ajax.html

class LoadDataAndRunScenario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          muffinPrice: props.muffinPrice,
          startDateString: props.startDateString,
          endDateString: props.endDateString,
          spendinglimit: props.spendinglimit,
          tradeFrequency: props.tradeFrequency,
          saleThreshold: props.saleThreshold,
          sellAllAtSaleThreshold: props.sellAllAtSaleThreshold,
        };
      }
    
      componentDidMount() {
        fetch("http://localhost:3000/voo-2018-present.json")
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

        const {startDate, endDate, tradeFrequency, spendinglimit, muffinPrice, saleThreshold, sellAllAtSaleThreshold} = this.props;

        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {

          //console.log(`start before end: ${this.props.startDate < this.props.endDate}`);

          let data = convertData(items);

          let tradeDays = getTradeDays(data, startDate, endDate, tradeFrequency);

          const maxMuffins = Math.floor(spendinglimit/muffinPrice);

          let res = {
            totalScenarioProfit: 0,
            muffins: [],
          };
          
          res.muffins = runScenario(data, tradeDays, maxMuffins, muffinPrice, saleThreshold, sellAllAtSaleThreshold); // test this.

          return (
            <div>
              {tradeDays.map(item => (
                <TradeDay id={item} />
              ))}
            </div>
          );
        }
      }

}

export default LoadDataAndRunScenario;