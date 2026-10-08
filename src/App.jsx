import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages & Components imports
import Home from './pages/Home';
import AllAnnouncements from './pages/AllAnnouncements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Academics & other pages
import Admissions from './pages/Admission';
import BSPrograms from './pages/BSPrograms';
import Departments from './pages/Departments';
import Examination from './pages/Examination';
import Faculty from './pages/Faculty';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/announcements" element={<AllAnnouncements />} />
        
        {/* Dynamic Route for Each Announcement Button */}
        <Route path="/announcements/:id" element={<AnnouncementDetail />} />

        {/* Other Main Sections */}
        <Route path="/admission" element={<Admissions />} />
        <Route path="/academics/bs-programs" element={<BSPrograms />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/examination" element={<Examination />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

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
  );
}
