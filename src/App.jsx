import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Main Website Homepage Content</div>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<div>Page Not Found (404)</div>} />
      </Routes>
    </Router>
  );
}
