import React from 'react';
import { X, Calendar, Bell } from 'lucide-react';

export default function AnnouncementModal({ announcement, onClose }) {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-slate-100 dark:border-slate-800 text-left text-slate-800 dark:text-slate-200 overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Category Badge */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900 shadow-sm flex-shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-900">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {announcement.date || 'Official Circular'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-4 leading-snug">
          {announcement.title}
        </h3>

        {/* Full Description / Content */}
        <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
          <p className="whitespace-pre-line">
            {announcement.description || announcement.content || 'Detailed instructions and complete guidelines regarding this announcement can be obtained from the college administration office during working hours.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Captain Ashfaq Shaheed Degree College, Tank
          </span>
          <button 
            onClick={onClose}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-teal-700/20 cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
