import React from 'react';
import Navbar from '../components/Navbar'; // اگر آپ کے پاتھ میں فولڈر کا فرق ہو تو اسے اپنے پروجیکٹ کے مطابق ایڈجسٹ کر لیں
import Footer from '../components/Footer'; // اگر فوٹر الگ کمپوننت ہے تو اسے یہاں امپورٹ کریں

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 1. مکمل نیویگیشن بار */}
      <Navbar />

      {/* 2. اصل کانٹیکٹ پیج کا مواد (Main Content) */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400">WE ARE HERE TO ANSWER YOUR QUESTIONS</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Send us a Message Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">FULL NAME</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">PHONE NUMBER</label>
                  <input
                    type="text"
                    placeholder="Enter active mobile number"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SUBJECT</label>
                  <select className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Admissions Inquiry</option>
                    <option>General Support</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">YOUR MESSAGE</label>
                <textarea
                  rows="4"
                  placeholder="Write your message or inquiry here..."
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Campus Address & Map Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Campus Address Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-start gap-2">
                <span>📍</span> Main Bannu Road, Opposite Polytechnic Institute, District Tank
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span>📞</span> +92 306 5927447
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-sm mb-2">Government Captain Ashfaq Shaheed Degree College, Tank</h4>
              <p className="text-xs text-gray-500 mb-3">Main Bannu Road, Opposite Polytechnic Institute, District Tank</p>
              <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* نقشہ یا لوکیشن پلیس ہولڈر */}
                <span className="text-sm text-gray-600 dark:text-gray-300">Google Map Preview</span>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-xs bg-teal-600 text-white px-4 py-2 rounded font-medium hover:bg-teal-700 transition-colors"
              >
                OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* 3. مکمل فوٹر */}
      <Footer />
    </div>
  );
}
