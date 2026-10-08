import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight, Award } from 'lucide-react';
import campusImg from '../../assets/campus.png';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar.jsx'; // Apne folder path ke mutabiq check kar lein
import Footer from '../../components/Footer.jsx'; // Apne folder path ke mutabiq check kar lein

export default function AcademicsList() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const intermediatePrograms = [
    {
      id: 'pre-medical',
      titleEn: 'F.Sc Pre-Medical',
      titleUr: 'ایف ایس سی پری میڈیکل',
      descEn: 'Designed for higher studies in medicine, dentistry, pharmacy, and allied health sciences.',
      descUr: 'طب، دندان سازی، فارمیسی اور الائیڈ ہیلتھ سائنسز میں اعلیٰ تعلیم کے لیے ڈیزائن کیا گیا ہے۔'
    },
    {
      id: 'pre-engineering',
      titleEn: 'F.Sc Pre-Engineering',
      titleUr: 'ایف ایس سی پری انجینئرنگ',
      descEn: 'Equips students with mathematical, analytical, and physical science foundations.',
      descUr: 'طلباء کو ریاضیاتی، تجزیاتی اور طبعی سائنس کے علوم سے آراستہ کرتا ہے۔'
    },
    {
      id: 'ics',
      titleEn: 'ICS (Computer Science)',
      titleUr: 'آئی سی ایس (کمپیوٹر سائنس)',
      descEn: 'Combines computer science with mathematics and physics for the digital world.',
      descUr: 'ڈیجیٹل دنیا کے لیے ریاضی اور فزکس کے ساتھ کمپیوٹر سائنس کا بنیادی علم فراہم کرتا ہے۔'
    },
    {
      id: 'fa',
      titleEn: 'FA (Faculty of Arts)',
      titleUr: 'ایف اے (آرٹس)',
      descEn: 'Offers humanities, social sciences, and languages for law and administration.',
      descUr: 'قانون، انتظامیہ اور سماجی علوم کے لیے ہیومینیٹیز اور زبانیں پیش کرتا ہے۔'
    }
  ];

  const bsPrograms = [
    {
      id: 'bs-computer-science',
      titleEn: 'BS Computer Science',
      titleUr: 'بی ایس کمپیوٹر سائنس',
      descEn: 'Affiliated with Gomal University. Covers programming, AI, and software engineering.',
      descUr: 'گومل یونیورسٹی سے الحاق شدہ۔ پروگرامنگ، مصنوعی ذہانت اور سافٹ ویئر انجینئرنگ کا احاطہ کرتا ہے۔'
    },
    {
      id: 'bs-chemistry',
      titleEn: 'BS Chemistry',
      titleUr: 'بی ایس کیمسٹری',
      descEn: 'Affiliated with Gomal University. Deep theoretical and experimental chemistry training.',
      descUr: 'گومل یونیورسٹی سے الحاق شدہ۔ نامیاتی، غیر نامیاتی اور طبعی کیمسٹری کی عملی تربیت۔'
    },
    {
      id: 'bs-physics',
      titleEn: 'BS Physics',
      titleUr: 'بی ایس فزکس',
      descEn: 'Affiliated with Gomal University. Explores mechanics, quantum physics, and electronics.',
      descUr: 'گومل یونیورسٹی سے الحاق شدہ۔ میکانکس، کوانٹم فزکس اور الیکٹرونکس کا مطالعہ۔'
    },
    {
      id: 'bs-english',
      titleEn: 'BS English',
      titleUr: 'بی ایس انگلش',
      descEn: 'Affiliated with Gomal University. Comprehensive study of literature and linguistics.',
      descUr: 'گومل یونیورسٹی سے الحاق شدہ۔ ادب اور لسانیات کا جامع مطالعہ۔'
    },
    {
      id: 'bs-political-science',
      titleEn: 'BS Political Science',
      titleUr: 'بی ایس پولیٹیکل سائنس',
      descEn: 'Affiliated with Gomal University. Analyzes political theory and international relations.',
      descUr: 'گومل یونیورسٹی سے الحاق شدہ۔ سیاسی نظریات اور بین الاقوامی تعلقات کا تجزیہ۔'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-slate-900 text-white py-16 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              {isUrdu ? 'ہمارے تعلیمی پروگرامز' : 'Our Academic Programs'}
            </h1>
            <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-2xl mx-auto">
              {isUrdu 
                ? 'انٹرمیڈیٹ (ایف ایس سی، آئی سی ایس، ایف اے) سے لے کر اعلیٰ معیار کے 4 سالہ بی ایس آنرز ڈگری پروگرامز تک۔'
                : 'Explore our wide range of Intermediate and 4-Year BS Honors degree programs affiliated with Gomal University.'}
            </p>
          </div>
        </section>

        {/* Intermediate Programs Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isUrdu ? 'rtl' : 'ltr'}>
          <div className="mb-10">
            <div className={`flex items-center space-x-3 ${isUrdu ? 'space-x-reverse' : ''}`}>
              <GraduationCap className="w-8 h-8 text-teal-700" />
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">
                {isUrdu ? 'انٹرمیڈیٹ پروگرامز (HSSC)' : 'Intermediate Programs (HSSC)'}
              </h2>
            </div>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              {isUrdu ? 'بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن کے تحت 2 سالہ انٹرمیڈیٹ پروگرامز۔' : '2-year higher secondary programs building strong foundations for future careers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {intermediatePrograms.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950 mb-2 font-serif">
                    {isUrdu ? prog.titleUr : prog.titleEn}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {isUrdu ? prog.descUr : prog.descEn}
                  </p>
                </div>
                <Link
                  to={`/academics/${prog.id}`}
                  className={`inline-flex items-center text-teal-700 font-semibold text-sm group-hover:text-blue-950 ${isUrdu ? 'flex-row-reverse' : ''}`}
                >
                  <span>{isUrdu ? 'مزید تفصیلات' : 'Explore Program'}</span>
                  <ArrowRight className={`w-4 h-4 ${isUrdu ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BS Honors Programs Section */}
        <section className="py-16 bg-slate-100 border-t border-slate-200" dir={isUrdu ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className={`flex items-center space-x-3 ${isUrdu ? 'space-x-reverse' : ''}`}>
                <Award className="w-8 h-8 text-blue-900" />
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">
                  {isUrdu ? 'بی ایس آنرز پروگرامز (4 سالہ - گومل یونیورسٹی الحاق)' : 'BS Honors Programs (4-Year - Gomal University Affiliated)'}
                </h2>
              </div>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                {isUrdu ? 'پیشہ ورانہ مہارتوں اور جدید تحقیق کے حامل انڈرگریجویٹ ڈگری پروگرامز۔' : 'Advanced undergraduate degree programs designed for professional excellence and research.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bsPrograms.map((prog) => (
                <div key={prog.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 mb-2 font-serif">
                      {isUrdu ? prog.titleUr : prog.titleEn}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {isUrdu ? prog.descUr : prog.descEn}
                    </p>
                  </div>
                  <Link
                    to={`/academics/${prog.id}`}
                    className={`inline-flex items-center text-blue-900 font-semibold text-sm group-hover:text-teal-700 ${isUrdu ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{isUrdu ? 'پروگرام کی تفصیل' : 'View Curriculum'}</span>
                    <ArrowRight className={`w-4 h-4 ${isUrdu ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
