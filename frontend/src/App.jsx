import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Services from './components/Services';
import ServiceVersion from './components/ServiceVersion';
import ReleaseManager from './components/ReleaseManager';
import VersionDetail from './components/VersionDetail';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/services" element={<Services />} />
        <Route path="/:serviceId/versions" element={<ServiceVersion />} />
        <Route path="/release-manager" element={<ReleaseManager />} />
        <Route path="/:serviceId/:version" element={<VersionDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 