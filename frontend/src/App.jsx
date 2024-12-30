import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComplianceCheck from './components/ComplianceCheck';
import ReleaseManager from './components/ReleaseManager';
import VersionDetail from './components/VersionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/compliance-check" replace />} />
        <Route path="/compliance-check" element={<ComplianceCheck />} />
        <Route path="/release-manager" element={<ReleaseManager />} />
        <Route path="/compliance-check/:version" element={<VersionDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 