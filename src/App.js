import { Route, Routes, Link } from "react-router-dom";
import { Home } from "./Home";
//import Table from "./Table";
import Main from "./Main";
import DynamicWrapper from "./DynamicWrapper";
import TableWrapper from "./BasicTableWrapper";
import DynamicTableWrapper from "./DynamicTableWrapper";
//import Comparison from "./Comparison";

function App() {
  return (
    <>
    <header>
      <nav>
        <Link to="/">Muffins home</Link> &nbsp; -
        Basic: <Link to="/basic">Scenario</Link> &nbsp;
        <Link to="/basic-table">Table</Link> &nbsp; -
        Dynamic: <Link to="/dynamic">Scenario</Link> &nbsp;
        <Link to="/dynamic-table">Table</Link>
        {/* <Link to="/table">Exploration table TBD</Link>  | &nbsp;
        <Link to="/table">Long term muffins</Link> */}
      </nav>
    </header>
    <hr />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/basic" element={<Main />} />
      <Route path="/basic-table" element={<TableWrapper />} />
      <Route path="/dynamic" element={<DynamicWrapper />} />
      <Route path="/dynamic-table" element={<DynamicTableWrapper />} />
      {/* <Route path="/compare" element={<Comparison />} />
      <Route path="/table" element={<Table />} /> */}
    </Routes>
    </>
  )
};

export default App;