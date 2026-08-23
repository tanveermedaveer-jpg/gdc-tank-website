import { useState } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, FileText, User, GraduationCap, Clipboard } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';

export default function ApplyNow() {
  const { t } = useLanguage();
  const isUrdu = t('home') === '\u06c1\u0648\u0645';

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
    program: 'pre-medical',
    matricBoard: '',
    matricRollNo: '',
    matricPassingYear: '',
    matricObtainedMarks: '',
    matricTotalMarks: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `CASDCT-2026-${randomNum}`;
      
      const storedAdmissions = localStorage.getItem('casdct_admissions');
      const currentAdmissions = storedAdmissions ? JSON.parse(storedAdmissions) : [];
      const updatedAdmissions = [
        ...currentAdmissions,
        { ...formData, regId: generatedId }
      ];
      localStorage.setItem('casdct_admissions', JSON.stringify(updatedAdmissions));

      setRegId(generatedId);
      setSubmitted(true);
      
      setFormData({
        studentName: '', fatherName: '', dob: '', gender: 'male', cnic: '',
        domicile: '', mobile: '', email: '', address: '', program: 'pre-medical',
        matricBoard: '', matricRollNo: '', matricPassingYear: '',
        matricObtainedMarks: '', matricTotalMarks: ''
      });
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-grow">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-955 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('onlineAdmissionReg')}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {t('academicSession')}
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="bg-white dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {submitted ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-teal-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-650 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-white font-serif">{t('registrationSuccessful')}</h2>
              
              <div className="bg-slate-50 dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-slate-700 dark:text-slate-300">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">{t('yourAdmissionId')}</span>
                <span className="text-xl sm:text-2xl font-extrabold text-teal-805 dark:text-teal-400 tracking-wider block mt-1">{regId}</span>
              </div>
              
              <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto space-y-2.5">
                <p>{t('regDetailsSaved')}</p>
                <p>{t('bringDocuments')}</p>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-955 hover:to-teal-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors"
                >
                  {t('submitAnotherForm')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Online Admission Form */}
              <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-md">
                <div className="flex items-center space-x-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
                  <FileText className="w-6 h-6 text-teal-700" />
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-955 dark:text-slate-100 font-serif">{t('admissionForm')}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* PART 1: PERSONAL INFORMATION */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <User className="w-4 h-4 mr-1.5" />
                      {t('personalDetails')}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('studentName')}</label>
                        <input 
                          type="text" name="studentName" value={formData.studentName} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={t('enterFullName')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('fatherName')}</label>
                        <input 
                          type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={t('enterFatherName')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('dateOfBirth')}</label>
                        <input 
                          type="date" name="dob" value={formData.dob} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-650 dark:text-slate-350"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('gender')}</label>
                        <select 
                          name="gender" value={formData.gender} onChange={handleChange}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-650 dark:text-slate-350"
                        >
                          <option value="male">{t('male')}</option>
                          <option value="female">{t('female')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('domicileDistrict')}</label>
                        <input 
                          type="text" name="domicile" value={formData.domicile} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={t('enterDomicile')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('cnicFormB')}</label>
                        <input 
                          type="text" name="cnic" value={formData.cnic} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={t('enterCnic')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('activeMobile')}</label>
                        <input 
                          type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={t('enterMobile')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('emailAddress')}</label>
                        <input 
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          placeholder={t('enterEmail')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('residentialAddress')}</label>
                        <input 
                          type="text" name="address" value={formData.address} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder={t('enterAddress')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PART 2: ACADEMIC BACKGROUND */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <GraduationCap className="w-4 h-4 mr-1.5" />
                      {t('matricDetails')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('matricBoard')}</label>
                        <input 
                          type="text" name="matricBoard" value={formData.matricBoard} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder={t('enterBoardName')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('matricRollNo')}</label>
                        <input 
                          type="text" name="matricRollNo" value={formData.matricRollNo} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          placeholder={t('enterRollNo')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('passingYear')}</label>
                        <input 
                          type="text" name="matricPassingYear" value={formData.matricPassingYear} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          placeholder={t('enterPassYear')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('obtainedMarks')}</label>
                        <input 
                          type="number" name="matricObtainedMarks" value={formData.matricObtainedMarks} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          placeholder={t('enterObtainedMarks')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('totalMarks')}</label>
                        <input 
                          type="number" name="matricTotalMarks" value={formData.matricTotalMarks} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          placeholder={t('enterTotalMarks')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PART 3: PROGRAM OF CHOICE */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <Clipboard className="w-4 h-4 mr-1.5" />
                      {t('programSelection')}
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('selectProgram')}</label>
                      <select 
                        name="program" value={formData.program} onChange={handleChange}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-650 dark:text-slate-350"
                      >
                        <option value="pre-medical">{t('fscPreMedical')}</option>
                        <option value="pre-engineering">{t('fscPreEngineering')}</option>
                        <option value="ics">{t('icsComputerScience')}</option>
                        <option value="fa">{isUrdu ? '\u0627\u06cc\u0641 \u0627\u06d2 (\u0622\u0631\u0679\u0633 / \u06c1\u06cc\u0648\u0645\u06cc\u0646\u06cc\u0679\u06cc\u0632)' : 'FA (Arts / Humanities)'}</option>
                        <option value="bs-computer-science">{isUrdu ? '\u0628\u06cc \u0627\u06cc \u0633 \u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0633\u0627\u0626\u0646\u0633 (4 \u0633\u0627\u0644)' : 'BS Computer Science (4-Year)'}</option>
                        <option value="bs-english">{isUrdu ? '\u0628\u06cc \u0627\u06cc \u0633 \u0627\u0646\u06af\u0631\u06cc\u0632\u06cc (4 \u0633\u0627\u0644)' : 'BS English (4-Year)'}</option>
                        <option value="bs-chemistry">{isUrdu ? '\u0628\u06cc \u0627\u06cc \u0633 \u06a9\u06cc\u0645\u0633\u0679\u0631\u06cc (4 \u0633\u0627\u0644)' : 'BS Chemistry (4-Year)'}</option>
                        <option value="bs-physics">{isUrdu ? '\u0628\u06cc \u0627\u06cc \u0633 \u0641\u0632\u06a9\u0633 (4 \u0633\u0627\u0644)' : 'BS Physics (4-Year)'}</option>
                        <option value="bs-zoology">{isUrdu ? '\u0628\u06cc \u0627\u06cc \u0633 \u0632\u0648\u0644\u0648\u062c\u06cc (4 \u0633\u0627\u0644)' : 'BS Zoology (4-Year)'}</option>
                        <option value="bs-botany">{isUrdu ? '\u0628\u06cc \u0627\u06cc \u0633 \u0628\u0627\u0679\u0646\u06cc (4 \u0633\u0627\u0644)' : 'BS Botany (4-Year)'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-teal-50 dark:bg-slate-800 border border-teal-150 dark:border-slate-700 p-4 rounded-xl text-teal-900 dark:text-teal-200 text-xs sm:text-sm flex items-start">
                    <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-450 mr-2.5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-teal-950 dark:text-teal-300">{t('declaration')}</span>
                      {t('declarationText')}
                    </div>
                  </div>

                  <div className="text-right">
                    <button 
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-955 hover:to-teal-800 text-white font-bold px-10 py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center text-sm"
                    >
                      {t('submitApplication')}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                </form>
              </div>

              {/* Right Side: Important Instructions */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-950 to-teal-900 border border-teal-850 rounded-2xl p-6 sm:p-8 text-white shadow-md sticky top-24" dir="rtl">
                  <h3 className="text-xl font-bold text-center mb-4 text-emerald-400">ضروری ہدایات</h3>
                  <ul className="space-y-3 text-right text-sm text-slate-100" dir="rtl">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>آن لائن ایڈمیشن فارم مکمل اور درست معلومات کے ساتھ پر کریں۔</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>تمام معلومات (نام، والد کا نام) میٹرک سند کے مطابق انگریزی کے بڑے حروف میں لکھیں۔</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>آن لائن فارم جمع کرنے کے بعد اس کا پرنٹ لے کر ضروری دستاویزات کے ساتھ کالج جمع کروائیں۔</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>غلط یا نامکمل معلومات کی صورت میں درخواست رد کر دی جائے گی۔</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
