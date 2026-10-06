import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<div>Page Not Found (404)</div>} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
