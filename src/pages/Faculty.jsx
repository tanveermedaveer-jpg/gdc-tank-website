import { useState, useEffect } from 'react';
import { Users, GraduationCap, Mail, Shield, RefreshCw } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';
import { subscribeLocalData } from '../lib/adminApi';

export default function Faculty() {
  const { t, language } = useLanguage();
  const [faculty, setFaculty] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(true);
  const [facultyError, setFacultyError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingFaculty(true);
    const unsubscribe = subscribeLocalData('faculty', (profiles) => {
      if (!isMounted) return;
      setFaculty(profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        role: profile.designation,
        qual: profile.qualification,
        dept: profile.department,
        email: profile.contact,
        photoUrl: profile.photo_url,
        isHOD: profile.is_hod
      })));
      setFacultyError('');
      setIsLoadingFaculty(false);
    }, (error) => {
      if (!isMounted) return;
      console.error('Unable to load local faculty profiles:', error);
      setFacultyError('Faculty profiles could not be loaded. Please try again later.');
      setIsLoadingFaculty(false);
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reloadKey]);

  const translateFacultyField = (text) => {
    const isUrdu = t('home') === 'ہوم';
    if (!isUrdu || !text) return text;

    const dict = {
      // Roles
      'Principal / Head of Institution': 'پرنسپل / سربراہ ادارہ',
      'HOD / Assistant Professor': 'ایچ او ڈی / اسسٹنٹ پروفیسر',
      'Assistant Professor': 'اسسٹنٹ پروفیسر',
      'HOD / Lecturer': 'ایچ او ڈی / لیکچرار',
      'Lecturer': 'لیکچرار',
      'Principal / Head': 'پرنسپل / سربراہ',

      // Departments
      'Administration / English': 'انتظامیہ / انگریزی',
      'Computer Science': 'کمپیوٹر سائنس',
      'Chemistry': 'کیمسٹری',
      'Physics': 'فزکس',
      'Biological Sciences (Zoology)': 'بیالوجیکل سائنسز (زولوجی)',
      'Biological Sciences (Botany)': 'بیالوجیکل سائنسز (بوٹنی)',
      'English': 'انگلش',
      'Islamic Studies & Humanities': 'اسلامیات و ہیومینیٹیز',
      'Mathematics': 'میتھمیٹکس',
      'Urdu': 'اردو',

      // Universities
      'Quaid-e-Azam University': 'قائد اعظم یونیورسٹی',
      'Gomal University': 'گومل یونیورسٹی',
      'Peshawar University': 'پشاور یونیورسٹی',
      'NUML': 'نمل (NUML)',

      // Names & Prefixes
      'Prof. Shabir Ahmad': 'پروفیسر شبیر احمد',
      'Dr. Shakeel Ahmad': 'ڈاکٹر شکیل احمد',
      'Mr. Muhammad Imran': 'مسٹر محمد عمران',
      'Mr. Habib-ur-Rehman': 'مسٹر حبیب الرحمٰن',
      'Mr. Najeeb-ur-Rehman': 'مسٹر نجیب الرحمٰن',
      'Mr. Tariq Rafiq': 'مسٹر طارق رفیق',
      'Mr. Shaukat Khan': 'مسٹر شوکت خان',
      'Mr. Asif Mahmud': 'مسٹر آصف محمود',
      'Mr. Zia-ur-Rehman': 'مسٹر ضیاء الرحمٰن',

      // Degree qualifications
      'M.Phil English Literature': 'ایم فل انگلش لٹریچر',
      'MS Computer Science': 'ایم ایس کمپیوٹر سائنس',
      'Ph.D Organic Chemistry': 'پی ایچ ڈی آرگینک کیمسٹری',
      'M.Sc Physics': 'ایم ایس سی فزکس',
      'M.Phil Zoology': 'ایم فل زولوجی',
      'MA English Language & Literature': 'ایم اے انگلش لینگویج اینڈ لٹریچر',
      'MA Islamic Studies': 'ایم اے اسلامیات',
      'M.Sc Applied Mathematics': 'ایم ایس سی اپلائیڈ میتھمیٹکس',
      'M.Phil Urdu': 'ایم فل اردو'
    };

    if (dict[text]) return dict[text];

    let result = text;
    Object.keys(dict).forEach(key => {
      result = result.replace(key, dict[key]);
    });
    return result;
  };

  return (
    <div className="flex-grow">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('ourTeachingFaculty')}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {t('facultyBannerSub')}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">{t('meetOurEducators')}</h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {t('facultyDescription')}
            </p>
          </div>

          {isLoadingFaculty ? (
            <p role="status" className="text-center text-sm text-slate-500 py-8">
              {language === 'ur' ? 'اساتذہ کے پروفائلز لوڈ ہو رہے ہیں...' : 'Loading faculty profiles…'}
            </p>
          ) : facultyError ? (
            <div role="alert" className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-rose-700">
              <span>{facultyError}</span>
              <button
                type="button"
                onClick={() => {
                  setIsLoadingFaculty(true);
                  setReloadKey(key => key + 1);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 font-semibold hover:bg-rose-50"
              >
                <RefreshCw className="h-4 w-4" />
                {language === 'ur' ? 'دوبارہ کوشش کریں' : 'Retry'}
              </button>
            </div>
          ) : faculty.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">
              {language === 'ur' ? 'فی الحال کوئی فیکلٹی پروفائل دستیاب نہیں ہے۔' : 'No faculty profiles available yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculty.map((member, idx) => (
                <div key={member.id || idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform relative overflow-hidden">
                  {member.isHOD && (
                    <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      {t('adminHod')}
                    </div>
                  )}
                  <div>
                    {/* Avatar */}
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="mb-4 h-16 w-16 rounded-full border border-slate-200 object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-teal-600" />
                      </div>
                    )}
                    
                    <h3 className="font-serif font-bold text-lg text-slate-800 leading-tight mb-1">
                      {translateFacultyField(member.name)}
                    </h3>
                    <div className="text-xs font-bold text-teal-700 mb-4">{translateFacultyField(member.role)}</div>

                    <div className="space-y-2 mt-4 text-xs sm:text-sm text-slate-650">
                      <div className="flex items-start">
                        <GraduationCap className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{translateFacultyField(member.qual)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-slate-500 mr-1.5 text-xs uppercase">{t('department')}:</span>
                        <span className="font-semibold text-slate-700">{translateFacultyField(member.dept)}</span>
                      </div>
                    </div>
                  </div>

                  {member.email && (
                    <div className="pt-6 border-t border-slate-200 mt-6 flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 mr-2" />
                      <a
                        href={member.email.includes('@') ? `mailto:${member.email}` : `tel:${member.email}`}
                        className="break-all text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
