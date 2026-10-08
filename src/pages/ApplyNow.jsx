import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ApplyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programType: 'BS Program (4-Year)',
    program: 'BS Computer Science',
    studyGroup: 'Pre-Medical',
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
    matricMarks: '',
    matricTotal: '1100',
    matricYear: '2025',
    matricBoard: 'BISE DI Khan',
    intermediateMarks: '',
    intermediateTotal: '1100',
    intermediateYear: '2026',
    intermediateBoard: 'BISE DI Khan',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application Submitted Successfully! Your data has been sent to the Admin Dashboard.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      
      {/* 1. Navbar Component */}
      <Navbar />

      {/* Top Banner */}
      <div className="bg-[#0b1b3d] text-white py-12 text-center relative shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">Online Admission Application Portal</h2>
          <p className="text-teal-400 text-xs md:text-sm tracking-widest mt-2 uppercase font-semibold">
            ACADEMIC SESSION 2026-27 • INTERMEDIATE & BS PROGRAMS
          </p>
        </div>
      </div>

      {/* Main Content & Registration Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100 mb-6">
              <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl text-lg">🎓</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Student Registration Form</h3>
                <p className="text-xs text-gray-500">Fill out your credentials accurately for merit list generation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Program Selection */}
              <div className="bg-teal-50/40 rounded-xl p-5 border border-teal-100">
                <span className="text-xs font-bold text-teal-800 tracking-wider uppercase block mb-3">
                  STEP 1: DEGREE & PROGRAM SELECTION
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">PROGRAM LEVEL *</label>
                    <select name="programType" value={formData.programType} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>BS Program (4-Year)</option>
                      <option>Intermediate Program (F.Sc / F.A / ICS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">DESIRED DISCIPLINE / MAJOR *</label>
                    <select name="program" value={formData.program} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>BS Computer Science</option>
                      <option>BS English</option>
                      <option>BS Zoology / Botany</option>
                      <option>F.Sc Pre-Medical</option>
                      <option>F.Sc Pre-Engineering</option>
                      <option>ICS (Computer Science)</option>
                      <option>F.A (Arts & Humanities)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">STUDY GROUP *</label>
                    <select name="studyGroup" value={formData.studyGroup} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Pre-Medical</option>
                      <option>Pre-Engineering</option>
                      <option>Computer Science</option>
                      <option>Humanities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SHIFT *</label>
                    <select name="shift" value={formData.shift} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Morning</option>
                      <option>Evening</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 2: APPLICANT PERSONAL INFORMATION
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">STUDENT'S FULL NAME (BLOCK LETTERS) *</label>
                    <input type="text" name="studentName" placeholder="Enter your full name" value={formData.studentName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">FATHER'S NAME (BLOCK LETTERS) *</label>
                    <input type="text" name="fatherName" placeholder="Enter father's name" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase" required />
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">STUDENT CNIC / B-FORM NUMBER *</label>
                    <input type="text" name="cnic" placeholder="12101-1234567-1" value={formData.cnic} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">FATHER CNIC NUMBER *</label>
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

              {/* Academic Records */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 3: ACADEMIC BACKGROUND (MATRIC & INTERMEDIATE)
                </span>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-teal-800 block mb-2">MATRICULATION RECORD</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">OBTAINED MARKS *</label>
                        <input type="number" name="matricMarks" placeholder="e.g. 850" value={formData.matricMarks} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">TOTAL MARKS *</label>
                        <input type="number" name="matricTotal" placeholder="1100" value={formData.matricTotal} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">PASSING YEAR *</label>
                        <input type="text" name="matricYear" placeholder="2025" value={formData.matricYear} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">BOARD *</label>
                        <input type="text" name="matricBoard" placeholder="BISE DI Khan" value={formData.matricBoard} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-teal-800 block mb-2">INTERMEDIATE RECORD (Required for BS Programs)</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">OBTAINED MARKS</label>
                        <input type="number" name="intermediateMarks" placeholder="e.g. 750" value={formData.intermediateMarks} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">TOTAL MARKS</label>
                        <input type="number" name="intermediateTotal" placeholder="1100" value={formData.intermediateTotal} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">PASSING YEAR</label>
                        <input type="text" name="intermediateYear" placeholder="2026" value={formData.intermediateYear} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">BOARD</label>
                        <input type="text" name="intermediateBoard" placeholder="BISE DI Khan" value={formData.intermediateBoard} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 4: REQUIRED DOCUMENTS SCAN UPLOADS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">PASSPORT SIZE PHOTOGRAPH *</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" required />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">MATRIC DMC / CERTIFICATE *</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" required />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">INTERMEDIATE DMC (If applicable)</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">STUDENT CNIC / B-FORM & FATHER CNIC *</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" required />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#009688] hover:bg-teal-700 text-white font-semibold py-4 rounded-xl shadow-md transition duration-200 text-sm tracking-wide uppercase">
                  SUBMIT ADMISSION APPLICATION
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

      {/* 2. Footer Component */}
      <Footer />

    </div>
  );
};

export default ApplyPage;
