import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Globe } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';
import {
  COLLEGE_PHONE,
  resolveCollegePhone
} from '../lib/contactDetails';
import { subscribeLocalData } from '../lib/adminApi';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);
  const [collegePhone, setCollegePhone] = useState(COLLEGE_PHONE);

  const aboutRef = useRef(null);
  const academicsRef = useRef(null);

  useEffect(() => {
    return subscribeLocalData('settings', (settings) => {
      setCollegePhone(resolveCollegePhone(settings.phone));
    }, (error) => console.error('Unable to load phone:', error));
  }, []);

  // ڈراپ ڈاؤن کے باہر کلک کرنے پر بند کرنے کے لیے
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setAboutDropdown(false);
      }
      if (academicsRef.current && !academicsRef.current.contains(event.target)) {
        setAcademicsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // پیج تبدیل ہونے پر مینو خود بخود بند ہو جائے
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdown(false);
    setAcademicsDropdown(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-200">
      {/* انتہائی بلندی پر پروفیشنل ٹاپ بار (فون نمبر اور زبان کی تبدیلی کے لیے) */}
      <div className="bg-blue-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-medium">{collegePhone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5 bg-blue-900 px-2.5 py-0.5 rounded border border-blue-800">
              <Globe className="w-3 h-3 text-teal-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white border-0 text-xs focus:outline-none cursor-pointer font-semibold"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="ur" className="bg-slate-900 text-white">اردو (Urdu)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* اصل نیویگیشن بار */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* لوگو اور کالج کا نام */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logoImg} alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-teal-600 shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-blue-950 text-base sm:text-lg leading-tight group-hover:text-teal-700 transition-colors">
                {language === 'ur' ? 'کیپٹن اشفاق شہید' : 'Captain Ashfaq Shaheed'}
              </span>
              <span className="text-[11px] font-bold text-teal-700 tracking-wider uppercase">
                {language === 'ur' ? 'ڈگری کالج، ٹانک' : 'Degree College, Tank'}
              </span>
            </div>
          </Link>

          {/* ڈیسک ٹاپ کے اہم لنکس */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/' ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            {/* About Us ڈراپ ڈاؤن */}
            <div className="relative" ref={aboutRef}>
              <button
                onClick={() => {
                  setAboutDropdown(!aboutDropdown);
                  setAcademicsDropdown(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                {t('aboutUs')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aboutDropdown ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdown && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                  <Link
                    to="/about/history"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {language === 'ur' ? 'تاریخ اور پس منظر' : 'History & Background'}
                  </Link>
                  <Link
                    to="/about/vision"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {language === 'ur' ? 'ویژن اور مشن' : 'Vision & Mission'}
                  </Link>
                </div>
              )}
            </div>

            {/* Academics ڈراپ ڈاؤن */}
            <div className="relative" ref={academicsRef}>
              <button
                onClick={() => {
                  setAcademicsDropdown(!academicsDropdown);
                  setAboutDropdown(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                {t('academics')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${academicsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {academicsDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-3 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-4 py-1 text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                    {language === 'ur' ? 'انٹرمیڈیٹ (HSSC)' : 'INTERMEDIATE (HSSC)'}
                  </div>
                  <Link to="/academics/pre-medical" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {t('fscPreMedical')}
                  </Link>
                  <Link to="/academics/pre-engineering" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {t('fscPreEngineering')}
                  </Link>
                  <Link to="/academics/ics" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {t('icsComputerScience')}
                  </Link>
                  <Link to="/academics/fa" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {t('faArtsHumanities')}
                  </Link>

                  <div className="border-t border-slate-100 my-2"></div>
                  <div className="px-4 py-1 text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                    {language === 'ur' ? 'ڈگری پروگرامز (BS 4-YEAR)' : 'DEGREE PROGRAMS (BS 4-YEAR)'}
                  </div>
                  <Link to="/academics/bs-computer-science" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {t('bsComputerScience')}
                  </Link>
                  <Link to="/academics/bs-chemistry" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {language === 'ur' ? 'بی ایس کیمسٹری' : 'BS Chemistry'}
                  </Link>
                  <Link to="/academics/bs-physics" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {language === 'ur' ? 'بی ایس فزکس' : 'BS Physics'}
                  </Link>
                  <Link to="/academics/bs-english" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {language === 'ur' ? 'بی ایس انگلش' : 'BS English'}
                  </Link>
                  <Link to="/academics/bs-political-science" className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700">
                    {language === 'ur' ? 'بی ایس پولیٹیکل سائنس' : 'BS Political Science'}
                  </Link>
                </div>
              )}
            </div>

            <Link to="/admission" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('admission')}
            </Link>
            <Link to="/departments" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('departments')}
            </Link>
            <Link to="/examination" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('examination')}
            </Link>
            <Link to="/faculty" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('faculty')}
            </Link>
            <Link to="/facilities" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('facilities')}
            </Link>
            <Link to="/gallery" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('gallery')}
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors">
              {t('contactUs')}
            </Link>
          </nav>

          {/* دائیں طرف اپلائی ناؤ بٹن */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/apply"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs uppercase tracking-wider"
            >
              {language === 'ur' ? 'ابھی اپلائی کریں' : 'Apply Now'}
            </Link>
          </div>

          {/* موبائل مینو بٹن */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* موبائل ورژن ڈراپ ڈاؤن */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <Link to="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('home')}
          </Link>
          <div className="space-y-1 pl-3 border-l-2 border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase py-1">{t('aboutUs')}</div>
            <Link to="/about/history" className="block py-1.5 text-xs text-slate-600 hover:text-teal-700">History & Background</Link>
            <Link to="/about/vision" className="block py-1.5 text-xs text-slate-600 hover:text-teal-700">Vision & Mission</Link>
          </div>
          <div className="space-y-1 pl-3 border-l-2 border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase py-1">{t('academics')}</div>
            <Link to="/academics/pre-medical" className="block py-1.5 text-xs text-slate-600 hover:text-teal-700">F.Sc Pre-Medical</Link>
            <Link to="/academics/pre-engineering" className="block py-1.5 text-xs text-slate-600 hover:text-teal-700">F.Sc Pre-Engineering</Link>
            <Link to="/academics/ics" className="block py-1.5 text-xs text-slate-600 hover:text-teal-700">ICS Computer Science</Link>
            <Link to="/academics/bs-computer-science" className="block py-1.5 text-xs text-slate-600 hover:text-teal-700">BS Computer Science</Link>
          </div>
          <Link to="/admission" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('admission')}
          </Link>
          <Link to="/departments" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('departments')}
          </Link>
          <Link to="/examination" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('examination')}
          </Link>
          <Link to="/faculty" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('faculty')}
          </Link>
          <Link to="/facilities" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('facilities')}
          </Link>
          <Link to="/gallery" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('gallery')}
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('contactUs')}
          </Link>
          <div className="pt-2">
            <Link
              to="/apply"
              className="block text-center bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl shadow text-xs uppercase tracking-wider"
            >
              {language === 'ur' ? 'ابھی اپلائی کریں' : 'Apply Now'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
