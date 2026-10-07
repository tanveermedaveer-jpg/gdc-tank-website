import { useState, useEffect } from 'react';
import { Phone, MapPin, Send, CheckCircle, Globe } from 'lucide-react';
import campusImg from '../assets/campus.png';
import logoImg from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';
import {
  COLLEGE_ADDRESS,
  COLLEGE_ADDRESS_URDU,
  COLLEGE_PHONE,
  resolveCollegeAddress,
  resolveCollegePhone
} from '../lib/contactDetails';
import { subscribeLocalData } from '../lib/adminApi';

export default function Contact() {
  const { t, language, setLanguage } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'admission',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [collegePhone, setCollegePhone] = useState(COLLEGE_PHONE);
  const [collegeAddress, setCollegeAddress] = useState(COLLEGE_ADDRESS);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeLocalData('settings', (settings) => {
      if (!isMounted) return;
      setCollegePhone(resolveCollegePhone(settings.phone));
      setCollegeAddress(resolveCollegeAddress(settings.address));
      setContactError('');
    }, (error) => {
      if (!isMounted) return;
      console.error('Unable to load local college contact details:', error);
      setContactError('Contact details could not be updated from local settings.');
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newInquiry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      read: false
    };

    try {
      const storedInquiries = localStorage.getItem('casdct_inquiries');
      const inquiriesList = storedInquiries ? JSON.parse(storedInquiries) : [];
      inquiriesList.push(newInquiry);
      localStorage.setItem('casdct_inquiries', JSON.stringify(inquiriesList));
    } catch (err) {
      console.error('Failed to save inquiry to localStorage:', err);
    }

    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'admission', message: '' });
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* FULL NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-blue-950 block">
                {isUrdu ? 'کیپٹن اشفاق شہید ڈگری کالج' : 'Captain Ashfaq Shaheed'}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                {isUrdu ? 'ڈگری کالج ٹانک' : 'Degree College, Tank'}
              </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <a href="/" className="hover:text-teal-700 transition-colors">{isUrdu ? 'ہوم' : 'Home'}</a>
            <a href="/about" className="hover:text-teal-700 transition-colors">{isUrdu ? 'تعارف' : 'About Us'}</a>
            <a href="/academics" className="hover:text-teal-700 transition-colors">{isUrdu ? 'تعلیم' : 'Academics'}</a>
            <a href="/admission" className="hover:text-teal-700 transition-colors">{isUrdu ? 'داخلہ' : 'Admission'}</a>
            <a href="/departments" className="hover:text-teal-700 transition-colors">{isUrdu ? 'شعبہ جات' : 'Departments'}</a>
            <a href="/examination" className="hover:text-teal-700 transition-colors">{isUrdu ? 'امتحانات' : 'Examination'}</a>
            <a href="/faculty" className="hover:text-teal-700 transition-colors">{isUrdu ? 'فیکلٹی' : 'Faculty'}</a>
            <a href="/facilities" className="hover:text-teal-700 transition-colors">{isUrdu ? 'سولیٹیز' : 'Facilities'}</a>
            <a href="/gallery" className="hover:text-teal-700 transition-colors">{isUrdu ? 'گیلری' : 'Gallery'}</a>
            <a href="/contact" className="text-teal-700 font-bold border-b-2 border-teal-700 pb-1">{isUrdu ? 'رابطہ' : 'Contact Us'}</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
              className="bg-slate-100 hover:bg-slate-200 text-teal-800 border border-teal-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-colors"
            >
              <Globe className="w-3.5 h-3.5 mr-1"/>
              {isUrdu ? 'English' : 'اردو'}
            </button>
            <a href="/admission" className="hidden sm:inline-block bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
              {isUrdu ? 'آن لائن अप्लाई کریں' : 'Apply Now'}
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        <section className="bg-slate-900 text-white py-12 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mb-2">
              {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
            </h1>
            <p className="text-teal-300 text-xs sm:text-sm font-semibold max-w-xl mx-auto uppercase tracking-wider">
              {isUrdu ? 'ہم آپ کے سوالات کے جوابات دینے کے لیے یہاں ہیں' : 'We are Here to Answer Your Questions'}
            </p>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {contactError && (
              <div role="alert" className="mb-6 text-center text-xs font-semibold text-rose-700">
                {contactError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-blue-950 font-serif mb-5">
                  {isUrdu ? 'ہمیں پیغام بھیجیں' : 'Send us a Message'}
                </h2>
                
                {submitted ? (
                  <div className="bg-teal-50 border border-teal-200 text-teal-900 p-6 rounded-xl text-center space-y-3">
                    <CheckCircle className="w-10 h-10 text-teal-600 mx-auto"/>
                    <h3 className="font-bold text-base">{isUrdu ? 'شکریہ!' : 'Thank You!'}</h3>
                    <p className="text-xs">
                      {isUrdu 
                        ? 'آپ کا پیغام کامیابی کے ساتھ بھیج دیا گیا ہے۔ ہمارا سپورٹ آفس جلد ہی آپ سے رابطہ کرے گا۔' 
                        : 'Your message has been sent successfully. Our support office will contact you shortly.'}
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider mt-3"
                    >
                      {isUrdu ? 'دوسرا پیغام بھیجیں' : 'Send another message'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'مکمل نام' : 'Full Name'}
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                          placeholder={isUrdu ? 'اپنا مکمل نام درج کریں' : 'Enter your full name'}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'ای میل ایڈریس' : 'Email Address'}
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                          placeholder={isUrdu ? 'اپنا ای میل پتہ درج کریں' : 'Enter your email address'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'فون نمبر' : 'Phone Number'}
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                          placeholder={isUrdu ? 'سرگرم موبائل نمبر درج کریں' : 'Enter active mobile number'}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'موضوع' : 'Subject'}
                        </label>
                        <select 
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                        >
                          <option value="admission">{isUrdu ? 'داخلہ سے متعلق معلومات' : 'Admissions Inquiry'}</option>
                          <option value="examination">{isUrdu ? 'امتحانات اور نتائج' : 'Examinations & Results'}</option>
                          <option value="scholarship">{isUrdu ? 'اسکالرشپ اور مالی امداد' : 'Scholarships & Financial Aid'}</option>
                          <option value="migration">{isUrdu ? 'کالج سرٹیفکیٹ اور مائگریشن' : 'College Certificates & Migration'}</option>
                          <option value="hostel">{isUrdu ? 'ہاسٹل کی رہائش' : 'Hostel Accommodation'}</option>
                          <option value="other">{isUrdu ? 'عام رائے / دیگر' : 'General Feedback / Other'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {isUrdu ? 'آپ کا پیغام' : 'Your Message'}
                      </label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                        placeholder={isUrdu ? 'اپنا پیغام یا پوچھ گچھ یہاں لکھیں...' : 'Write your message or inquiry here...'}
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center justify-center text-xs w-full sm:w-auto"
                    >
                      <Send className="w-3.5 h-3.5 mr-2"/>
                      {isUrdu ? 'پیغام بھیجیں' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
                  <h3 className="text-base font-bold text-blue-950 font-serif border-b border-slate-200 pb-2.5">
                    {isUrdu ? 'کیمپس ایڈریس کی تفصیلات' : 'Campus Address Details'}
                  </h3>
                  <ul className="space-y-3 text-slate-600 text-xs">
                    <li className="flex items-start">
                      <MapPin className="w-4 h-4 text-teal-600 mr-2.5 mt-0.5 flex-shrink-0"/>
                      <span>{isUrdu ? COLLEGE_ADDRESS_URDU : collegeAddress}</span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="w-4 h-4 text-teal-600 mr-2.5 flex-shrink-0"/>
                      <span>{collegePhone}</span>
                    </li>
                  </ul>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="px-4 py-3">
                    <h3 className="text-xs font-bold text-blue-950">Government Captain Ashfaq Shaheed Degree College, Tank</h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">{COLLEGE_ADDRESS}</p>
                  </div>
                  <div className="relative h-48 bg-teal-50">
                    <iframe
                      title={`Government Captain Ashfaq Shaheed Degree College, Tank — ${COLLEGE_ADDRESS}`}
                      src="https://www.google.com/maps?q=32.2106769,70.3950047&z=17&output=embed"
                      className="absolute inset-0 z-0 h-full w-full border-0"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="flex justify-end p-2.5">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=32.2106769%2C70.3950047"
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] shadow-sm transition-colors tracking-wide uppercase inline-flex items-center"
                    >
                      <MapPin className="w-3 h-3 mr-1"/>
                      {isUrdu ? 'گوگل میپس پر کھولیں' : 'Open in Google Maps'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FULL PROFESSIONAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 pt-12 pb-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-serif font-bold text-sm text-white block">Captain Ashfaq Shaheed</span>
                <span className="text-[10px] text-teal-400 uppercase tracking-wider block">Degree College, Tank</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Established to provide quality education in the historic region of Tank. Named in memory of Captain Ashfaq Shaheed to inspire generations toward academic excellence, discipline, and patriotism.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="/" className="hover:text-teal-300 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-teal-300 transition-colors">About Us</a></li>
              <li><a href="/academics" className="hover:text-teal-300 transition-colors">Academics</a></li>
              <li><a href="/admission" className="hover:text-teal-300 transition-colors">Admission</a></li>
              <li><a href="/departments" className="hover:text-teal-300 transition-colors">Departments</a></li>
              <li><a href="/contact" className="hover:text-teal-300 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Offered Programs</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="/academics" className="hover:text-teal-300 transition-colors">F.Sc Pre-Medical</a></li>
              <li><a href="/academics" className="hover:text-teal-300 transition-colors">F.Sc Pre-Engineering</a></li>
              <li><a href="/academics" className="hover:text-teal-300 transition-colors">ICS (Computer Science)</a></li>
              <li><a href="/academics" className="hover:text-teal-300 transition-colors">F.A (Arts & Humanities)</a></li>
              <li><a href="/academics" className="hover:text-teal-300 transition-colors">BS Computer Science</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Contact Info</h4>
            <ul className="space-y-2.5 text-[11px]">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-teal-400 mr-2 flex-shrink-0 mt-0.5"/>
                <span>Main Bannu Road, Opposite Polytechnic Institute, District Tank</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-teal-400 mr-2 flex-shrink-0"/>
                <span>+92 306 5927447</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Government Captain Ashfaq Shaheed Degree College, Tank. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="/" className="hover:text-teal-300 transition-colors">Home</a>
            <a href="/contact" className="hover:text-teal-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
