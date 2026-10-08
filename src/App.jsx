import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Language Context Provider (زبان کے لیے ضروری)
import { LanguageProvider } from './context/LanguageContext';

// Pages & Components imports
import Home from './pages/Home';
import AllAnnouncements from './pages/AllAnnouncements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Available pages import
import Admissions from './pages/Admission';
import BSPrograms from './pages/BSPrograms';
import Departments from './pages/Departments';
import Faculty from './pages/Faculty';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Academics Specific Pages (اگر یہ فائلیں موجود ہیں)
import PreMedical from './pages/PreMedical';
import PreEngineering from './pages/PreEngineering';
import ICS from './pages/ICS';
import FA from './pages/FA';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Main Website Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/announcements" element={<AllAnnouncements />} />
          
          {/* Dynamic Route for Each Announcement Button */}
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />

          {/* Academics Individual Routes */}
          <Route path="/academics" element={<BSPrograms />} />
          <Route path="/academics/bs-programs" element={<BSPrograms />} />
          <Route path="/academics/pre-medical" element={<PreMedical />} />
          <Route path="/academics/pre-engineering" element={<PreEngineering />} />
          <Route path="/academics/ics" element={<ICS />} />
          <Route path="/academics/fa" element={<FA />} />

          {/* Other Main Sections */}
          <Route path="/admission" element={<Admissions />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Dashboard */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
