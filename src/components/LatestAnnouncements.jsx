import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeLocalData } from '../lib/adminApi';

export default function LatestAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Admissions open for F.Sc Pre-Medical & Pre-Engineering', date: 'AUG 24', description: 'Admissions for intermediate pre-medical and pre-engineering sessions have officially begun. Candidates can submit their applications online or visit the campus admission desk with required documents.' },
    { id: 2, title: 'BS Computer Science & BS English admission schedule announced', date: 'AUG 20', description: 'The schedule for 4-year BS programs in Computer Science and English has been released. Check the academic portal for merit lists, entry test dates, and fee structure details.' },
    { id: 3, title: 'Orientation ceremony for new intermediate batch on Sept 1st', date: 'AUG 15', description: 'All newly enrolled intermediate students are cordially invited to attend the orientation ceremony in the main college auditorium at 9:00 AM sharp.' },
    { id: 4, title: 'HED KP scholarships application deadline extended to Sept 10', date: 'AUG 10', description: 'Higher Education Department KP has extended the scholarship application deadline. Students are advised to submit their verified documents to the scholarship cell before the closing date.' }
  ]);

  useEffect(() => {
    const unsubscribe = subscribeLocalData('announcements', (data) => {
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    }, () => {});
    
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900">
            <Bell className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Latest Announcements</h2>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-900">
          NOTICE BOARD
        </span>
      </div>

      {/* Announcements List - Har button ab apne alag id wale page par jayega */}
      <div className="space-y-3.5">
        {announcements.slice(0, 4).map((item, index) => (
          <Link
            key={item.id || index}
            to={`/announcements/${item.id || index + 1}`}
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all duration-200 block"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-teal-700 dark:text-teal-400 shadow-sm border border-slate-100 dark:border-slate-800 font-bold text-xs uppercase flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 mb-0.5 opacity-80" />
                <span>{item.date ? item.date.split(' ')[0] : 'NOTICE'}</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click to view complete circular details and instructions.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-teal-700 group-hover:text-white transition-all flex-shrink-0 ml-2 shadow-sm border border-slate-100 dark:border-slate-800">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Link
          to="/announcements"
          className="inline-flex items-center text-sm font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors group"
        >
          View All Announcements 
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
