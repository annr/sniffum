import React from "react";
import RunRow from "./RunRow";

class RunTable extends React.Component {

  render() {

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>            
            <th>open - high</th>
            <th>In and Out</th>
            <th>Invested</th>
            <th className="table-integer">Unsold gain/loss</th>
            <th className="table-integer">Sales</th>
            <th className="table-integer">Total</th>
          </tr>
        </thead>
        <tbody className="table-striped">
          {this.props.events.map((event, index) =>
            <RunRow {...event} key={index} />
          )}
        </tbody>
      </table>

    );
  }
}

export default RunTable;