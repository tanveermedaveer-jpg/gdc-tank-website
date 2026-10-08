import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bell, Calendar, ArrowLeft } from 'lucide-react';
import { subscribeLocalData } from '../lib/adminApi';

export default function AnnouncementDetail() {
  const { id } = useParams();
  
  const defaultAnnouncements = [
    { id: 1, title: 'Admissions open for F.Sc Pre-Medical & Pre-Engineering', date: 'AUG 24', description: 'Admissions for intermediate pre-medical and pre-engineering sessions have officially begun. Candidates can submit their applications online or visit the campus admission desk with required documents.' },
    { id: 2, title: 'BS Computer Science & BS English admission schedule announced', date: 'AUG 20', description: 'The schedule for 4-year BS programs in Computer Science and English has been released. Check the academic portal for merit lists, entry test dates, and fee structure details.' },
    { id: 3, title: 'Orientation ceremony for new intermediate batch on Sept 1st', date: 'AUG 15', description: 'All newly enrolled intermediate students are cordially invited to attend the orientation ceremony in the main college auditorium at 9:00 AM sharp.' },
    { id: 4, title: 'HED KP scholarships application deadline extended to Sept 10', date: 'AUG 10', description: 'Higher Education Department KP has extended the scholarship application deadline. Students are advised to submit their verified documents to the scholarship cell before the closing date.' }
  ];

  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = defaultAnnouncements.find(item => String(item.id) === String(id));
    if (found) setAnnouncement(found);

    const unsubscribe = subscribeLocalData('announcements', (data) => {
      if (data && data.length > 0) {
        const match = data.find(item => String(item.id) === String(id));
        if (match) setAnnouncement(match);
      }
    }, () => {});

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [id]);

  if (!announcement) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md w-full">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Announcement Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">The circular you are looking for does not exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider bg-teal-700 text-white px-5 py-2.5 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors bg-teal-50 dark:bg-teal-950/60 px-3.5 py-2 rounded-xl border border-teal-100 dark:border-teal-900">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Date & Category Badge */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-900">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {announcement.date || 'Official Circular'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              ID: #{announcement.id}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white mb-6 leading-snug">
            {announcement.title}
          </h1>

          {/* Content Description */}
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
            <p className="whitespace-pre-line">
              {announcement.description || announcement.content || 'Detailed instructions and complete guidelines regarding this announcement can be obtained from the college administration office during working hours.'}
            </p>
          </div>

          {/* Footer info */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Captain Ashfaq Shaheed Degree College, Tank</span>
            <span>Official Notice Board</span>
          </div>
        </div>

      </div>
    </div>
  );
}
