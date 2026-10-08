import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnnouncementModal from '../components/AnnouncementModal';
import { subscribeLocalData } from '../lib/adminApi';

export default function AllAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Admissions open for F.Sc Pre-Medical & Pre-Engineering', date: 'AUG 24', description: 'Admissions for intermediate pre-medical and pre-engineering sessions have officially begun. Candidates can submit their applications online or visit the campus admission desk with required documents.' },
    { id: 2, title: 'BS Computer Science & BS English admission schedule announced', date: 'AUG 20', description: 'The schedule for 4-year BS programs in Computer Science and English has been released. Check the academic portal for merit lists, entry test dates, and fee structure details.' },
    { id: 3, title: 'Orientation ceremony for new intermediate batch on Sept 1st', date: 'AUG 15', description: 'All newly enrolled intermediate students are cordially invited to attend the orientation ceremony in the main college auditorium at 9:00 AM sharp.' },
    { id: 4, title: 'HED KP scholarships application deadline extended to Sept 10', date: 'AUG 10', description: 'Higher Education Department KP has extended the scholarship application deadline. Students are advised to submit their verified documents to the scholarship cell before the closing date.' }
  ]);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with Admin panel local data storage if available
  useEffect(() => {
    window.scrollTo(0, 0);
    return subscribeLocalData('announcements', (data) => {
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    }, (err) => console.log('Loaded default announcement items'));
  }, []);

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors bg-teal-50 dark:bg-teal-950/60 px-3.5 py-2 rounded-xl border border-teal-100 dark:border-teal-900">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-blue-950 text-white rounded-3xl p-8 mb-8 shadow-xl border border-teal-800/40 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center space-x-3.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 border border-white/10">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">College Notice Board & Circulars</h1>
          </div>
          <p className="text-teal-100/80 text-sm max-w-xl leading-relaxed">
            Access official announcements, exam schedules, scholarship updates, and admission notices issued by Captain Ashfaq Shaheed Degree College, Tank.
          </p>
        </div>

        {/* Search Bar Filter */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            placeholder="Search announcements by title or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 text-slate-800 dark:text-slate-100 shadow-sm transition-all"
          />
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item, index) => (
              <div 
                key={item.id || index}
                onClick={() => setSelectedNotice(item)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex flex-col items-center justify-center text-teal-700 dark:text-teal-400 flex-shrink-0 border border-teal-100 dark:border-teal-900 font-bold text-xs uppercase">
                    <Calendar className="w-3.5 h-3.5 mb-0.5 opacity-80" />
                    <span>{item.date?.split(' ')[0] || 'NOTICE'}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {item.description || item.content || 'Click to view complete circular details and instructions.'}
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-teal-700 group-hover:text-white transition-all flex-shrink-0 ml-4 shadow-sm">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No matching announcements found.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Popup Component */}
      <AnnouncementModal 
        announcement={selectedNotice} 
        onClose={() => setSelectedNotice(null)} 
      />
    </div>
  );
}
