import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ChevronRight, GraduationCap, X } from 'lucide-react';
import { FaFacebookF, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import logoImg from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';
import {
  COLLEGE_ADDRESS,
  COLLEGE_ADDRESS_URDU,
  COLLEGE_PHONE,
  resolveCollegeAddress,
  resolveCollegePhone
} from '../lib/contactDetails';
import { subscribeLocalData } from '../lib/adminApi';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [collegePhone, setCollegePhone] = useState(COLLEGE_PHONE);
  const [collegeAddress, setCollegeAddress] = useState(COLLEGE_ADDRESS);

  useEffect(() => {
    return subscribeLocalData('settings', (settings) => {
      setCollegePhone(resolveCollegePhone(settings.phone));
      setCollegeAddress(resolveCollegeAddress(settings.address));
    }, (error) => console.error('Unable to load local college contact details:', error));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top Banner section */}
      <div className="bg-gradient-to-r from-blue-950 via-teal-900 to-blue-950 text-white py-8 border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <h3 className="text-xl font-bold font-serif">{t('home') === 'ہوم' ? 'کیا آپ اپنا تعلیمی سفر شروع کرنے کے لیے تیار ہیں؟' : 'Ready to start your academic journey?'}</h3>
            <p className="text-teal-200 text-sm mt-1">{t('home') === 'ہوم' ? 'تعلیمی سال 2026-27 کے لیے داخلے کھلے ہیں۔' : 'Admissions are open for the academic session 2026-27.'}</p>
          </div>
          <Link
            to="/apply"
            className="bg-white text-blue-950 hover:bg-teal-50 font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide"
          >
            {t('home') === 'ہوم' ? 'ابھی آن لائن اپلائی کریں' : 'Apply Online Now'}
          </Link>
        </div>
      </div>

      {/* Main Footer Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: College Info */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <img src={logoImg} alt="College Logo" className="h-12 w-12 rounded-full border border-teal-500 object-cover" />
            <div>
              <h4 className="text-white font-bold leading-tight font-serif">{t('home') === 'ہوم' ? 'کیپٹن اشفاق شہید' : 'Captain Ashfaq Shaheed'}</h4>
              <p className="text-teal-500 text-xs font-semibold uppercase tracking-wider">{t('home') === 'ہوم' ? 'ڈگری کالج، ٹانک' : 'Degree College, Tank'}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed pt-2">
            {t('home') === 'ہوم' ? (
              'ٹانک کے تاریخی خطے میں معیاری تعلیم کی فراہمی کے لیے قائم کیا گیا۔ نسلوں کو تعلیمی فضیلت، ڈسپلن اور حب الوطنی کی ترغیب دینے کے لیے کیپٹن اشفاق شہید (ملٹری میڈل/شہید) کی یاد میں نامزد کیا گیا۔'
            ) : (
              'Established to provide quality education in the historic region of Tank. Named in memory of Captain Ashfaq Shaheed (Military Medal/Martyr) to inspire generations toward academic excellence, discipline, and patriotism.'
            )}
          </p>
          <div className="flex space-x-4 pt-2">
            <a 
              href="https://www.facebook.com/profile.php?id=61551867236243&mibextid=9R9pXO" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              style={{ backgroundColor: '#1877F2' }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com/GDC_Tank?t=A1YdUoGVr87oa-AzuwBP5A&s=09" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter" 
              style={{ backgroundColor: '#000000' }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50 transition-all duration-300 transform border border-slate-800"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/gdc_tank" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-teal-600 font-serif">
            {t('quickLinks')}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/about/history" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('aboutUs')}
              </Link>
            </li>
            <li>
              <Link to="/academics" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('academics')}
              </Link>
            </li>
            <li>
              <Link to="/admission" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('admission')}
              </Link>
            </li>
            <li>
              <Link to="/departments" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('departments')}
              </Link>
            </li>
            <li>
              <Link to="/examination" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('examination')}
              </Link>
            </li>
            <li>
              <Link to="/faculty" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('faculty')}
              </Link>
            </li>
            <li>
              <Link to="/facilities" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('facilities')}
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('gallery')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('contactUs')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Academic Programs */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-teal-600 font-serif">
            {t('offeredPrograms')}
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <Link to="/academics/pre-medical" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-4 h-4 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('fscPreMedical')}
              </Link>
            </li>
            <li>
              <Link to="/academics/pre-engineering" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-4 h-4 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('fscPreEngineering')}
              </Link>
            </li>
            <li>
              <Link to="/academics/ics" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-4 h-4 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('icsComputerScience')}
              </Link>
            </li>
            <li>
              <Link to="/academics/fa" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-4 h-4 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('faArtsHumanities')}
              </Link>
            </li>
            <li>
              <Link to="/academics/bs-computer-science" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-4 h-4 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('bsComputerScience')}
              </Link>
            </li>
            <li>
              <Link to="/academics/bs-programs" className="flex items-center hover:text-teal-400 transition-colors group">
                <ChevronRight className="w-4 h-4 mr-1 text-teal-500 group-hover:translate-x-1 transition-transform" />
                {t('home') === 'ہوم' ? 'بی ایس انگلش و نیچرل سائنسز' : 'BS English & Natural Sciences'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Details */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-teal-600 font-serif">
            {t('contactInfo')}
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>{t('home') === 'ہوم' ? COLLEGE_ADDRESS_URDU : collegeAddress}</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" />
              <span>{collegePhone}</span>
            </li>
            <li className="flex items-start pt-2">
              <GraduationCap className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-semibold text-xs uppercase tracking-wider">{t('home') === 'ہوم' ? 'منسلک تعلیمی نظام' : 'Affiliated With'}</span>
                <span className="text-xs text-slate-400">{t('home') === 'ہوم' ? 'BISE ڈیرہ اسماعیل خان / گومل یونیورسٹی' : 'BISE Dera Ismail Khan / Gomal University'}</span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright bar */}
      <div className="bg-slate-900 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <span>&copy; {currentYear} Captain Ashfaq Shaheed Degree College, Tank. {t('allRightsReserved')}</span>
          <span className="flex items-center space-x-4 flex-wrap justify-center">
            <button 
              onClick={() => setIsPrivacyOpen(true)} 
              className="hover:text-slate-400 transition-colors cursor-pointer focus:outline-none"
            >
              {t('privacyPolicy')}
            </button>
            <span>|</span>
            <button 
              onClick={() => setIsTermsOpen(true)} 
              className="hover:text-slate-400 transition-colors cursor-pointer focus:outline-none"
            >
              {t('termsOfUse')}
            </button>
            <span>|</span>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-400 hover:text-white transition-colors duration-200">
              <span className="text-[14px]">🌐</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-0 text-xs font-semibold focus:outline-none text-slate-300 cursor-pointer"
              >
                <option value="en" className="bg-slate-950 text-slate-300">English</option>
                <option value="ur" className="bg-slate-950 text-slate-300">Urdu (اردو)</option>
              </select>
            </div>
          </span>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-slate-100 dark:border-slate-800 text-left text-slate-800 dark:text-slate-200">
            <button 
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold font-serif text-blue-950 dark:text-white">{t('privacyPolicy')}</h3>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mt-0.5">{t('gdcTank') === 'جی ڈی سی ٹانک' ? 'کالج کیپٹن اشفاق شہید، ٹانک' : 'Captain Ashfaq Shaheed Degree College, Tank'}</p>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wide mb-1">{t('gdcTank') === 'جی ڈی سی ٹانک' ? '1۔ طلباء کی معلومات کے تحفظ کے رہنما اصول' : '1. Student Data Privacy Guidelines'}</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('gdcTank') === 'جی ڈی سی ٹانک' ? 'ہم آن لائن داخلہ فارم کی پروسیسنگ کے مقصد کے لیے ذاتی معلومات جمع کرتے ہیں اور ان معلومات کا مکمل تحفظ کیا جاتا ہے۔' : 'We collect personal and academic registration details solely for the purpose of online admission processing. All details are kept secure and confidential.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wide mb-1">{t('gdcTank') === 'جی ڈی سی ٹانک' ? '2۔ فارم کی حفاظت اور سیکیورٹی' : '2. Form Security'}</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('gdcTank') === 'جی ڈی سی ٹانک' ? 'ہم طلباء کے فارم-بی / شناختی کارڈ نمبرز اور موبائل رابطوں کے تحفظ کے لیے بہترین اور محفوظ ترین سیکیورٹی نظام کا استعمال کرتے ہیں۔' : 'We use secure data practices to safeguard student Form-B / CNIC numbers, mobile contacts, and transcripts from unauthorized viewing or leakages.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wide mb-1">{t('gdcTank') === 'جی ڈی سی ٹانک' ? '3۔ ڈیٹا کے استعمال کی پالیسی' : '3. Usage Policies'}</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('gdcTank') === 'جی ڈی سی ٹانک' ? 'جمع کرایا گیا ڈیٹا میرٹ لسٹ بنانے اور تعلیمی ریکارڈ کے لیے استعمال کیا جاتا ہے اور یہ معلومات صرف سرکاری محکموں جیسے BISE اور ایچ ای ڈی خیبر پختونخوا کے ساتھ شیئر کی جاتی ہیں۔' : 'Data submitted online is utilized only for registration lists, compilation of merit, and is shared strictly with official bodies such as BISE D.I. Khan and the Higher Education Department (HED) KP.'}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Use Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-slate-100 dark:border-slate-800 text-left text-slate-800 dark:text-slate-200">
            <button 
              onClick={() => setIsTermsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold font-serif text-blue-950 dark:text-white">{t('termsOfUse')}</h3>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mt-0.5">{t('gdcTank')}</p>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wide mb-1">{t('gdcTank') === 'جی ڈی سی ٹانک' ? '1۔ ویب سائٹ کا استعمال' : '1. Website Usage'}</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('gdcTank') === 'جی ڈی سی ٹانک' ? 'یہ پورٹل طلباء، والدین اور اساتذہ کی سہولت کے لیے فراہم کیا گیا ہے۔ غلط یا غیر قانونی رسائی اور غلط ڈیٹا جمع کروانا سخت ممنوع ہے۔' : 'This portal is provided to facilitate applicants, parents, and faculty members of Govt. Degree College Tank. Malicious access, spam submissions, or trying to exploit form fields is strictly forbidden.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wide mb-1">{t('gdcTank') === 'جی ڈی سی ٹانک' ? '2۔ داخلہ فارم کی درستگی کے رہنما اصول' : '2. Admission Form Accuracy Guidelines'}</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('gdcTank') === 'جی ڈی سی ٹانک' ? 'طلباء کو تعلیمی نمبرز، رول نمبرز اور بورڈ کی معلومات کو احتیاط سے درج کرنا چاہئے۔ غلط معلومات فراہم کرنے کی صورت میں درخواست فوری طور پر منسوخ کر دی جائے گی۔' : 'Students must double-check academic marks, roll numbers, and board specifications. Any false statement or intentional typo discovered in verification cancels the admission process instantly.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wide mb-1">{t('gdcTank') === 'جی ڈی سی ٹانک' ? '3۔ دستبرداری (ڈس کلیمر)' : '3. Disclaimers'}</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('gdcTank') === 'جی ڈی سی ٹانک' ? 'ویب سائٹ پر دی گئی معلومات صرف رہنمائی کے لیے ہیں۔ کالج کے نوٹس بورڈ پر چسپاں کردہ اعلانات کو ہی حتمی حیثیت حاصل ہوگی۔' : 'Online notifications, schedules, and information on programs are for reference. The notices and circulars physically pinned on the college bulletin boards serve as the final authority.'}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setIsTermsOpen(false)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
