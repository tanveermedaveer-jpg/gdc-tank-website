import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
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

// Academics Dynamic Page
import ProgramDetail from './pages/Academics/ProgramDetail.jsx';

// Layout Component jo Navbar aur Footer ko tamaam pages par automatically show karega
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          {/* Main Website Routes (Navbar aur Footer in sab par khud-ba-khud aye ga) */}
          <ElementLayout element={<MainLayout />}>
            <Route path="/" element={<Home />} />
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

            {/* Academics Dynamic Route */}
            <Route path="/academics/:programId" element={<ProgramDetail />} />
          </ElementLayout>

          {/* Admin Dashboard (Is par main website ka Navbar/Footer nahi chahiye hoga) */}
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

// Helper wrapper component for clean syntax
function ElementLayout({ element, children }) {
  return <Route element={element}>{children}</Route>;
}
