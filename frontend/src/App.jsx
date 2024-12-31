import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Services from './components/Services';
import ComplianceCheck from './components/ComplianceCheck';
import ReleaseManager from './components/ReleaseManager';
import VersionDetail from './components/VersionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/services" element={<Services />} />
        <Route path="/compliance-check" element={<ComplianceCheck />} />
        <Route path="/airflow" element={<ComplianceCheck />} />
        <Route path="/release-manager" element={<ReleaseManager />} />
        <Route path="/:serviceId/:version" element={<VersionDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 