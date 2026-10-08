import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Home from './pages/Home.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Admission from './pages/Admission.jsx';
import ApplyNow from './pages/ApplyNow.jsx';
import Contact from './pages/Contact.jsx';
import Departments from './pages/Departments.jsx';
import Examination from './pages/Examination.jsx';
import Facilities from './pages/Facilities.jsx';
import Faculty from './pages/Faculty.jsx';
import Gallery from './pages/Gallery.jsx';

// About Pages
import History from './pages/About/History.jsx';
import Vision from './pages/About/Vision.jsx';

// Academics Pages
import AcademicsList from './pages/Academics/AcademicsList.jsx';
import ProgramDetail from './pages/Academics/ProgramDetail.jsx';

// Scroll to top helper component
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTopOnNavigate />
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/examination" element={<Examination />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<ApplyNow />} />

          {/* About Routes */}
          <Route path="/about/history" element={<History />} />
          <Route path="/about/vision" element={<Vision />} />

          {/* Academics Routes */}
          <Route path="/academics" element={<AcademicsList />} />
          <Route path="/academics/:programId" element={<ProgramDetail />} />

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
