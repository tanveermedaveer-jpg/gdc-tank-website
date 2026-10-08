import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    // Yahan aap Firebase Firestore ya backend submission logic add karenge
    // taake yeh data admin dashboard par merit list ke liye show ho sake.
    alert('Application Submitted Successfully! Your data has been sent to the Admin Dashboard.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      
      {/* Complete Professional Navigation Bar matching Image 2 */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="College Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Captain Ashfaq Shaheed</h1>
              <p className="text-xs text-teal-700 font-bold tracking-wider">DEGREE COLLEGE, TANK</p>
            </div>
          </div>
          
          <nav className="hidden xl:flex items-center space-x-5 text-xs font-semibold text-gray-700">
            <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-teal-600 transition-colors">About Us</Link>
            <Link to="/academics" className="hover:text-teal-600 transition-colors">Academics</Link>
            <Link to="/admission" className="hover:text-teal-600 transition-colors">Admission</Link>
            <Link to="/departments" className="hover:text-teal-600 transition-colors">Departments</Link>
            <Link to="/examination" className="hover:text-teal-600 transition-colors">Examination</Link>
            <Link to="/faculty" className="hover:text-teal-600 transition-colors">Faculty</Link>
            <Link to="/facilities" className="hover:text-teal-600 transition-colors">Facilities</Link>
            <Link to="/gallery" className="hover:text-teal-600 transition-colors">Gallery</Link>
            <Link to="/contact" className="hover:text-teal-600 transition-colors">Contact Us</Link>
          </nav>

          <div>
            <Link to="/apply" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider shadow-md transition-all">
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* Top Header Banner */}
      <div className="bg-[#0b1b3d] text-white py-10 text-center relative shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">Online Admission Application Portal</h2>
          <p className="text-teal-400 text-xs md:text-sm tracking-widest mt-2 uppercase font-semibold">
            ACADEMIC SESSION 2026-27 • INTERMEDIATE & BS PROGRAMS
          </p>
        </div>
      </div>

      {/* Main Content Layout with Professional Form & Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Professional Form Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100 mb-6">
              <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl text-lg">🎓</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Student Registration Form</h3>
                <p className="text-xs text-gray-500">Fill out your credentials accurately for merit list generation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Program Selection */}
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">STUDY GROUP</label>
                    <select name="studyGroup" value={formData.studyGroup} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Pre-Medical</option>
                      <option>Pre-Engineering</option>
                      <option>Computer Science</option>
                      <option>Humanities</option>
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
              </div>

              {/* Step 2: Personal Details */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 2: APPLICANT PERSONAL INFORMATION
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">STUDENT'S FULL NAME (BLOCK LETTERS) *</label>
                    <input type="text" name="studentName" placeholder="e.g. MUHAMMAD ALI" value={formData.studentName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">FATHER'S NAME (BLOCK LETTERS) *</label>
                    <input type="text" name="fatherName" placeholder="e.g. AHMAD KHAN" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase" required />
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">STUDENT CNIC / B-FORM *</label>
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
                    <input type="text" name="domicile" placeholder="e.g. Tank / DI Khan" value={formData.domicile} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">POSTAL ADDRESS *</label>
                    <input type="text" name="address" placeholder="House No, Street, Area, City" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
                  </div>
                </div>
              </div>

              {/* Step 3: Academic Credentials */}
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
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">TOTAL MARKS</label>
                        <input type="number" name="matricTotal" value={formData.matricTotal} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">PASSING YEAR</label>
                        <input type="text" name="matricYear" value={formData.matricYear} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">BOARD</label>
                        <input type="text" name="matricBoard" value={formData.matricBoard} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-teal-800 block mb-2">INTERMEDIATE RECORD (Required for BS Programs)</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">OBTAINED MARKS</label>
                        <input type="number" name="intermediateMarks" placeholder="e.g. 750 (or 1st Year marks)" value={formData.intermediateMarks} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">TOTAL MARKS</label>
                        <input type="number" name="intermediateTotal" value={formData.intermediateTotal} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">PASSING YEAR</label>
                        <input type="text" name="intermediateYear" value={formData.intermediateYear} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">BOARD</label>
                        <input type="text" name="intermediateBoard" value={formData.intermediateBoard} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Document Uploads */}
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">
                  STEP 4: REQUIRED DOCUMENTS SCAN UPLOADS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">PASSPORT SIZE PHOTOGRAPH</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">MATRIC DMC / CERTIFICATE</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">INTERMEDIATE DMC (If applicable)</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <span className="block text-xs font-semibold text-gray-700 mb-1">STUDENT CNIC / B-FORM / FATHER CNIC</span>
                    <input type="file" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl shadow-md transition duration-200 text-sm tracking-wide uppercase">
                  Submit Application for Merit List
                </button>
              </div>

            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm mb-4">
                <span>🛡️</span>
                <span>Admission Policy & Rules</span>
              </div>
              
              <ul className="space-y-4 text-xs text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px]">1</span>
                  <span>Data submitted here will directly sync with the Admin Dashboard for official merit calculation.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px]">2</span>
                  <span>Ensure marks entered match your official board documents to avoid form rejection during verification.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px]">3</span>
                  <span>Both Intermediate and BS applicants must keep their application serial number safe.</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100 bg-teal-50/50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-900 mb-1">COLLEGE ADMISSION DESK</h4>
                <p className="text-[11px] text-gray-500 mb-2">For technical queries or support, call us:</p>
                <a href="tel:+923065927447" className="text-xs font-bold text-teal-700 hover:underline">
                  +92 306 5927447
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Complete Professional Footer matching Image 2 */}
      <footer className="bg-[#0b1b3d] text-white pt-12 pb-6 mt-12 border-t border-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
            {/* Col 1: About */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                <div>
                  <h3 className="text-xs font-bold leading-tight">Captain Ashfaq Shaheed</h3>
                  <p className="text-[10px] text-teal-400 font-bold">DEGREE COLLEGE, TANK</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Established to provide quality education in the historic region of Tank. Named in memory of Captain Ashfaq Shaheed (Military Medal/Martyr).
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
                <li><Link to="/academics" className="hover:text-teal-400 transition-colors">Academics</Link></li>
                <li><Link to="/admission" className="hover:text-teal-400 transition-colors">Admission</Link></li>
                <li><Link to="/departments" className="hover:text-teal-400 transition-colors">Departments</Link></li>
              </ul>
            </div>

            {/* Col 3: Offered Programs */}
            <div>
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">Offered Programs</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>F.Sc Pre-Medical & Pre-Engineering</li>
                <li>ICS (Computer Science)</li>
                <li>F.A (Arts & Humanities)</li>
                <li>BS Computer Science (4-Year)</li>
                <li>BS English & Natural Sciences</li>
              </ul>
            </div>

            {/* Col 4: Contact Info */}
            <div>
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">Contact Info</h4>
              <p className="text-xs text-gray-300 mb-2">Main Bannu Road, Opposite Polytechnic Institute, District Tank</p>
              <p className="text-xs font-bold text-teal-400 mb-2">+92 306 5927447</p>
              <p className="text-[11px] text-gray-400">AFFILIATED WITH: BISE Dera Ismail Khan / Gomal University</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
            <p>© 2026 Captain Ashfaq Shaheed Degree College Tank. All Rights Reserved.</p>
            <p className="mt-2 md:mt-0">Designed for Online Admissions & Admin Dashboard Integration</p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default ApplyPage;
