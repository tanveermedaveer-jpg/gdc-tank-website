import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, Users, Clock, Wallet, Check, X, Download, Play, Eye, 
  Settings, HelpCircle, LogOut, LayoutGrid, FileText, CreditCard, ImageIcon, 
  GraduationCap, CheckCircle, XCircle, Plus, Trash2, AlertTriangle, ChevronDown, 
  Moon, Sun, Shield, UserCheck, RefreshCw, Edit3, Lock, Mail, Phone, 
  Upload, FileCheck, Info, Maximize2
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import principalImg from '../assets/principal.jpg';

export default function AdminDashboard({ darkMode: propDarkMode, setDarkMode: propSetDarkMode }) {
  const navigate = useNavigate();

  // Dark Mode State
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    return localStorage.getItem('casdct_dark_mode') === 'true';
  });

  const isDark = propDarkMode !== undefined ? propDarkMode : localDarkMode;
  const toggleDark = () => {
    if (propSetDarkMode) {
      propSetDarkMode(!propDarkMode);
    } else {
      const nextDark = !localDarkMode;
      setLocalDarkMode(nextDark);
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('casdct_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('casdct_dark_mode', 'false');
      }
    }
  };

  // Active Sidebar Tab: 'admissions' | 'dashboard' | 'fee_records' | 'media_gallery' | 'settings' | 'help'
  const [activeTab, setActiveTab] = useState('admissions');

  // Interactive Sidebar Badge State (Click-to-clear)
  const [clearedBadges, setClearedBadges] = useState({
    admissions: false,
    media_gallery: false
  });

  // Search & Filter State for Table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [sortBy, setSortBy] = useState('merit'); // 'merit' | 'name' | 'id' | 'marks'

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Tab Click with Badge Reset
  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'admissions' || tabKey === 'dashboard') {
      setClearedBadges(prev => ({ ...prev, admissions: true }));
    }
    if (tabKey === 'media_gallery') {
      setClearedBadges(prev => ({ ...prev, media_gallery: true }));
    }
  };

  // Handle Search Input Change (Works from both top navbar and dashboard table search bars)
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim() && activeTab !== 'admissions' && activeTab !== 'dashboard') {
      setActiveTab('admissions');
    }
  };

  // 1. Admissions List State (Defaults to 7 rows from mockup)
  const defaultAdmissions = [
    {
      regId: 'STU-10214',
      fullName: 'Ayesha Khan',
      program: 'BS Computer Science',
      matricMarks: 945,
      matricTotal: 1050,
      marksText: '945/1050',
      meritPct: 91.8,
      paymentStatus: 'Paid - EasyPaisa TRX: 98273641',
      isPaid: true,
      status: 'pending'
    },
    {
      regId: 'STU-10227',
      fullName: 'Bilal Ahmed',
      program: 'BS Physics',
      matricMarks: 782,
      matricTotal: 1050,
      marksText: '782/1050',
      meritPct: 75.2,
      paymentStatus: 'Paid - EasyPaisa TRX: 98143017',
      isPaid: true,
      status: 'pending'
    },
    {
      regId: 'STU-10235',
      fullName: 'Zainab Fatima',
      program: 'FSC Pre-Medical',
      matricMarks: 858,
      matricTotal: 1050,
      marksText: '858/1050',
      meritPct: 82.4,
      paymentStatus: 'Paid - EasyPaisa TRX: 98301155',
      isPaid: true,
      status: 'pending'
    },
    {
      regId: 'STU-10241',
      fullName: 'Usman Ali',
      program: 'Matric',
      matricMarks: 689,
      matricTotal: 1000,
      marksText: '689/1000',
      meritPct: 68.9,
      paymentStatus: 'Pending',
      isPaid: false,
      status: 'pending'
    },
    {
      regId: 'STU-10249',
      fullName: 'Fatima Noor',
      program: 'BS Mathematics',
      matricMarks: 651,
      matricTotal: 1000,
      marksText: '651/1000',
      meritPct: 65.1,
      paymentStatus: 'Pending',
      isPaid: false,
      status: 'pending'
    },
    {
      regId: 'STU-10253',
      fullName: 'Hassan Raza',
      program: 'FSC Pre-Engineering',
      matricMarks: 703,
      matricTotal: 1050,
      marksText: '703/1050',
      meritPct: 67.0,
      paymentStatus: 'Paid - EasyPaisa TRX: 98074211',
      isPaid: true,
      status: 'pending'
    },
    {
      regId: 'STU-10260',
      fullName: 'Maryam Saeed',
      program: 'Matric',
      matricMarks: 597,
      matricTotal: 1000,
      marksText: '597/1000',
      meritPct: 59.7,
      paymentStatus: 'Pending',
      isPaid: false,
      status: 'pending'
    }
  ];

  const [admissions, setAdmissions] = useState([]);

  // 2. Media Moderation List State (Defaults to 2 items from mockup)
  const defaultMediaUploads = [
    {
      id: 1,
      title: 'campus_tour.mp4',
      type: 'video',
      size: '24 MB',
      uploadedBy: 'Media Team',
      uploadedTime: 'Uploaded 1h ago',
      duration: '04:21',
      thumbnail: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      status: 'pending'
    },
    {
      id: 2,
      title: 'building_view.jpg',
      type: 'image',
      size: '11 MB',
      uploadedBy: 'Media Team',
      uploadedTime: 'Uploaded 2h ago',
      badge: 'JPG',
      thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      status: 'pending'
    }
  ];

  const [mediaUploads, setMediaUploads] = useState([]);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Settings state
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [principalName, setPrincipalName] = useState('');
  const [principalMessage, setPrincipalMessage] = useState('');
  const [principalImage, setPrincipalImage] = useState('');
  const [collegePhone, setCollegePhone] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Load Admissions
    const storedAdmissions = localStorage.getItem('casdct_admissions');
    if (storedAdmissions) {
      try {
        const parsed = JSON.parse(storedAdmissions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdmissions(parsed);
        } else {
          setAdmissions(defaultAdmissions);
          localStorage.setItem('casdct_admissions', JSON.stringify(defaultAdmissions));
        }
      } catch (err) {
        setAdmissions(defaultAdmissions);
      }
    } else {
      setAdmissions(defaultAdmissions);
      localStorage.setItem('casdct_admissions', JSON.stringify(defaultAdmissions));
    }

    // Load Media Moderation
    const storedMedia = localStorage.getItem('casdct_media_moderation');
    if (storedMedia) {
      try {
        const parsedMedia = JSON.parse(storedMedia);
        if (Array.isArray(parsedMedia) && parsedMedia.length > 0) {
          setMediaUploads(parsedMedia);
        } else {
          setMediaUploads(defaultMediaUploads);
          localStorage.setItem('casdct_media_moderation', JSON.stringify(defaultMediaUploads));
        }
      } catch (err) {
        setMediaUploads(defaultMediaUploads);
      }
    } else {
      setMediaUploads(defaultMediaUploads);
      localStorage.setItem('casdct_media_moderation', JSON.stringify(defaultMediaUploads));
    }

    // Load Credentials and Settings
    const sName = localStorage.getItem('casdct_admin_name') || 'Shabir Ahmad';
    const sPass = localStorage.getItem('casdct_admin_pass') || '122011577';
    const sPName = localStorage.getItem('casdct_principal_name') || 'Prof. Shabir Ahmad';
    const sPMessage = localStorage.getItem('casdct_principal_message') || 'It is a matter of great pride and privilege to welcome you to Government Degree College, Tank.';
    const sPImg = localStorage.getItem('casdct_principal_image') || principalImg;
    const sPhone = localStorage.getItem('casdct_college_phone') || '+92 (0963) 510111';
    const sEmail = localStorage.getItem('casdct_college_email') || 'info@casdct.edu.pk';

    setAdminName(sName);
    setAdminPassword(sPass);
    setPrincipalName(sPName);
    setPrincipalMessage(sPMessage);
    setPrincipalImage(sPImg);
    setCollegePhone(sPhone);
    setCollegeEmail(sEmail);
  }, []);

  // Sync Admissions to localStorage on change
  const updateAdmissionsState = (updatedList) => {
    setAdmissions(updatedList);
    localStorage.setItem('casdct_admissions', JSON.stringify(updatedList));
  };

  // Sync Media to localStorage on change
  const updateMediaState = (updatedList) => {
    setMediaUploads(updatedList);
    localStorage.setItem('casdct_media_moderation', JSON.stringify(updatedList));
  };

  // Action: Approve Admission
  const handleApproveAdmission = (regId) => {
    const updated = admissions.map(st => 
      st.regId === regId ? { ...st, status: 'approved' } : st
    );
    updateAdmissionsState(updated);
    const item = admissions.find(a => a.regId === regId);
    showToast(`Approved admission for ${item ? item.fullName : regId}`, 'success');
  };

  // Action: Reject Admission
  const handleRejectAdmission = (regId) => {
    const updated = admissions.map(st => 
      st.regId === regId ? { ...st, status: 'rejected' } : st
    );
    updateAdmissionsState(updated);
    const item = admissions.find(a => a.regId === regId);
    showToast(`Rejected admission for ${item ? item.fullName : regId}`, 'error');
  };

  // Action: Approve Media
  const handleApproveMedia = (mediaId) => {
    const updated = mediaUploads.map(m => 
      m.id === mediaId ? { ...m, status: 'approved' } : m
    );
    updateMediaState(updated);
    const item = mediaUploads.find(m => m.id === mediaId);
    showToast(`Approved media item "${item ? item.title : mediaId}"`, 'success');
  };

  // Counts for badges
  const pendingAdmissionsCount = useMemo(() => {
    return admissions.filter(a => a.status === 'pending').length;
  }, [admissions]);

  const pendingMediaCount = useMemo(() => {
    return mediaUploads.filter(m => m.status === 'pending').length;
  }, [mediaUploads]);

  // Filtering & Sorting admissions for the table
  const filteredAdmissions = useMemo(() => {
    return admissions
      .filter(st => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          st.fullName.toLowerCase().includes(query) ||
          st.regId.toLowerCase().includes(query) ||
          st.program.toLowerCase().includes(query);

        if (!matchesQuery) return false;

        if (selectedProgram === 'All') return true;
        if (selectedProgram === 'BS') return st.program.startsWith('BS');
        if (selectedProgram === 'FSc') return st.program.startsWith('FSC') || st.program.startsWith('F.Sc');
        if (selectedProgram === 'Matric') return st.program.toLowerCase().includes('matric');
        return st.program === selectedProgram;
      })
      .sort((a, b) => {
        if (sortBy === 'merit') return b.meritPct - a.meritPct;
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'id') return a.regId.localeCompare(b.regId);
        if (sortBy === 'marks') return b.matricMarks - a.matricMarks;
        return 0;
      });
  }, [admissions, searchQuery, selectedProgram, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Student ID", "Student Name", "Program", "Marks", "Merit %", "Payment Status", "Admin Status"];
    const rows = filteredAdmissions.map(st => [
      st.regId,
      `"${st.fullName}"`,
      `"${st.program}"`,
      st.marksText || `${st.matricMarks}/${st.matricTotal}`,
      `${st.meritPct}%`,
      `"${st.paymentStatus}"`,
      st.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admissions_Merit_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file exported successfully!", "success");
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('casdct_is_logged_in');
    navigate('/login');
  };

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('casdct_admin_name', adminName);
    localStorage.setItem('casdct_admin_pass', adminPassword);
    localStorage.setItem('casdct_principal_name', principalName);
    localStorage.setItem('casdct_principal_message', principalMessage);
    localStorage.setItem('casdct_principal_image', principalImage);
    localStorage.setItem('casdct_college_phone', collegePhone);
    localStorage.setItem('casdct_college_email', collegeEmail);

    setSettingsSaved(true);
    showToast('Admin & Institutional Settings saved successfully!', 'success');
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold text-white transition-all transform animate-bounce ${toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
          {toastMessage.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{previewMedia.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{previewMedia.uploadedBy} • {previewMedia.size} • {previewMedia.uploadedTime}</p>
            
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-96 mb-6">
              {previewMedia.type === 'video' ? (
                <video src={previewMedia.videoUrl} controls autoPlay className="max-h-96 w-full object-contain" />
              ) : (
                <img src={previewMedia.thumbnail} alt={previewMedia.title} className="max-h-96 w-full object-contain" />
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              {previewMedia.status === 'pending' && (
                <button 
                  onClick={() => {
                    handleApproveMedia(previewMedia.id);
                    setPreviewMedia(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" /> Approve Media
                </button>
              )}
              <button 
                onClick={() => setPreviewMedia(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SIDEBAR NAVIGATION ---------------- */}
      <aside className="w-full md:w-64 bg-[#052836] text-slate-200 flex-shrink-0 flex flex-col justify-between min-h-screen border-r border-[#0d3b4e]">
        <div>
          {/* Logo & Header Title */}
          <div className="px-6 py-6 border-b border-[#0d3e52] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-tight text-lg font-sans">College Admin</span>
                <span className="text-[10px] text-teal-300/80 font-medium tracking-wider uppercase">GDC COLLEGE TANK</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-6 space-y-1.5 font-medium text-sm">
            <button
              onClick={() => handleTabSelect('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'dashboard' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <LayoutGrid className="w-5 h-5 text-teal-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleTabSelect('admissions')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'admissions' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Admissions & Merit List</span>
              </div>
              {!clearedBadges.admissions && pendingAdmissionsCount > 0 && (
                <span className="bg-cyan-500/30 text-cyan-200 text-xs font-bold px-2 py-0.5 rounded-full border border-cyan-400/40">
                  {pendingAdmissionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabSelect('fee_records')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'fee_records' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Fee Records</span>
            </button>

            <button
              onClick={() => handleTabSelect('media_gallery')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'media_gallery' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>Media Gallery Moderation</span>
              </div>
              {!clearedBadges.media_gallery && pendingMediaCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {pendingMediaCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabSelect('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'settings' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / Support & Logout */}
        <div className="p-4 border-t border-[#0d3e52] space-y-1.5 text-sm font-medium">
          <button
            onClick={() => handleTabSelect('help')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left ${activeTab === 'help' ? 'bg-[#13485b] text-white font-semibold' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
          >
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <span>Help & Support</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-all duration-200 text-left font-semibold"
          >
            <LogOut className="w-5 h-5 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
          {/* Header Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800">
              {activeTab === 'admissions' && <FileText className="w-6 h-6" />}
              {activeTab === 'dashboard' && <LayoutGrid className="w-6 h-6" />}
              {activeTab === 'fee_records' && <CreditCard className="w-6 h-6" />}
              {activeTab === 'media_gallery' && <ImageIcon className="w-6 h-6" />}
              {activeTab === 'settings' && <Settings className="w-6 h-6" />}
              {activeTab === 'help' && <HelpCircle className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                {activeTab === 'admissions' && 'Admissions & Merit List'}
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'fee_records' && 'Fee Records & Receipts'}
                {activeTab === 'media_gallery' && 'Media Gallery Moderation'}
                {activeTab === 'settings' && 'System & Portal Settings'}
                {activeTab === 'help' && 'Help & Admin Support'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Review and moderate pending student admissions and media uploads
              </p>
            </div>
          </div>

          {/* Header Controls: Search input, Notification Bell, User Avatar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            
            {/* Global Top Navbar Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Student by Name or ID..."
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 border border-slate-200 dark:border-slate-700 transition-all"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDark}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => showToast(`You have ${pendingAdmissionsCount} pending admissions requiring review.`, 'info')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {(pendingAdmissionsCount > 0 || pendingMediaCount > 0) && (
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{adminName || 'Admin'}</span>
                <span className="text-[10px] text-slate-400 font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body based on activeTab */}
        <div className="p-6 space-y-6">

          {/* (Tabs 'admissions' and 'dashboard' show full top metrics + main table + media moderation section) */}
          {(activeTab === 'admissions' || activeTab === 'dashboard') && (
            <>
              {/* ---------------- TOP METRICS CARDS ---------------- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric 1: Total Admissions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Admissions</span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                      1,245
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                      <span>↑ +32 this month</span>
                    </div>
                  </div>
                  <Users className="w-24 h-24 text-emerald-500/5 dark:text-emerald-500/10 absolute -right-4 -bottom-4 pointer-events-none" />
                </div>

                {/* Metric 2: Pending Verifications */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Verifications</span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                      42
                    </div>
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Requires admin action</span>
                    </div>
                  </div>
                  <Clock className="w-24 h-24 text-amber-500/5 dark:text-amber-500/10 absolute -right-4 -bottom-4 pointer-events-none" />
                </div>

                {/* Metric 3: Total Fee Collected */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Fee Collected</span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                      Rs. 4.5M
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                      <span>↑ +Rs 280K this month</span>
                    </div>
                  </div>
                  <Wallet className="w-24 h-24 text-emerald-500/5 dark:text-emerald-500/10 absolute -right-4 -bottom-4 pointer-events-none" />
                </div>

              </div>

              {/* ---------------- FILTER & CONTROLS BAR ---------------- */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left Side Filters */}
                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  {/* Table Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search Student by Name or ID..."
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Program Selector */}
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                  >
                    <option value="All">Program: BS / FSc / Matric</option>
                    <option value="BS">BS Programs</option>
                    <option value="FSc">FSc / Intermediate</option>
                    <option value="Matric">Matric / SSC</option>
                  </select>

                  {/* Sort Selector */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                  >
                    <option value="merit">Sort by: Merit %</option>
                    <option value="name">Sort by: Name</option>
                    <option value="id">Sort by: Student ID</option>
                    <option value="marks">Sort by: Marks</option>
                  </select>
                </div>

                {/* Right Side Action: Export CSV */}
                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* ---------------- ADMISSIONS & MERIT LIST TABLE ---------------- */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                
                {/* Table Section Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                    Recent Admissions & Merit List
                  </h2>
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>{pendingAdmissionsCount} pending moderation</span>
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th className="py-3.5 px-6">Student ID</th>
                        <th className="py-3.5 px-6">Student Name</th>
                        <th className="py-3.5 px-6">Program</th>
                        <th className="py-3.5 px-6">Marks</th>
                        <th className="py-3.5 px-6">Merit %</th>
                        <th className="py-3.5 px-6">Payment Status</th>
                        <th className="py-3.5 px-6 text-center">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-200">
                      {filteredAdmissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                            No student admission records found matching "{searchQuery}".
                          </td>
                        </tr>
                      ) : (
                        filteredAdmissions.map((st) => (
                          <tr key={st.regId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            
                            {/* Student ID */}
                            <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {st.regId}
                            </td>

                            {/* Student Name */}
                            <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                              {st.fullName}
                            </td>

                            {/* Program */}
                            <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                              {st.program}
                            </td>

                            {/* Marks */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              {st.marksText || `${st.matricMarks}/${st.matricTotal}`}
                            </td>

                            {/* Merit % */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${st.meritPct >= 70 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                                {st.meritPct}%
                              </span>
                            </td>

                            {/* Payment Status */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              {st.isPaid ? (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</div>
                                  <span>{st.paymentStatus}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                  <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">⏱</div>
                                  <span>Pending</span>
                                </div>
                              )}
                            </td>

                            {/* Admin Action Buttons */}
                            <td className="py-4 px-6 whitespace-nowrap text-center">
                              {st.status === 'approved' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                                  <CheckCircle className="w-3.5 h-3.5" /> Approved
                                </span>
                              ) : st.status === 'rejected' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">
                                  <XCircle className="w-3.5 h-3.5" /> Rejected
                                </span>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleApproveAdmission(st.regId)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectAdmission(st.regId)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                                  >
                                    <X className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </div>
                              )}
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* ---------------- MEDIA GALLERY MODERATION SECTION ---------------- */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                    Recent Media Uploads
                  </h2>
                  <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-800 text-xs font-bold px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span>{pendingMediaCount} Items Pending moderation</span>
                  </div>
                </div>

                {/* Grid of Media Upload Thumbnails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mediaUploads.map((media) => (
                    <div 
                      key={media.id} 
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 dark:bg-slate-850 hover:shadow-md transition-shadow"
                    >
                      {/* Media Thumbnail Container */}
                      <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 group">
                        <img 
                          src={media.thumbnail} 
                          alt={media.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        {/* Overlay Icon / Badges */}
                        {media.type === 'video' ? (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {media.duration || '04:21'}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white p-1 rounded">
                              <ImageIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {media.badge || 'JPG'}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Details & Actions */}
                      <div className="flex-1 flex flex-col justify-between w-full">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{media.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Uploaded by: <span className="font-semibold text-slate-700 dark:text-slate-300">{media.uploadedBy}</span> • {media.size} • {media.uploadedTime}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-4">
                          {media.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="w-4 h-4" /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApproveMedia(media.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          <button
                            onClick={() => setPreviewMedia(media)}
                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" /> View
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </>
          )}

          {/* ---------------- FEE RECORDS TAB ---------------- */}
          {activeTab === 'fee_records' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fee Collection Summary</h2>
                    <p className="text-xs text-slate-500">Track online admissions fees paid through EasyPaisa, JazzCash & Bank transfers.</p>
                  </div>
                  <button onClick={() => showToast("Syncing fee records from banking gateway...", "info")} className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Banking Gateway
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">Total Verified Revenue</span>
                    <div className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">Rs 4,520,000</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">Pending Slip Verifications</span>
                    <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 mt-1">Rs 185,000</div>
                  </div>
                  <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-4 rounded-xl">
                    <span className="text-xs text-sky-700 dark:text-sky-400 font-bold uppercase">EasyPaisa & Mobile Receipts</span>
                    <div className="text-2xl font-extrabold text-sky-900 dark:text-sky-200 mt-1">312 Transactions</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold text-[11px]">
                        <th className="p-3">TRX ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Program</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {admissions.map(st => (
                        <tr key={st.regId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-semibold">{st.paymentStatus.includes('TRX:') ? st.paymentStatus.split('TRX:')[1].trim() : 'N/A'}</td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">{st.fullName}</td>
                          <td className="p-3">{st.program}</td>
                          <td className="p-3 font-medium text-teal-700 dark:text-teal-400">EasyPaisa / Mobile Wallet</td>
                          <td className="p-3 font-bold">Rs 2,500</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${st.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {st.isPaid ? 'Verified' : 'Pending Slip'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- MEDIA GALLERY MODERATION TAB ---------------- */}
          {activeTab === 'media_gallery' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Media Gallery Moderation Center</h2>
                    <p className="text-xs text-slate-500">Approve or review photo uploads from campus tours, sports galas, and lab practicals.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaUploads.map((media) => (
                    <div key={media.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                      <div>
                        <div className="relative h-44 rounded-xl overflow-hidden bg-black mb-3">
                          <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover" />
                          {media.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{media.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{media.uploadedBy} • {media.size} • {media.uploadedTime}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        {media.status === 'approved' ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Approved
                          </span>
                        ) : (
                          <button onClick={() => handleApproveMedia(media.id)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        <button onClick={() => setPreviewMedia(media)} className="bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> View Fullscreen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- SETTINGS TAB ---------------- */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Credentials & College Settings</h2>
                <p className="text-xs text-slate-500">Update your security passkeys, institutional information, and principal desk message.</p>
              </div>

              {settingsSaved && (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Settings saved successfully!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Username</label>
                    <input 
                      type="text" 
                      value={adminName} 
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Password</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Principal Name</label>
                  <input 
                    type="text" 
                    value={principalName} 
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Principal Message</label>
                  <textarea 
                    rows={4}
                    value={principalMessage} 
                    onChange={(e) => setPrincipalMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College Phone Helpline</label>
                    <input 
                      type="text" 
                      value={collegePhone} 
                      onChange={(e) => setCollegePhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College Email Address</label>
                    <input 
                      type="text" 
                      value={collegeEmail} 
                      onChange={(e) => setCollegeEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-wider shadow-md">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* ---------------- HELP & SUPPORT TAB ---------------- */}
          {activeTab === 'help' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Portal Help & Technical Support</h2>
                <p className="text-xs text-slate-500">Need assistance moderating admissions or exporting merit lists? Contact technical support.</p>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">How to approve or reject student admissions?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Click the green "Approve" button or red "Reject" button in the Admissions table. Approved applications will immediately update the verification counter.
                  </p>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">How to export student records to Excel / CSV?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Click the "Export CSV" button right above the Recent Admissions table. The downloadable `.csv` file contains Student ID, Name, Program, Marks, and Status.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
