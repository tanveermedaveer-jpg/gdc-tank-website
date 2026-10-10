import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, Users, Clock, Wallet, Check, X, Download, Play, Eye, EyeOff,
  Menu, Settings, HelpCircle, LogOut, LayoutGrid, FileText, CreditCard, ImageIcon,
  GraduationCap, CheckCircle, XCircle, Plus, Trash2, AlertTriangle, ClipboardList, FileUp,
  Moon, Sun, UserCheck, RefreshCw, Edit3,
  Upload, Trophy
} from 'lucide-react';
import principalImg from '../assets/principal.jpg';
import {
  MAX_CIRCULAR_SIZE_BYTES,
  adminFileRequest,
  adminRequest,
  getAdminSessionUsername,
  signOutAdmin,
  subscribeLocalChanges,
  subscribeHomeContent
} from '../lib/adminApi';
import { COLLEGE_ADDRESS, COLLEGE_PHONE } from '../lib/contactDetails';
import { DEFAULT_HOME_CONTENT } from '../lib/siteContentDefaults';
import { supabase } from '../lib/supabase.js';
// Firebase ko Supabase se replace kar diya hai taake build fail na ho
const db = supabase;
const doc = (database, collectionName, docId) => ({ collectionName, docId, id: docId });
const getDoc = async (docRef) => {
  const { data } = await supabase.from('site_content').select('*').eq('id', docRef.id).single();
  return { exists: () => !!data, data: () => data?.content || data };
};
const setDoc = async (docRef, newData) => {
  const { error } = await supabase.from('site_content').upsert({ id: docRef.id, content: newData });
  if (error) console.log(error);
};
const isVideoMediaFile = (file) =>
  file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|ogv|avi)$/i.test(file.name);

const isSupportedMediaFile = (file) =>
  [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
    'video/ogg', 'video/x-msvideo'
  ].includes(file.type);

const getTodayDateValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const formatRecordedFeeAmount = (admission) => {
  const amount = admission.feeAmount ?? admission.paymentAmount ?? admission.amount;
  if (amount === undefined || amount === null || amount === '' || !Number.isFinite(Number(amount))) {
    return 'Not recorded';
  }
  return `Rs ${Number(amount).toLocaleString()}`;
};

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

  // Active Sidebar Tab: 'admissions' | 'dashboard' | 'fee_records' | 'media_gallery' | 'examination_circulars' | 'settings' | 'help'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false);
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
      setIsSidebarOpen(false);
    }
  };

  const [admissions, setAdmissions] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoadingAdminData, setIsLoadingAdminData] = useState(true);
  const [adminDataError, setAdminDataError] = useState('');
  const [feeEditDrafts, setFeeEditDrafts] = useState({});
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [facultyDraft, setFacultyDraft] = useState({});
  const [facultyPhotoFile, setFacultyPhotoFile] = useState(null);
  const [facultyPhotoName, setFacultyPhotoName] = useState('');
  const [facultyFormError, setFacultyFormError] = useState('');
  const [isSavingFaculty, setIsSavingFaculty] = useState(false);

  // 2. Media Moderation List State (starts completely empty — no demo data)
  const [mediaUploads, setMediaUploads] = useState([]);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Admin Upload Modal State
  const [isAdminUploadOpen, setIsAdminUploadOpen] = useState(false);
  const [adminUploadTitle, setAdminUploadTitle] = useState('');
  const [adminUploadCategory, setAdminUploadCategory] = useState('facilities');
  const [adminUploadFile, setAdminUploadFile] = useState(null);
  const [adminUploadError, setAdminUploadError] = useState('');
  const [isDraggingAdminUpload, setIsDraggingAdminUpload] = useState(false);
  const [isUploadingAdminMedia, setIsUploadingAdminMedia] = useState(false);
  const [adminUploadDesc, setAdminUploadDesc] = useState('');
  const [adminUploadSuccess, setAdminUploadSuccess] = useState(false);
  const adminUploadCloseTimer = useRef(null);

  // Settings state
  const [adminName, setAdminName] = useState(getAdminSessionUsername);
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [circulars, setCirculars] = useState([]);
  const [circularTitle, setCircularTitle] = useState('');
  const [circularPublishDate, setCircularPublishDate] = useState(getTodayDateValue);
  const [circularFile, setCircularFile] = useState(null);
  const [circularsLoading, setCircularsLoading] = useState(false);
  const [circularsError, setCircularsError] = useState('');
  const [circularRefreshKey, setCircularRefreshKey] = useState(0);
  const [isUploadingCircular, setIsUploadingCircular] = useState(false);
  const [deletingCircularId, setDeletingCircularId] = useState(null);
  const [principalName, setPrincipalName] = useState('');
  const [principalMessage, setPrincipalMessage] = useState('');
  const [principalImage, setPrincipalImage] = useState('');
  const [collegePhone, setCollegePhone] = useState('');
  const [collegeAddress, setCollegeAddress] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [isMeritListLive, setIsMeritListLive] = useState(false);
  const [homeContentDraft, setHomeContentDraft] = useState(DEFAULT_HOME_CONTENT);
  const [noticeDraftText, setNoticeDraftText] = useState('');
  const [tickerDraftText, setTickerDraftText] = useState('');
  const [homeContentError, setHomeContentError] = useState('');
  const [isSavingHomeContent, setIsSavingHomeContent] = useState(false);

  useEffect(() => () => {
    if (adminUploadCloseTimer.current) window.clearTimeout(adminUploadCloseTimer.current);
  }, []);

  useEffect(() => subscribeHomeContent((content) => {
    const stats = Array.isArray(content.stats) && content.stats.length === 4
      ? content.stats
      : DEFAULT_HOME_CONTENT.stats;
    const notices = Array.isArray(content.notices) ? content.notices : [];
    const tickerAnnouncements = Array.isArray(content.tickerAnnouncements) ? content.tickerAnnouncements : [];
    setHomeContentDraft({
      ...DEFAULT_HOME_CONTENT,
      ...content,
      stats,
      notices,
      tickerAnnouncements
    });
    setNoticeDraftText(notices.map((notice) => `${notice.date}|${notice.title}`).join('\n'));
    setTickerDraftText(tickerAnnouncements.join('\n'));
  }, (error) => {
    console.error('Unable to subscribe to shared admin homepage content:', error);
    setHomeContentError(error.message || 'Homepage content could not be loaded.');
  }), []);

  // Helper: Sort list by merit percentage descending (highest score first)
  const sortMeritDescending = (list) => {
    return [...list].sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0));
  };

  // Load shared dashboard data and refresh it periodically for new applications.
  useEffect(() => {
    let isMounted = true;
    const loadSharedData = async (showFailure = false) => {
      try {
        const data = await adminRequest('admin.bootstrap');
        if (!isMounted) return;
        setAdmissions(sortMeritDescending(data.admissions || []));
        setMediaUploads(data.gallery || []);
        setFacultyMembers(data.faculty || []);
        setCirculars(data.circulars || []);
        setAdminName(data.username || getAdminSessionUsername());
        setPrincipalName(data.settings.principal_name || '');
        setPrincipalMessage(data.settings.principal_message || '');
        setPrincipalImage(data.settings.principal_image_url || principalImg);
        setCollegePhone(data.settings.phone || COLLEGE_PHONE);
        setCollegeAddress(data.settings.address || COLLEGE_ADDRESS);
        setIsMeritListLive(data.settings.merit_list_live === true);
        setAdminDataError('');
      } catch (error) {
        if (!isMounted) return;
        console.error('Unable to load shared admin records:', error);
        setAdminDataError(error.message || 'Local admin data is unavailable.');
        if (showFailure) showToast('Local dashboard data could not be loaded.', 'error');
      } finally {
        if (isMounted) setIsLoadingAdminData(false);
      }
    };
    loadSharedData(true);
    const unsubscribe = subscribeLocalChanges(
      ['admissions', 'gallery', 'faculty', 'settings', 'circulars'],
      () => loadSharedData(false)
    );
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'examination_circulars') return undefined;

    let isMounted = true;
    setCircularsLoading(true);
    setCircularsError('');
    adminRequest('admin.bootstrap')
      .then((data) => {
        if (isMounted) setCirculars(data.circulars || []);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Unable to load shared examination circulars:', error);
        setCircularsError(error.message || 'Unable to load examination circulars.');
      })
      .finally(() => {
        if (isMounted) setCircularsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeTab, circularRefreshKey]);

  const updateAdmission = async (regId, changes) => {
    try {
      const updatedRecord = await adminRequest('admin.admission.update', { regId, ...changes });
      setAdmissions(current => sortMeritDescending(current.map(admission =>
        admission.regId === regId ? { ...admission, ...updatedRecord } : admission
      )));
      setFeeEditDrafts(current => {
        const next = { ...current };
        delete next[regId];
        return next;
      });
      return updatedRecord;
    } catch (error) {
      console.error('Unable to update shared admission record:', error);
      showToast(error.message || 'Unable to save admission changes.', 'error');
      return null;
    }
  };

  // Sync shared gallery items to the current dashboard and open public pages.
  const updateMediaState = (updatedList) => {
    setMediaUploads(updatedList);
    window.dispatchEvent(new Event('casdct_media_updated'));
  };

  const openFacultyForm = (profile = null) => {
    setFacultyDraft(profile ? { ...profile } : {
      name: '',
      designation: '',
      department: '',
      qualification: '',
      contact: '',
      photo_url: '',
      is_hod: false
    });
    setFacultyPhotoFile(null);
    setFacultyPhotoName('');
    setFacultyFormError('');
    setIsFacultyModalOpen(true);
  };

  const handleSaveFaculty = async (event) => {
    event.preventDefault();
    setIsSavingFaculty(true);
    setFacultyFormError('');
    try {
      const payload = { faculty: facultyDraft };
      const savedProfile = facultyPhotoFile
        ? await adminFileRequest('admin.faculty.save', payload, facultyPhotoFile, 'photo_file')
        : await adminRequest('admin.faculty.save', payload);
      setFacultyMembers(current => {
        const updated = current.filter(member => member.id !== savedProfile.id);
        return [...updated, savedProfile].sort((a, b) =>
          a.sort_order - b.sort_order || a.name.localeCompare(b.name)
        );
      });
      setIsFacultyModalOpen(false);
      window.dispatchEvent(new Event('casdct_faculty_updated'));
      showToast(`Saved faculty profile for ${savedProfile.name}.`, 'success');
    } catch (error) {
      console.error('Unable to save shared faculty profile:', error);
      setFacultyFormError(error.message || 'Unable to save this faculty profile.');
    } finally {
      setIsSavingFaculty(false);
    }
  };

  const handleDeleteFaculty = async (profile) => {
    if (!window.confirm(`Delete ${profile.name}'s faculty profile?`)) return;
    try {
      await adminRequest('admin.faculty.delete', { id: profile.id });
      setFacultyMembers(current => current.filter(member => member.id !== profile.id));
      window.dispatchEvent(new Event('casdct_faculty_updated'));
      showToast(`Deleted faculty profile for ${profile.name}.`, 'success');
    } catch (error) {
      console.error('Unable to delete shared faculty profile:', error);
      showToast(error.message || 'Unable to delete this faculty profile.', 'error');
    }
  };

  const updateFeeDraft = (regId, field, value) => {
    const currentAdmission = admissions.find(admission => admission.regId === regId);
    setFeeEditDrafts(current => ({
      ...current,
      [regId]: {
        trxId: current[regId]?.trxId ?? currentAdmission?.trxId ?? '',
        paymentMethod: current[regId]?.paymentMethod ?? currentAdmission?.paymentMethod ?? '',
        feeAmount: current[regId]?.feeAmount ?? currentAdmission?.feeAmount ?? '',
        [field]: value
      }
    }));
  };

  const handleSaveFeeDetails = async (admission) => {
    const draft = feeEditDrafts[admission.regId];
    if (!draft) {
      showToast('There are no unsaved payment details.', 'error');
      return;
    }
    const updated = await updateAdmission(admission.regId, {
      trxId: draft.trxId,
      paymentMethod: draft.paymentMethod,
      feeAmount: draft.feeAmount
    });
    if (updated) showToast(`Saved payment details for ${admission.fullName}.`, 'success');
  };

  const handleToggleFeeVerification = async (admission) => {
    const verified = await updateAdmission(admission.regId, {
      feeVerified: admission.feeVerified !== true
    });
    if (verified) {
      showToast(
        admission.feeVerified === true ? 'Payment marked as pending verification.' : 'Payment verified successfully.',
        'success'
      );
    }
  };

  // Action: Approve Admission
  const handleApproveAdmission = async (regId) => {
    const updated = await updateAdmission(regId, { status: 'approved' });
    if (!updated) return;
    const item = admissions.find(a => a.regId === regId);
    showToast(`Approved admission for ${item ? item.fullName : regId}`, 'success');
  };

  // Action: Reject Admission
  const handleRejectAdmission = async (regId) => {
    const updated = await updateAdmission(regId, { status: 'rejected' });
    if (!updated) return;
    const item = admissions.find(a => a.regId === regId);
    showToast(`Rejected admission for ${item ? item.fullName : regId}`, 'error');
  };

  // Action: Approve Media
  const handleApproveMedia = async (mediaId, assignedCategory) => {
    const item = mediaUploads.find(media => media.id === mediaId);
    if (!item) return;
    try {
      const updatedMedia = await adminRequest('admin.gallery.moderate', {
        id: mediaId,
        status: 'approved',
        category: assignedCategory || item.category || 'facilities'
      });
      updateMediaState(mediaUploads.map(media => media.id === mediaId ? updatedMedia : media));
      showToast(`Approved media item "${item.title}"`, 'success');
    } catch (error) {
      console.error('Unable to approve shared gallery media:', error);
      showToast(error.message || 'Unable to approve this gallery item.', 'error');
    }
  };

  // Action: Change Media Category
  const handleMediaCategoryChange = async (mediaId, newCategory) => {
    const item = mediaUploads.find(media => media.id === mediaId);
    if (!item) return;
    try {
      const updatedMedia = await adminRequest('admin.gallery.moderate', {
        id: mediaId,
        status: item.status,
        category: newCategory
      });
      updateMediaState(mediaUploads.map(media => media.id === mediaId ? updatedMedia : media));
      showToast(`Category updated to "${newCategory === 'sports' ? 'Sports' : 'Facilities'}"`, 'success');
    } catch (error) {
      console.error('Unable to update gallery category:', error);
      showToast(error.message || 'Unable to update the gallery category.', 'error');
    }
  };

  // Action: Reject / Delete Media — permanently removes the item from the list
  const handleRejectMedia = async (mediaId) => {
    const item = mediaUploads.find(m => m.id === mediaId);
    try {
      await adminRequest('admin.gallery.delete', { id: mediaId });
      updateMediaState(mediaUploads.filter(media => media.id !== mediaId));
    } catch (error) {
      console.error('Unable to delete media item:', error);
      showToast('Unable to delete this media item. Please try again.', 'error');
      return;
    }
    showToast(`Deleted media item "${item ? item.title : mediaId}"`, 'error');
  };

  // Action: Admin Direct Upload (auto-approved, instantly public)
  const handleAdminUploadFileChange = (file) => {
    if (!file) return;
    if (!isSupportedMediaFile(file)) {
      setAdminUploadError('Choose an image or video file.');
      setAdminUploadFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAdminUploadError('Image and video files must be 5 MB or smaller.');
      setAdminUploadFile(null);
      return;
    }
    setAdminUploadError('');
    setAdminUploadFile(file);
  };

  const resetAdminUpload = () => {
    if (adminUploadCloseTimer.current) {
      window.clearTimeout(adminUploadCloseTimer.current);
      adminUploadCloseTimer.current = null;
    }
    setIsAdminUploadOpen(false);
    setAdminUploadTitle('');
    setAdminUploadFile(null);
    setAdminUploadError('');
    setAdminUploadDesc('');
    setIsDraggingAdminUpload(false);
    setAdminUploadSuccess(false);
  };

  const handleAdminUploadMedia = async (e) => {
    e.preventDefault();
    if (!adminUploadTitle.trim() || !adminUploadFile) {
      setAdminUploadError('Enter a title and choose an image or video file.');
      return;
    }

    setIsUploadingAdminMedia(true);
    setAdminUploadError('');
    try {
      const newMedia = await adminFileRequest('admin.gallery.upload', {
        title: adminUploadTitle.trim(),
        category: adminUploadCategory,
        description: adminUploadDesc.trim()
      }, adminUploadFile, 'media_file');
      updateMediaState([newMedia, ...mediaUploads]);
      setAdminUploadSuccess(true);
      showToast(`Media "${newMedia.title}" uploaded and published!`, 'success');
      adminUploadCloseTimer.current = window.setTimeout(() => {
        adminUploadCloseTimer.current = null;
        setAdminUploadSuccess(false);
        resetAdminUpload();
      }, 2000);
    } catch (error) {
      console.error('Unable to upload admin media:', error);
      setAdminUploadError(error.message || 'Unable to upload media. Please try again.');
    } finally {
      setIsUploadingAdminMedia(false);
    }
  };

  // Counts for badges
  const pendingAdmissionsCount = useMemo(() => {
    return admissions.filter(a => a.status === 'pending').length;
  }, [admissions]);

  const verifiedPaymentsCount = useMemo(() => {
    return admissions.filter(admission => admission.feeVerified === true).length;
  }, [admissions]);

  const pendingPaymentsCount = admissions.filter(admission =>
    admission.feeVerified !== true && Boolean(admission.trxId || admission.feeSlipPath || admission.feeSlipName)
  ).length;

  const feeCollectedTotal = useMemo(() => admissions.reduce((total, admission) => {
    const amount = Number(admission.feeAmount ?? admission.paymentAmount ?? admission.amount);
    return admission.feeVerified === true && Number.isFinite(amount) && amount > 0
      ? total + amount
      : total;
  }, 0), [admissions]);

  const feeAmountRecordsCount = useMemo(() => admissions.filter((admission) => {
    const amount = Number(admission.feeAmount ?? admission.paymentAmount ?? admission.amount);
    return admission.feeVerified === true && Number.isFinite(amount) && amount > 0;
  }).length, [admissions]);

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
    const headers = [
      'Student ID', 'Student Name', "Father's Name", 'Date of Birth', 'Gender', 'CNIC',
      'Domicile', 'Phone', 'Email', 'Address', 'Program', 'Matric Board',
      'Matric Roll Number', 'Matric Passing Year', 'Matric Obtained Marks',
      'Matric Total Marks', 'Intermediate Board', 'Intermediate Roll Number',
      'Intermediate Passing Year', 'Intermediate Obtained Marks', 'Intermediate Total Marks',
      'Marks', 'Merit Percentage', 'Payment Method', 'Transaction ID', 'Payment Status',
      'Fee Slip Filename', 'Admin Status', 'Applied At'
    ];
    const rows = admissions.map(st => [
      st.regId, st.fullName, st.fatherName, st.dob, st.gender, st.cnic, st.domicile,
      st.phone || st.mobile, st.email, st.address, st.program, st.matricBoard,
      st.matricRollNo, st.matricPassingYear, st.matricMarks, st.matricTotal,
      st.interBoard, st.interRollNo, st.interPassingYear, st.interObtainedMarks,
      st.interTotalMarks, st.marksText || `${st.matricMarks ?? ''}/${st.matricTotal ?? ''}`,
      st.meritPct == null ? '' : `${st.meritPct}%`, st.paymentMethod, st.trxId,
      st.paymentStatus, st.feeSlipName, st.status, st.appliedAt
    ]);
    const escapeCsvValue = (value) => {
      const text = String(value ?? '');
      const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const csvContent = `\uFEFF${[headers, ...rows]
      .map(row => row.map(escapeCsvValue).join(','))
      .join('\r\n')}`;
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.setAttribute("href", downloadUrl);
    link.setAttribute("download", `Admissions_Merit_List_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    showToast(`Exported ${admissions.length} admissions to CSV.`, "success");
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOutAdmin();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Unable to end the admin session:', error);
      showToast(error.message || 'Unable to end the admin session.', 'error');
    }
  };

  // Handle Toggle Live Merit List Publishing Status
  const handleToggleMeritListLive = async (newStatus) => {
    try {
      await adminRequest('admin.merit.set', { published: newStatus });
      setIsMeritListLive(newStatus);
      window.dispatchEvent(new Event('casdct_merit_status_changed'));
      showToast(
        newStatus ? 'Merit List is now LIVE and published for the public!' : 'Merit List is now UNPUBLISHED and hidden from the public.',
        newStatus ? 'success' : 'error'
      );
    } catch (error) {
      console.error('Unable to update merit-list visibility:', error);
      showToast(error.message || 'Unable to update merit-list visibility.', 'error');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaved(false);
    try {
      const savedAdminName = adminName.trim();
      if (savedAdminName.length < 3 || savedAdminName.length > 80) {
        throw new Error('Admin username must be between 3 and 80 characters.');
      }
      if (adminPassword && adminPassword !== confirmAdminPassword) {
        throw new Error('The new admin password confirmation does not match.');
      }
      if (adminPassword && (adminPassword.length < 16 || adminPassword.length > 256)) {
        throw new Error('New admin passwords must be between 16 and 256 characters.');
      }

      if (savedAdminName !== getAdminSessionUsername() || adminPassword) {
        await adminRequest('auth.credentials.update', {
          username: savedAdminName,
          password: adminPassword
        });
        setAdminName(savedAdminName);
        setAdminPassword('');
        setConfirmAdminPassword('');
      }
      await adminRequest('admin.settings.save', {
        settings: {
          principal_name: principalName,
          principal_message: principalMessage,
          principal_image_url: principalImage === principalImg ? '' : principalImage,
          phone: collegePhone,
          address: collegeAddress,
          merit_list_live: isMeritListLive
        }
      });

      setSettingsSaved(true);
      window.dispatchEvent(new Event('casdct_public_settings_updated'));
      window.dispatchEvent(new Event('casdct_merit_status_changed'));
      showToast('Admin and institutional settings saved successfully!', 'success');
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      console.error('Unable to save admin settings:', error);
      setSettingsSaved(false);
      showToast(error.message || 'Settings could not be saved.', 'error');
    }
  };

  const handleSaveHomeContent = async (event) => {
    event.preventDefault();
    setHomeContentError('');
    const notices = noticeDraftText.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const separator = line.indexOf('|');
      if (separator < 0) return { date: '', title: '' };
      return { date: line.slice(0, separator).trim(), title: line.slice(separator + 1).trim() };
    });
    const tickerAnnouncements = tickerDraftText.split('\n').map((line) => line.trim()).filter(Boolean);
    const content = {
      ...homeContentDraft,
      notices,
      tickerAnnouncements
    };

    setIsSavingHomeContent(true);
    try {
      const docRef = doc(db, 'siteContent', 'homepage');
await setDoc(docRef, {
  ...content,
  updatedAt: new Date().toISOString()
});
      setHomeContentDraft(content);
      showToast('Shared homepage content and announcements saved.', 'success');
    } catch (error) {
      console.error('Unable to save shared homepage content:', error);
      setHomeContentError(error.message || 'Homepage content could not be saved.');
    } finally {
      setIsSavingHomeContent(false);
    }
  };

  const handleUploadCircular = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!circularTitle.trim() || !circularPublishDate || !circularFile) {
      showToast('Enter a title and publish date, and select a PDF file.', 'error');
      return;
    }
    if ((circularFile.type && circularFile.type !== 'application/pdf') || !circularFile.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF files can be uploaded as examination circulars.', 'error');
      return;
    }
    if (circularFile.size > MAX_CIRCULAR_SIZE_BYTES) {
      showToast('PDF files must be 10 MB or smaller.', 'error');
      return;
    }

    setIsUploadingCircular(true);
    try {
      const data = await adminFileRequest('admin.circular.save', {
        title: circularTitle.trim(),
        publishDate: circularPublishDate
      }, circularFile, 'circular_file');
      setCirculars((current) => [data, ...current.filter((item) => item.id !== data.id)].sort((a, b) =>
        b.publish_date.localeCompare(a.publish_date) || b.created_at.localeCompare(a.created_at)
      ));
      setCircularTitle('');
      setCircularPublishDate(getTodayDateValue());
      setCircularFile(null);
      form.reset();
      showToast('Examination circular published successfully.', 'success');
    } catch (error) {
      console.error('Unable to publish examination circular:', error);
      showToast(error.message || 'Unable to publish the examination circular.', 'error');
    } finally {
      setIsUploadingCircular(false);
    }
  };

  const handleDeleteCircular = async (circular) => {
    if (!window.confirm(`Remove "${circular.title}" from the public examination page?`)) return;

    setDeletingCircularId(circular.id);
    try {
      await adminRequest('admin.circular.delete', { id: circular.id });
      setCirculars((current) => current.filter((item) => item.id !== circular.id));
      showToast('Examination circular removed.', 'success');
    } catch (error) {
      console.error('Unable to remove examination circular:', error);
      showToast(error.message || 'Unable to remove the examination circular.', 'error');
    } finally {
      setDeletingCircularId(null);
    }
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
                <video src={previewMedia.publicUrl} controls autoPlay className="max-h-96 w-full object-contain" />
              ) : (
                <img src={previewMedia.publicUrl} alt={previewMedia.title} className="max-h-96 w-full object-contain" />
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
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-[#0d3b4e] bg-[#052836] text-slate-200 transition-transform duration-300 md:relative md:z-auto md:min-h-screen md:w-64 md:flex-shrink-0 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
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
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-300 hover:bg-[#0a3345] hover:text-white md:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
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
              onClick={() => handleTabSelect('faculty')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'faculty' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>Faculty Management</span>
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
              onClick={() => handleTabSelect('examination_circulars')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === 'examination_circulars' ? 'bg-[#13485b] text-white font-semibold shadow-md' : 'text-slate-300 hover:bg-[#0a3345] hover:text-white'}`}
            >
              <ClipboardList className="w-5 h-5 text-violet-400" />
              <span>Examination / Circulars</span>
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
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
          {/* Header Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="admin-sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800">
              {activeTab === 'admissions' && <FileText className="w-6 h-6" />}
              {activeTab === 'dashboard' && <LayoutGrid className="w-6 h-6" />}
              {activeTab === 'faculty' && <UserCheck className="w-6 h-6" />}
              {activeTab === 'fee_records' && <CreditCard className="w-6 h-6" />}
              {activeTab === 'media_gallery' && <ImageIcon className="w-6 h-6" />}
              {activeTab === 'examination_circulars' && <ClipboardList className="w-6 h-6" />}
              {activeTab === 'settings' && <Settings className="w-6 h-6" />}
              {activeTab === 'help' && <HelpCircle className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                {activeTab === 'admissions' && 'Admissions & Merit List'}
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'faculty' && 'Faculty Management'}
                {activeTab === 'fee_records' && 'Fee Records & Receipts'}
                {activeTab === 'media_gallery' && 'Media Gallery Moderation'}
                {activeTab === 'examination_circulars' && 'Examination / Circulars Management'}
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
        <div key={activeTab} className="admin-content-enter p-6 space-y-6">
          {adminDataError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
              Local dashboard data is unavailable: {adminDataError}
            </div>
          )}
          {isLoadingAdminData && (
            <p role="status" className="text-sm text-slate-500">Loading local dashboard records…</p>
          )}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            Authentication is verified server-side, but admissions, media, circulars, faculty, and settings remain in this browser only. They do not sync across devices and are not protected by server-side authorization.
          </div>

          {/* Dashboard overview and admissions management */}
          {(activeTab === 'admissions' || activeTab === 'dashboard') && (
            <>
              {activeTab === 'dashboard' && (
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Summary of admission and payment records saved in this browser.</p>
                </div>
              )}

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
                      {admissions.length.toLocaleString()}
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                      <span>Applications recorded</span>
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
                      {pendingAdmissionsCount.toLocaleString()}
                    </div>
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Requires admin action</span>
                    </div>
                  </div>
                  <Clock className="w-24 h-24 text-amber-500/5 dark:text-amber-500/10 absolute -right-4 -bottom-4 pointer-events-none" />
                </div>

                {/* Metric 3: Verified Payments */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee Collected</span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                      {feeAmountRecordsCount > 0 ? `Rs ${feeCollectedTotal.toLocaleString()}` : 'Not recorded'}
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                      <span>{verifiedPaymentsCount.toLocaleString()} verified payments</span>
                    </div>
                  </div>
                  <Wallet className="w-24 h-24 text-emerald-500/5 dark:text-emerald-500/10 absolute -right-4 -bottom-4 pointer-events-none" />
                </div>

              </div>

              {activeTab === 'admissions' && (
                <>
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

                {/* Right Side Actions: Publish Toggle & Export CSV */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleMeritListLive(!isMeritListLive)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm border ${
                      isMeritListLive 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${isMeritListLive ? 'bg-emerald-200 animate-pulse' : 'bg-white'}`} />
                    <span>{isMeritListLive ? 'Merit List: LIVE (Published)' : 'Merit List: UNPUBLISHED'}</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* ---------------- ADMISSIONS & MERIT LIST TABLE ---------------- */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                
                {/* Table Section Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                      Recent Admissions & Merit List
                    </h2>
                    <p className="text-xs text-slate-500">
                      Public Visibility Status: <span className={isMeritListLive ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{isMeritListLive ? 'Published to Admission Page' : 'Hidden from Public'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>{pendingAdmissionsCount} pending moderation</span>
                    </div>
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
                              {st.feeVerified === true ? (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</div>
                                  <span>Payment verified{st.paymentMethod ? ` · ${st.paymentMethod}` : ''}</span>
                                </div>
                              ) : st.trxId || st.feeSlipPath || st.feeSlipName ? (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                  <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">⏱</div>
                                  <span>Payment submitted · pending verification</span>
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
                        {media.type === 'video' ? (
                          <video src={media.publicUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                        ) : (
                          <img src={media.publicUrl} alt={media.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                        )}
                        {/* Overlay Icon / Badges */}
                        {media.type === 'video' ? (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              VIDEO
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white p-1 rounded">
                              <ImageIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {media.fileName?.split('.').pop()?.toUpperCase() || 'IMAGE'}
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
            </>
          )}

          {/* ---------------- FACULTY MANAGEMENT TAB ---------------- */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <section className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Faculty Management</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage faculty and HOD profiles shown on this browser's public Faculty page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openFacultyForm()}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-800"
                >
                  <Plus className="h-4 w-4" /> Add Faculty Profile
                </button>
              </section>

              {facultyMembers.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  No faculty profiles are available. Add a profile to publish it on the public website.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {facultyMembers.map((member) => (
                    <article key={member.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-teal-50 dark:bg-slate-800">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-teal-600 dark:text-teal-300">
                            <Users className="h-9 w-9" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="font-bold text-slate-900 dark:text-white">{member.name}</h2>
                            <p className="mt-1 text-xs font-semibold text-teal-700 dark:text-teal-300">{member.designation}</p>
                          </div>
                          {member.is_hod && <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">HOD</span>}
                        </div>
                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">{member.department}</p>
                        <p className="mt-1 text-xs text-slate-500">{member.qualification}</p>
                        {member.contact && <p className="mt-1 break-all text-xs text-slate-500">{member.contact}</p>}
                        <div className="mt-4 flex gap-2">
                          <button type="button" onClick={() => openFacultyForm(member)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                            <Edit3 className="mr-1 inline h-3.5 w-3.5" /> Edit
                          </button>
                          <button type="button" onClick={() => handleDeleteFaculty(member)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40">
                            <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {isFacultyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
                  <form onSubmit={handleSaveFaculty} className="relative my-auto max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                    <button type="button" onClick={() => setIsFacultyModalOpen(false)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close faculty form">
                      <X className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="pr-10 text-lg font-bold text-slate-900 dark:text-white">{facultyDraft.id ? 'Edit Faculty Profile' : 'Add Faculty Profile'}</h2>
                      <p className="mt-1 text-xs text-slate-500">Profiles are saved centrally and become visible on the public Faculty page.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        ['name', 'Name', true],
                        ['designation', 'Designation', true],
                        ['department', 'Department', true],
                        ['qualification', 'Qualification', true],
                        ['contact', 'Email / Contact', false]
                      ].map(([field, label, required]) => (
                        <label key={field} className={`block text-xs font-bold text-slate-600 dark:text-slate-300 ${field === 'qualification' || field === 'contact' ? 'sm:col-span-2' : ''}`}>
                          <span className="mb-1 block uppercase">{label}</span>
                          <input
                            type="text"
                            required={required}
                            maxLength={500}
                            value={facultyDraft[field] || ''}
                            onChange={(event) => setFacultyDraft(current => ({ ...current, [field]: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </label>
                      ))}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={facultyDraft.is_hod === true}
                        onChange={(event) => setFacultyDraft(current => ({ ...current, is_hod: event.target.checked }))}
                        className="h-4 w-4 accent-teal-700"
                      />
                      Mark as Head of Department (HOD)
                    </label>
                    <div>
                      <label htmlFor="faculty-photo" className="mb-1 block text-xs font-bold uppercase text-slate-500">Profile Photo (JPEG, PNG, WebP or GIF; max 5 MB)</label>
                      <input
                        id="faculty-photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={async (event) => {
                          const file = event.currentTarget.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024 || !/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
                            setFacultyFormError('Choose a JPEG, PNG, WebP, or GIF image no larger than 5 MB.');
                            event.currentTarget.value = '';
                            return;
                          }
                          try {
                            setFacultyPhotoFile(file);
                            setFacultyPhotoName(file.name);
                            setFacultyFormError('');
                          } catch (error) {
                            setFacultyFormError(error.message);
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                      />
                      <p className="mt-1 text-xs text-slate-500">{facultyPhotoName || (facultyDraft.photo_url ? 'Current profile photo will be kept unless replaced.' : 'No photo selected.')}</p>
                    </div>
                    {facultyFormError && <p role="alert" className="text-sm font-semibold text-rose-600">{facultyFormError}</p>}
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <button type="button" onClick={() => setIsFacultyModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">Cancel</button>
                      <button type="submit" disabled={isSavingFaculty} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60">
                        {isSavingFaculty ? 'Saving…' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ---------------- FEE RECORDS TAB ---------------- */}
          {activeTab === 'fee_records' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fee Collection Summary</h2>
                    <p className="text-xs text-slate-500">Review submitted payment details, verification status and any recorded amounts.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">Verified Payments</span>
                    <div className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">{verifiedPaymentsCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">Pending Fee Records</span>
                    <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 mt-1">{pendingPaymentsCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-4 rounded-xl">
                    <span className="text-xs text-sky-700 dark:text-sky-400 font-bold uppercase">Admission Fee Records</span>
                    <div className="text-2xl font-extrabold text-sky-900 dark:text-sky-200 mt-1">{admissions.length.toLocaleString()}</div>
                  </div>
                  <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 p-4 rounded-xl">
                    <span className="text-xs text-violet-700 dark:text-violet-400 font-bold uppercase">Verified Fee Amount</span>
                    <div className="text-2xl font-extrabold text-violet-900 dark:text-violet-200 mt-1">{feeAmountRecordsCount > 0 ? `Rs ${feeCollectedTotal.toLocaleString()}` : 'Not recorded'}</div>
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
                        <th className="p-3">Receipt / Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {admissions.map(st => {
                        const draft = feeEditDrafts[st.regId] || {};
                        const receiptUrl = typeof st.feeSlipUrl === 'string' &&
                          /^https:\/\//i.test(st.feeSlipUrl)
                          ? st.feeSlipUrl
                          : '';
                        return (
                        <tr key={st.regId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 min-w-40">
                            <input
                              aria-label={`Transaction ID for ${st.fullName}`}
                              value={draft.trxId ?? st.trxId ?? ''}
                              onChange={(event) => updateFeeDraft(st.regId, 'trxId', event.target.value)}
                              className="w-36 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">{st.fullName}</td>
                          <td className="p-3">{st.program}</td>
                          <td className="p-3">
                            <input
                              aria-label={`Payment method for ${st.fullName}`}
                              value={draft.paymentMethod ?? st.paymentMethod ?? ''}
                              onChange={(event) => updateFeeDraft(st.regId, 'paymentMethod', event.target.value)}
                              className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              aria-label={`Fee amount for ${st.fullName}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={draft.feeAmount ?? st.feeAmount ?? ''}
                              onChange={(event) => updateFeeDraft(st.regId, 'feeAmount', event.target.value)}
                              placeholder="Not recorded"
                              className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            <div className="mt-1 text-[10px] text-slate-500">{formatRecordedFeeAmount(st)}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${st.feeVerified === true ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {st.feeVerified === true ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex min-w-40 flex-col items-start gap-2">
                              {receiptUrl ? (
                                <a href={receiptUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-teal-700 underline dark:text-teal-300">
                                  View {st.feeSlipName || 'receipt'}
                                </a>
                              ) : <span className="text-xs text-slate-500">{st.feeSlipName || 'No receipt'}</span>}
                              <button
                                type="button"
                                onClick={() => handleSaveFeeDetails(st)}
                                className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                              >
                                Save details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleFeeVerification(st)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold text-white ${st.feeVerified === true ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                              >
                                {st.feeVerified === true ? 'Unverify payment' : 'Verify payment'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );})}
                      {admissions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500">No admission fee records have been submitted.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- ADMIN UPLOAD MEDIA MODAL ---------------- */}
          {isAdminUploadOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={resetAdminUpload}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Upload New Media</h3>
                    <p className="text-xs text-slate-500">Media uploaded by admin is auto-approved and instantly visible in the public gallery.</p>
                  </div>
                </div>

                {adminUploadSuccess ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-6 rounded-2xl text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-base">Published Successfully!</h4>
                    <p className="text-xs">Your media has been uploaded and is now live in the public gallery.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAdminUploadMedia} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={adminUploadTitle}
                        onChange={(e) => setAdminUploadTitle(e.target.value)}
                        placeholder="Enter media title..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select
                        value={adminUploadCategory}
                        onChange={(e) => setAdminUploadCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="facilities">Facilities</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Photo / Video File</span>
                      <label
                        htmlFor="admin-media-file"
                        onDragOver={(event) => {
                          event.preventDefault();
                          setIsDraggingAdminUpload(true);
                        }}
                        onDragLeave={() => setIsDraggingAdminUpload(false)}
                        onDrop={(event) => {
                          event.preventDefault();
                          setIsDraggingAdminUpload(false);
                          handleAdminUploadFileChange(event.dataTransfer.files[0]);
                        }}
                        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
                          isDraggingAdminUpload
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                            : 'border-slate-300 bg-slate-50 hover:border-teal-400 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      >
                        <input
                          id="admin-media-file"
                          type="file"
                          accept="image/*,video/*"
                          className="sr-only"
                          onChange={(event) => {
                            handleAdminUploadFileChange(event.currentTarget.files[0]);
                            event.currentTarget.value = '';
                          }}
                        />
                        {adminUploadFile ? (
                          <>
                            {isVideoMediaFile(adminUploadFile)
                              ? <Play className="mb-2 h-7 w-7 text-teal-600 dark:text-teal-400" />
                              : <ImageIcon className="mb-2 h-7 w-7 text-teal-600 dark:text-teal-400" />}
                            <span className="max-w-full truncate text-sm font-bold text-teal-700 dark:text-teal-300">{adminUploadFile.name}</span>
                            <span className="mt-1 text-xs text-slate-500">
                              {adminUploadFile.size > 1024 * 1024
                                ? `${(adminUploadFile.size / (1024 * 1024)).toFixed(1)} MB`
                                : `${Math.max(1, Math.round(adminUploadFile.size / 1024))} KB`}
                              {' · '}Click to replace
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="mb-2 h-7 w-7 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              <span className="text-teal-600 dark:text-teal-400">Choose a file</span> or drag it here
                            </span>
                            <span className="mt-1 text-xs text-slate-500">Supported images and videos, maximum 5 MB</span>
                          </>
                        )}
                      </label>
                      {adminUploadError && (
                        <p role="alert" className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">{adminUploadError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (Optional)</label>
                      <textarea
                        rows={2}
                        value={adminUploadDesc}
                        onChange={(e) => setAdminUploadDesc(e.target.value)}
                        placeholder="Provide a brief caption or context..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={resetAdminUpload}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploadingAdminMedia}
                        className="bg-teal-600 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> {isUploadingAdminMedia ? 'Uploading...' : 'Upload & Publish'}
                      </button>
                    </div>
                  </form>
                )}
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
                  <button
                    onClick={() => setIsAdminUploadOpen(true)}
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Upload New Media
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaUploads.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-400">
                      No media uploads pending moderation.
                    </div>
                  ) : (
                    mediaUploads.map((media) => (
                      <div key={media.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                        <div>
                          <div className="relative h-44 rounded-xl overflow-hidden bg-black mb-3">
                            {media.type === 'video' ? (
                              <video
                                src={media.publicUrl}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={media.publicUrl}
                                alt={media.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                            {media.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{media.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{media.uploadedBy} • {media.size || 'Media'} • {media.uploadedTime || 'Recent'}</p>
                          {media.desc && <p className="text-xs text-slate-400 italic mt-1 line-clamp-2">"{media.desc}"</p>}
                          
                          {/* Admin Category Selection Dropdown */}
                          <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Assigned Category</label>
                            <select
                              value={media.category && (media.category === 'sports' || media.category === 'facilities') ? media.category : 'facilities'}
                              onChange={(e) => handleMediaCategoryChange(media.id, e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                              <option value="facilities">Facilities</option>
                              <option value="sports">Sports</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                          {media.status === 'approved' || media.isApproved ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Approved & Live
                              </span>
                              <button onClick={() => handleRejectMedia(media.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 underline cursor-pointer">
                                Unpublish
                              </button>
                            </div>
                          ) : media.status === 'rejected' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" /> Rejected
                              </span>
                              <button onClick={() => handleApproveMedia(media.id, media.category)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer">
                                Approve
                              </button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => handleApproveMedia(media.id, media.category)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button onClick={() => handleRejectMedia(media.id)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                          <button onClick={() => setPreviewMedia(media)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 ml-auto cursor-pointer">
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- EXAMINATION CIRCULARS TAB ---------------- */}
          {activeTab === 'examination_circulars' && (
            <div className="space-y-6">
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Examination / Circulars Management</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Publish PDF circulars to the public Examination page. PDFs are limited to 10 MB.
                  </p>
                </div>

                <form onSubmit={handleUploadCircular} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="circular-title" className="mb-1 block text-xs font-bold uppercase text-slate-500">Circular Title</label>
                    <input
                      id="circular-title"
                      type="text"
                      required
                      maxLength={180}
                      value={circularTitle}
                      onChange={(event) => setCircularTitle(event.target.value)}
                      placeholder="For example: Intermediate Annual-I Date Sheet"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="circular-publish-date" className="mb-1 block text-xs font-bold uppercase text-slate-500">Publish Date</label>
                    <input
                      id="circular-publish-date"
                      type="date"
                      required
                      value={circularPublishDate}
                      onChange={(event) => setCircularPublishDate(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="circular-file" className="mb-1 block text-xs font-bold uppercase text-slate-500">PDF File</label>
                    <input
                      id="circular-file"
                      type="file"
                      required
                      accept=".pdf,application/pdf"
                      onChange={(event) => setCircularFile(event.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 md:col-span-2">
                    <span className="truncate text-xs text-slate-500">
                      {circularFile ? `${circularFile.name} (${(circularFile.size / (1024 * 1024)).toFixed(2)} MB)` : 'Select a PDF file (maximum 10 MB).'}
                    </span>
                    <button
                      type="submit"
                      disabled={isUploadingCircular}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FileUp className="h-4 w-4" />
                      {isUploadingCircular ? 'Publishing…' : 'Publish Circular'}
                    </button>
                  </div>
                </form>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Published Examination Circulars</h3>
                    <p className="mt-1 text-xs text-slate-500">These files are available to all visitors on the Examination page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCircularRefreshKey((key) => key + 1)}
                    disabled={circularsLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${circularsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {circularsLoading ? (
                  <p role="status" className="p-6 text-sm text-slate-500">Loading circulars…</p>
                ) : circularsError ? (
                  <div role="alert" className="p-6 text-sm text-rose-700">
                    <p>Unable to load examination circulars: {circularsError}</p>
                  </div>
                ) : circulars.length === 0 ? (
                  <p className="p-6 text-sm text-slate-500">No examination circulars have been published.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {circulars.map((circular) => {
                      const fileUrl = circular.public_url;
                      return (
                        <div key={circular.id} className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
                          <div className="min-w-0">
                            <p className="break-words text-sm font-bold text-slate-900 dark:text-white">{circular.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              Published {new Date(`${circular.publish_date}T00:00:00`).toLocaleDateString()} · {circular.file_name}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 dark:border-slate-700 dark:text-teal-300 dark:hover:bg-slate-800"
                            >
                              View PDF
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteCircular(circular)}
                              disabled={deletingCircularId === circular.id}
                              aria-label={`Remove ${circular.title}`}
                              className="rounded-lg border border-rose-200 p-2 text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950"
                            >
                              {deletingCircularId === circular.id
                                ? <RefreshCw className="h-4 w-4 animate-spin" />
                                : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ---------------- SETTINGS TAB ---------------- */}
          {activeTab === 'settings' && (
            <>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Access & College Settings</h2>
                <p className="text-xs text-slate-500">Manage this browser's local prototype admin credentials, along with institutional information and the principal desk message. These credentials are not secure for production.</p>
              </div>

              {settingsSaved && (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Settings saved successfully!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* Merit List Publishing Control Card */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Public Live Merit Ranking List Control
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Control whether student merit rankings are publicly visible on the Admissions page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleMeritListLive(!isMeritListLive)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      isMeritListLive 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${isMeritListLive ? 'bg-emerald-200 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{isMeritListLive ? 'Merit List: Published (Live)' : 'Merit List: Unpublished (Hidden)'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-950 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-100">
                  <p className="font-semibold">Update Admin Credentials</p>
                  <p className="mt-1 text-xs leading-relaxed">Credential changes are saved to the secure server-side database. Updating either credential signs out other active sessions. Passwords must be at least 16 characters and are never stored in browser storage.</p>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Admin Username</label>
                      <input
                        type="text"
                        required
                        minLength={3}
                        maxLength={80}
                        autoComplete="username"
                        value={adminName}
                        onChange={(event) => setAdminName(event.target.value)}
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">New Admin Password</label>
                      <div className="relative">
                        <input
                          type={showAdminPassword ? 'text' : 'password'}
                          minLength={16}
                          maxLength={256}
                          autoComplete="new-password"
                          value={adminPassword}
                          onChange={(event) => setAdminPassword(event.target.value)}
                          placeholder="Leave blank to keep current password"
                          className="w-full rounded-xl border border-teal-200 bg-white px-4 py-2.5 pr-12 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword((visible) => !visible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-400 dark:hover:text-white"
                          aria-label={showAdminPassword ? 'Hide new admin password' : 'Show new admin password'}
                          aria-pressed={showAdminPassword}
                        >
                          {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {adminPassword && (
                    <div className="mt-4">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Confirm New Admin Password</label>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        minLength={16}
                        maxLength={256}
                        autoComplete="new-password"
                        value={confirmAdminPassword}
                        onChange={(event) => setConfirmAdminPassword(event.target.value)}
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  )}
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 sm:col-span-2">
                    Campus Address
                    <textarea
                      rows={2}
                      value={collegeAddress}
                      onChange={(e) => setCollegeAddress(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </label>
                </div>

                <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-wider shadow-md">
                  Save Changes
                </button>
              </form>
            </div>
            <form onSubmit={handleSaveHomeContent} className="max-w-4xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Homepage Content & Announcements</h2>
                <p className="mt-1 text-xs text-slate-500">Changes are saved to Firestore and appear on every device in real time. Announcement lines use YYYY-MM-DD|Title.</p>
              </div>
              {homeContentError && (
                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{homeContentError}</p>
              )}
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Homepage headline
                  <input
                    type="text"
                    maxLength={180}
                    required
                    value={homeContentDraft.heroTitle}
                    onChange={(event) => setHomeContentDraft((current) => ({ ...current, heroTitle: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Homepage description
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={homeContentDraft.heroDesc}
                    onChange={(event) => setHomeContentDraft((current) => ({ ...current, heroDesc: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {homeContentDraft.stats.map((stat, index) => (
                    <div key={`home-stat-${index}`} className="grid grid-cols-2 gap-2">
                      <label className="block text-xs font-bold uppercase text-slate-500">
                        Statistic {index + 1} value
                        <input
                          type="text"
                          maxLength={40}
                          required
                          value={stat.value}
                          onChange={(event) => setHomeContentDraft((current) => ({
                            ...current,
                            stats: current.stats.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, value: event.target.value } : item
                            )
                          }))}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </label>
                      <label className="block text-xs font-bold uppercase text-slate-500">
                        Statistic {index + 1} label
                        <input
                          type="text"
                          maxLength={100}
                          required
                          value={stat.label}
                          onChange={(event) => setHomeContentDraft((current) => ({
                            ...current,
                            stats: current.stats.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, label: event.target.value } : item
                            )
                          }))}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Homepage notice board
                  <textarea
                    rows={6}
                    value={noticeDraftText}
                    onChange={(event) => setNoticeDraftText(event.target.value)}
                    placeholder="2026-10-05|Admissions announcement"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="mt-1 block text-[11px] font-medium normal-case text-slate-500">Add, edit, or remove notices, one per line. Maximum 12.</span>
                </label>
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Scrolling ticker announcements
                  <textarea
                    rows={5}
                    value={tickerDraftText}
                    onChange={(event) => setTickerDraftText(event.target.value)}
                    placeholder="One public announcement per line"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="mt-1 block text-[11px] font-medium normal-case text-slate-500">Add, edit, or remove ticker messages, one per line. Maximum 12.</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={isSavingHomeContent}
                className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
              >
                {isSavingHomeContent ? 'Saving local content…' : 'Save Homepage Content'}
              </button>
            </form>
            </>
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
                    Click the "Export CSV" button right above the Recent Admissions table. The Excel-friendly CSV includes applicant details, marks, payment information, and admission status for all admissions.
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
