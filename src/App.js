import { Route, Routes, Link } from "react-router-dom";
import { Home } from "./Home";
import { Main } from "./Main";
import { Advanced } from "./Advanced"
import { Table } from "./Table";
import './App.css';


function App() {
  return (
    <>
    <header>
      <h1><Link to="/">Muffins</Link></h1>
      <nav>
        <ul>
          <li><Link to="/basic">Basic Muffin Scenario Runner</Link></li>
          <li><Link to="/advanced">Advanced Muffin Scenario Runner</Link></li>
          <li><Link to="/table">Comparison Table of Approaches</Link></li>
        </ul>
        <hr></hr>
      </nav>
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/basic" element={<Main />} />
      <Route path="/advanced" element={<Advanced />} />
      <Route path="/table" element={<Table />} />
    </Routes>
    </>
  )
};

export default App;
