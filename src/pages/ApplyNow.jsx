import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    program: 'BS Computer Science (4-Year)',
    studentName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    domicile: '',
    cnic: '',
    mobile: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application Submitted Successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      
      {/* 1. Top Navigation Bar (First Image Style) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="College Logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Captain Ashfaq Shaheed</h1>
              <p className="text-xs text-teal-700 font-semibold">DEGREE COLLEGE, TANK</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <a href="/" className="hover:text-teal-600">Home</a>
            <a href="/about" className="hover:text-teal-600">About Us</a>
            <a href="/academics" className="hover:text-teal-600">Academics</a>
            <a href="/apply" className="text-teal-600 font-semibold">Admission</a>
            <a href="/departments" className="hover:text-teal-600">Departments</a>
            <a href="/facilities" className="hover:text-teal-600">Facilities</a>
            <a href="/contact" className="hover:text-teal-600">Contact Us</a>
          </nav>
          <div>
            <span className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wider shadow-sm">
              Apply Now
            </span>
          </div>
        </div>
      </header>

      {/* 2. Top Header Banner (Second Image Style) */}
      <div className="bg-[#0b1b3d] text-white py-12 text-center relative shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">Online Admission Registration</h1>
          <p className="text-teal-400 text-xs md:text-sm tracking-widest mt-2 uppercase font-semibold">
            ACADEMIC SESSION 2026-27 • 2026-2027
          </p>
        </div>
      </div>

      {/* Main Content Layout with Form & Side Guidelines */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section (Takes 2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100 mb-6">
              <span className="p-2 bg-teal-50 text-teal-600 rounded-lg text-lg">📄</span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Admission Form</h2>
                <p className="text-xs text-gray-500">Government Degree College Tank Admission Desk</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1 */}
              <div className="bg-teal-50/40 rounded-xl p-5 border border-teal-100">
                <span className="text-xs font-bold text-teal-800 tracking-wider uppercase block mb-3">
                  STEP 1: 3. OFFERED PROGRAMS SELECTION
                </span>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SELECT PROGRAM OF CHOICE *</label>
                  <select 
                    name="program" 
                    value={formData.program} 
                    onChange={handleChange} 
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option>BS Computer Science (4-Year)</option>
                    <option>BS English (4-Year)</option>
                    <option>F.Sc (Pre-Medical)</option>
                    <option>F.Sc (Pre-Engineering)</option>
                  </select>
                  <p className="text-[11px] text-teal-700 mt-1.5">Academic section dynamically switches between Intermediate Details (for BS Program).</p>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 2: 1. PERSONAL DETAILS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">STUDENT'S NAME (CAPITAL LETTERS) *</label>
                    <input 
                      type="text" 
                      name="studentName" 
                      placeholder="Enter your full name" 
                      value={formData.studentName} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">FATHER'S NAME (CAPITAL LETTERS) *</label>
                    <input 
                      type="text" 
                      name="fatherName" 
                      placeholder="Enter father's name" 
                      value={formData.fatherName} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">DATE OF BIRTH *</label>
                    <input 
                      type="date" 
                      name="dob" 
                      value={formData.dob} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">GENDER *</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">DOMICILE DISTRICT *</label>
                    <input 
                      type="text" 
                      name="domicile" 
                      placeholder="Enter your domicile district" 
                      value={formData.domicile} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition duration-200 text-sm tracking-wide"
                >
                  Proceed to Next Step
                </button>
              </div>

            </form>
          </div>

          {/* Guidelines Sidebar (Second Image Style) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm mb-4">
                <span>🛡️</span>
                <span>Admission Guidelines</span>
              </div>
              
              <ul className="space-y-4 text-xs text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px]">1</span>
                  <span>Ensure all personal and academic records match your original board documents.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px]">2</span>
                  <span>Merit is calculated automatically based on your entered marks and total marks.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px]">3</span>
                  <span>Keep your generated Student ID secure for future merit list checks and status updates.</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100 bg-teal-50/50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-900 mb-1">NEED HELP?</h4>
                <p className="text-[11px] text-gray-500 mb-2">Contact college administration desk or call us at:</p>
                <a href="tel:+923065927447" className="text-xs font-bold text-teal-700 hover:underline">
                  +92 306 5927447
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Professional Footer (First Image Style) */}
      <footer className="bg-[#0b1b3d] text-white py-6 mt-12 border-t border-teal-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div>
            <h3 className="text-sm font-semibold text-teal-400">Ready to start your academic journey?</h3>
            <p className="text-xs text-gray-300">Admissions are open for the academic session 2026-27.</p>
          </div>
          <div>
            <button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2 rounded-md text-xs shadow">
              Apply Online Now
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ApplyPage;
