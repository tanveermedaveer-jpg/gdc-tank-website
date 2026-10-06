import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdown(false);
    setAcademicsDropdown(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const academicsLinks = [
    { name: 'F.Sc Pre-Medical', path: '/academics/pre-medical' },
    { name: 'F.Sc Pre-Engineering', path: '/academics/pre-engineering' },
    { name: 'ICS (Computer Science)', path: '/academics/ics' },
    { name: 'FA (Arts & Humanities)', path: '/academics/fa' },
    { name: 'BS Computer Science', path: '/academics/bs-computer-science' },
    { name: 'BS Chemistry', path: '/academics/bs-chemistry' },
    { name: 'BS Physics', path: '/academics/bs-physics' },
    { name: 'BS English', path: '/academics/bs-english' },
    { name: 'BS Political Science', path: '/academics/bs-political-science' }
  ];

  const aboutLinks = [
    { name: 'History & Background', path: '/about/history' },
    { name: 'Vision & Mission', path: '/about/vision' }
  ];

  return (
    <header className="w-full z-50">
      {/* Main Navbar */}
      <nav className={`w-full bg-white dark:bg-slate-900 shadow-md transition-all duration-300 ${isScrolled ? 'sticky top-0 shadow-lg border-b border-gray-100 dark:border-slate-800' : ''}`}>
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 2xl:px-10">
          <div className="flex items-center justify-between min-h-20 gap-3 xl:gap-4">
            
            {/* Left side: Logo & Navigation Links grouped together */}
            <div className="flex min-w-0 flex-1 items-center gap-3 xl:gap-4 2xl:gap-6">
              {/* Logo Section */}
              <Link to="/" className="flex items-center py-4 flex-shrink-0 group gap-2.5">
                <img 
                  src={logoImg} 
                  alt="College Logo" 
                  className="h-12 w-12 rounded-full border border-blue-900 object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="flex flex-col justify-center">
                  <span className="text-blue-950 dark:text-slate-100 font-bold leading-none tracking-tight text-sm sm:text-base md:text-lg font-serif">
                    {t('home') === 'ہوم' ? 'کیپٹن اشفاق شہید' : 'Captain Ashfaq Shaheed'}
                  </span>
                  <span className="text-teal-700 dark:text-teal-400 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase mt-1">
                    {t('home') === 'ہوم' ? 'ڈگری کالج، ٹانک' : 'Degree College, Tank'}
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden min-w-0 flex-1 items-center justify-between gap-0.5 xl:flex 2xl:gap-1.5">
                <Link 
                  to="/" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('home')}
                </Link>
   
                {/* About Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setAboutDropdown(true)}
                  onMouseLeave={() => setAboutDropdown(false)}
                >
                  <button 
                    className={`flex items-center px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname.startsWith('/about') ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {t('aboutUs')}
                    <ChevronDown className="ml-0.5 w-3 h-3" />
                  </button>
                  {aboutDropdown && (
                    <div className="absolute left-0 mt-0 w-52 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100 dark:divide-slate-700 transition-all duration-200">
                      <div className="py-1">
                        {aboutLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="block px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-800 dark:hover:text-white transition-colors"
                          >
                            {link.name === 'History & Background' ? (t('home') === 'ہوم' ? 'تاریخ و پس منظر' : link.name) : (t('home') === 'ہوم' ? 'وژن اور مشن' : link.name)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
   
                {/* Academics Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setAcademicsDropdown(true)}
                  onMouseLeave={() => setAcademicsDropdown(false)}
                >
                  <button 
                    className={`flex items-center px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname.startsWith('/academics') ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {t('academics')}
                    <ChevronDown className="ml-0.5 w-3 h-3" />
                  </button>
                  {academicsDropdown && (
                    <div className="absolute left-0 mt-0 w-72 rounded-xl shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 p-2 border border-slate-100 dark:border-slate-700 transition-all duration-200">
                      <div>
                        <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase px-3 py-1 tracking-wider select-none">
                          {t('intermediateHSSC')}
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <Link
                            to="/academics/pre-medical"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('fscPreMedical')}
                          </Link>
                          <Link
                            to="/academics/pre-engineering"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('fscPreEngineering')}
                          </Link>
                          <Link
                            to="/academics/ics"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('icsComputerScience')}
                          </Link>
                          <Link
                            to="/academics/fa"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('faArtsHumanities')}
                          </Link>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                        <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase px-3 py-1 tracking-wider select-none">
                          {t('degreePrograms')}
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <Link
                            to="/academics/bs-computer-science"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('bsComputerScience')}
                          </Link>
                          <Link
                            to="/academics/bs-chemistry"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('bsChemistry')}
                          </Link>
                          <Link
                            to="/academics/bs-physics"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('bsPhysics')}
                          </Link>
                          <Link
                            to="/academics/bs-english"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-350 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('bsEnglish')}
                          </Link>
                          <Link
                            to="/academics/bs-political-science"
                            className="block px-3 py-1.5 text-[11px] font-semibold rounded-lg text-slate-700 dark:text-slate-355 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                          >
                            {t('bsPoliticalScience')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
   
                <Link 
                  to="/admission" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/admission' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('admission')}
                </Link>
   
                <Link 
                  to="/departments" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/departments' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('departments')}
                </Link>
   
                <Link 
                  to="/examination" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/examination' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('examination')}
                </Link>
   
                <Link 
                  to="/faculty" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/faculty' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('faculty')}
                </Link>
   
                <Link 
                  to="/facilities" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/facilities' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('facilities')}
                </Link>
   
                <Link 
                  to="/gallery" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/gallery' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('gallery')}
                </Link>
   
                <Link 
                  to="/contact" 
                  className={`px-1 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${location.pathname === '/contact' ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-500 rounded-b-none' : 'text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-455 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t('contactUs')}
                </Link>
              </div>
            </div>

            {/* Right side: Action Buttons Section */}
            <div className="hidden xl:flex items-center flex-shrink-0">
              <Link 
                to="/apply" 
                className="px-3 2xl:px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors duration-200 whitespace-nowrap shadow-sm"
              >
                {t('applyNow')}
              </Link>
            </div>

            {/* Hamburger Button for Mobile */}
            <div className="flex xl:hidden items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-800 dark:text-slate-200 hover:text-teal-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`xl:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[100vh] border-t border-gray-150 dark:border-slate-800 bg-white dark:bg-slate-905 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('home')}
            </Link>

            {/* Mobile About Us Section */}
            <div className="space-y-1">
              <button 
                onClick={() => setAboutDropdown(!aboutDropdown)}
                className="w-full flex justify-between items-center px-3 py-2.5 rounded-md text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 focus:outline-none"
              >
                <span>{t('aboutUs')}</span>
                <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${aboutDropdown ? 'rotate-180 text-teal-700 dark:text-teal-400' : ''}`} />
              </button>
              <div className={`pl-4 space-y-1 transition-all duration-200 ${aboutDropdown ? 'block' : 'hidden'}`}>
                {aboutLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === link.path ? 'bg-teal-50/50 dark:bg-slate-800/50 text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400'}`}
                  >
                    {link.name === 'History & Background' ? (t('home') === 'ہوم' ? 'تاریخ و پس منظر' : link.name) : (t('home') === 'ہوم' ? 'وژن اور مشن' : link.name)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Academics Section */}
            <div className="space-y-1">
              <button 
                onClick={() => setAcademicsDropdown(!academicsDropdown)}
                className="w-full flex justify-between items-center px-3 py-2.5 rounded-md text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 focus:outline-none"
              >
                <span>{t('academics')}</span>
                <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${academicsDropdown ? 'rotate-180 text-teal-700 dark:text-teal-400' : ''}`} />
              </button>
              <div className={`pl-4 space-y-1 transition-all duration-200 ${academicsDropdown ? 'block' : 'hidden'}`}>
                {academicsLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === link.path ? 'bg-teal-50/50 dark:bg-slate-800/50 text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/admission" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/admission' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('admission')}
            </Link>

            <Link 
              to="/departments" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/departments' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('departments')}
            </Link>

            <Link 
              to="/examination" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/examination' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('examination')}
            </Link>

            <Link 
              to="/faculty" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/faculty' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('faculty')}
            </Link>

            <Link 
              to="/facilities" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/facilities' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('facilities')}
            </Link>

            <Link 
              to="/gallery" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/gallery' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('gallery')}
            </Link>

            <Link 
              to="/contact" 
              className={`block px-3 py-2.5 rounded-md text-base font-semibold ${location.pathname === '/contact' ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-450'}`}
            >
              {t('contactUs')}
            </Link>

            <div className="pt-4 px-3">
              <Link 
                to="/apply" 
                className="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full shadow-md text-base tracking-wide transition-colors duration-200"
              >
                {t('applyNow')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
