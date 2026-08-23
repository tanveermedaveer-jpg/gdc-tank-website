import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, ShieldCheck, CheckCircle2, DollarSign, FileText } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';

export default function Admission() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const steps = [
    { 
      num: '01', 
      title: isUrdu ? 'آن لائن رجسٹریشن' : 'Online Registration', 
      desc: isUrdu 
        ? 'ہمارے آن لائن ایڈمیشن پورٹل پر ایک اکاؤنٹ بنائیں، ذاتی تفصیلات درج کریں، اور اپنا مطلوبہ پروگرام منتخب کریں۔' 
        : 'Create an account on our Online Admission Portal, fill in the personal details, and select your desired program.' 
    },
    { 
      num: '02', 
      title: isUrdu ? 'دستاویزات جمع کروانا' : 'Submit Documents', 
      desc: isUrdu 
        ? 'مطلوبہ دستاویزات (میٹرک رزلٹ کارڈ، کریکٹر سرٹیفکیٹ، ڈومیسائل، تصاویر) کی سکین شدہ کاپیاں اپ لوڈ کریں۔' 
        : 'Upload scanned copies of required documents (Matric result card, character certificate, domicile, photos).' 
    },
    { 
      num: '03', 
      title: isUrdu ? 'میرٹ لسٹ کا اجراء' : 'Merit List Generation', 
      desc: isUrdu 
        ? 'اپنے میٹرک/انٹرمیڈیٹ نمبروں کی بنیاد پر کالج کی طرف سے متعلقہ شعبے کی میرٹ لسٹوں کے جاری ہونے کا انتظار کریں۔' 
        : 'Wait for the college to release the department merit lists based on your Matric/Intermediate scores.' 
    },
    { 
      num: '04', 
      title: isUrdu ? 'انٹرویو اور فیس کی ادائیگی' : 'Interview & Fee Payment', 
      desc: isUrdu 
        ? 'اصل دستاویزات کے ساتھ مختصر انٹرویو کے لیے حاضر ہوں اور مقررہ معمولی سرکاری داخلہ فیس جمع کروائیں۔' 
        : 'Appear for a brief interview with original documents and deposit the nominal government admission fee.' 
    }
  ];

  const documents = isUrdu ? [
    'میٹرک / ایس ایس سی سرٹیفکیٹ (مارک شیٹ)',
    'انٹرمیڈیٹ / ایچ ایس ایس سی مارک شیٹ (بی ایس کے امیدواروں کے لیے)',
    'پچھلے تعلیمی ادارے کا جاری کردہ کریکٹر سرٹیفکیٹ',
    'خیبر پختونخوا کا ڈومیسائل سرٹیفکیٹ (ٹانک کو ترجیح)',
    'امیدوار کا کمپیوٹرائزڈ شناختی کارڈ (CNIC) یا فارم-B کاپی',
    'والد / سرپرست کے شناختی کارڈ کی کاپی',
    'پاسپورٹ سائز کی 4 تصاویر (نیلے بیک گراؤنڈ کے ساتھ)'
  ] : [
    'Matric / SSC Certificate (Mark Sheet)',
    'Intermediate / HSSC Mark Sheet (for BS Applicants)',
    'Character Certificate from school last attended',
    'Domicile Certificate of KP (Tank priority)',
    'CNIC or Form-B copy of the applicant',
    'Father / Guardian CNIC copy',
    '4 Passport-size photographs (Blue background)'
  ];

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
            {isUrdu ? 'داخلہ 2026-27' : 'Admissions 2026-27'}
          </h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {isUrdu ? 'ٹانک شہر کے سب سے معتبر تعلیمی ادارے کا حصہ بنیں' : 'Join the Premier Educational Institution in Tank City'}
          </p>
        </div>
      </section>

      {/* Intro and Guidelines */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-blue-950 font-serif mb-4">
                  {isUrdu ? 'داخلہ کے رہنما اصول' : 'Admission Guidelines'}
                </h2>
                <p className="text-slate-650 leading-relaxed text-sm sm:text-base">
                  {isUrdu 
                    ? 'گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج، ٹانک میں داخلے خالصتاً میرٹ کی بنیاد پر ہائر ایجوکیشن ڈیپارٹمنٹ (HED)، حکومتِ خیبر پختونخوا کی جاری کردہ پالیسی کے مطابق ہوتے ہیں۔'
                    : 'Admissions to Captain. Ashfaq Shaheed Degree College, Tank are strictly based on merit, conforming to the policy rules issued by the Higher Education Department (HED), Government of Khyber Pakhtunkhwa.'}
                </p>
              </div>

              {/* Timeline Info */}
              <div className="bg-teal-50 border border-teal-150 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-teal-950 font-serif mb-3 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-teal-700 mr-2" />
                  {isUrdu ? 'داخلہ کا اہم شیڈول (خریف 2026)' : 'Key Admission Schedule (Fall 2026)'}
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-700 mt-4">
                  <li className="flex justify-between border-b border-teal-100 pb-2">
                    <span className="font-semibold text-slate-600">{isUrdu ? 'آن لائن رجسٹریشن کا آغاز:' : 'Online Registrations Start:'}</span>
                    <span className="font-bold text-teal-800">{isUrdu ? '20 اگست، 2026' : 'August 20, 2026'}</span>
                  </li>
                  <li className="flex justify-between border-b border-teal-100 pb-2">
                    <span className="font-semibold text-slate-600">{isUrdu ? 'آن لائن درخواست جمع کرانے کی آخری تاریخ:' : 'Last Date to Submit Online Application:'}</span>
                    <span className="font-bold text-teal-800">{isUrdu ? '10 ستمبر، 2026' : 'September 10, 2026'}</span>
                  </li>
                  <li className="flex justify-between border-b border-teal-100 pb-2">
                    <span className="font-semibold text-slate-600">{isUrdu ? 'پہلی میرٹ لسٹ کا اجراء:' : 'First Merit List Display:'}</span>
                    <span className="font-bold text-teal-800">{isUrdu ? '14 ستمبر، 2026' : 'September 14, 2026'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold text-slate-600">{isUrdu ? 'کلاسز کا باقاعدہ آغاز:' : 'Commencement of Classes:'}</span>
                    <span className="font-bold text-teal-800">{isUrdu ? '20 ستمبر، 2026' : 'September 20, 2026'}</span>
                  </li>
                </ul>
              </div>

              {/* Steps grid */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 font-serif mb-6 flex items-center">
                  <ClipboardList className="w-5 h-5 text-teal-600 mr-2" />
                  {isUrdu ? 'رجسٹریشن کا مرحلہ وار طریقہ کار' : 'Step-by-Step Registration Process'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-teal-750 font-extrabold text-lg mb-2">{step.num}. {step.title}</div>
                      <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Required Documents & Fees */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Documents Checklist */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-blue-950 font-serif border-b border-slate-200 pb-3 flex items-center">
                  <FileText className="w-5 h-5 text-teal-600 mr-2" />
                  {isUrdu ? 'مطلوبہ دستاویزات' : 'Required Documents'}
                </h3>
                <ul className="space-y-3.5 mt-4 text-xs sm:text-sm text-slate-650">
                  {documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fees Structure */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-blue-950 font-serif border-b border-slate-200 pb-3 flex items-center">
                  <DollarSign className="w-5 h-5 text-teal-600 mr-1.5" />
                  {isUrdu ? 'فیس کا ڈھانچہ' : 'Fee Structure'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {isUrdu 
                    ? 'ایک سرکاری ادارہ ہونے کے ناطے، ہم انتہائی سبسڈی والی، برائے نام فیس وصول کرتے ہیں۔'
                    : 'As a government institution, we offer highly subsidized, nominal education fees.'}
                </p>
                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-650 font-medium">{isUrdu ? 'انٹرمیڈیٹ (F.Sc/ICS/FA)' : 'Intermediate (F.Sc/ICS/FA)'}</span>
                    <span className="font-bold text-slate-800">{isUrdu ? 'سالانہ ~3,500 روپے' : 'PKR ~3,500 / Year'}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-650 font-medium">{isUrdu ? 'بی ایس پروگرام (فی سمسٹر)' : 'BS Programs (Per Semester)'}</span>
                    <span className="font-bold text-slate-800">{isUrdu ? 'فی سمسٹر ~8,000 روپے' : 'PKR ~8,000 / Sem'}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200 mt-6">
                  <Link 
                    to="/apply" 
                    className="w-full block text-center bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors"
                  >
                    {isUrdu ? 'آن لائن درخواست کا آغاز' : 'Start Online Application'}
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
