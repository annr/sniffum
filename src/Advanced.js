import Settings from './Settings';
import AdvancedScenario from './AdvancedScenario';

const {config} = require('./config');

export function Advanced() {

  return (
    <div className="Main">
      <header className="App-header">
        <h1 className="app-title">👩🏻‍🍳 Advanced Muffins Scenario Runner</h1>
        <Settings />
      </header>
      <AdvancedScenario          
        muffinPrice={config.muffinPrice}
        startDate={config.startDate}
        endDate={config.endDate}
        spendinglimit={config.spendinglimit}
        tradeFrequency={config.tradeFrequency}
        saleThreshold={config.saleThreshold}
      />
    </div>
  );
}