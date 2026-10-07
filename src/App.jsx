import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// اہم صفحات کی امپورٹ (یقینی بنائیں کہ یہ فائلز آپ کے 'src/pages/' فولڈر میں موجود ہوں)
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import History from './pages/about/History'; // اگر آپ کا فولڈر سٹرکچر مختلف ہے تو پاتھ چیک کر لیں
import Vision from './pages/about/Vision';
import Admission from './pages/Admission';
import Departments from './pages/Departments';
import Examination from './pages/Examination';
import Faculty from './pages/Faculty';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Apply from './pages/Apply';

// اکیڈمک پروگرامز کے صفحات
import PreMedical from './pages/academics/PreMedical';
import PreEngineering from './pages/academics/PreEngineering';
import ICS from './pages/academics/ICS';
import FA from './pages/academics/FA';
import BSComputerScience from './pages/academics/BSComputerScience';
import BSChemistry from './pages/academics/BSChemistry';
import BSPhysics from './pages/academics/BSPhysics';
import BSEnglish from './pages/academics/BSEnglish';
import BSPoliticalScience from './pages/academics/BSPoliticalScience';

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          {/* مین اور ایڈمن روٹس */}
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* اباؤٹ اس (About Us) کے صفحات */}
          <Route path="/about/history" element={<History />} />
          <Route path="/about/vision" element={<Vision />} />

          {/* اکیڈمکس (Academics) کے تمام ذیلی صفحات */}
          <Route path="/academics/pre-medical" element={<PreMedical />} />
          <Route path="/academics/pre-engineering" element={<PreEngineering />} />
          <Route path="/academics/ics" element={<ICS />} />
          <Route path="/academics/fa" element={<FA />} />
          <Route path="/academics/bs-computer-science" element={<BSComputerScience />} />
          <Route path="/academics/bs-chemistry" element={<BSChemistry />} />
          <Route path="/academics/bs-physics" element={<BSPhysics />} />
          <Route path="/academics/bs-english" element={<BSEnglish />} />
          <Route path="/academics/bs-political-science" element={<BSPoliticalScience />} />

          {/* کالج کے دیگر اہم سیکشنز */}
          <Route path="/admission" element={<Admission />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/examination" element={<Examination />} ./>
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />

          {/* ری ڈائریکٹس */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
