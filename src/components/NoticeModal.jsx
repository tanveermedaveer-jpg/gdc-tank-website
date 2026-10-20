import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  Phone, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { 
  DEFAULT_POPUP_NOTICE, 
  subscribePopupNotice, 
  getPopupNotice 
} from '../lib/adminApi';

const SESSION_STORAGE_KEY = 'casdct_notice_modal_dismissed';

export default function NoticeModal({ 
  notice: propNotice, 
  isOpen: propIsOpen, 
  onClose: propOnClose,
  isPreview = false 
}) {
  const navigate = useNavigate();
  const [internalNotice, setInternalNotice] = useState(() => propNotice || getPopupNotice());
  const [isOpen, setIsOpen] = useState(() => {
    if (propIsOpen !== undefined) return propIsOpen;
    if (isPreview) return true;
    const isDismissed = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
    const current = propNotice || getPopupNotice();
    return Boolean(current?.active && !isDismissed);
  });

  // Sync with propNotice if passed
  useEffect(() => {
    if (propNotice) {
      setInternalNotice(propNotice);
    }
  }, [propNotice]);

  // Subscribe to live notice updates from AdminDashboard / LocalStorage
  useEffect(() => {
    if (propNotice) return undefined;
    const unsubscribe = subscribePopupNotice((data) => {
      setInternalNotice(data || DEFAULT_POPUP_NOTICE);
    });
    return unsubscribe;
  }, [propNotice]);

  // Handle external isOpen control (like Admin preview modal)
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
      return;
    }
    if (isPreview) {
      setIsOpen(true);
      return;
    }

    const isDismissed = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
    if (!isDismissed && internalNotice?.active) {
      setIsOpen(true);
    } else if (!internalNotice?.active) {
      setIsOpen(false);
    }
  }, [propIsOpen, isPreview, internalNotice?.active]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const activeNotice = propNotice || internalNotice || DEFAULT_POPUP_NOTICE;

  const handleClose = () => {
    if (!isPreview) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } catch (err) {
        console.warn('Unable to write to sessionStorage:', err);
      }
    }
    setIsOpen(false);
    if (typeof propOnClose === 'function') {
      propOnClose();
    }
  };

  const handleActionClick = () => {
    const targetLink = activeNotice.buttonLink?.trim() || '/admission';
    handleClose();

    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      window.open(targetLink, '_blank', 'noopener,noreferrer');
    } else if (targetLink.startsWith('tel:') || targetLink.startsWith('mailto:')) {
      window.location.href = targetLink;
    } else {
      navigate(targetLink);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;
  if (!activeNotice?.active && !isPreview) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="casdct-notice-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-teal-900/10 dark:border-slate-800 overflow-hidden text-left transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ---------------- MODAL HEADER ---------------- */}
        <div className="bg-gradient-to-r from-[#0d3b4c] via-[#0f4457] to-[#0a3140] px-6 py-5 text-white flex items-center justify-between border-b border-teal-600/20 relative shrink-0">
          <div className="flex items-center gap-3.5 pr-8">
            {/* Glowing Bell Icon Container */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-teal-500/20 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.35)] shrink-0">
              <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  OFFICIAL ANNOUNCEMENT
                </span>
                <span className="text-teal-300/40">•</span>
                <span className="text-xs font-bold text-teal-200 font-serif">اہم اطلاع</span>
              </div>
              <h2 className="text-xs sm:text-sm font-medium text-teal-100/90 mt-0.5">
                Govt. Captain Ashfaq Shaheed Degree College, Tank
              </h2>
            </div>
          </div>

          {/* Close '✕' Button */}
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-teal-200/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shrink-0"
            aria-label="Close Announcement Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---------------- MODAL CONTENT ---------------- */}
        <div className="p-6 sm:p-7 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Urgent Subtitle / Red Badge */}
          {activeNotice.subtitle && (
            <div className="flex items-center">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>{activeNotice.subtitle}</span>
              </span>
            </div>
          )}

          {/* Notice Title */}
          <h3 
            id="casdct-notice-title"
            className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white leading-snug tracking-tight"
          >
            {activeNotice.title || 'Official College Notice'}
          </h3>

          {/* Body Content with smart dynamic height: auto scroll for long text, clean natural display for short text */}
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar border-y border-slate-100 dark:border-slate-800/80 py-3.5">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans selection:bg-teal-100">
              {activeNotice.content || 'Please refer to the college admissions & administration office for further details.'}
            </p>
          </div>

          {/* Quick Info Strip (Contact Details) */}
          {(activeNotice.phone || activeNotice.email) && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Helpdesk & Inquiries:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {activeNotice.phone && (
                  <a 
                    href={`tel:${activeNotice.phone}`}
                    className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeNotice.phone}</span>
                  </a>
                )}
                {activeNotice.phone && activeNotice.email && (
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                )}
                {activeNotice.email && (
                  <a 
                    href={`mailto:${activeNotice.email}`}
                    className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-bold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{activeNotice.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ---------------- ACTION FOOTER ---------------- */}
        <div className="bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center sm:text-left">
            Admission & Academic Directorate · CASDCT
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Subtle Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
            >
              Close
            </button>

            {/* Gradient Teal-to-Emerald Action Button */}
            {activeNotice.buttonText && activeNotice.buttonLink && (
              <button
                type="button"
                onClick={handleActionClick}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:via-teal-700 hover:to-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>{activeNotice.buttonText}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
