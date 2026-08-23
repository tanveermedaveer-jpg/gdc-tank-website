import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function NewsTicker() {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);

  const defaultAnnouncements = [
    "Welcome to Govt. Captain Ashfaq Shaheed Degree College Tank — Committed to Quality Education & Discipline.",
    "Notice: Fill out the online admission form carefully with exact details as per your Matric certificate.",
    "College Hours: 08:00 AM to 02:00 PM. Proper college uniform is mandatory for all students.",
    "Help Desk: For admission inquiries, contact our official helpline or visit the admission desk."
  ];

  const defaultUrdu = [
    "گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج ٹانک میں خوش آمدید — جو کہ معیاری تعلیم اور بہترین ڈسپلن کے لیے پرعزم ہے۔",
    "نوٹس: میٹرک کی سند کے مطابق تمام معلومات کے ساتھ آن لائن داخلہ فارم احتیاط سے پُر کریں۔",
    "کالج کے اوقات: صبح 08:00 بجے سے دوپہر 02:00 بجے تک۔ تمام طلبہ کے لیے باقاعدہ کالج یونیفارم لازمی ہے۔",
    "ہیلپ ڈیسک: داخلے کے بارے میں معلومات کے لیے ہمارے آفیشل ہیلپ لائن نمبرز پر رابطہ کریں یا داخلہ ڈیسک تشریف لائیں۔"
  ];

  const defaultPashto = [
    "دولتي کیپټن اشفاق شهید ډګري کالج ټانک ته ښه راغلاست — چې معیاري زده کړې او ډسپلین ته ژمن دی.",
    "خبرتیا: د میٹرک سند سره سم آنلاین د داخلې فورمه په احتیاط سره ډکه کړئ.",
    "د کالج ساعتونه: سهار 08:00 بجو څخه تر غرمې 02:00 بجو پورې. د ټولو زده کونکو لپاره کالج یونیفورم لازمي دی.",
    "د مرستې میز: د داخلې پوښتنو لپاره، زموږ د رسمي مرستې لاین سره اړیکه ونیسئ یا د داخلې میز څخه لیدنه وکړئ."
  ];

  const defaultSaraiki = [
    "گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج ٹانک وچ خوش آمدید — جیہڑا معیاری تعلیم تے ڈسپلن واسطے پرعزم ہے۔",
    "نوٹس: میٹرک دی سند دے مطابق معلومات نال آن لائن داخلہ فارم احتیاط نال پُر کرو۔",
    "کالج دے اوقات: سویرے 08:00 بجے توں ڈوپہر 02:00 بجے تئیں۔ سارے بالاں واسطے باقاعدہ کالج یونیفارم لازمی ہے۔",
    "ہیلپ ڈیسک: داخلے دی معلومات واسطے اساڈے آفیشل ہیلپ لائن نمبرز تے رابطہ کرو یا داخلہ ڈیسک آؤ۔"
  ];

  const defaultArabic = [
    "مرحباً بكم في كلية الكابتن الحكومية إشفاق شهيد تانك — ملتزمون بجودة التعليم والانضباط.",
    "تنبيه: يرجى ملء نموذج القبول عبر الإنترنت بعناية وتطابق تام مع شهادة الثانوية العامة.",
    "ساعات الكلية: من الساعة 08:00 صباحاً حتى 02:00 ظهراً. الزي الرسمي للكلية إلزامي لجميع الطلاب.",
    "مكتب المساعدة: للاستفسارات حول القبول، يرجى الاتصال بخط المساعدة الرسمي أو زيارة مكتب القبول."
  ];

  useEffect(() => {
    const stored = localStorage.getItem('casdct_ticker_announcements');
    if (stored) {
      try {
        setAnnouncements(JSON.parse(stored));
      } catch (e) {
        setAnnouncements(getLangDefaults());
      }
    } else {
      setAnnouncements(getLangDefaults());
    }

    // Listen for custom settings storage events to update ticker in real time
    const handleStorageChange = () => {
      const updated = localStorage.getItem('casdct_ticker_announcements');
      if (updated) {
        try {
          setAnnouncements(JSON.parse(updated));
        } catch (e) {
          setAnnouncements(getLangDefaults());
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('casdct_ticker_update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('casdct_ticker_update', handleStorageChange);
    };
  }, [t('home')]); // re-run default language translation fallbacks when language switches

  const getLangDefaults = () => {
    const currentHome = t('home');
    if (currentHome === 'ہوم') {
      return defaultUrdu; // Urdu translation
    } else if (currentHome === 'کور پاڼه') {
      return defaultPashto; // Pashto translation
    } else if (currentHome === 'ہوم' && t('aboutUs') === 'ہمارے بارے') {
      return defaultSaraiki; // Saraiki translation
    } else if (currentHome === 'الرئيسية') {
      return defaultArabic; // Arabic translation
    }
    return defaultAnnouncements; // English default
  };

  if (announcements.length === 0) return null;

  // Duplicate for seamless infinite loop scroll
  const loopList = [...announcements, ...announcements];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white h-10 flex items-center overflow-hidden select-none z-40 relative">
      {/* Announcements fixed left badge */}
      <div className="bg-teal-700 h-full px-4 flex items-center justify-center font-bold text-xs uppercase tracking-widest text-white shadow-lg z-50 flex-shrink-0">
        📢 {t('home') === 'ہوم' ? 'اعلانات' : t('home') === 'الرئيسية' ? 'الإعلانات' : 'Announcements'}
      </div>

      {/* Scrolling container */}
      <div className="flex-grow overflow-hidden relative flex items-center h-full bg-slate-950/40">
        <div className="animate-marquee hover:animate-marquee-paused flex items-center gap-16 pr-16 pl-4">
          {loopList.map((text, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-slate-300 dark:text-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500 flex-shrink-0"></span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
