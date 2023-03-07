import { Route, Routes, Link } from "react-router-dom";
import { Home } from "./Home";
import { Main } from "./Main";
//import { BasicScenario } from "./BasicScenario"
import './App.css';

export default function App() {
  return (
    <>
    <header>
      <h1><Link to="/">Muffins</Link></h1>
      <nav>
        <ul>
          <li><Link to="/basic">Basic Muffin Scenario Runner</Link></li>
        </ul>
        <hr></hr>
      </nav>
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/basic" element={<Main />} />
      {/* <Route path="/basic" element={<BasicScenario />} /> */}
      {/* <Route path="/advanced" element={<AdvancedScenario />} /> */}
    </Routes>
    </>
  )
};
