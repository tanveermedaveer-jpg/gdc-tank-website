import { useState, useEffect } from 'react';
import { Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import campusImg from '../assets/campus.png';
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
  const { t } = useLanguage();
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

  useEffect(() => {
    return subscribeLocalData('settings', (settings) => {
      setCollegePhone(resolveCollegePhone(settings.phone));
      setCollegeAddress(resolveCollegeAddress(settings.address));
    }, (error) => console.error('Unable to load local college contact details:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save message to inquiries in localStorage
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

    const storedInquiries = localStorage.getItem('casdct_inquiries');
    const inquiriesList = storedInquiries ? JSON.parse(storedInquiries) : [];
    inquiriesList.push(newInquiry);
    localStorage.setItem('casdct_inquiries', JSON.stringify(inquiriesList));

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
    <div className="flex-grow">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
            {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
          </h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {isUrdu ? 'ہم آپ کے سوالات کے جوابات دینے کے لیے یہاں ہیں' : 'We are Here to Answer Your Questions'}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-blue-950 font-serif mb-6">
                {isUrdu ? 'ہمیں پیغام بھیجیں' : 'Send us a Message'}
              </h2>
              
              {submitted ? (
                <div className="bg-teal-50 border border-teal-200 text-teal-855 p-6 rounded-xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-teal-650 mx-auto" />
                  <h3 className="font-bold text-lg">{isUrdu ? 'شکریہ!' : 'Thank You!'}</h3>
                  <p className="text-sm">
                    {isUrdu 
                      ? 'آپ کا پیغام کامیابی کے ساتھ بھیج دیا گیا ہے۔ ہمارا سپورٹ آفس جلد ہی آپ سے رابطہ کرے گا۔' 
                      : 'Your message has been sent successfully. Our support office will contact you shortly.'}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider mt-4"
                  >
                    {isUrdu ? 'دوسرا پیغام بھیجیں' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {isUrdu ? 'مکمل نام' : 'Full Name'}
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-700"
                        placeholder={isUrdu ? 'اپنا مکمل نام درج کریں' : 'Enter your full name'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {isUrdu ? 'ای میل ایڈریس' : 'Email Address'}
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-700"
                        placeholder={isUrdu ? 'اپنا ای میل پتہ درج کریں' : 'Enter your email address'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {isUrdu ? 'فون نمبر' : 'Phone Number'}
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-700"
                        placeholder={isUrdu ? 'سرگرم موبائل نمبر درج کریں' : 'Enter active mobile number'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {isUrdu ? 'موضوع' : 'Subject'}
                      </label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-650"
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
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {isUrdu ? 'آپ کا پیغام' : 'Your Message'}
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-700"
                      placeholder={isUrdu ? 'اپنا پیغام یا پوچھ گچھ یہاں لکھیں...' : 'Write your message or inquiry here...'}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center text-sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isUrdu ? 'پیغام بھیجیں' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Contact info & Map */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* College Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-bold text-blue-950 font-serif border-b border-slate-200 pb-3">
                  {isUrdu ? 'کیمپس ایڈریس کی تفصیلات' : 'Campus Address Details'}
                </h3>

                <ul className="space-y-4 text-slate-650 text-sm">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 text-teal-655 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{isUrdu ? COLLEGE_ADDRESS_URDU : collegeAddress}</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="w-5 h-5 text-teal-655 mr-3 flex-shrink-0" />
                    <span>{collegePhone}</span>
                  </li>
                </ul>
              </div>

              {/* Embedded Google Map */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                <div className="px-5 py-4">
                  <h3 className="text-sm font-bold text-blue-950">Government Captain Ashfaq Shaheed Degree College, Tank</h3>
                  <p className="mt-1 text-xs text-slate-500">{COLLEGE_ADDRESS}</p>
                </div>
                <div className="relative h-64 bg-teal-50">
                  <iframe
                    title={`Government Captain Ashfaq Shaheed Degree College, Tank — ${COLLEGE_ADDRESS}`}
                    src="https://www.google.com/maps?q=32.2106769,70.3950047&z=17&output=embed"
                    className="absolute inset-0 z-0 h-full w-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="flex justify-end p-3">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=32.2106769%2C70.3950047"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-lg transition-colors tracking-wide uppercase inline-flex items-center"
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {isUrdu ? 'گوگل میپس پر کھولیں' : 'Open in Google Maps'}
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
