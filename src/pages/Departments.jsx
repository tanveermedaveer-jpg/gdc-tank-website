import { Code, Atom, Beaker, Landmark, BookOpen, Dna } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function Departments() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const depts = [
    {
      icon: <Code className="w-8 h-8 text-teal-600" />,
      name: isUrdu ? 'کمپیوٹر سائنس' : 'Computer Science',
      hod: isUrdu ? 'جناب محمد عمران (MCS, MS CS)' : 'Mr. Muhammad Imran (MCS, MS CS)',
      desc: isUrdu 
        ? 'سافٹ ویئر انجینئرنگ، آئی ٹی نیٹ ورکنگ، ڈیٹا بیس مینجमेंट، اور پروگرامنگ کے بنیادی اصولوں پر توجہ مرکوز کرتا ہے۔ یہ شعبہ 30 سے زائد کمپیوٹرز پر مشتمل لیبارٹری سے لیس ہے۔' 
        : 'Focuses on software engineering, IT networks, database management, and programming basics. Fully equipped with an air-conditioned laboratory containing 30+ network-linked PCs.',
      degree: isUrdu ? 'ICS، بی ایس کمپیوٹر سائنس' : 'ICS, BS Computer Science'
    },
    {
      icon: <Atom className="w-8 h-8 text-teal-600" />,
      name: isUrdu ? 'فزکس (طبیعیات)' : 'Physics',
      hod: isUrdu ? 'جناب نجیب الرحمن (M.Sc Physics)' : 'Mr. Najeeb-ur-Rehman (M.Sc Physics)',
      desc: isUrdu 
        ? 'طبیعی نظام، الیکٹرانکس، کلاسیکی اور کوانٹم میکانکس کا احاطہ کرتا ہے۔ حرارت، روشنی اور بجلی کے تجرباتی آلات سے آراستہ ہے۔' 
        : 'Covers physical systems, electronics, classical and quantum mechanics. Supports student research with experimental kits for heat, light, electricity, and mechanics.',
      degree: isUrdu ? 'F.Sc پری انجینئرنگ، ICS، بی ایس فزکس' : 'F.Sc Pre-Engineering, ICS, BS Physics'
    },
    {
      icon: <Beaker className="w-8 h-8 text-teal-600" />,
      name: isUrdu ? 'کیمسٹری (کیمیا)' : 'Chemistry',
      hod: isUrdu ? 'ڈاکٹر شکیل احمد (Ph.D Chemistry)' : 'Dr. Shakeel Ahmad (Ph.D Chemistry)',
      desc: isUrdu 
        ? 'نامیاتی، غیر نامیاتی، اور طبیعیاتی کیمسٹری میں تربیت فراہم کرتا ہے۔ لیبارٹری اعلیٰ درجے کے ری ایجنٹس اور فلٹریشن اسٹیشنوں سے لیس ہے۔' 
        : 'Provides training in organic, inorganic, and physical chemistry. The laboratory is equipped with high-grade reagents, hoods, heaters, and titrating stations.',
      degree: isUrdu ? 'F.Sc پری میڈیکل، F.Sc پری انجینئرنگ، بی ایس کیمسٹری' : 'F.Sc Pre-Medical, F.Sc Pre-Engineering, BS Chemistry'
    },
    {
      icon: <Dna className="w-8 h-8 text-teal-600" />,
      name: isUrdu ? 'حیاتیاتی علوم (زولوجی اور باٹنی)' : 'Biological Sciences (Zoology & Botany)',
      hod: isUrdu ? 'جناب حبیب الرحمن (M.Phil Zoology)' : 'Mr. Habib-ur-Rehman (M.Phil Zoology)',
      desc: isUrdu 
        ? 'جانداروں، ارتقائی ساختوں، جینیات، اور ماحولیات کا مطالعہ کرتا ہے۔ خوردبین اور حیاتیاتی ماڈلز سے لیس خصوصی لیبارٹری کی خصوصیات رکھتا ہے۔' 
        : 'Studies living organisms, evolutionary structures, genetics, and ecology. Features specialized bio labs with microscopes, models, skeletons, and field samples.',
      degree: isUrdu ? 'F.Sc پری میڈیکل، بی ایس زولوجی، بی ایس باٹنی' : 'F.Sc Pre-Medical, BS Zoology, BS Botany'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-teal-600" />,
      name: isUrdu ? 'انگریزی' : 'English',
      hod: isUrdu ? 'جناب طارق رفیق (MA English Literature)' : 'Mr. Tariq Rafiq (MA English Literature)',
      desc: isUrdu 
        ? 'انگریزی قواعد، بول چال، تحریری مہارت اور کلاسک ادب کو نکھارنے پر توجہ مرکوز کرتا ہے۔ اس شعبے میں انگریزی زبان کا آڈیو سینٹر بھی شامل ہے۔' 
        : 'Focuses on building communication, writing competency, English syntax, semantics, and classical literature. Features a small language audio center.',
      degree: isUrdu ? 'لازمی انٹرمیڈیٹ، بی ایس انگریزی' : 'Intermediate Compulsory, BS English'
    },
    {
      icon: <Landmark className="w-8 h-8 text-teal-600" />,
      name: isUrdu ? 'سوشل سائنسز اور ہیومینیٹیز' : 'Social Sciences & Humanities',
      hod: isUrdu ? 'جناب شوکت خان (MA Islamic Studies)' : 'Mr. Shaukat Khan (MA Islamic Studies)',
      desc: isUrdu 
        ? 'سیاسیات، تاریخ، اسلامیات، عربی، اور شہریت کے کورسز پیش کرتا ہے، جس میں اخلاقیات، انسانی اقدار اور سماجی نظام پر توجہ مرکوز کی جاتی ہے۔' 
        : 'Offers courses in political sciences, history, Islamic education, Arabic, and civics, focusing on ethics, human values, and socio-economic systems.',
      degree: isUrdu ? 'FA، لازمی انٹرمیڈیٹ مضامین' : 'FA, Compulsory Intermediate Subjects'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              {isUrdu ? 'تعلیمی شعبہ جات' : 'Academic Departments'}
            </h1>
            <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
              {isUrdu ? 'مخصوص مہارتوں اور سائنسی سخت کوشی کی آبیاری' : 'Nurturing Specialized Skills & Scientific Rigor'}
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">
                {isUrdu ? 'ہمارا تعلیمی ڈھانچہ' : 'Our Academic Framework'}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                {isUrdu 
                  ? 'ہمارے شعبہ جات ماہر تعلیمی عملے کے زیرِ نگرانی ہیں، جو طلباء کو بہترین کلاس روم تدریس اور تجربہ گاہوں کی تربیت فراہم کرتے ہیں۔'
                  : 'Our departments are guided by specialized academic staff, ensuring that students receive excellent classroom instruction, research guidance, and practical laboratory experience.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {depts.map((d, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                  <div>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                      {d.icon}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-slate-800 mb-2">{d.name}</h3>
                    <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full w-max mb-4">
                      {isUrdu ? 'صدر شعبہ:' : 'HOD:'} {d.hod}
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {d.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500">
                    <span>{isUrdu ? 'پروگرامز:' : 'Programs:'} <strong className="text-blue-900">{d.degree}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
