import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen, Award, Users, CheckCircle, Bell } from 'lucide-react';
import campusImg from '../assets/campus.png';
import principalImg from '../assets/principal.jpg';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import AnimatedCounter from '../components/AnimatedCounter';
import { COLLEGE_PHONE, resolveCollegePhone } from '../lib/contactDetails';

export default function Home() {
  const { t } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [principalName, setPrincipalName] = useState('Prof. Shabir Ahmad');
  const [principalImage, setPrincipalImage] = useState('');
  const [principalMessage, setPrincipalMessage] = useState('');
  const [admissionPhone, setAdmissionPhone] = useState(COLLEGE_PHONE);
  const [admissionEmail, setAdmissionEmail] = useState('admissions@casdct.edu.pk');
  const [heroTitle, setHeroTitle] = useState('Government Captain Ashfaq Shaheed Degree College Tank');
  const [heroDesc, setHeroDesc] = useState('A premier educational institution in Khyber Pakhtunkhwa, dedicated to academic excellence, character building, and career guidance.');

  // Stats States
  const [stat1Value, setStat1Value] = useState('1,200+');
  const [stat1Label, setStat1Label] = useState('Active Students');
  const [stat2Value, setStat2Value] = useState('45+');
  const [stat2Label, setStat2Label] = useState('Qualified Lecturers');
  const [stat3Value, setStat3Value] = useState('10+');
  const [stat3Label, setStat3Label] = useState('BS & Inter Programs');
  const [stat4Value, setStat4Value] = useState('100%');
  const [stat4Label, setStat4Label] = useState('Dedicated Support');

  useEffect(() => {
    // 1. Notices
    const storedNotices = localStorage.getItem('casdct_notices');
    if (storedNotices) {
      setNotices(JSON.parse(storedNotices));
    } else {
      const defaultNotices = [
        { id: 1, date: 'Aug 24, 2026', title: 'Admissions open for F.Sc Pre-Medical & Pre-Engineering' },
        { id: 2, date: 'Aug 20, 2026', title: 'BS Computer Science & BS English admission schedule announced' },
        { id: 3, date: 'Aug 15, 2026', title: 'Orientation ceremony for new intermediate batch on Sept 1st' },
        { id: 4, date: 'Aug 10, 2026', title: 'HED KP scholarships application deadline extended to Sept 10' }
      ];
      localStorage.setItem('casdct_notices', JSON.stringify(defaultNotices));
      setNotices(defaultNotices);
    }

    // 2. Principal Info
    const storedPName = localStorage.getItem('casdct_principal_name');
    const storedPMessage = localStorage.getItem('casdct_principal_message');
    const storedPImage = localStorage.getItem('casdct_principal_image');
    setPrincipalName(storedPName || 'Prof. Shabir Ahmad');
    setPrincipalImage(storedPImage || principalImg);
    setPrincipalMessage(storedPMessage || 'It is a matter of great pride and privilege to welcome you to Captain Ashfaq Shaheed Degree College, Tank. This college stands as a beacon of learning in South KP, committed to delivering high-quality intermediate and undergraduate education to our youth.\n\nOur primary goal is to nurture academic curiosity, foster critical thinking, and build a strong sense of responsibility. Naming our college in honor of the martyred military officer, Captain Ashfaq Shaheed, reminds us daily of the virtues of discipline, sacrifice, and duty to our homeland.\n\nWe are proud of our qualified faculty, well-equipped science and computer labs, and a spacious green campus that supports learning. I invite you to join us and become part of a legacy that strives for excellence in every field of life.');

    // 3. Admission Desk Info
    const storedPhone = localStorage.getItem('casdct_admission_phone');
    const storedEmail = localStorage.getItem('casdct_admission_email');
    setAdmissionPhone(resolveCollegePhone(storedPhone));
    setAdmissionEmail(storedEmail || 'admissions@casdct.edu.pk');

    // 4. Stats Info
    const s1v = localStorage.getItem('casdct_stat1_value');
    const s1l = localStorage.getItem('casdct_stat1_label');
    const s2v = localStorage.getItem('casdct_stat2_value');
    const s2l = localStorage.getItem('casdct_stat2_label');
    const s3v = localStorage.getItem('casdct_stat3_value');
    const s3l = localStorage.getItem('casdct_stat3_label');
    const s4v = localStorage.getItem('casdct_stat4_value');
    const s4l = localStorage.getItem('casdct_stat4_label');
    
    setStat1Value(s1v || '1,200+');
    setStat1Label(s1l || 'Active Students');
    setStat2Value(s2v || '45+');
    setStat2Label(s2l || 'Qualified Lecturers');
    setStat3Value(s3v || '10+');
    setStat3Label(s3l || 'BS & Inter Programs');
    setStat4Value(s4v || '100%');
    setStat4Label(s4l || 'Dedicated Support');

    // 5. Hero Banner Details
    const storedHeroTitle = localStorage.getItem('casdct_hero_title');
    const storedHeroDesc = localStorage.getItem('casdct_hero_desc');
    if (storedHeroTitle) setHeroTitle(storedHeroTitle);
    if (storedHeroDesc) setHeroDesc(storedHeroDesc);
  }, []);

  const stats = [
    { icon: <Users className="w-8 h-8 text-teal-500" />, count: stat1Value, label: stat1Label === 'Active Students' ? t('activeStudents') : stat1Label },
    { icon: <BookOpen className="w-8 h-8 text-teal-500" />, count: stat2Value, label: stat2Label === 'Qualified Lecturers' ? t('qualifiedLecturers') : stat2Label },
    { icon: <Award className="w-8 h-8 text-teal-500" />, count: stat3Value, label: stat3Label === 'BS & Inter Programs' ? t('bsInterPrograms') : stat3Label },
    { icon: <CheckCircle className="w-8 h-8 text-teal-500" />, count: stat4Value, label: stat4Label === 'Dedicated Support' ? t('dedicatedSupport') : stat4Label }
  ];

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[85vh] flex items-center justify-center text-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={campusImg} 
            alt="College Campus" 
            className="w-full h-full object-cover object-center opacity-95 scale-102 transform transition-transform duration-[10000ms]" 
          />
          <div className="absolute inset-0 bg-slate-900/55 backdrop-brightness-75"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-28 flex flex-col items-center justify-center">
          <ScrollReveal className="max-w-4xl mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 uppercase tracking-widest mb-6 border border-teal-500/30">
              {t('gdcTank')}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight font-serif text-white mb-6 text-center max-w-3xl">
              <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
                {heroTitle === 'Government Captain Ashfaq Shaheed Degree College Tank' ? t('heroTitle') : heroTitle}
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl text-center">
              {heroDesc === 'A premier educational institution in Khyber Pakhtunkhwa, dedicated to academic excellence, character building, and career guidance.' ? t('heroDesc') : heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link 
                to="/admission" 
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl text-center transition-all duration-200 w-full sm:w-auto"
              >
                {t('applyOnline')}
              </Link>
              <Link 
                to="/academics" 
                className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-bold px-8 py-3.5 rounded-full text-center transition-all duration-200 w-full sm:w-auto"
              >
                {t('explorePrograms')}
              </Link>
              <Link 
                to="/contact" 
                className="bg-teal-500/80 hover:bg-teal-500 text-white border border-teal-400/40 font-bold px-8 py-3.5 rounded-full text-center transition-all duration-200 w-full sm:w-auto"
              >
                {t('contactUs')}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Counters Section */}
      <section className="bg-white dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 text-center shadow-sm hover:scale-[1.03] hover:shadow-md transition-all duration-300 transform will-change-transform h-full">
                  <div className="mx-auto w-16 h-16 bg-teal-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-extrabold text-blue-950 dark:text-teal-400">
                    <AnimatedCounter value={stat.count} />
                  </div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Box */}
            <ScrollReveal className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-700 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-sm hover:scale-[1.03] transition-all duration-300 transform will-change-transform">
                  <img 
                    src={principalImage} 
                    alt={principalName} 
                    className="w-64 h-80 rounded-xl object-cover shadow-sm bg-slate-50"
                  />
                  <div className="mt-4 text-center">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{principalName}</h4>
                    <p className="text-teal-700 dark:text-teal-400 text-xs font-semibold">{t('home') === 'ہوم' ? 'پرنسپل، جی ڈی سی ٹانک' : 'Principal, Gdc Tank'}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Content Box */}
            <ScrollReveal delay={150} className="lg:col-span-8">
              <span className="text-xs text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest bg-teal-100/50 dark:bg-teal-950/40 px-3.5 py-1.5 rounded-full">
                {t('welcomeMessage')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 dark:text-white font-serif mt-4 mb-6 leading-tight">
                {t('fromPrincipalDesk')}
              </h2>
              <div className="text-slate-650 dark:text-slate-350 space-y-4 leading-relaxed text-base whitespace-pre-wrap">
                {t('home') === 'ہوم' 
                  ? "کیپٹن اشفاق شہید ڈگری کالج ٹانک میں آپ کو خوش آمدید کہنا ہمارے لیے انتہائی اعزاز کی بات ہے۔ یہ کالج جنوبی خیبر پختونخوا میں اعلیٰ اور معياری تعلیم کے فروغ کے لیے کوشاں ہے۔"
                  : principalMessage}
              </div>
              <div className="mt-8 flex items-center space-x-3">
                <div className="w-12 h-0.5 bg-teal-600"></div>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm tracking-wide uppercase font-serif">
                  {t('home') === 'ہوم' ? 'پروفیسر شبیر احمد (پرنسپل)' : 'PROF. SHABIR AHMAD (PRINCIPAL)'}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Highlights & News / Announcements Section */}
      <section className="bg-slate-50 dark:bg-slate-950 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Announcement Board */}
            <ScrollReveal className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 sm:p-8 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center font-serif">
                    <Bell className="w-5 h-5 text-teal-600 mr-2.5 animate-bounce" />
                    {t('latestAnnouncements')}
                  </h2>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider bg-teal-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {t('noticeBoard')}
                  </span>
                </div>
                <div className="mt-6 space-y-5">
                  {notices.map((notice) => (
                    <div key={notice.id} className="flex gap-4 group cursor-pointer border-b border-slate-50 dark:border-slate-800/60 pb-4 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-350 w-24 h-16 rounded-xl flex flex-col items-center justify-center transition-colors">
                        <Calendar className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">{notice.date.split(',')[0]}</span>
                      </div>
                      <div className="flex-grow pt-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
                          {notice.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('noticeClickHint')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 text-right">
                <Link to="/examination" className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-bold text-sm inline-flex items-center group">
                  {t('viewAllAnnouncements')}
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Quick Contact & Info Card */}
            <ScrollReveal delay={100} className="bg-gradient-to-br from-blue-950 to-teal-900 rounded-2xl shadow-md p-6 sm:p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4 font-serif">{t('admissionDesk')}</h3>
                <p className="text-teal-100 text-sm leading-relaxed mb-6">
                  {t('admissionDeskDesc')}
                </p>
                <div className="space-y-4">
                  <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                    <span className="text-xs text-teal-300 block font-semibold">{t('intermediateInquiries')}</span>
                    <span className="text-sm font-bold block mt-0.5">{admissionPhone}</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                    <span className="text-xs text-teal-300 block font-semibold">{t('bsProgramAdmissions')}</span>
                    <span className="text-sm font-bold block mt-0.5">{admissionEmail}</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link 
                  to="/admission" 
                  className="w-full block text-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                >
                  {t('admissionProcessDetails')}
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Offered Academic Programs Section */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider bg-teal-50 dark:bg-slate-800 px-3.5 py-1.5 rounded-full">
              {t('home') === 'ہوم' ? 'تعلیمی پروگرامز' : 'Our Academics'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 dark:text-white font-serif mt-4 mb-4">
              {t('home') === 'ہوم' ? 'پیش کردہ تعلیمی پروگرامز' : 'Offered Academic Programs'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              {t('exploreStreams')}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            
            {/* Card 1: F.Sc Pre-Medical */}
            <ScrollReveal delay={0}>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform flex flex-col justify-between h-full">
                <div>
                  <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">{t('intermediateHSSC')}</div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-serif leading-snug mb-3">{t('fscPreMedical')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {t('preMedicalDesc')}
                  </p>
                </div>
                <Link 
                  to="/academics/pre-medical"
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-xs transition-colors border border-slate-150 dark:border-slate-700/80 hover:border-transparent block"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 2: F.Sc Pre-Engineering */}
            <ScrollReveal delay={50}>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform flex flex-col justify-between h-full">
                <div>
                  <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">{t('intermediateHSSC')}</div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-serif leading-snug mb-3">{t('fscPreEngineering')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {t('preEngineeringDesc')}
                  </p>
                </div>
                <Link 
                  to="/academics/pre-engineering"
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-xs transition-colors border border-slate-150 dark:border-slate-700/80 hover:border-transparent block"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 3: ICS */}
            <ScrollReveal delay={100}>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform flex flex-col justify-between h-full">
                <div>
                  <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">{t('intermediateHSSC')}</div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-serif leading-snug mb-3">{t('icsComputerScience')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {t('icsDesc')}
                  </p>
                </div>
                <Link 
                  to="/academics/ics"
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-xs transition-colors border border-slate-150 dark:border-slate-700/80 hover:border-transparent block"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 4: FA */}
            <ScrollReveal delay={150}>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform flex flex-col justify-between h-full">
                <div>
                  <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">{t('intermediateHSSC')}</div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-serif leading-snug mb-3">{t('faArtsHumanities')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {t('faDesc')}
                  </p>
                </div>
                <Link 
                  to="/academics/fa"
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-xs transition-colors border border-slate-150 dark:border-slate-700/80 hover:border-transparent block"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 5: BS Programs */}
            <ScrollReveal delay={200}>
              <div className="bg-gradient-to-b from-slate-900 to-blue-950 border border-blue-900 dark:border-blue-900/60 rounded-2xl p-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform flex flex-col justify-between h-full text-white">
                <div>
                  <div className="text-[10px] font-bold text-teal-300 uppercase tracking-wider mb-2">{t('degreePrograms')}</div>
                  <h3 className="text-base font-bold text-white font-serif leading-snug mb-3">{t('home') === '\u06c1\u0648\u0645' ? '\u0628\u06cc \u0627\u06cc \u0633 4 \u0633\u0627\u0644\u06c1 \u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0632' : 'BS 4-Year Programs'}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {t('bsProgramsDesc')}
                  </p>
                </div>
                <Link 
                  to="/academics/bs-programs"
                  className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-xs transition-colors block border border-transparent"
                >
                  {t('exploreMajors')}
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>


      {/* Core Highlights Grid */}
      <section className="bg-white dark:bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider bg-teal-50 dark:bg-slate-800 px-3.5 py-1.5 rounded-full">
              {t('whyCasdct')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 dark:text-white font-serif mt-4 mb-4">
              {t('distinctiveExperience')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              We design our facilities and curricula to help students grow academically and personally.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <ScrollReveal delay={0}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform h-full">
                <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-650 dark:text-teal-455 mb-6 font-bold text-xl">
                  01
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-150 mb-3">
                  {t('qualifiedFacultyTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {t('qualifiedFacultyDesc')}
                </p>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={75}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform h-full">
                <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-655 dark:text-teal-455 mb-6 font-bold text-xl">
                  02
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-150 mb-3">
                  {t('modernLabsTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {t('modernLabsDesc')}
                </p>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={150}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform h-full">
                <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-655 dark:text-teal-455 mb-6 font-bold text-xl">
                  03
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-150 mb-3">
                  {t('richLibraryTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {t('richLibraryDesc')}
                </p>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={0}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform h-full">
                <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-655 dark:text-teal-455 mb-6 font-bold text-xl">
                  04
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-150 mb-3">
                  {t('sportsTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {t('sportsDesc')}
                </p>
              </div>
            </ScrollReveal>

            {/* Card 5 */}
            <ScrollReveal delay={75}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform h-full">
                <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-655 dark:text-teal-455 mb-6 font-bold text-xl">
                  05
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-150 mb-3">
                  {t('disciplineTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {t('disciplineDesc')}
                </p>
              </div>
            </ScrollReveal>

            {/* Card 6 */}
            <ScrollReveal delay={150}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform h-full">
                <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-655 dark:text-teal-455 mb-6 font-bold text-xl">
                  06
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-150 mb-3">
                  {t('hostelTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {t('hostelDesc')}
                </p>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>
    </div>
  );
}
