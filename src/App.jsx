import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* جب بھی کوئی مین ڈومین یا /admin کھولے گا، سیدھا ڈیش بورڈ آئے گا */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* اگر کوئی غلطی سے /login پر جائے گا، تو وہ بھی خود بخود ڈیش بورڈ پر چلا جائے گا */}
        <Route path="/login" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
