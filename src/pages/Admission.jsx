import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ShieldCheck, CheckCircle2, DollarSign, FileText, Award, Search, Trophy } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';

export default function Admission() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const [admissions, setAdmissions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Load admissions from localStorage on mount and sort by merit descending
  useEffect(() => {
    const loadMeritList = () => {
      const stored = localStorage.getItem('casdct_admissions');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Sort by Merit % descending
            const sorted = [...parsed].sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0));
            setAdmissions(sorted);
          }
        } catch (e) {}
      }
    };
    loadMeritList();
    window.addEventListener('casdct_admission_submitted', loadMeritList);
    return () => window.removeEventListener('casdct_admission_submitted', loadMeritList);
  }, []);

  // Filtered public merit list sorted descending by merit percentage
  const publicMeritList = useMemo(() => {
    return admissions.filter(st => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = st.fullName.toLowerCase().includes(query) || 
                           st.regId.toLowerCase().includes(query) || 
                           st.program.toLowerCase().includes(query);
      if (!matchesQuery) return false;
      if (selectedProgram === 'All') return true;
      return st.program.toLowerCase().includes(selectedProgram.toLowerCase());
    }).sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0));
  }, [admissions, searchQuery, selectedProgram]);

  const steps = [
    { 
      num: '01', 
      title: isUrdu ? 'آن لائن رجسٹریشن' : 'Online Registration', 
      desc: isUrdu 
        ? 'ہمارے آن لائن ایڈمیشن پورٹل پر ایک اکاؤنٹ بنائیں، ذاتی تفصیلات درج کریں، اور اپنا مطلوبہ پروگرام منتخب کریں۔' 
        : 'Create an account on our Online Admission Portal, fill in the personal details, and select your desired program.' 
    },
    { 
      num: '02', 
      title: isUrdu ? 'دستاویزات جمع کروانا' : 'Submit Documents', 
      desc: isUrdu 
        ? 'مطلوبہ دستاویزات (میٹرک رزلٹ کارڈ، کریکٹر سرٹیفکیٹ، ڈومیسائل، تصاویر) کی سکین شدہ کاپیاں اپ لوڈ کریں۔' 
        : 'Upload scanned copies of required documents (Matric result card, character certificate, domicile, photos).' 
    },
    { 
      num: '03', 
      title: isUrdu ? 'میرٹ لسٹ کا اجراء' : 'Merit List Generation', 
      desc: isUrdu 
        ? 'اپنے میٹرک/انٹرمیڈیٹ نمبروں کی بنیاد پر کالج کی طرف سے متعلقہ شعبے کی میرٹ لسٹوں کے جاری ہونے کا انتظار کریں۔' 
        : 'Wait for the college to release the department merit lists based on your Matric/Intermediate scores.' 
    },
    { 
      num: '04', 
      title: isUrdu ? 'انٹرویو اور فیس کی ادائیگی' : 'Interview & Fee Payment', 
      desc: isUrdu 
        ? 'اصل دستاویزات کے ساتھ مختصر انٹرویو کے لیے حاضر ہوں اور مقررہ معمولی سرکاری داخلہ فیس جمع کروائیں۔' 
        : 'Appear for a brief interview with original documents and deposit the nominal government admission fee.' 
    }
  ];

  const documents = isUrdu ? [
    'میٹرک / ایس ایس سی سرٹیفکیٹ (مارک شیٹ)',
    'انٹرمیڈیٹ / ایچ ایس ایس سی مارک شیٹ (بی ایس کے امیدواروں کے لیے)',
    'پچھلے تعلیمی ادارے کا جاری کردہ کریکٹر سرٹیفکیٹ',
    'خیبر پختونخوا کا ڈومیسائل سرٹیفکیٹ (ٹانک کو ترجیح)',
    'امیدوار کا کمپیوٹرائزڈ شناختی کارڈ (CNIC) یا فارم-B کاپی',
    'والد / سرپرست کے شناختی کارڈ کی کاپی',
    'پاسپورٹ سائز کی 4 تصاویر (نیلے بیک گراؤنڈ کے ساتھ)'
  ] : [
    'Matric / SSC Certificate (Mark Sheet)',
    'Intermediate / HSSC Mark Sheet (for BS Applicants)',
    'Character Certificate from school last attended',
    'Domicile Certificate of KP (Tank priority)',
    'CNIC or Form-B copy of the applicant',
    'Father / Guardian CNIC copy',
    '4 Passport-size photographs (Blue background)'
  ];

  return (
    <div className="flex-grow">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
            {isUrdu ? 'داخلہ 2026-27' : 'Admissions 2026-27'}
          </h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {isUrdu ? 'ٹانک شہر کے سب سے معتبر تعلیمی ادارے کا حصہ بنیں' : 'Join the Premier Educational Institution in Tank City'}
          </p>
        </div>
      </section>

      {/* Intro and Guidelines */}
      <section className="bg-white dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-blue-950 dark:text-white font-serif mb-4">
                  {isUrdu ? 'داخلہ کے رہنما اصول' : 'Admission Guidelines'}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {isUrdu 
                    ? 'گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج، ٹانک میں داخلے خالصتاً میرٹ کی بنیاد پر ہائر ایجوکیشن ڈیپارٹمنٹ (HED)، حکومتِ خیبر پختونخوا کی جاری کردہ پالیسی کے مطابق ہوتے ہیں۔'
                    : 'Admissions to Captain. Ashfaq Shaheed Degree College, Tank are strictly based on merit, conforming to the policy rules issued by the Higher Education Department (HED), Government of Khyber Pakhtunkhwa.'}
                </p>
              </div>

              {/* Timeline Info */}
              <div className="bg-teal-50 dark:bg-slate-900 border border-teal-150 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-teal-950 dark:text-teal-300 font-serif mb-3 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400 mr-2" />
                  {isUrdu ? 'داخلہ کا اہم شیڈول (خریف 2026)' : 'Key Admission Schedule (Fall 2026)'}
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300 mt-4">
                  <li className="flex justify-between border-b border-teal-100 dark:border-slate-800 pb-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{isUrdu ? 'آن لائن رجسٹریشن کا آغاز:' : 'Online Registrations Start:'}</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{isUrdu ? '20 اگست، 2026' : 'August 20, 2026'}</span>
                  </li>
                  <li className="flex justify-between border-b border-teal-100 dark:border-slate-800 pb-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{isUrdu ? 'آن لائن درخواست جمع کرانے کی آخری تاریخ:' : 'Last Date to Submit Online Application:'}</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{isUrdu ? '10 ستمبر، 2026' : 'September 10, 2026'}</span>
                  </li>
                  <li className="flex justify-between border-b border-teal-100 dark:border-slate-800 pb-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{isUrdu ? 'پہلی میرٹ لسٹ کا اجراء:' : 'First Merit List Display:'}</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{isUrdu ? '14 ستمبر، 2026' : 'September 14, 2026'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{isUrdu ? 'کلاسز کا باقاعدہ آغاز:' : 'Commencement of Classes:'}</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{isUrdu ? '20 ستمبر، 2026' : 'September 20, 2026'}</span>
                  </li>
                </ul>
              </div>

              {/* Steps grid */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-serif mb-6 flex items-center">
                  <ClipboardList className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                  {isUrdu ? 'رجسٹریشن کا مرحلہ وار طریقہ کار' : 'Step-by-Step Registration Process'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-teal-750 dark:text-teal-400 font-extrabold text-lg mb-2">{step.num}. {step.title}</div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Required Documents & Fees */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Documents Checklist */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-blue-950 dark:text-white font-serif border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                  {isUrdu ? 'مطلوبہ دستاویزات' : 'Required Documents'}
                </h3>
                <ul className="space-y-3.5 mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fees Structure */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-blue-950 dark:text-white font-serif border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center">
                  <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-1.5" />
                  {isUrdu ? 'فیس کا ڈھانچہ' : 'Fee Structure'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {isUrdu 
                    ? 'ایک سرکاری ادارہ ہونے کے ناطے، ہم انتہائی سبسڈی والی، برائے نام فیس وصول کرتے ہیں۔'
                    : 'As a government institution, we offer highly subsidized, nominal education fees.'}
                </p>
                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{isUrdu ? 'انٹرمیڈیٹ (F.Sc/ICS/FA)' : 'Intermediate (F.Sc/ICS/FA)'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{isUrdu ? 'سالانہ ~3,500 روپے' : 'PKR ~3,500 / Year'}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-650 dark:text-slate-400 font-medium">{isUrdu ? 'بی ایس پروگرام (فی سمسٹر)' : 'BS Programs (Per Semester)'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{isUrdu ? 'فی سمسٹر ~8,000 روپے' : 'PKR ~8,000 / Sem'}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
                  <Link 
                    to="/apply" 
                    className="w-full block text-center bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-sm"
                  >
                    {isUrdu ? 'آن لائن درخواست کا آغاز' : 'Start Online Application'}
                  </Link>
                </div>
              </div>

            </div>

          </div>

          {/* PUBLIC LIVE MERIT RANKING LIST (Automatically Sorted Descending by Merit Score) */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                    {isUrdu ? 'لائیو میرٹ پاکستان رینکنگ لسٹ 2026' : 'Live Merit Ranking List (Fall 2026)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isUrdu ? 'خالصتاً میرٹ نمبرات کی ترجیحی ترتیب میں لائیو درجہ بندی' : 'Candidates ranked in automatic descending order based on Merit Score'}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate name or ID..."
                    className="bg-white dark:bg-slate-800 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="bg-white dark:bg-slate-800 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="All">All Programs</option>
                  <option value="BS">BS Programs</option>
                  <option value="FSc">FSc / Intermediate</option>
                  <option value="Matric">Matric / SSC</option>
                </select>
              </div>
            </div>

            {/* Merit List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                    <th className="py-3 px-4">Merit Rank</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Applicant Name</th>
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Marks Obtained</th>
                    <th className="py-3 px-4">Merit Score %</th>
                    <th className="py-3 px-4">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {publicMeritList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No registered candidates found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    publicMeritList.map((st, index) => (
                      <tr key={st.regId} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${index === 0 ? 'bg-amber-400 text-slate-950 font-bold shadow' : index === 1 ? 'bg-slate-300 text-slate-900 font-bold' : index === 2 ? 'bg-amber-700 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-teal-700 dark:text-teal-400">{st.regId}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{st.fullName}</td>
                        <td className="py-3.5 px-4">{st.program}</td>
                        <td className="py-3.5 px-4">{st.marksText || `${st.matricMarks}/${st.matricTotal}`}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {st.meritPct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${st.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {st.status === 'approved' ? 'Approved' : 'Pending Verification'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
