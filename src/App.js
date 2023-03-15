import { Route, Routes, Link } from "react-router-dom";
import { Home } from "./Home";
import Table from "./Table";
import Main from "./Main";
import Comparison from "./Comparison";

function App() {
  return (
    <>
    <header>
      <nav>
        <Link to="/">Home</Link> | &nbsp;
        <Link to="/basic">Basic Scenario</Link> | &nbsp;
        <Link to="/compare">Comparing approaches</Link> | &nbsp;
        <Link to="/table">Exploration table TBD</Link>  | &nbsp;
        <Link to="/table">Long term muffins</Link>
      </nav>
    </header>
    <hr />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/basic" element={<Main />} />
      <Route path="/compare" element={<Comparison />} />
      <Route path="/table" element={<Table />} />
    </Routes>
    </>
  )
};

export default App;