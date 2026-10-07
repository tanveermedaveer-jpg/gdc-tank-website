import { useState, useMemo } from 'react';
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
    gender: 'male',
    cnic: '',
    domicile: '',
    mobile: '',
    email: '',
    address: '',
    program: 'BS Computer Science',
    // Matric Details (For Intermediate program applicants)
    matricBoard: '',
    matricRollNo: '',
    matricPassingYear: '',
    matricObtainedMarks: '',
    matricTotalMarks: '',
    // Intermediate / F.Sc Details (For BS program applicants)
    interBoard: '',
    interRollNo: '',
    interPassingYear: '',
    interObtainedMarks: '',
    interTotalMarks: '',
    paymentMethod: 'EasyPaisa',
    trxId: ''
  });

  const [feeSlipFile, setFeeSlipFile] = useState(null);
  const [feeSlipName, setFeeSlipName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedStudent, setSubmittedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Check if selected program is a BS Program
  const isBsProgram = useMemo(() => {
    return formData.program.startsWith('BS');
  }, [formData.program]);

  // Dynamic Merit Percentage Calculation based on active program level
  const calculatedMerit = useMemo(() => {
    if (isBsProgram) {
      const obt = parseFloat(formData.interObtainedMarks);
      const tot = parseFloat(formData.interTotalMarks);
      if (obt > 0 && tot > 0 && obt <= tot) {
        return ((obt / tot) * 100).toFixed(1);
      }
    } else {
      const obt = parseFloat(formData.matricObtainedMarks);
      const tot = parseFloat(formData.matricTotalMarks);
      if (obt > 0 && tot > 0 && obt <= tot) {
        return ((obt / tot) * 100).toFixed(1);
      }
    }
    return null;
  }, [isBsProgram, formData.interObtainedMarks, formData.interTotalMarks, formData.matricObtainedMarks, formData.matricTotalMarks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Fee Slip Upload
  const handleFeeSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024 ||
          !(file.type === 'application/pdf' || file.type.startsWith('image/'))) {
        setSubmitError('Choose an image or PDF receipt no larger than 5 MB.');
        e.target.value = '';
        setFeeSlipName('');
        setFeeSlipFile(null);
        return;
      }
      setSubmitError('');
      setFeeSlipName(file.name);
      setFeeSlipFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const meritValue = calculatedMerit ? parseFloat(calculatedMerit) : 0;

      const marksText = isBsProgram
        ? (formData.interObtainedMarks && formData.interTotalMarks ? `${formData.interObtainedMarks}/${formData.interTotalMarks}` : 'N/A')
        : (formData.matricObtainedMarks && formData.matricTotalMarks ? `${formData.matricObtainedMarks}/${formData.matricTotalMarks}` : 'N/A');

      const newRecord = {
        fullName: formData.studentName,
        studentName: formData.studentName,
        fatherName: formData.fatherName,
        dob: formData.dob,
        gender: formData.gender,
        cnic: formData.cnic,
        domicile: formData.domicile,
        phone: formData.mobile,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        program: formData.program,
        matricBoard: isBsProgram ? '' : formData.matricBoard,
        matricRollNo: isBsProgram ? '' : formData.matricRollNo,
        matricPassingYear: isBsProgram ? '' : formData.matricPassingYear,
        matricMarks: isBsProgram ? 0 : Number(formData.matricObtainedMarks || 0),
        matricTotal: isBsProgram ? 0 : Number(formData.matricTotalMarks || 1100),
        interBoard: isBsProgram ? formData.interBoard : '',
        interRollNo: isBsProgram ? formData.interRollNo : '',
        interPassingYear: isBsProgram ? formData.interPassingYear : '',
        interObtainedMarks: isBsProgram ? formData.interObtainedMarks : '',
        interTotalMarks: isBsProgram ? formData.interTotalMarks : '',
        marksText: marksText,
        meritPct: meritValue,
        paymentMethod: formData.paymentMethod,
        trxId: formData.trxId,
        paymentStatus: formData.trxId ? `Submitted - ${formData.paymentMethod} TRX: ${formData.trxId}` : 'Pending Slip',
        isPaid: false,
        feeSlipName: feeSlipName,
      };

      const savedRecord = feeSlipFile
        ? await publicFileRequest('public.submitAdmission', { record: newRecord }, feeSlipFile, 'receipt_file')
        : await publicRequest('public.submitAdmission', { record: newRecord });
      window.dispatchEvent(new Event('casdct_admission_submitted'));

      setSubmittedStudent(savedRecord);
      setSubmitted(true);

      // Reset form
      setFormData({
        studentName: '', fatherName: '', dob: '', gender: 'male', cnic: '',
        domicile: '', mobile: '', email: '', address: '', program: 'BS Computer Science',
        matricBoard: '', matricRollNo: '', matricPassingYear: '',
        matricObtainedMarks: '', matricTotalMarks: '',
        interBoard: '', interRollNo: '', interPassingYear: '',
        interObtainedMarks: '', interTotalMarks: '',
        paymentMethod: 'EasyPaisa', trxId: ''
      });
      setFeeSlipFile(null);
      setFeeSlipName('');
    } catch (error) {
      console.error('Unable to submit the shared admission application:', error);
      setSubmitError(error.message || 'Your application could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Banner Header */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-955 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
            {t('onlineAdmissionReg')}
          </h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {t('academicSession')} • 2026-2027
          </p>
        </div>
      </section>

      {/* Form Content Body */}
      <section className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {submitted && submittedStudent ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
                {t('registrationSuccessful')}
              </h2>
              
              <div className="bg-teal-50/70 dark:bg-slate-800/80 border border-teal-200/80 dark:border-slate-700 rounded-2xl p-6 text-slate-700 dark:text-slate-200 space-y-3">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
                    {t('yourAdmissionId')} (Student ID)
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-teal-800 dark:text-teal-400 tracking-wider block mt-1">
                    {submittedStudent.regId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-teal-200/50 dark:border-slate-700 text-xs sm:text-sm font-semibold">
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase">Program</span>
                    <span className="text-slate-900 dark:text-white font-bold">{submittedStudent.program}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase">Merit Score</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{submittedStudent.meritPct}%</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-amber-300 dark:border-amber-800">
                    <AlertCircle className="w-4 h-4" /> Verification Status: Pending Admin Approval
                  </span>
                </div>
              </div>
              
              <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto space-y-2">
                <p>Your application has been registered successfully and transmitted to the <strong>GDC Tank Admission Desk</strong>.</p>
                <p className="text-slate-500">Please bring your original academic certificates, CNIC/Form-B, and fee deposit receipt to the college admission desk.</p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors text-sm"
                >
                  {t('submitAnotherForm')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Clean Dynamic Admission Form */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
                
                {/* Form Header */}
                <div className="flex items-center space-x-3 pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
                      {t('admissionForm')}
                    </h2>
                    <p className="text-xs text-slate-500">Government Degree College Tank Admission Desk</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {submitError && (
                    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                      {submitError}
                    </p>
                  )}
                  
                  {/* STEP 1: PROGRAM SELECTION */}
                  <div className="space-y-5 bg-teal-50/40 dark:bg-slate-850 p-6 rounded-2xl border border-teal-100/70 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-teal-100 dark:border-slate-800 pb-2">
                      <Clipboard className="w-4 h-4 mr-2" />
                      Step 1: {t('programSelection')}
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        {t('selectProgram')} *
                      </label>
                      <select 
                        name="program" value={formData.program} onChange={handleChange}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white cursor-pointer shadow-sm"
                      >
                        <optgroup label="Undergraduate (BS Programs)">
                          <option value="BS Computer Science">BS Computer Science (4-Year)</option>
                          <option value="BS Physics">BS Physics (4-Year)</option>
                          <option value="BS Chemistry">BS Chemistry (4-Year)</option>
                          <option value="BS English">BS English (4-Year)</option>
                          <option value="BS Mathematics">BS Mathematics (4-Year)</option>
                        </optgroup>
                        <optgroup label="Intermediate (HSSC Programs)">
                          <option value="FSC Pre-Medical">FSC Pre-Medical (HSSC)</option>
                          <option value="FSC Pre-Engineering">FSC Pre-Engineering (HSSC)</option>
                          <option value="ICS (Computer Science)">ICS Computer Science (HSSC)</option>
                          <option value="FA (Arts & Humanities)">FA Arts & Humanities (HSSC)</option>
                        </optgroup>
                      </select>
                      
                      <div className="mt-2 text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Academic section dynamically switches between {isBsProgram ? 'Intermediate Details (for BS Program)' : 'Matriculation Details (for Intermediate Program)'}.</span>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: PERSONAL INFORMATION */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <User className="w-4 h-4 mr-2" />
                      Step 2: {t('personalDetails')}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('studentName')} *
                        </label>
                        <input 
                          type="text" name="studentName" value={formData.studentName} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('fatherName')} *
                        </label>
                        <input 
                          type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter father's name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('dateOfBirth')} *
                        </label>
                        <input 
                          type="date" name="dob" value={formData.dob} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('gender')} *
                        </label>
                        <select 
                          name="gender" value={formData.gender} onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                        >
                          <option value="male">{t('male')}</option>
                          <option value="female">{t('female')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('domicileDistrict')} *
                        </label>
                        <input 
                          type="text" name="domicile" value={formData.domicile} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter your domicile district"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('cnicFormB')} *
                        </label>
                        <input 
                          type="text" name="cnic" value={formData.cnic} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter CNIC or Form-B number"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('activeMobile')} *
                        </label>
                        <input 
                          type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter active mobile number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('emailAddress')}
                        </label>
                        <input 
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('residentialAddress')} *
                        </label>
                        <input 
                          type="text" name="address" value={formData.address} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter complete residential address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: CONDITIONAL ACADEMIC BACKGROUND & MERIT CALCULATION */}
                  <div className="space-y-6">
                    
                    {/* Header with Calculated Merit Indicator */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Step 3: {isBsProgram ? 'Intermediate Academic Details' : 'Matriculation Academic Details'}
                      </h3>
                      {calculatedMerit && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <span>Calculated Merit:</span>
                          <span className="text-sm font-extrabold">{calculatedMerit}%</span>
                        </div>
                      )}
                    </div>

                    {/* CONDITION A: Intermediate Program Selected -> Show ONLY Matriculation (SSC) Academic Details */}
                    {!isBsProgram && (
                      <div className="space-y-4 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/70 dark:border-slate-700 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            Matriculation (SSC) Academic Details
                          </h4>
                          <span className="text-[10px] font-bold bg-teal-700 text-white px-2.5 py-0.5 rounded-md uppercase">
                            Required for {formData.program}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Matric Board *
                            </label>
                            <input 
                              type="text" name="matricBoard" value={formData.matricBoard} onChange={handleChange} required={!isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                              placeholder="Enter board name (e.g. BISE D.I. Khan)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Matric Roll No *
                            </label>
                            <input 
                              type="text" name="matricRollNo" value={formData.matricRollNo} onChange={handleChange} required={!isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                              placeholder="Enter roll number"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Passing Year *
                            </label>
                            <input 
                              type="text" name="matricPassingYear" value={formData.matricPassingYear} onChange={handleChange} required={!isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                              placeholder="Enter passing year (e.g. 2026)"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Matric Obtained Marks *
                            </label>
                            <input 
                              type="number" name="matricObtainedMarks" value={formData.matricObtainedMarks} onChange={handleChange} required={!isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white"
                              placeholder="Enter obtained marks"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Matric Total Marks *
                            </label>
                            <input 
                              type="number" name="matricTotalMarks" value={formData.matricTotalMarks} onChange={handleChange} required={!isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white"
                              placeholder="Enter total marks"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONDITION B: BS Program Selected -> Show ONLY Intermediate (F.Sc / HSSC) Academic Details */}
                    {isBsProgram && (
                      <div className="space-y-4 bg-teal-50/50 dark:bg-slate-800/60 p-5 rounded-2xl border border-teal-200/60 dark:border-slate-700 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Intermediate (F.Sc / HSSC) Academic Details
                          </h4>
                          <span className="text-[10px] font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-md uppercase">
                            Required for {formData.program}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Intermediate Board *
                            </label>
                            <input 
                              type="text" name="interBoard" value={formData.interBoard} onChange={handleChange} required={isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                              placeholder="Enter board name (e.g. BISE D.I. Khan)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Inter Roll No *
                            </label>
                            <input 
                              type="text" name="interRollNo" value={formData.interRollNo} onChange={handleChange} required={isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                              placeholder="Enter roll number"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Passing Year *
                            </label>
                            <input 
                              type="text" name="interPassingYear" value={formData.interPassingYear} onChange={handleChange} required={isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                              placeholder="Enter passing year (e.g. 2026)"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Inter Obtained Marks *
                            </label>
                            <input 
                              type="number" name="interObtainedMarks" value={formData.interObtainedMarks} onChange={handleChange} required={isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white"
                              placeholder="Enter obtained marks"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                              Inter Total Marks *
                            </label>
                            <input 
                              type="number" name="interTotalMarks" value={formData.interTotalMarks} onChange={handleChange} required={isBsProgram}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white"
                              placeholder="Enter total marks"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 4: FEE PAYMENT & SUBMISSION */}
                  <div className="space-y-5 pt-4">
                    <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Step 4: Application Fee & Submission
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Payment Method *
                        </label>
                        <select 
                          name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                        >
                          <option value="EasyPaisa">EasyPaisa</option>
                          <option value="JazzCash">JazzCash</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cash at College">Cash at College Counter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Transaction ID / Reference Number *
                        </label>
                        <input 
                          type="text" name="trxId" value={formData.trxId} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="Enter TrxID or receipt number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Upload Fee Slip / Receipt (Image or PDF, max 5MB)
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex-grow flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-800/50 transition-colors">
                          <Upload className="w-5 h-5 text-slate-400 mr-2" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {feeSlipName ? feeSlipName : 'Choose fee slip file...'}
                          </span>
                          <input type="file" accept="image/*,application/pdf" onChange={handleFeeSlipUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" disabled={isSubmitting}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 text-base"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Admission Application</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side: Instructions & Contact Info Sidebar */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center">
                    <ShieldCheck className="w-5 h-5 text-teal-600 mr-2" />
                    Admission Guidelines
                  </h3>

                  <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-400 flex-shrink-0 flex items-center justify-center font-bold text-xs">1</span>
                      <span>Ensure all personal and academic records match your original board documents.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-400 flex-shrink-0 flex items-center justify-center font-bold text-xs">2</span>
                      <span>Merit is calculated automatically based on your entered marks and total marks.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-400 flex-shrink-0 flex items-center justify-center font-bold text-xs">3</span>
                      <span>Keep your generated Student ID secure for future merit list checks and status updates.</span>
                    </li>
                  </ul>

                  <div className="bg-teal-50/70 dark:bg-slate-800/80 rounded-2xl p-5 border border-teal-100 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider">Need Help?</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Contact college administration desk or call us at:</p>
                    <p className="text-sm font-extrabold text-teal-800 dark:text-teal-400">{COLLEGE_PHONE}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
