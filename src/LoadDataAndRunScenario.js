import React from "react";

import TradeDay from "./TradeDay";
import {convertData, getTradeDays, runScenario, money} from "./Helpers";

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

          let data = convertData(items);
          let tradeDays = getTradeDays(data, startDate, endDate, tradeFrequency);
          const maxMuffins = Math.floor(spendinglimit/muffinPrice);

          // outcome
          const o = runScenario(data, tradeDays, maxMuffins, muffinPrice, saleThreshold, sellAllAtSaleThreshold); // test this.
          const duration = (endDate - startDate)/(1000*60*60*24);
          return (
            <div>
              <h2>Outcome</h2>
              <ul>
                <li>
                  <em>Profit: </em>
                  <span className="money">{`${o.totalProfits}`}</span>
                </li>
                <li>
                  <em>Scenario start price: </em>
                  {`${money.format(o.firstDayPrice)} `}
                  <span className="dim">{`(${new Date(startDate).toDateString()})`}</span>
                </li>
                <li>
                  <em>Scenario end price: </em>
                  {`${money.format(o.lastDayPrice)} `}
                  <span className="dim">{`(${new Date(endDate).toDateString()})`}</span>
                </li>
                <li>
                  <em>Length of run:</em> {`${duration.toString()} days`}
                </li>
                <li>
                  <em>Market growth of scenario period: </em>
                  <span className={(o.firstDayPrice < o.lastDayPrice) ? 'positive' : 'negative'}>{`${o.marketGrowthOfPeriod}`}</span>
                </li>
                <li>
                  <em>Average investment over period: </em>
                  {`${o.averageInvestment}`}
                </li>
                <li>
                  <em>Scenario (short-term) gains: </em>
                  <span className="positive">{`${o.scenarioReturn}`} </span>
                  <span className="dim">(profit/average-investment) </span>
                </li>
                <li>
                  <em>Maximum invested at any time: </em>
                  {`${o.maximumInvestedAtAnyTime}`}
                </li>
                <li>
                  <em>Remaining unsold muffins: </em>
                  {`${o.remainingUnsoldMuffins}`}
                </li>
                <li>
                  <em>Trade shutout days: </em>
                  {`${o.shutOutDays.length} `}
                </li>
              </ul>
              <h2>Trade Days</h2>
              <div>
              {o.events.map(event => (
                <TradeDay {...event} />
              ))}
              </div>
            </div>
          );
        }
      }

}

export default LoadDataAndRunScenario;