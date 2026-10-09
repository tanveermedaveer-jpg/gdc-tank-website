import React from 'react';
import { Eye, Target, Award, Heart, Shield, Globe } from 'lucide-react';
import campusImg from '../../assets/campus.png';
import { useLanguage } from '../../context/LanguageContext';

export default function Vision() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const values = [
    { 
      icon: <Shield className="w-6 h-6 text-teal-600" />, 
      title: isUrdu ? 'ڈسپلن اور نظم و ضبط' : 'Discipline', 
      desc: isUrdu 
        ? 'تعلیمی اور روزمرہ کی زندگی میں نظم و ضبط، وقت کی پابندی اور اخلاقی جوابدہی کے احساس کو فروغ دینا۔' 
        : 'Fostering a sense of order, punctuality, and moral accountability in academic and daily life.' 
    },
    { 
      icon: <Award className="w-6 h-6 text-teal-600" />, 
      title: isUrdu ? 'تعلیمی فضیلت' : 'Academic Excellence', 
      desc: isUrdu 
        ? 'اعلیٰ ترین معیار کی تدریس، امتحانی کارکردگی، اور سائنسی تحقیق و ایجاد کے لیے مسلسل کوشاں رہنا۔' 
        : 'Striving for highest quality teaching, examination performance, and scientific exploration.' 
    },
    { 
      icon: <Heart className="w-6 h-6 text-teal-600" />, 
      title: isUrdu ? 'حب الوطنی اور فرض شناسی' : 'Patriotism & Duty', 
      desc: isUrdu 
        ? 'ملک و ملت سے وفاداری اور کیپٹن اشفاق شہید جیسے شہداء کی عظیم قربانیوں کے لیے دلوں میں احترام پیدا کرنا۔' 
        : 'Inspiring loyalty to the nation and respect for the legacy of martyrs like Captain Ashfaq Shaheed.' 
    },
    { 
      icon: <Globe className="w-6 h-6 text-teal-600" />, 
      title: isUrdu ? 'سماجی ذمہ داری' : 'Social Responsibility', 
      desc: isUrdu 
        ? 'شہری شعور، صاف اور سرسبز ماحول کی قدریں، اور مقامی کمیونٹی کے ساتھ فعال روابط کو پروان چڑھانا۔' 
        : 'Developing civic sense, clean-green values, and active engagement with the local community.' 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              {isUrdu ? 'وژن، مشن اور ہماری اقدار' : 'Vision, Mission & Values'}
            </h1>
            <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
              {isUrdu ? 'معیاری تعلیم اور کردار سازی کا ہمارا روڈ میپ' : 'Our Roadmap to Quality Education & Character Building'}
            </p>
          </div>
        </section>

        {/* Vision & Mission Row */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Vision Card */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                    <Eye className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-950 font-serif mb-4">
                    {isUrdu ? 'ہمارا وژن' : 'Our Vision'}
                  </h2>
                  <p className="text-slate-650 leading-relaxed text-base">
                    {isUrdu 
                      ? 'ایک ممتاز سرکاری شعبے کے کالج کے طور پر پہچانا جانا جو طلباء کو انتہائی علم دوست، اخلاقی طور پر مضبوط اور سماجی طور پر ذمہ دار شہریوں میں تبدیل کرتا ہے، جو جدید پیشوں میں مہارت حاصل کرنے اور علاقائی و قومی ترقی میں مثبت کردار ادا کرنے کے قابل ہوں۔'
                      : 'To be recognized as a leading public sector college that transforms students into highly knowledgeable, ethically sound, and socially responsible citizens, capable of excelling in modern professions and contributing positively to regional and national development.'}
                  </p>
                </div>
                <div className="w-16 h-1 bg-teal-600 mt-8 rounded-full"></div>
              </div>

              {/* Mission Card */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-650 mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-950 font-serif mb-4">
                    {isUrdu ? 'ہمارا مشن' : 'Our Mission'}
                  </h2>
                  <p className="text-slate-650 leading-relaxed text-base">
                    {isUrdu
                      ? 'ہمارا مشن سائنس، ہیومینیٹیز اور آئی ٹی کے شعبوں میں معیاری انٹرمیڈیٹ اور ہائر انڈر گریجویٹ تعلیم تک یکساں اور سستی رسائی فراہم کرنا ہے۔ ہمارا مقصد منطقی استدلال کو پروان چڑھانا، سائنسی تحقیق کو فروغ دینا، قومی اقدار کو بیدار کرنا اور سرگرم اساتذہ کی رہنمائی میں نظم و ضبط سے بھرپور کردار بنانا ہے۔'
                      : 'Our mission is to provide equal and affordable access to qualitative intermediate and higher undergraduate education in sciences, humanities, and IT. We aim to nurture logical reasoning, promote scientific research, instill national values, and build disciplined characters through dedicated teaching and guidance.'}
                  </p>
                </div>
                <div className="w-16 h-1 bg-teal-600 mt-8 rounded-full"></div>
              </div>

            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-slate-50 py-20 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-blue-950 font-serif">
                {isUrdu ? 'ہماری بنیادی اقدار' : 'Our Core Values'}
              </h2>
              <p className="text-slate-550 mt-2 text-sm sm:text-base">
                {isUrdu 
                  ? 'وہ بنیادی اصول جو ہمارے ادارے کے کلچر، پالیسیوں اور برتاؤ کی رہنمائی کرتے ہیں۔'
                  : "The fundamental principles that guide our institute's culture, policies, and behavior."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((v, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 flex gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-serif mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-650 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
