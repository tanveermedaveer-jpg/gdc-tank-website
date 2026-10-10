import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ShieldCheck, CheckCircle2, DollarSign, FileText, Award, Search, Trophy } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';
import { subscribeMeritList } from '../lib/adminApi';

export default function Admission() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const [admissions, setAdmissions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMeritListLive, setIsMeritListLive] = useState(false);
  const [isLoadingMerit, setIsLoadingMerit] = useState(true);
  const [meritError, setMeritError] = useState('');

  useEffect(() => {
    return subscribeMeritList((result) => {
      setIsMeritListLive(result?.published || false);
      const rawList = Array.isArray(result?.admissions) ? result.admissions : [];
      
      // Safely map and format admissions data to avoid undefined errors
      const formattedList = rawList.map(st => {
        if (Array.isArray(st)) {
          return {
            regId: st[0] || 'N/A',
            fullName: st[1] || 'Unknown',
            program: st[10] || 'BS',
            marksText: st[21] || '',
            meritPct: st[22] || '0',
            status: st[28] || 'pending'
          };
        }
        return {
          regId: st.regId || st.student_id || 'N/A',
          fullName: st.fullName || st.name || 'Unknown',
          program: st.program || 'BS',
          marksText: st.marksText || '',
          meritPct: st.meritPct || st.merit || '0',
          status: st.status || 'pending'
        };
      });

      setAdmissions(formattedList.sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0)));
      setMeritError('');
      setIsLoadingMerit(false);
    }, (error) => {
      console.error('Unable to load merit list:', error);
      setAdmissions([]);
      setIsMeritListLive(false);
      setMeritError('The merit list could not be loaded. Please try again later.');
      setIsLoadingMerit(false);
    });
  }, []);

  const publicMeritList = useMemo(() => {
    return admissions.filter(st => {
      const query = (searchQuery || '').toLowerCase().trim();
      const nameStr = String(st.fullName || '').toLowerCase();
      const idStr = String(st.regId || '').toLowerCase();
      const progStr = String(st.program || '').toLowerCase();

      const matchesQuery = nameStr.includes(query) || idStr.includes(query) || progStr.includes(query);
      if (!matchesQuery) return false;
      if (selectedProgram === 'All') return true;
      return progStr.includes(selectedProgram.toLowerCase());
    }).sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0));
  }, [admissions, searchQuery, selectedProgram]);

  const steps = [
    { 
      num: '01', 
      title: isUrdu ? 'آن لائن رجسٹریشن' : 'Online Registration', 
      desc: isUrdu ? 'ہمارے آن لائن ایڈمیشن پورٹل پر ایک اکاؤنٹ بنائیں، ذاتی تفصیلات درج کریں، اور اپنا مطلوبہ پروگرام منتخب کریں۔' : 'Create an account on our Online Admission Portal, fill in the personal details, and select your desired program.' 
    },
    { 
      num: '02', 
      title: isUrdu ? 'دستاویزات جمع کروانا' : 'Submit Documents', 
      desc: isUrdu ? 'مطلوبہ دستاویزات کی سکین شدہ کاپیاں اپ لوڈ کریں۔' : 'Upload scanned copies of required documents.' 
    },
    { 
      num: '03', 
      title: isUrdu ? 'میرٹ لسٹ کا اجراء' : 'Merit List Generation', 
      desc: isUrdu ? 'میرٹ لسٹوں کے جاری ہونے کا انتظار کریں۔' : 'Wait for the college to release department merit lists.' 
    },
    { 
      num: '04', 
      title: isUrdu ? 'انٹرویو اور فیس کی ادائیگی' : 'Interview & Fee Payment', 
      desc: isUrdu ? 'انٹرویو کے لیے حاضر ہوں اور فیس جمع کروائیں۔' : 'Appear for interview and deposit admission fee.' 
    }
  ];

  const documents = isUrdu ? [
    'میٹرک / ایس ایس سی سرٹیفکیٹ (مارک شیٹ)',
    'انٹرمیڈیٹ / ایچ ایس ایس سی مارک شیٹ',
    'کریکٹر سرٹیفکیٹ',
    'ڈومیسائل سرٹیفکیٹ',
    'شناختی کارڈ یا فارم-B کاپی',
    'پاسپورٹ سائز کی تصاویر'
  ] : [
    'Matric / SSC Certificate',
    'Intermediate / HSSC Mark Sheet',
    'Character Certificate',
    'Domicile Certificate',
    'CNIC or Form-B copy',
    'Passport-size photographs'
  ];

  return (
    <div className="flex flex-col min-h-screen">
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

        {/* Content Section */}
        <section className="bg-white dark:bg-slate-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-blue-950 dark:text-white font-serif mb-4">
                    {isUrdu ? 'داخلہ کے رہنما اصول' : 'Admission Guidelines'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                    {isUrdu 
                      ? 'گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج، ٹانک میں داخلے خالصتاً میرٹ کی بنیاد پر ہوتے ہیں۔'
                      : 'Admissions are strictly based on merit conforming to government policy rules.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                      <div className="text-teal-700 dark:text-teal-400 font-extrabold text-lg mb-2">{step.num}. {step.title}</div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-blue-950 dark:text-white font-serif border-b border-slate-200 dark:border-slate-800 pb-3">
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

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                  <Link 
                    to="/apply" 
                    className="w-full block text-center bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-sm"
                  >
                    {isUrdu ? 'آن لائن درخواست کا آغاز' : 'Start Online Application'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Merit List Section */}
            {meritError ? (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-semibold text-rose-700">{meritError}</p>
            ) : isLoadingMerit ? (
              <p role="status" className="p-4 text-center text-sm text-slate-500">Loading current merit-list status…</p>
            ) : isMeritListLive ? (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                        {isUrdu ? 'لائیو میرٹ رینکنگ لسٹ 2026' : 'Live Merit Ranking List (Fall 2026)'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name or ID..."
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
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                        <th className="py-3 px-4">Merit Rank</th>
                        <th className="py-3 px-4">Student ID</th>
                        <th className="py-3 px-4">Applicant Name</th>
                        <th className="py-3 px-4">Program</th>
                        <th className="py-3 px-4">Merit Score %</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                      {publicMeritList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400">
                            No candidates found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        publicMeritList.map((st, index) => (
                          <tr key={index} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                            <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">#{index + 1}</td>
                            <td className="py-3.5 px-4 font-bold text-teal-700 dark:text-teal-400">{st.regId}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{st.fullName}</td>
                            <td className="py-3.5 px-4">{st.program}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600">{st.meritPct}%</td>
                            <td className="py-3.5 px-4">{st.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-8 text-center space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  {isUrdu ? 'میرٹ لسٹ جلد شائع کی جائے گی' : 'Merit List Will Be Announced Soon'}
                </h3>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
