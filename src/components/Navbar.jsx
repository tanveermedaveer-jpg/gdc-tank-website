import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { language, t } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);

  // Mobile dropdown states ke liye alag se states
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileAcademicsOpen, setMobileAcademicsOpen] = useState(false);

  const aboutRef = useRef(null);
  const academicsRef = useRef(null);

  // Dropdown ke bahar click karne par band karne ke liye
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

  // Page tabdeel hone par menu khud ba khud band ho jaye
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdown(false);
    setAcademicsDropdown(false);
    setMobileAboutOpen(false);
    setMobileAcademicsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-200">
      {/* Asal Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo aur College ka Naam */}
          <Link to="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <img src={logoImg} alt="Logo" className="h-11 w-11 rounded-full object-cover border-2 border-teal-600 shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-blue-950 text-sm sm:text-base leading-tight group-hover:text-teal-700 transition-colors whitespace-nowrap">
                {language === 'ur' ? 'کیپٹن اشفاق شہید' : 'Captain Ashfaq Shaheed'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 tracking-wider uppercase whitespace-nowrap">
                {language === 'ur' ? 'ڈگری کالج، ٹانک' : 'Degree College, Tank'}
              </span>
            </div>
          </Link>

          {/* Desktop ke ahem Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs font-semibold text-slate-700">
            <Link
              to="/"
              className={`px-2 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname === '/' ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            {/* About Us Dropdown */}
            <div className="relative" ref={aboutRef}>
              <button
                onClick={() => {
                  setAboutDropdown(!aboutDropdown);
                  setAcademicsDropdown(false);
                }}
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors focus:outline-none whitespace-nowrap"
              >
                {t('aboutUs')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aboutDropdown ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdown && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                  <Link
                    to="/about/history"
                    onClick={() => setAboutDropdown(false)}
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors whitespace-nowrap"
                  >
                    {language === 'ur' ? 'تاریخ اور پس منظر' : 'History & Background'}
                  </Link>
                  <Link
                    to="/about/vision"
                    onClick={() => setAboutDropdown(false)}
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors whitespace-nowrap"
                  >
                    {language === 'ur' ? 'ویژن اور مشن' : 'Vision & Mission'}
                  </Link>
                </div>
              )}
            </div>

            {/* Academics Dropdown */}
            <div className="relative" ref={academicsRef}>
              <button
                onClick={() => {
                  setAcademicsDropdown(!academicsDropdown);
                  setAboutDropdown(false);
                }}
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors focus:outline-none whitespace-nowrap"
              >
                {t('academics')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${academicsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {academicsDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-3 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-4 py-1 text-[10px] font-bold text-teal-700 uppercase tracking-wider whitespace-nowrap">
                    {language === 'ur' ? 'انٹرمیڈیٹ (HSSC)' : 'INTERMEDIATE (HSSC)'}
                  </div>
                  <Link to="/academics/pre-medical" onClick={() => setAcademicsDropdown(false)} className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 whitespace-nowrap">
                    {t('fscPreMedical')}
                  </Link>
                  <Link to="/academics/pre-engineering" onClick={() => setAcademicsDropdown(false)} className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 whitespace-nowrap">
                    {t('fscPreEngineering')}
                  </Link>
                  <Link to="/academics/ics" onClick={() => setAcademicsDropdown(false)} className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 whitespace-nowrap">
                    {t('icsComputerScience')}
                  </Link>
                  <Link to="/academics/fa" onClick={() => setAcademicsDropdown(false)} className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 whitespace-nowrap">
                    {t('faArtsHumanities')}
                  </Link>
                </div>
              )}
            </div>

            <Link to="/admission" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('admission')}
            </Link>
            <Link to="/departments" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('departments')}
            </Link>
            <Link to="/examination" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('examination')}
            </Link>
            <Link to="/faculty" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('faculty')}
            </Link>
            <Link to="/facilities" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('facilities')}
            </Link>
            <Link to="/gallery" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('gallery')}
            </Link>
            <Link to="/contact" className="px-2 py-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              {t('contactUs')}
            </Link>
          </nav>

          {/* Dahine taraf Apply Now Button */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <Link
              to="/apply"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs uppercase tracking-wider whitespace-nowrap"
            >
              {language === 'ur' ? 'ابھی اپلائی کریں' : 'Apply Now'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Version Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('home')}
          </Link>

          {/* Mobile About Us Dropdown */}
          <div>
            <button
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
            >
              <span>{t('aboutUs')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileAboutOpen && (
              <div className="space-y-1 pl-6 pt-1 border-l-2 border-teal-100 ml-3">
                <Link 
                  to="/about/history" 
                  onClick={() => { setIsOpen(false); setMobileAboutOpen(false); }}
                  className="block py-1.5 text-xs text-slate-600 hover:text-teal-700"
                >
                  {language === 'ur' ? 'تاریخ اور پس منظر' : 'History & Background'}
                </Link>
                <Link 
                  to="/about/vision" 
                  onClick={() => { setIsOpen(false); setMobileAboutOpen(false); }}
                  className="block py-1.5 text-xs text-slate-600 hover:text-teal-700"
                >
                  {language === 'ur' ? 'ویژن اور مشن' : 'Vision & Mission'}
                </Link>
              </div>
            )}
          </div>

          <Link to="/admission" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('admission')}
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700">
            {t('contactUs')}
          </Link>
        </div>
      )}
    </header>
  );
}
