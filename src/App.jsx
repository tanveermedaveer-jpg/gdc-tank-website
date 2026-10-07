import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Navbar اور Footer کو یہاں امپورٹ کریں (اپنے فولڈر کے نام چیک کر لیں اگر components فولڈر میں ہیں)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

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

// یہ لے آؤٹ کمپونینٹ ہر پیج کے اوپر Navbar اور نیچے Footer کو فکس رکھے گا
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* یہاں پر آپ کے تمام باقی پیجز شو ہوں گے */}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          {/* Admin ڈیش بورڈ کو لے آؤٹ سے باہر رکھا گیا ہے تاکہ وہاں عام ویب سائٹ کا نیویگیشن شو نہ ہو */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* یہ تمام پیجز MainLayout کے اندر ہیں، اس لیے ان سب پر Navbar اور Footer ہمیشہ شو ہوں گے */}
          <Route element={<MainLayout />}>
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

            {/* Academics Dynamic Route (جیسے آپ کا Pre-Medical والا پیج ہے) */}
            <Route path="/academics/:programId" element={<ProgramDetail />} />
          </Route>

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
