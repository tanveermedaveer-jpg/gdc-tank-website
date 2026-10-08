import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ShieldCheck, CheckCircle2, ChevronRight, FileText, User, 
  GraduationCap, Clipboard, CreditCard, Upload, AlertCircle, FileCheck, Layers 
} from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';
import { COLLEGE_PHONE } from '../lib/contactDetails';
import { publicFileRequest, publicRequest } from '../lib/adminApi';

export default function ApplyNow() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    cnicOrBForm: '',
    fatherCnic: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    domicile: '',
    religion: 'Islam',
    category: 'Regular',
    program: 'F.Sc (Pre-Medical)',
    subCategory: 'Pre-Medical',
    shift: 'Morning',
    matricMarks: '',
    matricTotal: '1100',
    matricYear: '2025',
    matricBoard: 'BISE DI Khan',
    firstYearMarks: '',
    firstYearTotal: '550',
    firstYearRollNo: '',
    hifzQuran: 'No',
    hafizDocument: null,
    sportCert: 'No',
    sportDocument: null,
    orphan: 'No',
    challanReceipt: null,
    applicantPhoto: null,
    fatherCnicDoc: null,
    studentCnicDoc: null,
    matricDmcDoc: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const programsConfig = useMemo(() => ({
    'F.Sc (Pre-Medical)': {
      subCategories: [
        { label: 'Pre-Medical (Biology, Physics, Chemistry)', value: 'Pre-Medical' }
      ],
      eligibility: 'Metric Science with min 45% marks.'
    },
    'F.Sc (Pre-Engineering)': {
      subCategories: [
        { label: 'Pre-Engineering (Maths, Physics, Chemistry)', value: 'Pre-Engineering' }
      ],
      eligibility: 'Metric Science with min 45% marks.'
    },
    'ICS': {
      subCategories: [
        { label: 'Physics, Math, Computer Science', value: 'Physics-Math-Computer' },
        { label: 'Statistics, Math, Computer Science', value: 'Stats-Math-Computer' },
        { label: 'Economics, Math, Computer Science', value: 'Economics-Math-Computer' }
      ],
      eligibility: 'Metric Science or Arts (with Math) min 45% marks.'
    },
    'FA': {
      subCategories: [
        { label: 'General Humanities Group', value: 'Humanities' }
      ],
      eligibility: 'Metric (Any Stream) with passing marks.'
    }
  }), []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProgramChange = (e) => {
    const val = e.target.value;
    const cfg = programsConfig[val];
    setFormData(prev => ({
      ...prev,
      program: val,
      subCategory: cfg ? cfg.subCategories[0].value : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
        }
      });

      const res = await publicFileRequest.post('/api/applications/submit', dataToSend);
      setSuccessData(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application. Please check your inputs or network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Application Submitted Successfully!</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Your admission form has been received and registered in our database.</p>
            
            <div className="bg-teal-50 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700 rounded-2xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-teal-100 dark:border-slate-700 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID / Tracking No:</span>
                <span className="text-lg font-black text-teal-700 dark:text-teal-400 font-mono">{successData.studentId || successData.trackingNo}</span>
              </div>
              <div className="flex justify-between items-center border-b border-teal-100 dark:border-slate-700 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant Name:</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formData.studentName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Program:</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formData.program}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Print Application Slip</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-black text-xs uppercase tracking-widest rounded-full">
            Admissions Open 2026-27
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            Online Admission Application Form
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
            Please fill out all the required information accurately. Make sure to upload clear document scans where necessary.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl flex items-center space-x-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-bold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Program Selection Card */}
          <div className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Program & Category Selection</h3>
                <p className="text-xs text-slate-500">Choose your desired intermediate program and study group</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Select Program</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleProgramChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {Object.keys(programsConfig).map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Study Group / Sub-Category</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {programsConfig[formData.program]?.subCategories.map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Shift</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening / Self Finance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                <p className="text-xs text-slate-500">Provide your official identification and contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Student Name (As per Matric)</label>
                <input
                  type="text"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Father Name</label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="e.g. Ahmed Khan"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">CNIC / B-Form Number</label>
                <input
                  type="text"
                  name="cnicOrBForm"
                  required
                  value={formData.cnicOrBForm}
                  onChange={handleChange}
                  placeholder="12101-1234567-1"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Father CNIC</label>
                <input
                  type="text"
                  name="fatherCnic"
                  required
                  value={formData.fatherCnic}
                  onChange={handleChange}
                  placeholder="12101-1234567-1"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Mobile Phone</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Domicile</label>
                <input
                  type="text"
                  name="domicile"
                  required
                  value={formData.domicile}
                  onChange={handleChange}
                  placeholder="e.g. D.I. Khan"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Postal / Residential Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House No, Street, Area, City"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Records */}
          <div className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Academic Record (Matriculation)</h3>
                <p className="text-xs text-slate-500">Enter your 10th grade examination details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Obtained Marks</label>
                <input
                  type="number"
                  name="matricMarks"
                  required
                  value={formData.matricMarks}
                  onChange={handleChange}
                  placeholder="e.g. 850"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Total Marks</label>
                <input
                  type="number"
                  name="matricTotal"
                  required
                  value={formData.matricTotal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Passing Year</label>
                <input
                  type="text"
                  name="matricYear"
                  required
                  value={formData.matricYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Board</label>
                <input
                  type="text"
                  name="matricBoard"
                  required
                  value={formData.matricBoard}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Required Documents Upload</h3>
                <p className="text-xs text-slate-500">Upload clean passport size photo and document copies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Applicant Passport Size Photo</label>
                <input
                  type="file"
                  name="applicantPhoto"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 dark:file:bg-slate-800 dark:file:text-teal-300 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Matric DMC / Certificate</label>
                <input
                  type="file"
                  name="matricDmcDoc"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 dark:file:bg-slate-800 dark:file:text-teal-300 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Student CNIC / B-Form Copy</label>
                <input
                  type="file"
                  name="studentCnicDoc"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 dark:file:bg-slate-800 dark:file:text-teal-300 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Father CNIC Copy</label>
                <input
                  type="file"
                  name="fatherCnicDoc"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 dark:file:bg-slate-800 dark:file:text-teal-300 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Submit Admission Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}
