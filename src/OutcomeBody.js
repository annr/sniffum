import React from 'react';
import SummaryBox from './SummaryBox';
import RunTable from "./RunTable";

class OutcomeBody extends React.Component {
  render() {
    return (
      <>
        <h3>Outcome</h3>
        <SummaryBox {...this.props} />
        <RunTable {...this.props} />
      </>
    );
  }
}

export default OutcomeBody;
