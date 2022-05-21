import React from "react";
import OverviewPanel from "./OverviewPanel";
import AdminTraining from "./AdminTraining";
import Result from './Result'
import Nav from "./components/Nav";
import './css/w3.css';
import './css/style.css';

import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
      <Router>
        <div className="App">
          <Nav num = "1" />
          <Routes>
            <Route path="/admin" element = { <AdminTraining/> } />
            <Route path="/reviewer" element = { <OverviewPanel/> } />
            <Route path="/result" element = { <Result/> } />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
