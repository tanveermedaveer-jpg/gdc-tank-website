import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

import History from './pages/About/History.jsx';
import Vision from './pages/About/Vision.jsx';

import PreMedical from './pages/Academics/PreMedical.jsx';
import PreEngineering from './pages/Academics/PreEngineering.jsx';
import ICS from './pages/Academics/ICS.jsx';
import FA from './pages/Academics/FA.jsx';
import BSComputerScience from './pages/Academics/BSComputerScience.jsx';
import BSChemistry from './pages/Academics/BSChemistry.jsx';
import BSPhysics from './pages/Academics/BSPhysics.jsx';
import BSEnglish from './pages/Academics/BSEnglish.jsx';
import BSPoliticalScience from './pages/Academics/BSPoliticalScience.jsx';

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/about/history" element={<History />} />
          <Route path="/about/vision" element={<Vision />} />

          <Route path="/academics/pre-medical" element={<PreMedical />} />
          <Route path="/academics/pre-engineering" element={<PreEngineering />} />
          <Route path="/academics/ics" element={<ICS />} />
          <Route path="/academics/fa" element={<FA />} />
          <Route path="/academics/bs-computer-science" element={<BSComputerScience />} />
          <Route path="/academics/bs-chemistry" element={<BSChemistry />} />
          <Route path="/academics/bs-physics" element={<BSPhysics />} />
          <Route path="/academics/bs-english" element={<BSEnglish />} />
          <Route path="/academics/bs-political-science" element={<BSPoliticalScience />} />

          <Route path="/admission" element={<Admission />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/examination" element={<Examination />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<ApplyNow />} />

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
