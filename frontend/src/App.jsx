import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComplianceCheck from './components/ComplianceCheck';
import VersionDetail from './components/VersionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComplianceCheck />} />
        <Route path="/version/:version" element={<VersionDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 