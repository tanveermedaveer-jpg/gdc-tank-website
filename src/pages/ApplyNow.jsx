import { useState, useMemo } from 'react';
import { 
  ShieldCheck, CheckCircle2, ChevronRight, FileText, User, 
  GraduationCap, Clipboard, CreditCard, Upload, AlertCircle, FileCheck, Layers
} from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';

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
    // Intermediate / F.Sc Details (Primary Academic Section)
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

  // Dynamic Merit Percentage Calculation based on Intermediate Marks
  const calculatedMerit = useMemo(() => {
    const obt = parseFloat(formData.interObtainedMarks);
    const tot = parseFloat(formData.interTotalMarks);
    if (obt > 0 && tot > 0 && obt <= tot) {
      return ((obt / tot) * 100).toFixed(1);
    }
    return null;
  }, [formData.interObtainedMarks, formData.interTotalMarks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Fee Slip Upload
  const handleFeeSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeeSlipName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeeSlipFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Auto-generate Unique Student ID in STU-10255 format
      const randomNum = Math.floor(10200 + Math.random() * 800);
      const generatedId = `STU-${randomNum}`;
      const meritValue = calculatedMerit ? parseFloat(calculatedMerit) : 0;

      const marksText = formData.interObtainedMarks && formData.interTotalMarks 
        ? `${formData.interObtainedMarks}/${formData.interTotalMarks}` 
        : 'N/A';

      const newRecord = {
        regId: generatedId,
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
        interBoard: formData.interBoard,
        interRollNo: formData.interRollNo,
        interPassingYear: formData.interPassingYear,
        interObtainedMarks: formData.interObtainedMarks,
        interTotalMarks: formData.interTotalMarks,
        marksText: marksText,
        meritPct: meritValue,
        paymentMethod: formData.paymentMethod,
        trxId: formData.trxId,
        paymentStatus: formData.trxId ? `Paid - ${formData.paymentMethod} TRX: ${formData.trxId}` : 'Pending Slip',
        isPaid: Boolean(formData.trxId),
        feeSlipName: feeSlipName,
        feeSlipData: feeSlipFile,
        status: 'pending',
        appliedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      // Save to localStorage admissions collection (Maintains descending merit ranking)
      const storedAdmissions = localStorage.getItem('casdct_admissions');
      let admissionsArray = [];
      if (storedAdmissions) {
        try {
          admissionsArray = JSON.parse(storedAdmissions);
        } catch (err) {
          admissionsArray = [];
        }
      }
      
      const updatedAdmissions = [...admissionsArray, newRecord].sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0));
      localStorage.setItem('casdct_admissions', JSON.stringify(updatedAdmissions));

      // Trigger custom window event for real-time sync with Admin Dashboard & Public Merit List
      window.dispatchEvent(new Event('casdct_admission_submitted'));

      setSubmittedStudent(newRecord);
      setSubmitted(true);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        studentName: '', fatherName: '', dob: '', gender: 'male', cnic: '',
        domicile: '', mobile: '', email: '', address: '', program: 'BS Computer Science',
        interBoard: '', interRollNo: '', interPassingYear: '',
        interObtainedMarks: '', interTotalMarks: '',
        paymentMethod: 'EasyPaisa', trxId: ''
      });
      setFeeSlipFile(null);
      setFeeSlipName('');
    }, 600);
  };

  return (
    <div className="flex-grow">
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
            {t('academicSession')} • Fall 2026
          </p>
        </div>
      </section>

      {/* Form Content Body */}
      <section className="bg-slate-50 dark:bg-slate-950 py-12">
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
              
              {/* Left Side: Admission Form */}
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
                        <option value="BS Computer Science">BS Computer Science (4-Year)</option>
                        <option value="BS Physics">BS Physics (4-Year)</option>
                        <option value="BS Chemistry">BS Chemistry (4-Year)</option>
                        <option value="BS English">BS English (4-Year)</option>
                        <option value="BS Mathematics">BS Mathematics (4-Year)</option>
                        <option value="FSC Pre-Medical">FSC Pre-Medical (HSSC)</option>
                        <option value="FSC Pre-Engineering">FSC Pre-Engineering (HSSC)</option>
                        <option value="ICS (Computer Science)">ICS Computer Science (HSSC)</option>
                        <option value="FA (Arts & Humanities)">FA Arts & Humanities (HSSC)</option>
                      </select>
                      
                      <div className="mt-2 text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Showing Intermediate to BS program offerings for Government Degree College Tank.</span>
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
                          placeholder="e.g. Muhammad Ali"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('fatherName')} *
                        </label>
                        <input 
                          type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="e.g. Ahmad Khan"
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
                          placeholder="e.g. Tank"
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
                          placeholder="e.g. 12201-1234567-1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('activeMobile')} *
                        </label>
                        <input 
                          type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="e.g. 0300-1234567"
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
                          placeholder="e.g. student@gmail.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {t('residentialAddress')} *
                        </label>
                        <input 
                          type="text" name="address" value={formData.address} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                          placeholder="e.g. Main Street, Tank City"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: INTERMEDIATE (F.Sc / HSSC) ACADEMIC DETAILS SECTION */}
                  <div className="space-y-6">
                    
                    {/* Header with Calculated Merit Indicator */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Step 3: Intermediate Academic Details & Merit Score
                      </h3>
                      {calculatedMerit && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <span>Calculated Merit:</span>
                          <span className="text-sm font-extrabold">{calculatedMerit}%</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 bg-teal-50/50 dark:bg-slate-800/60 p-5 rounded-2xl border border-teal-200/60 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Intermediate (F.Sc / HSSC) Academic Details
                        </h4>
                        <span className="text-[10px] font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-md uppercase">
                          Mandatory Academic Record
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Intermediate Board *
                          </label>
                          <input 
                            type="text" name="interBoard" value={formData.interBoard} onChange={handleChange} required
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                            placeholder="e.g. BISE Bannu / D.I. Khan"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Inter Roll No *
                          </label>
                          <input 
                            type="text" name="interRollNo" value={formData.interRollNo} onChange={handleChange} required
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                            placeholder="e.g. 784102"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Passing Year *
                          </label>
                          <input 
                            type="text" name="interPassingYear" value={formData.interPassingYear} onChange={handleChange} required
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                            placeholder="e.g. 2026"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Intermediate Obtained Marks *
                          </label>
                          <input 
                            type="number" name="interObtainedMarks" value={formData.interObtainedMarks} onChange={handleChange} required
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white"
                            placeholder="e.g. 920"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Intermediate Total Marks *
                          </label>
                          <input 
                            type="number" name="interTotalMarks" value={formData.interTotalMarks} onChange={handleChange} required
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900 dark:text-white"
                            placeholder="e.g. 1100"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* STEP 4: PAYMENT DETAILS SECTION */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Step 4: Fee Payment & Proof Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Payment Method */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Payment Method *
                        </label>
                        <select 
                          name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white cursor-pointer"
                        >
                          <option value="EasyPaisa">EasyPaisa Mobile Account</option>
                          <option value="JazzCash">JazzCash Mobile Account</option>
                          <option value="Bank Transfer">Bank Transfer (NBP / Bank of KP)</option>
                        </select>
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Transaction ID (TRX ID) / Receipt No *
                        </label>
                        <input 
                          type="text" name="trxId" value={formData.trxId} onChange={handleChange} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                          placeholder="e.g. 98273641 or Bank Slip No"
                        />
                      </div>
                    </div>

                    {/* Fee Slip File Upload */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Fee Slip / Payment Proof Upload
                      </label>
                      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl p-4 transition-colors text-center bg-slate-50/50 dark:bg-slate-850">
                        <input 
                          type="file" 
                          accept="image/*,.pdf" 
                          onChange={handleFeeSlipUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-600 flex items-center justify-center">
                            {feeSlipName ? <FileCheck className="w-5 h-5 text-emerald-600" /> : <Upload className="w-5 h-5" />}
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                              {feeSlipName || 'Click or drag fee slip image / receipt'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {feeSlipName ? 'Proof attached successfully' : 'Supports JPG, PNG, PDF (Max 5MB)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Declaration & Submission */}
                  <div className="bg-teal-50/60 dark:bg-slate-800/60 border border-teal-200/60 dark:border-slate-700 p-4.5 rounded-2xl text-teal-900 dark:text-teal-200 text-xs sm:text-sm flex items-start">
                    <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-teal-950 dark:text-teal-300">{t('declaration')}</span>
                      {t('declarationText')}
                    </div>
                  </div>

                  <div className="text-right">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white font-bold px-10 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center text-sm uppercase tracking-wider"
                    >
                      {isSubmitting ? 'Registering Application...' : t('submitApplication')}
                      <ChevronRight className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>

                </form>
              </div>

              {/* Right Side: Instructions Card */}
              <div className="lg:col-span-1">
                <div className="bg-[#052836] border border-[#0d3b4e] rounded-3xl p-6 sm:p-8 text-white shadow-xl sticky top-24 space-y-6">
                  <div className="text-center pb-4 border-b border-[#0d3e52]">
                    <h3 className="text-lg font-bold text-emerald-400 font-serif">ضروری ہدایات برائے داخلہ</h3>
                    <p className="text-xs text-slate-300 mt-1">Government Degree College Tank Guidelines</p>
                  </div>

                  <ul className="space-y-4 text-right text-xs sm:text-sm text-slate-200 leading-relaxed" dir="rtl">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      <span>آن لائن ایڈمیشن فارم میں تمام معلوماتی خانے درست اور تعلیمی اسناد کے مطابق پر کریں۔</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      <span>بی ایس اور انٹرمیڈیٹ پروگرامز کے لیے انٹرمیڈیٹ تعلیمی ریکارڈ اور حاصل کردہ نمبرات درج کرنا لازمی ہے۔</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      <span>ایزی پیسہ، جاز کیش یا بینک چالان کے ذریعے فیس جمع کروا کر ٹرانزیکشن (TRX ID) درج کریں۔</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-[#0d3e52] text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Help Desk:</span>
                      <span className="font-semibold text-teal-300">+92 (0963) 510111</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-semibold text-teal-300">admissions@casdct.edu.pk</span>
                    </div>
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
