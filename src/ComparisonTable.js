import React from 'react';

class ComparisonTable extends React.Component {
  render() {

    // table wrapper
    // build an array of outcomes

       
    return (
      <table className="outcome-table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Start</th>
            <th>End</th>
            <th>Sale threshold</th>
            <th>Profit</th>
            <th>Short-term gains</th>
            <th>Market growth</th>
            <th>Avg. invested</th>
            <th>Max invested at any time</th>
            <th>Unsold</th>
            <th>Shutout days</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Scenario</td>
            <td>Start</td>
            <td>End</td>
            <td>Sale threshold</td>
            <td>Profit</td>
            <td>Short-term gains</td>
            <td>Market growtd</td>
            <td>Avg. invested</td>
            <td>Max invested at any time</td>
            <td>Unsold</td>
            <td>Shutout days</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default ComparisonTable;
