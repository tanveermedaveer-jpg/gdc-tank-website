import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Milestone, Shield, Calendar, Users, GraduationCap } from 'lucide-react';
import campusImg from '../../assets/campus.png';
import { useLanguage } from '../../context/LanguageContext';

export default function History() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const milestones = [
    { 
      year: '1970s', 
      title: isUrdu ? 'بنیاد رکھی گئی' : 'Foundation Laid', 
      desc: isUrdu 
        ? 'کالج ابتدائی طور پر گورنمنٹ ڈگری کالج، ٹانک کے طور پر قائم کیا گیا تھا تاکہ ضلع ٹانک اور ملحقہ قبائلی علاقوں کے طلباء کی تعلیمی ضروریات کو پورا کیا جا سکے۔' 
        : 'The college was initially established as Government Degree College, Tank, to serve the underserved educational needs of the students in the Tank district and adjoining tribal regions.' 
    },
    { 
      year: '2000s', 
      title: isUrdu ? 'کیپٹن اشفاق شہید کے نام سے منسوب' : 'Naming after Captain Ashfaq Shaheed', 
      desc: isUrdu 
        ? 'کیپٹن اشفاق (ملٹری میڈل) کی طرف سے دی گئی عظیم قربانی کے اعتراف میں، جنہوں نے فعال فوجی سروس کے دوران جامِ شہادت نوش کیا، کالج کا نام ان کے اعزاز میں تبدیل کر دیا گیا۔' 
        : 'In recognition of the supreme sacrifice made by Captain Ashfaq (Military Medal) who embraced martyrdom (Shahadat) during active military service, the college was renamed in his honor.' 
    },
    { 
      year: '2016', 
      title: isUrdu ? 'بی ایس پروگرام الحاق' : 'BS Program Affiliation', 
      desc: isUrdu 
        ? 'قومی تعلیمی پالیسی کے مطابق کالج کو گومل یونیورسٹی کے ساتھ منسلک کرتے ہوئے 4 سالہ بی ایس ڈگری پروگرام متعارف کرایا گیا۔' 
        : 'Introduced 4-Year BS degree programs in affiliation with Gomal University, aligning the college with the National Education Policy.' 
    },
    { 
      year: '2022', 
      title: isUrdu ? 'کیمپس کی توسیع' : 'Campus Expansion', 
      desc: isUrdu 
        ? 'نئے تعلیمی بلاکس، جدید کمپیوٹر لیبارٹریز اور سائنسی تحقیقی سہولیات کی اپ گریڈیشن مکمل کی گئی۔' 
        : 'Completed new academic blocks, modern computer laboratories, and upgraded scientific research facilities.' 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex-grow">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              {isUrdu ? 'کالج کی تاریخ اور پس منظر' : 'College History & Background'}
            </h1>
            <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
              {isUrdu ? 'شہادت کو خراجِ عقیدت، تعلیم کا فروغ' : 'Honoring Martyrdom, Fostering Education'}
            </p>
          </div>
        </section>

        {/* Main Narrative */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Narrative Box */}
              <div className="lg:col-span-7 space-y-6 text-slate-650 leading-relaxed">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-teal-600 mr-2 flex-shrink-0" />
                  {isUrdu ? 'کیپٹن اشفاق شہید کون تھے؟' : 'Who was Captain Ashfaq Shaheed?'}
                </h2>
                {isUrdu ? (
                  <>
                    <p>
                      کیپٹن اشفاق شہید پاک فوج کے ایک بہادر فوجی افسر تھے جنہوں نے اپنی ملازمت کے دوران مثالی شجاعت، قیادت اور لگن کا مظاہرہ کیا۔ وہ اسی علاقے سے تعلق رکھتے تھے اور اپنے ثابت قدم کردار کے لیے جانے جاتے تھے۔
                    </p>
                    <p>
                      انہوں نے ریاست کی خودمختاری کا دفاع کرتے ہوئے فرض کی راہ میں اپنی جان کا نذرانہ پیش کیا۔ ان کی بہادری، حب الوطنی اور عظیم قربانی کے اعتراف میں، حکومتِ خیبر پختونخوا نے ٹانک ضلع کے اہم ترین تعلیمی ادارے کا نام تبدیل کر کے <strong>گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج، ٹانک</strong> رکھ دیا۔
                    </p>
                    <h3 className="text-xl font-bold text-slate-800 font-serif pt-4">تعلیم میں وراثت</h3>
                    <p>
                      پچھلی دہائیوں کے دوران، یہ ادارہ ایک چھوٹے انٹرمیڈیٹ کالج سے ترقی کر کے ایک بڑے ڈگری دینے والے مرکز میں تبدیل ہو چکا ہے۔ اس نے ٹانک، وزیرستان، ڈیرہ اسماعیل خان اور ارد گرد کے علاقوں کے طلباء کے لیے اعلیٰ تعلیم کے دروازے کھولے ہیں۔
                    </p>
                    <p>
                      آج، یہ کالج خیبر پختونخوا کے ہائر ایجوکیشن ڈیپارٹمنٹ (HED) کے تحت ایک معتبر مقام رکھتا ہے، جو اپنے انٹرمیڈیٹ پروگراموں کے لیے بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن (BISE) ڈیرہ اسماعیل خان اور اپنے 4 سالہ بی ایس ڈگری پروگراموں کے لیے گومل یونیورسٹی سے منسلک ہے۔
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Captain Ashfaq Shaheed was a brave military officer of the Pakistan Army who demonstrated exemplary courage, leadership, and dedication during his service. He hailed from the region and was known for his steadfast character.
                    </p>
                    <p>
                      He laid down his life in the line of duty, defending the sovereignty of the state. In recognition of his valor, patriotism, and supreme sacrifice, the Government of Khyber Pakhtunkhwa renamed the premier government educational institute of Tank District as the <strong>Captain Ashfaq Shaheed Degree College, Tank</strong>.
                    </p>
                    <h3 className="text-xl font-bold text-slate-800 font-serif pt-4">Legacy in Education</h3>
                    <p>
                      Over the past decades, the institution has evolved from a small intermediate college into a major degree-granting center. It has opened doors of higher learning to students from Tank, Waziristan, Dera Ismail Khan, and surrounding zones.
                    </p>
                    <p>
                      Today, the college holds a prestigious status under the Higher Education Department (HED) of Khyber Pakhtunkhwa, affiliated with the Board of Intermediate and Secondary Education (BISE) Dera Ismail Khan for its intermediate programs, and Gomal University for its BS 4-Year degree programs.
                    </p>
                  </>
                )}
              </div>

              {/* Right Quick Info Box */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-blue-950 mb-6 font-serif border-b border-slate-200 pb-3 flex items-center">
                    <GraduationCap className="w-5 h-5 text-teal-600 mr-2" />
                    {isUrdu ? 'ایک نظر میں' : 'At a Glance'}
                  </h3>
                  <ul className="space-y-4 text-sm text-slate-650">
                    <li className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">{isUrdu ? 'قائم ہوا' : 'Established'}</span>
                      <span className="font-bold text-slate-800">1970s</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">{isUrdu ? 'الحاق (انٹرمیڈیٹ)' : 'Affiliation (Inter)'}</span>
                      <span className="font-bold text-slate-800">{isUrdu ? 'BISE ڈیرہ اسماعیل خان' : 'BISE Dera Ismail Khan'}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">{isUrdu ? 'الحاق (بی ایس ڈگری)' : 'Affiliation (BS Degree)'}</span>
                      <span className="font-bold text-slate-800">{isUrdu ? 'گومل یونیورسٹی، ڈی آئی خان' : 'Gomal University, D.I. Khan'}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">{isUrdu ? 'مقام' : 'Location'}</span>
                      <span className="font-bold text-slate-800">{isUrdu ? 'ٹانک شہر، خیبر پختونخوا' : 'Tank City, KP, Pakistan'}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">{isUrdu ? 'قسم' : 'Type'}</span>
                      <span className="font-bold text-slate-800">{isUrdu ? 'سرکاری کالج' : 'Public/Government College'}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">{isUrdu ? 'صنف داخلہ' : 'Gender Intake'}</span>
                      <span className="font-bold text-slate-800">{isUrdu ? 'صرف لڑکے (بی ایس میں مخلوط)' : 'Male (Co-ed BS options)'}</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Historical Milestones Timeline */}
        <section className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">
                {isUrdu ? 'تاریخی سنگِ میل' : 'Historical Milestones'}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {isUrdu ? 'کالج کی ترقی اور توسیع کے اہم مراحل۔' : 'Key phases in the development and expansion of the college.'}
              </p>
            </div>

            <div className="relative border-l-2 border-teal-500/30 ml-4 md:ml-10 space-y-12">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-3.5 top-1 bg-teal-600 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-slate-50 group-hover:bg-blue-900 transition-colors">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="inline-block bg-teal-100 text-teal-800 font-bold text-xs px-3 py-1 rounded-full mb-2">
                      {m.year}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-slate-800 mb-2">{m.title}</h3>
                    <p className="text-slate-650 text-sm max-w-3xl leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
