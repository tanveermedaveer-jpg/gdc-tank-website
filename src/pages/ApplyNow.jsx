import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ApplyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    program: 'BS Computer Science (4-Year)',
    studyGroup: 'Pre-Medical (Biology, Physics, Chemistry)',
    shift: 'Morning',
    studentName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    cnic: '',
    fatherCnic: '',
    mobile: '',
    whatsapp: '',
    domicile: '',
    address: '',
    obtainedMarks: '',
    totalMarks: '1100',
    passingYear: '2025',
    board: 'BISE DI Khan',
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
      
      {/* Exact Home Page Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="College Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Captain Ashfaq Shaheed</h1>
              <p className="text-xs text-teal-700 font-bold tracking-wider">DEGREE COLLEGE, TANK</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-700">
            <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-teal-600 transition-colors">About Us</Link>
            <Link to="/academics" className="hover:text-teal-600 transition-colors">Academics</Link>
            <Link to="/apply" className="text-teal-600 transition-colors border-b-2 border-teal-600 pb-1">Admission</Link>
            <Link to="/departments" className="hover:text-teal-600 transition-colors">Departments</Link>
            <Link to="/facilities" className="hover:text-teal-600 transition-colors">Facilities</Link>
            <Link to="/contact" className="hover:text-teal-600 transition-colors">Contact Us</Link>
          </nav>
          <div>
            <Link to="/apply" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg uppercase tracking-wider shadow-md transition-all">
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* Top Header Banner */}
      <div className="bg-[#0b1b3d] text-white py-12 text-center relative shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">Online Admission Registration</h2>
          <p className="text-teal-400 text-xs md:text-sm tracking-widest mt-2 uppercase font-semibold">
            ACADEMIC SESSION 2026-27 • 2026-2027
          </p>
        </div>
      </div>

      {/* Main Content Layout with Form & Side Guidelines */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100 mb-6">
              <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl text-lg">📄</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Admission Form</h3>
                <p className="text-xs text-gray-500">Government Degree College Tank Admission Desk</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Program Selection */}
              <div className="bg-teal-50/40 rounded-xl p-5 border border-teal-100">
                <span className="text-xs font-bold text-teal-800 tracking-wider uppercase block mb-3">
                  STEP 1: OFFERED PROGRAMS SELECTION
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SELECT PROGRAM OF CHOICE *</label>
                    <select name="program" value={formData.program} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>BS Computer Science (4-Year)</option>
                      <option>BS English (4-Year)</option>
                      <option>F.Sc (Pre-Medical)</option>
                      <option>F.Sc (Pre-Engineering)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">STUDY GROUP</label>
                    <select name="studyGroup" value={formData.studyGroup} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Pre-Medical (Biology, Physics, Chemistry)</option>
                      <option>Pre-Engineering (Math, Physics, Chemistry)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SHIFT</label>
                    <select name="shift" value={formData.shift} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Morning</option>
                      <option>Evening</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-teal-700 mt-2">Academic section dynamically switches between Intermediate Details (for BS Program).</p>
              </div>

              {/* Step 2: Personal Details */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 2: PERSONAL DETAILS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">STUDENT'S NAME (CAPITAL LETTERS) *</label>
                    <input type="text" name="studentName" placeholder="Enter your full name" value={formData.studentName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">FATHER'S NAME (CAPITAL LETTERS) *</label>
                    <input type="text" name="fatherName" placeholder="Enter father's name" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">DATE OF BIRTH *</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">GENDER *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">CNIC / B-FORM NUMBER *</label>
                    <input type="text" name="cnic" placeholder="12101-1234567-1" value={formData.cnic} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">FATHER CNIC *</label>
                    <input type="text" name="fatherCnic" placeholder="12101-1234567-1" value={formData.fatherCnic} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">ACTIVE MOBILE NUMBER *</label>
                    <input type="text" name="mobile" placeholder="03001234567" value={formData.mobile} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">WHATSAPP NUMBER</label>
                    <input type="text" name="whatsapp" placeholder="03001234567" value={formData.whatsapp} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">DOMICILE DISTRICT *</label>
                    <input type="text" name="domicile" placeholder="Enter your domicile district" value={formData.domicile} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">POSTAL / RESIDENTIAL ADDRESS *</label>
                    <input type="text" name="address" placeholder="House No, Street, Area, City" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                </div>
              </div>

              {/* Step 3: Academic Record */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 3: ACADEMIC RECORD (MATRICULATION)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">OBTAINED MARKS *</label>
                    <input type="number" name="obtainedMarks" placeholder="e.g. 850" value={formData.obtainedMarks} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">TOTAL MARKS *</label>
                    <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">PASSING YEAR *</label>
                    <input type="text" name="passingYear" value={formData.passingYear} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">BOARD *</label>
                    <input type="text" name="board" value={formData.board} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                </div>
              </div>

              {/* Step 4: Required Documents Upload */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 4: REQUIRED DOCUMENTS UPLOAD
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-gray-700">APPLICANT PASSPORT PHOTO</span>
                      <span className="text-xs text-gray-400">No file chosen</span>
                    </div>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-gray-700">MATRIC DMC / CERTIFICATE</span>
                      <span className="text-xs text-gray-400">No file chosen</span>
                    </div>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-gray-700">STUDENT CNIC / B-FORM</span>
                      <span className="text-xs text-gray-400">No file chosen</span>
                    </div>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-gray-700">FATHER CNIC COPY</span>
                      <span className="text-xs text-gray-400">No file chosen</span>
                    </div>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition duration-200 text-sm tracking-wide">
                  Submit Admission Application
                </button>
              </div>

            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
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

      {/* Professional Footer */}
      <footer className="bg-[#0b1b3d] text-white py-6 mt-12 border-t border-teal-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div>
            <h3 className="text-sm font-semibold text-teal-400">Ready to start your academic journey?</h3>
            <p className="text-xs text-gray-300">Admissions are open for the academic session 2026-27.</p>
          </div>
          <div>
            <Link to="/apply" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2 rounded-md text-xs shadow inline-block">
              Apply Online Now
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ApplyPage;
