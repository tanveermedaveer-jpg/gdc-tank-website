import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import campusImg from '../../assets/campus.png'; // آپ کے پاتھ کے مطابق (اگر ضرورت ہو)
import { useLanguage } from '../../context/LanguageContext';

export default function History() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. اوپر نیویگیشن بار */}
      <Navbar />

      {/* 2. صفحہ کا اصل مواد (Main Content) */}
      <div className="flex-grow">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              {t('historyAndBackground') || 'History & Background'}
            </h1>
          </div>
        </section>

        {/* Details Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-700 leading-relaxed space-y-4">
            {/* آپ کا جو بھی ہسٹری کا پرانا مواد (content) ہے وہ یہاں رہے گا */}
            <p>یہاں آپ کی کالج کی ہسٹری کا مواد موجود ہوگا۔</p>
          </div>
        </section>
      </div>

      {/* 3. نیچے فوٹر */}
      <Footer />
    </div>
  );
}
