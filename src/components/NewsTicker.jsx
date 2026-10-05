import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { subscribeHomeContent } from '../lib/firebase';

export default function NewsTicker() {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => subscribeHomeContent((content) => {
    setAnnouncements(Array.isArray(content.tickerAnnouncements) ? content.tickerAnnouncements : []);
  }, (error) => console.error('Unable to subscribe to shared ticker announcements:', error)), []);

  if (announcements.length === 0) return null;

  const loopList = [...announcements, ...announcements];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white h-10 flex items-center overflow-hidden select-none z-40 relative">
      <div className="bg-teal-700 h-full px-4 flex items-center justify-center font-bold text-xs uppercase tracking-widest text-white shadow-lg z-50 flex-shrink-0">
        📢 {t('home') === 'ہوم' ? 'اعلانات' : t('home') === 'الرئيسية' ? 'الإعلانات' : 'Announcements'}
      </div>
      <div className="flex-grow overflow-hidden relative flex items-center h-full bg-slate-950/40">
        <div className="animate-marquee hover:animate-marquee-paused flex items-center gap-16 pr-16 pl-4">
          {loopList.map((text, idx) => (
            <div key={`${idx}-${text}`} className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-slate-300 dark:text-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500 flex-shrink-0"></span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
