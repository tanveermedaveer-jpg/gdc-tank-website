import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';
import NewsTicker from './components/NewsTicker';

import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import History from './pages/About/History';
import Vision from './pages/About/Vision';
import ProgramDetail from './pages/Academics/ProgramDetail';
import Admission from './pages/Admission';
import Departments from './pages/Departments';
import Examination from './pages/Examination';
import Faculty from './pages/Faculty';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import ApplyNow from './pages/ApplyNow';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomeRoute = location.pathname === '/';

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('casdct_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('casdct_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('casdct_dark_mode', 'false');
    }
  }, [darkMode]);

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : ''}`}>
      {/* News Ticker - Sirf Admin aur Home ke ilawa sabhi jagah aayega */}
      {!isAdminRoute && !isHomeRoute && <NewsTicker />}

      {/* Global Navbar - Sirf Home aur Admin ke ilawa baaki sabhi pages par ek hi daفا aayega */}
      {!isAdminRoute && !isHomeRoute && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/history" element={<History />} />
          <Route path="/about/vision" element={<Vision />} />
          <Route path="/academics" element={<ProgramDetail />} />
          <Route path="/academics/:programId" element={<ProgramDetail />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/examination" element={<Examination />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<ApplyNow />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          
          {/* Fallback routing */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Footer - Sirf Home aur Admin ke ilawa baaki sabhi pages par aayega */}
      {!isAdminRoute && !isHomeRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}
