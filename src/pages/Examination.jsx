import { useEffect, useState } from 'react';
import { Download, Landmark, FileText, CheckSquare, ShieldAlert, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import campusImg from '../assets/campus.png';
import { getLocalFileUrl, subscribeLocalData } from '../lib/adminApi';

export default function Examination() {
  const { t, language } = useLanguage();
  const [circulars, setCirculars] = useState([]);
  const [isLoadingCirculars, setIsLoadingCirculars] = useState(true);
  const [circularsError, setCircularsError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCirculars(true);
    const unsubscribe = subscribeLocalData('circulars', async (items) => {
      try {
        const published = await Promise.all(items.map(async (circular) => ({
          ...circular,
          public_url: await getLocalFileUrl(circular.storage_path)
        })));
        if (!isMounted) return;
        setCirculars(published.sort((a, b) =>
          b.publish_date.localeCompare(a.publish_date) || b.created_at.localeCompare(a.created_at)
        ));
        setCircularsError('');
      } catch (error) {
        if (!isMounted) return;
        console.error('Unable to load local examination circulars:', error);
        setCircularsError('A saved circular file could not be loaded.');
      } finally {
        if (isMounted) setIsLoadingCirculars(false);
      }
    }, (error) => {
      if (!isMounted) return;
      console.error('Unable to subscribe to local examination circulars:', error);
      setCircularsError('Circulars could not be loaded. Please try again.');
      setIsLoadingCirculars(false);
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reloadKey]);

  return (
    <div className="flex-grow">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('examinationsRules')}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {t('examBannerSub')}
          </p>
        </div>
      </section>

      {/* Main Info */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Exam policy */}
              <div>
                <h2 className="text-2xl font-bold text-blue-950 font-serif mb-4 flex items-center">
                  <Landmark className="w-6 h-6 text-teal-600 mr-2" />
                  {t('affiliatedSystems')}
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                  <p>
                    {t('home') === 'ہوم' ? (
                      <>
                        <strong>انٹرمیڈیٹ پروگرامز (F.Sc, ICS, FA)</strong> <strong>بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن (BISE) ڈیرا اسماعیل خان</strong> کے وضع کردہ قواعد کے مطابق منعقد کیے جاتے ہیں۔ امتحانات سالانہ بنیادوں پر منعقد کیے جاتے ہیں۔
                      </>
                    ) : (
                      <>
                        <strong>Intermediate Programs (F.Sc, ICS, FA)</strong> are conducted in accordance with the regulations set by the <strong>Board of Intermediate and Secondary Education (BISE) Dera Ismail Khan</strong>. The exams are conducted on an annual basis (Annual-I and Annual-II systems).
                      </>
                    )}
                  </p>
                  <p>
                    {t('home') === 'ہوم' ? (
                      <>
                        <strong>بی ایس ڈگری پروگرامز (BS 4-Year Honors)</strong> سمسٹر سسٹم کے تحت چلتے ہیں اور <strong>گومل یونیورسٹی، ڈی آئی خان</strong> کے قواعد و ضوابط کے تحت چلائے جاتے ہیں۔ اس کا انحصار مڈ ٹرم، کوئز، اور فائنل امتحانات پر ہوتا ہے۔
                      </>
                    ) : (
                      <>
                        <strong>Undergraduate Degrees (BS 4-Year Honors)</strong> follow the semester system and are conducted under the rules and direct supervision of <strong>Gomal University, D.I. Khan</strong>. Grades are based on midterm tests, quizzes, assignments, and final semester end examinations.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Rules and Regulations */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-slate-800 font-serif mb-4 flex items-center">
                  <CheckSquare className="w-5 h-5 text-teal-600 mr-2" />
                  {t('examinationCodeOfConduct')}
                </h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 flex-shrink-0 text-xs">1</span>
                    <span>
                      {t('home') === 'ہوم' ? (
                        <><strong>حاضری کی ضرورت:</strong> بورڈ اور یونیورسٹی دونوں امتحانات میں بیٹھنے کا اہل ہونے کے لیے طلباء کو لیکچرز اور پریکٹیکل سیشنز میں کم از کم 75 فیصد حاضری برقرار رکھنی ہوگی۔</>
                      ) : (
                        <><strong>Attendance Requirement:</strong> Students must maintain a minimum of 75% attendance in lectures and practical sessions to be eligible to sit for both board and university examinations.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 flex-shrink-0 text-xs">2</span>
                    <span>
                      {t('home') === 'ہوم' ? (
                        <><strong>تشخیصی پالیسی:</strong> بی ایس پروگرام کے درجات 20 فیصد اندرونی تشخیص (اسائنمنٹس، حاضری، کوئز)، 30 فیصد وسط مدتی امتحانات، اور 50 فیصد فائنل ٹرم امتحانات پر مشتمل ہیں۔</>
                      ) : (
                        <><strong>Assessment Policy:</strong> BS program grades comprise 20% internal assessment (assignments, attendance, quizzes), 30% midterm exams, and 50% final term examinations.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 flex-shrink-0 text-xs">3</span>
                    <span>
                      {t('home') === 'ہوم' ? (
                        <><strong>غیر منصفانہ ذرائع (UFM):</strong> نقل کرنے یا چوری کا مواد لے جانے والے کسی بھی طالب علم کے خلاف سخت تادیبی کارروائی بشمول اخراج یا مستقل بے دخلی کی جائے گی۔</>
                      ) : (
                        <><strong>Unfair Means (UFM):</strong> Strict disciplinary actions, including rustication or permanent expulsion, will be taken against any student found engaging in copying or carrying cheating materials.</>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Content - Downloads */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Warnings and alerts */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900">
                <h4 className="font-bold font-serif flex items-center text-amber-950 mb-2">
                  <ShieldAlert className="w-5 h-5 mr-2 text-amber-700" />
                  {t('importantNote')}
                </h4>
                <p className="text-xs leading-relaxed">
                  {t('home') === 'ہوم' ? (
                    'ڈیٹ شیٹ اور امتحانی نتائج سرکاری طور پر BISE DI Khan اور گومل یونیورسٹی کی ویب سائٹس پر شائع کیے جاتے ہیں۔ کالج کے امتحانی سرکلر اسی صفحے پر انتظامیہ کے ذریعے شائع کیے جاتے ہیں۔'
                  ) : (
                    'Date sheets and results are officially published on the BISE D.I. Khan and Gomal University websites. College examination circulars are published here by the administration.'
                  )}
                </p>
              </div>

              {/* Published circulars */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-950 font-serif border-b border-slate-200 pb-3 flex items-center">
                  <FileText className="w-5 h-5 text-teal-600 mr-2" />
                  {t('circularDownloads')}
                </h3>
                <div className="mt-4 space-y-4">
                  {isLoadingCirculars ? (
                    <p role="status" className="text-sm text-slate-500">
                      {language === 'ur' ? 'سرکلر لوڈ ہو رہے ہیں...' : 'Loading examination circulars…'}
                    </p>
                  ) : circularsError ? (
                    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 text-sm text-rose-700">
                      <span>{circularsError}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoadingCirculars(true);
                          setReloadKey(key => key + 1);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 font-semibold hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {language === 'ur' ? 'دوبارہ کوشش کریں' : 'Retry'}
                      </button>
                    </div>
                  ) : circulars.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      {language === 'ur' ? 'فی الحال کوئی امتحانی سرکلر شائع نہیں ہوا۔' : 'No examination circulars have been published yet.'}
                    </p>
                  ) : circulars.map((circular) => {
                    const fileUrl = circular.public_url;
                    const publishedDate = new Date(`${circular.publish_date}T00:00:00`)
                      .toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-PK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                    return (
                      <div key={circular.id} className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between items-start gap-3 group shadow-sm hover:shadow transition-shadow">
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-800 block leading-tight break-words">{circular.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {language === 'ur' ? 'تاریخ اشاعت:' : 'Published:'} {publishedDate}
                          </span>
                        </div>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${language === 'ur' ? 'سرکلر کھولیں' : 'Open circular'}: ${circular.title}`}
                          className="bg-teal-50 group-hover:bg-teal-600 group-hover:text-white p-2 rounded-lg text-teal-700 transition-colors shrink-0"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
