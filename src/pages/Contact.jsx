import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // لوکل اسٹوریج میں محفوظ کرنے کا محفوظ طریقہ
    try {
      const newInquiry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        ...formData
      };
      const storedInquiries = localStorage.getItem('casdct_inquiries');
      const inquiriesList = storedInquiries ? JSON.parse(storedInquiries) : [];
      inquiriesList.push(newInquiry);
      localStorage.setItem('casdct_inquiries', JSON.stringify(inquiriesList));
    } catch (err) {
      console.error('Failed to save inquiry:', err);
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'Admissions Inquiry', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. پروجیکٹ کا اصل نیویگیشن بار */}
      <Navbar />

      {/* 2. مین کانٹیکٹ سیکشن */}
      <main className="flex-grow">
        {/* بینر ہیڈر */}
        <section className="bg-slate-900 text-white py-12 relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 opacity-90"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2 tracking-wide text-white">
              Contact Us
            </h1>
            <p className="text-teal-300 text-xs sm:text-sm font-semibold max-w-xl mx-auto uppercase tracking-widest">
              WE ARE HERE TO ANSWER YOUR QUESTIONS
            </p>
          </div>
        </section>

        {/* فارم اور میپ کا سیکشن */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* بائیں طرف: کانٹیکٹ فارم */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-100">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-blue-950 font-serif">
                    Send us a Message
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">Fill out the form below and our team will get back to you shortly.</p>
                </div>
                
                {submitted ? (
                  <div className="bg-teal-50 border border-teal-200 text-teal-900 p-8 rounded-2xl text-center space-y-3">
                    <h3 className="font-bold text-lg">Thank You!</h3>
                    <p className="text-xs text-teal-700 max-w-md mx-auto leading-relaxed">
                      Your message has been sent successfully. Our support office will contact you shortly.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider mt-4 shadow-md transition-all"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                          placeholder="Enter active mobile number"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Subject
                        </label>
                        <select 
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                        >
                          <option value="Admissions Inquiry">Admissions Inquiry</option>
                          <option value="Examinations & Results">Examinations & Results</option>
                          <option value="Scholarships & Financial Aid">Scholarships & Financial Aid</option>
                          <option value="General Feedback / Other">General Feedback / Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                        placeholder="Write your message or inquiry here..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center text-xs uppercase tracking-wider w-full sm:w-auto"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* دائیں طرف: ایڈریس اور درست لائیو گوگل میپ */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* ایڈریس باکس */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-100 space-y-4">
                  <h3 className="text-base font-bold text-blue-950 font-serif border-b border-slate-100 pb-3">
                    Campus Address Details
                  </h3>
                  <div className="space-y-3 text-slate-600 text-xs">
                    <p className="flex items-start">
                      <span className="mr-2">📍</span> 
                      <span>Main Bannu Road, Opposite Polytechnic Institute, District Tank</span>
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📞</span> 
                      <span className="font-semibold">+92 306 5927447</span>
                    </p>
                  </div>
                </div>

                {/* گوگل میپ کا درست ایمبیڈ باکس */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-100">
                  <div className="p-4 bg-slate-900 text-white">
                    <h3 className="text-xs font-bold">Government Captain Ashfaq Shaheed Degree College, Tank</h3>
                    <p className="mt-1 text-[11px] text-teal-300">Main Bannu Road, Opposite Polytechnic Institute, District Tank</p>
                  </div>
                  
                  {/* لائیو گوگل میپ فریم */}
                  <div className="relative h-56 bg-slate-100 w-full">
                    <iframe
                      title="College Location Map"
                      src="https://www.google.com/maps?q=32.2106769,70.3950047&z=17&output=embed"
                      className="absolute inset-0 z-0 h-full w-full border-0"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=32.2106769%2C70.3950047"
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-2 rounded-xl text-[10px] shadow-sm transition-colors tracking-wider uppercase inline-flex items-center"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      {/* 3. پروجیکٹ کا اصل فوٹر */}
      <Footer />

    </div>
  );
}
