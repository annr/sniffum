import Settings from './Settings';
import DataLoader from './DataLoader';

const {config} = require('./config');

export function Main() {

  return (
    <div className="Main">
      <header className="App-header">
        <h1 className="app-title">🧁 Basic Muffins Scenario Runner</h1>
        <Settings />
      </header>
      <DataLoader
        muffinPrice={config.muffinPrice}
        startDate={config.startDate}
        endDate={config.endDate}
        spendinglimit={config.spendinglimit}
        tradeFrequency={config.tradeFrequency}
        saleThreshold={config.saleThreshold}
        tradeAtStartOfWeekFlag={config.tradeAtStartOfWeekFlag}
      />
    </div>
  );
}