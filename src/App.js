import React from "react";
import OverviewPanel from "./OverviewPanel";
import AdminTraining from "./AdminTraining";
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
            <Route path="/admin/1" element = { <AdminTraining/> } />
            <Route path="/reviewer/2" element = { <OverviewPanel/> } />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
