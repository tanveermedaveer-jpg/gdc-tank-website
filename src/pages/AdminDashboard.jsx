import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, Image as ImageIcon, Users, FileText, Settings, 
  Plus, Trash2, LogOut, CheckCircle, RefreshCw, Edit3, Lock,
  Shield, Mail, Eye, EyeOff, Globe, Printer, X, Sun, Moon
} from 'lucide-react';
import principalImg from '../assets/principal.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function AdminDashboard({ darkMode: propDarkMode, setDarkMode: propSetDarkMode }) {
  const { t } = useLanguage();
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

  const [activeTab, setActiveTab] = useState('notices');
  const navigate = useNavigate();

  // Notices State
  const [notices, setNotices] = useState([]);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [newNoticeFile, setNewNoticeFile] = useState(null);
  
  // Gallery State
  const [gallery, setGallery] = useState([]);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('facilities');

  // Admissions State
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  // Faculty State
  const [faculty, setFaculty] = useState([]);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyRole, setNewFacultyRole] = useState('Lecturer');
  const [newFacultyQual, setNewFacultyQual] = useState('');
  const [newFacultyDept, setNewFacultyDept] = useState('Computer Science');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyIsHOD, setNewFacultyIsHOD] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);

  // Principal Message State
  const [principalMessage, setPrincipalMessage] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalImage, setPrincipalImage] = useState('');
  
  // Admin Credentials State
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  // Admission Desk State
  const [admissionPhone, setAdmissionPhone] = useState('');
  const [admissionEmail, setAdmissionEmail] = useState('');

  // Stats States
  const [stat1Value, setStat1Value] = useState('');
  const [stat1Label, setStat1Label] = useState('');
  const [stat2Value, setStat2Value] = useState('');
  const [stat2Label, setStat2Label] = useState('');
  const [stat3Value, setStat3Value] = useState('');
  const [stat3Label, setStat3Label] = useState('');
  const [stat4Value, setStat4Value] = useState('');
  const [stat4Label, setStat4Label] = useState('');

  // Ticker Announcements State
  const [tickerAnnouncements, setTickerAnnouncements] = useState([]);
  const [newTickerAnnouncement, setNewTickerAnnouncement] = useState('');

  // Hero & College Info State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [collegePhone, setCollegePhone] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [collegeAddress, setCollegeAddress] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    // 1. Notices
    const storedNotices = localStorage.getItem('casdct_notices');
    if (storedNotices) {
      setNotices(JSON.parse(storedNotices));
    } else {
      const defaultNotices = [
        { id: 1, date: 'Aug 24, 2026', title: 'Admissions open for F.Sc Pre-Medical & Pre-Engineering' },
        { id: 2, date: 'Aug 20, 2026', title: 'BS Computer Science & BS English admission schedule announced' },
        { id: 3, date: 'Aug 15, 2026', title: 'Orientation ceremony for new intermediate batch on Sept 1st' },
        { id: 4, date: 'Aug 10, 2026', title: 'HED KP scholarships application deadline extended to Sept 10' }
      ];
      localStorage.setItem('casdct_notices', JSON.stringify(defaultNotices));
      setNotices(defaultNotices);
    }

    // 2. Gallery
    const storedGallery = localStorage.getItem('casdct_gallery');
    if (storedGallery) {
      setGallery(JSON.parse(storedGallery));
    } else {
      const defaultGallery = [
        {
          id: 1,
          image: '/src/assets/campus.png',
          title: 'College Front Campus View',
          category: 'campus',
          desc: 'Beautiful view of the college lawn and academic blocks reflecting after rain.'
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
          title: 'College Library & Reading Hall',
          category: 'facilities',
          desc: 'Students utilizing the references in the quiet study zones of the library.'
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
          title: 'Computer Science Lab Practical',
          category: 'facilities',
          desc: 'Students writing algorithms and code during their ICS practical session.'
        },
        {
          id: 4,
          image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
          title: 'Annual Sports Gala - Volleyball Tournament',
          category: 'sports',
          desc: 'Intense volleyball matches played during the college annual sports week.'
        },
        {
          id: 5,
          image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
          title: 'Science Lab - Chemistry Experiments',
          category: 'facilities',
          desc: 'F.Sc Pre-Medical students performing acid-base titration tests.'
        },
        {
          id: 6,
          image: '/src/assets/logo.jpg',
          title: 'College Official Shield/Emblem',
          category: 'campus',
          desc: 'Government Degree College Tank official shield emblem displaying motivational Arabic calligraphy.'
        }
      ];
      localStorage.setItem('casdct_gallery', JSON.stringify(defaultGallery));
      setGallery(defaultGallery);
    }

    // 3. Admissions
    const storedAdmissions = localStorage.getItem('casdct_admissions');
    if (storedAdmissions) {
      const parsed = JSON.parse(storedAdmissions).map(ad => ({
        fullName: ad.fullName || ad.studentName || 'Student Name',
        phone: ad.phone || ad.mobile || '',
        cnic: ad.cnic || '',
        program: ad.program || '',
        matricMarks: Number(ad.matricMarks || ad.matricObtainedMarks || 0),
        matricTotal: Number(ad.matricTotal || ad.matricTotalMarks || 1100),
        domicile: ad.domicile || '',
        gender: ad.gender || 'male',
        address: ad.address || '',
        fatherName: ad.fatherName || '',
        email: ad.email || '',
        status: ad.status || 'pending',
        regId: ad.regId || ad.id || '',
        ...ad
      }));
      setAdmissions(parsed);
    }

    // 4. Faculty
    const storedFaculty = localStorage.getItem('casdct_faculty');
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty));
    } else {
      const defaultFaculty = [
        { id: 1, name: 'Prof. Shabir Ahmad', role: 'Principal / Head of Institution', qual: 'M.Phil English Literature (Peshawar University)', dept: 'Administration / English', email: 'principal@casdct.edu.pk', isHOD: true },
        { id: 2, name: 'Mr. Muhammad Imran', role: 'HOD / Lecturer', qual: 'MS Computer Science (Gomal University)', dept: 'Computer Science', email: 'imran.cs@casdct.edu.pk', isHOD: true },
        { id: 3, name: 'Dr. Shakeel Ahmad', role: 'HOD / Assistant Professor', qual: 'Ph.D Organic Chemistry (Quaid-e-Azam University)', dept: 'Chemistry', email: 'shakeel.chem@casdct.edu.pk', isHOD: true },
        { id: 4, name: 'Mr. Najeeb-ur-Rehman', role: 'HOD / Lecturer', qual: 'M.Sc Physics (Peshawar University)', dept: 'Physics', email: 'najeeb.phys@casdct.edu.pk', isHOD: true },
        { id: 5, name: 'Mr. Habib-ur-Rehman', role: 'HOD / Assistant Professor', qual: 'M.Phil Zoology (Gomal University)', dept: 'Biological Sciences (Zoology)', email: 'habib.zoo@casdct.edu.pk', isHOD: true }
      ];
      localStorage.setItem('casdct_faculty', JSON.stringify(defaultFaculty));
      setFaculty(defaultFaculty);
    }

    // 5. Inquiries
    const storedInquiries = localStorage.getItem('casdct_inquiries');
    if (storedInquiries) {
      setInquiries(JSON.parse(storedInquiries));
    } else {
      const defaultInquiries = [
        { id: 1, date: 'Aug 21, 2026, 11:30 AM', name: 'Zeeshan Khan', email: 'zeeshan@gmail.com', phone: '03001234567', subject: 'admission', message: 'I want to ask if hostel rooms are available for new BS Computer Science students.', read: false },
        { id: 2, date: 'Aug 19, 2026, 02:15 PM', name: 'Ahmad Shah', email: 'ahmad@yahoo.com', phone: '03129876543', subject: 'examination', message: 'When will the intermediate board supply exams roll number slips be dispatched?', read: true }
      ];
      localStorage.setItem('casdct_inquiries', JSON.stringify(defaultInquiries));
      setInquiries(defaultInquiries);
    }

    // 6. Principal Desk Settings Info
    const storedPMessage = localStorage.getItem('casdct_principal_message');
    const storedPName = localStorage.getItem('casdct_principal_name');
    const storedPImage = localStorage.getItem('casdct_principal_image');
    setPrincipalMessage(storedPMessage || 'It is a matter of great pride and privilege to welcome you to Captain. Ashfaq Shaheed Degree College, Tank. This college stands as a beacon of learning in South KP, committed to delivering high-quality intermediate and undergraduate education to our youth.\n\nOur primary goal is to nurture academic curiosity, foster critical thinking, and build a strong sense of responsibility. Naming our college in honor of the martyred military officer, Captain Ashfaq Shaheed, reminds us daily of the virtues of discipline, sacrifice, and duty to our homeland.\n\nWe are proud of our qualified faculty, well-equipped science and computer labs, and a spacious green campus that supports learning. I invite you to join us and become part of a legacy that strives for excellence in every field of life.');
    setPrincipalName(storedPName || 'Prof. Shabir Ahmad');
    setPrincipalImage(storedPImage || principalImg);

    // 7. Admin Credentials Info
    const storedAdminName = localStorage.getItem('casdct_admin_name');
    const storedAdminPass = localStorage.getItem('casdct_admin_pass');
    setAdminName(storedAdminName || 'Shabir Ahmad');
    setAdminPassword(storedAdminPass || '122011577');

    // 8. Admission Desk Info
    const storedPhone = localStorage.getItem('casdct_admission_phone');
    const storedEmail = localStorage.getItem('casdct_admission_email');
    setAdmissionPhone(storedPhone || '+92 (0963) 510111');
    setAdmissionEmail(storedEmail || 'admissions@casdct.edu.pk');

    // 9. Stats Info
    const s1v = localStorage.getItem('casdct_stat1_value');
    const s1l = localStorage.getItem('casdct_stat1_label');
    const s2v = localStorage.getItem('casdct_stat2_value');
    const s2l = localStorage.getItem('casdct_stat2_label');
    const s3v = localStorage.getItem('casdct_stat3_value');
    const s3l = localStorage.getItem('casdct_stat3_label');
    const s4v = localStorage.getItem('casdct_stat4_value');
    const s4l = localStorage.getItem('casdct_stat4_label');
    
    setStat1Value(s1v || '1,200+');
    setStat1Label(s1l || 'Active Students');
    setStat2Value(s2v || '45+');
    setStat2Label(s2l || 'Qualified Lecturers');
    setStat3Value(s3v || '10+');
    setStat3Label(s3l || 'BS & Inter Programs');
    setStat4Value(s4v || '100%');
    setStat4Label(s4l || 'Dedicated Support');

    // 10. Hero Banner & College General Contact info
    const storedHeroTitle = localStorage.getItem('casdct_hero_title');
    const storedHeroDesc = localStorage.getItem('casdct_hero_desc');
    const storedCollegePhone = localStorage.getItem('casdct_college_phone');
    const storedCollegeEmail = localStorage.getItem('casdct_college_email');
    const storedCollegeAddress = localStorage.getItem('casdct_college_address');

    setHeroTitle(storedHeroTitle || 'Government Captain Ashfaq Shaheed Degree College Tank');
    setHeroDesc(storedHeroDesc || 'A premier educational institution in Khyber Pakhtunkhwa, dedicated to academic excellence, character building, and career guidance.');
    setCollegePhone(storedCollegePhone || '+92 (0963) 510111');
    setCollegeEmail(storedCollegeEmail || 'info@casdct.edu.pk');
    setCollegeAddress(storedCollegeAddress || 'Near City Canal, Tank City, Khyber Pakhtunkhwa (KP), Pakistan.');

    // Load Ticker Announcements
    const storedTicker = localStorage.getItem('casdct_ticker_announcements');
    if (storedTicker) {
      setTickerAnnouncements(JSON.parse(storedTicker));
    } else {
      const defaultTicker = [
        "Welcome to Govt. Captain Ashfaq Shaheed Degree College Tank — Committed to Quality Education & Discipline.",
        "Notice: Fill out the online admission form carefully with exact details as per your Matric certificate.",
        "College Hours: 08:00 AM to 02:00 PM. Proper college uniform is mandatory for all students.",
        "Help Desk: For admission inquiries, contact our official helpline or visit the admission desk."
      ];
      localStorage.setItem('casdct_ticker_announcements', JSON.stringify(defaultTicker));
      setTickerAnnouncements(defaultTicker);
    }
  }, []);

  // Handle photo upload converting to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrincipalImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo upload converting to base64 for gallery
  const handleGalleryPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save All Settings (Consolidated Account Settings)
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('casdct_principal_name', principalName);
    localStorage.setItem('casdct_principal_message', principalMessage);
    localStorage.setItem('casdct_principal_image', principalImage);
    localStorage.setItem('casdct_admin_name', adminName);
    localStorage.setItem('casdct_admin_pass', adminPassword);
    localStorage.setItem('casdct_admission_phone', admissionPhone);
    localStorage.setItem('casdct_admission_email', admissionEmail);
    localStorage.setItem('casdct_stat1_value', stat1Value);
    localStorage.setItem('casdct_stat1_label', stat1Label);
    localStorage.setItem('casdct_stat2_value', stat2Value);
    localStorage.setItem('casdct_stat2_label', stat2Label);
    localStorage.setItem('casdct_stat3_value', stat3Value);
    localStorage.setItem('casdct_stat3_label', stat3Label);
    localStorage.setItem('casdct_stat4_value', stat4Value);
    localStorage.setItem('casdct_stat4_label', stat4Label);
    
    // Save Hero & College contact details
    localStorage.setItem('casdct_hero_title', heroTitle);
    localStorage.setItem('casdct_hero_desc', heroDesc);
    localStorage.setItem('casdct_college_phone', collegePhone);
    localStorage.setItem('casdct_college_email', collegeEmail);
    localStorage.setItem('casdct_college_address', collegeAddress);
    
    // Save ticker announcements
    localStorage.setItem('casdct_ticker_announcements', JSON.stringify(tickerAnnouncements));
    window.dispatchEvent(new Event('casdct_ticker_update'));
    
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Publish Notice Board Item
  // Notice File Upload
  const handleNoticeFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNoticeFile({
          name: file.name,
          data: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit Notice Click Helper
  const handleEditNoticeClick = (notice) => {
    setEditingNoticeId(notice.id);
    setNewNoticeTitle(notice.title);
    if (notice.fileName && notice.fileData) {
      setNewNoticeFile({
        name: notice.fileName,
        data: notice.fileData
      });
    } else {
      setNewNoticeFile(null);
    }
  };

  // Publish / Edit Notice Board Item
  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;

    if (editingNoticeId) {
      const updated = notices.map(n => n.id === editingNoticeId ? {
        ...n,
        title: newNoticeTitle,
        fileData: newNoticeFile ? newNoticeFile.data : n.fileData,
        fileName: newNoticeFile ? newNoticeFile.name : n.fileName
      } : n);
      setNotices(updated);
      localStorage.setItem('casdct_notices', JSON.stringify(updated));
      setEditingNoticeId(null);
    } else {
      const newNotice = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: newNoticeTitle,
        fileData: newNoticeFile ? newNoticeFile.data : null,
        fileName: newNoticeFile ? newNoticeFile.name : null
      };

      const updatedNotices = [newNotice, ...notices];
      setNotices(updatedNotices);
      localStorage.setItem('casdct_notices', JSON.stringify(updatedNotices));
    }
    setNewNoticeTitle('');
    setNewNoticeFile(null);
  };

  // Delete Notice Board Item
  const handleDeleteNotice = (id) => {
    const updatedNotices = notices.filter(n => n.id !== id);
    setNotices(updatedNotices);
    localStorage.setItem('casdct_notices', JSON.stringify(updatedNotices));
    if (editingNoticeId === id) {
      setEditingNoticeId(null);
      setNewNoticeTitle('');
      setNewNoticeFile(null);
    }
  };

  // Add Photo to Gallery
  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) return;

    const newPhoto = {
      id: Date.now(),
      image: newPhotoUrl,
      title: newPhotoTitle,
      category: newPhotoCategory,
      desc: `Academic session review for category ${newPhotoCategory}.`
    };

    const updatedGallery = [newPhoto, ...gallery];
    setGallery(updatedGallery);
    localStorage.setItem('casdct_gallery', JSON.stringify(updatedGallery));
    setNewPhotoTitle('');
    setNewPhotoUrl('');
  };

  // Delete Photo from Gallery
  const handleDeletePhoto = (id) => {
    const updatedGallery = gallery.filter(p => p.id !== id);
    setGallery(updatedGallery);
    localStorage.setItem('casdct_gallery', JSON.stringify(updatedGallery));
  };

  // Edit Faculty Click Helper
  const handleEditFacultyClick = (member) => {
    setEditingFacultyId(member.id);
    setNewFacultyName(member.name);
    setNewFacultyRole(member.role);
    setNewFacultyQual(member.qual);
    setNewFacultyDept(member.dept);
    setNewFacultyEmail(member.email);
    setNewFacultyIsHOD(member.isHOD);
  };

  // Add / Edit Faculty Member
  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFacultyName.trim() || !newFacultyEmail.trim()) return;

    if (editingFacultyId) {
      const updated = faculty.map(f => f.id === editingFacultyId ? {
        ...f,
        name: newFacultyName,
        role: newFacultyRole,
        qual: newFacultyQual,
        dept: newFacultyDept,
        email: newFacultyEmail,
        isHOD: newFacultyIsHOD
      } : f);
      setFaculty(updated);
      localStorage.setItem('casdct_faculty', JSON.stringify(updated));
      setEditingFacultyId(null);
    } else {
      const newMember = {
        id: Date.now(),
        name: newFacultyName,
        role: newFacultyRole,
        qual: newFacultyQual,
        dept: newFacultyDept,
        email: newFacultyEmail,
        isHOD: newFacultyIsHOD
      };

      const updatedFaculty = [...faculty, newMember];
      setFaculty(updatedFaculty);
      localStorage.setItem('casdct_faculty', JSON.stringify(updatedFaculty));
    }
    
    // Reset Form
    setNewFacultyName('');
    setNewFacultyQual('');
    setNewFacultyEmail('');
    setNewFacultyIsHOD(false);
  };

  // Delete Faculty Member
  const handleDeleteFaculty = (id) => {
    const updatedFaculty = faculty.filter(f => f.id !== id);
    setFaculty(updatedFaculty);
    localStorage.setItem('casdct_faculty', JSON.stringify(updatedFaculty));
    if (editingFacultyId === id) {
      setEditingFacultyId(null);
      setNewFacultyName('');
      setNewFacultyQual('');
      setNewFacultyEmail('');
      setNewFacultyIsHOD(false);
    }
  };

  // Approve Admission
  const handleApproveAdmission = (regId) => {
    const updated = admissions.map(ad => ad.regId === regId ? { ...ad, status: 'Approved' } : ad);
    setAdmissions(updated);
    localStorage.setItem('casdct_admissions', JSON.stringify(updated));
    if (selectedAdmission && selectedAdmission.regId === regId) {
      setSelectedAdmission({ ...selectedAdmission, status: 'Approved' });
    }
  };

  // Reject Admission
  const handleRejectAdmission = (regId) => {
    const updated = admissions.map(ad => ad.regId === regId ? { ...ad, status: 'Rejected' } : ad);
    setAdmissions(updated);
    localStorage.setItem('casdct_admissions', JSON.stringify(updated));
    if (selectedAdmission && selectedAdmission.regId === regId) {
      setSelectedAdmission({ ...selectedAdmission, status: 'Rejected' });
    }
  };

  // Mark Student Inquiry Message as Read
  const handleMarkInquiryRead = (id) => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, read: true } : inq);
    setInquiries(updated);
    localStorage.setItem('casdct_inquiries', JSON.stringify(updated));
  };

  // Delete Student Inquiry Message
  const handleDeleteInquiry = (id) => {
    const updated = inquiries.filter(inq => inq.id !== id);
    setInquiries(updated);
    localStorage.setItem('casdct_inquiries', JSON.stringify(updated));
  };

  // Print application details receipt helper
  const handlePrintAdmission = (student) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Admission Application - ${student.fullName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0f766e; font-family: Georgia, serif; }
            .sublogo { font-size: 12px; text-transform: uppercase; color: #0d9488; font-weight: 600; letter-spacing: 1px; margin-top: 5px; }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; }
            .label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
            .val { font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; font-size: 11px; text-align: center; color: #94a3b8; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Capt. Ashfaq Shaheed Degree College</div>
            <div class="sublogo">Government Degree College, Tank, KP</div>
          </div>
          <div class="title">Admission Application Receipt</div>
          <div class="grid">
            <div class="card">
              <div class="label">Full Name</div>
              <div class="val">${student.fullName}</div>
            </div>
            <div class="card">
              <div class="label">Father Name</div>
              <div class="val">${student.fatherName}</div>
            </div>
            <div class="card">
              <div class="label">CNIC / Form B</div>
              <div class="val">${student.cnic}</div>
            </div>
            <div class="card">
              <div class="label">Phone / Mobile</div>
              <div class="val">${student.phone}</div>
            </div>
            <div class="card">
              <div class="label">Program Applied</div>
              <div class="val" style="text-transform: uppercase;">${student.program}</div>
            </div>
            <div class="card">
              <div class="label">Matric Obtained Marks</div>
              <div class="val">${student.matricMarks} / ${student.matricTotal} (${((student.matricMarks / student.matricTotal) * 100).toFixed(1)}%)</div>
            </div>
            <div class="card">
              <div class="label">Gender</div>
              <div class="val" style="text-transform: capitalize;">${student.gender}</div>
            </div>
            <div class="card">
              <div class="label">District of Domicile</div>
              <div class="val">${student.domicile}</div>
            </div>
          </div>
          <div class="card" style="margin-bottom: 30px;">
            <div class="label">Residential Address</div>
            <div class="val">${student.address}</div>
          </div>
          <div class="footer">
            This is an official computer-generated admission submission receipt from CAPT. ASHFAQ SHAHEED DEGREE COLLEGE, TANK.
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex-grow bg-slate-100 min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-350 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-white font-bold font-serif text-lg leading-tight">{t('home') === 'ہوم' ? 'جی ڈی سی ٹانک ایڈمن' : 'CASDCT Admin Desk'}</h2>
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-wider mt-1">{t('home') === 'ہوم' ? 'پرنسپل ڈیش بورڈ' : 'Principal Dashboard'}</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('notices')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'notices' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Bell className="w-4 h-4 mr-3 text-slate-300" />
              {t('manageNotices')}
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'gallery' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <ImageIcon className="w-4 h-4 mr-3 text-slate-300" />
              {t('manageGallery')}
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'faculty' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Users className="w-4 h-4 mr-3 text-slate-300" />
              {t('manageFaculty')}
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'admissions' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <FileText className="w-4 h-4 mr-3 text-slate-300" />
              {t('admissionsList')}
              {admissions.length > 0 && (
                <span className="ml-auto bg-teal-550 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {admissions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'inquiries' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Mail className="w-4 h-4 mr-3 text-slate-300" />
              {t('studentInquiries')}
              {inquiries.filter(i => !i.read).length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {inquiries.filter(i => !i.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'settings' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Settings className="w-4 h-4 mr-3 text-slate-300" />
              {t('collegeInfoSettings')}
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-2.5 bg-teal-900/50 hover:bg-teal-800 text-teal-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-teal-800/40"
          >
            <Globe className="w-4 h-4 mr-2" />
            {t('home') === 'ہوم' ? 'لائیو سائٹ دیکھیں' : 'View Live Site'}
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-rose-950/40 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-900/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-250">
        <div className="max-w-5xl mx-auto">
          
          {/* Admin Header Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-blue-950 dark:text-white">{t('home') === 'ہوم' ? 'ایڈمن مینجمنٹ کنسول' : 'Admin Management Console'}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('home') === 'ہوم' ? 'بطور پرنسپل لاگ ان ہیں:' : 'Logged in as Principal:'} <span className="font-semibold">{principalName}</span></p>
            </div>
            
            {/* Theme Toggle Button next to Profile area */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={toggleDark}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors shadow-sm focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label="Toggle Dark Mode"
                title="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="w-6 h-6 bg-teal-50 dark:bg-slate-705 rounded-full overflow-hidden flex items-center justify-center">
                  <img src={principalImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350 hidden sm:inline">{principalName}</span>
              </div>
            </div>
          </div>

          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-650 mr-4">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('home') === 'ہوم' ? 'داخلے' : 'Admissions'}</span>
                <h4 className="text-2xl font-black text-slate-800 leading-none mt-1">{admissions.length}</h4>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-650 mr-4">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('home') === 'ہوم' ? 'نوٹسز' : 'Notices'}</span>
                <h4 className="text-2xl font-black text-slate-800 leading-none mt-1">{notices.length}</h4>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-650 mr-4">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('home') === 'ہوم' ? 'گیلری تصاویر' : 'Gallery Photos'}</span>
                <h4 className="text-2xl font-black text-slate-800 leading-none mt-1">{gallery.length}</h4>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mr-4">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('home') === 'ہوم' ? 'پوچھ گچھ' : 'Unread Inquiries'}</span>
                <h4 className="text-2xl font-black text-slate-800 leading-none mt-1">
                  {inquiries.filter(i => !i.read).length}
                </h4>
              </div>
            </div>
          </div>

          {/* TAB 1: MANAGE NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold font-serif text-blue-950">Manage Notice Board</h1>
                <span className="text-xs text-teal-850 font-bold bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">Notices: {notices.length}</span>
              </div>

              {/* Add Notice Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-slate-800 text-base mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-1.5 text-teal-650" />
                  {editingNoticeId ? 'Edit Announcement / Notice' : 'Add New Announcement / Notice'}
                </h3>
                <form onSubmit={handleAddNotice} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text"
                      required
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="Enter announcement text e.g. Admission cutoff merit date is..."
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    
                    {/* PDF/Text Notice file upload */}
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf,text/plain" 
                        onChange={handleNoticeFileUpload} 
                        id="notice-file-upload" 
                        className="hidden" 
                      />
                      <label 
                        htmlFor="notice-file-upload" 
                        className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-705 font-semibold px-4 py-3 rounded-xl text-xs flex items-center justify-center transition-all whitespace-nowrap h-full"
                        title="Upload PDF or text attachment"
                      >
                        {newNoticeFile ? `Attachment: ${newNoticeFile.name.substring(0, 15)}...` : 'Upload PDF/Text Notice'}
                      </label>
                      {newNoticeFile && (
                        <button
                          type="button"
                          onClick={() => setNewNoticeFile(null)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                          title="Remove Attachment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    {editingNoticeId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingNoticeId(null);
                          setNewNoticeTitle('');
                          setNewNoticeFile(null);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {editingNoticeId ? 'Update Notice' : 'Publish Notice'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Notices List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-slate-800 text-base mb-4">Active Notices</h3>
                <div className="divide-y divide-slate-100">
                  {notices.map((n) => (
                    <div key={n.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 gap-4 flex-wrap sm:flex-nowrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="inline-block bg-slate-105 text-slate-550 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                            {n.date}
                          </span>
                          {n.fileName && (
                            <span className="inline-block bg-teal-50 text-teal-705 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-teal-100">
                              📎 {n.fileName}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">{n.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        {n.fileData && (
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = n.fileData;
                              link.download = n.fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="bg-slate-100 hover:bg-teal-700 text-slate-700 hover:text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all border border-slate-205 cursor-pointer"
                            title="Download PDF/Text attachment"
                          >
                            Download PDF/Text
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditNoticeClick(n)}
                          className="text-slate-400 hover:text-teal-600 p-2 rounded-lg hover:bg-teal-55 transition-colors cursor-pointer"
                          title="Edit Announcement"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteNotice(n.id)}
                          className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Announcement"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <p className="text-center py-6 text-slate-400 text-sm">No notices published yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold font-serif text-blue-950">Manage Photo Gallery</h1>
                <span className="text-xs text-teal-850 font-bold bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">Photos: {gallery.length}</span>
              </div>

              {/* Add Photo Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-slate-800 text-base mb-2 flex items-center">
                  <Plus className="w-5 h-5 mr-1.5 text-teal-650" />
                  Add Photo to Gallery
                </h3>
                <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-5">
                    <input 
                      type="text"
                      required
                      value={newPhotoTitle}
                      onChange={(e) => setNewPhotoTitle(e.target.value)}
                      placeholder="Enter photo title e.g. Sports Gala Cricket Match"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4 flex gap-2">
                    <input 
                      type="text"
                      required
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Photo URL or Upload file"
                      className="flex-grow min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                    <div className="relative flex-shrink-0">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleGalleryPhotoUpload}
                        id="gallery-photo-file-upload"
                        className="hidden"
                      />
                      <label 
                        htmlFor="gallery-photo-file-upload"
                        className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-355 text-slate-700 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center transition-colors h-full whitespace-nowrap"
                        title="Upload from device"
                      >
                        Upload
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={newPhotoCategory}
                      onChange={(e) => setNewPhotoCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-650"
                    >
                      <option value="campus">Campus</option>
                      <option value="facilities">Facilities</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <button 
                      type="submit"
                      className="w-full h-full bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm flex items-center justify-center transition-colors py-3 sm:py-0"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Photo Grid Preview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-slate-800 text-base mb-6">Active Gallery Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gallery.map((p) => (
                    <div key={p.id} className="group border border-slate-100 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="h-44 overflow-hidden relative bg-slate-100">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider bg-teal-700 text-white px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        <button
                          onClick={() => handleDeletePhoto(p.id)}
                          className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-rose-600 text-slate-600 hover:text-white p-2 rounded-lg transition-colors shadow-sm"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 bg-white">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{p.title}</h4>
                      </div>
                    </div>
                  ))}
                  {gallery.length === 0 && (
                    <p className="col-span-full text-center py-12 text-slate-400 text-sm">No photos added to gallery yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE FACULTY */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold font-serif text-blue-950">Manage Faculty</h1>
                <span className="text-xs text-teal-850 font-bold bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">Educators: {faculty.length}</span>
              </div>

              {/* Add Faculty Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-slate-800 text-base mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-1.5 text-teal-650" />
                  {editingFacultyId ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h3>
                <form onSubmit={handleAddFaculty} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Educator Name</label>
                      <input 
                        type="text" 
                        required
                        value={newFacultyName}
                        onChange={(e) => setNewFacultyName(e.target.value)}
                        placeholder="Enter educator name"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qualifications</label>
                      <input 
                        type="text" 
                        required
                        value={newFacultyQual}
                        onChange={(e) => setNewFacultyQual(e.target.value)}
                        placeholder="Enter qualifications"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role / Designation</label>
                      <select
                        value={newFacultyRole}
                        onChange={(e) => setNewFacultyRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-650"
                      >
                        <option value="Lecturer">Lecturer</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor">Professor</option>
                        <option value="Principal / Head of Institution">Principal / Head of Institution</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                      <select
                        value={newFacultyDept}
                        onChange={(e) => setNewFacultyDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-655"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Biological Sciences (Zoology)">Zoology</option>
                        <option value="Biological Sciences (Botany)">Botany</option>
                        <option value="English">English</option>
                        <option value="Islamic Studies & Humanities">Islamic Studies</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Urdu">Urdu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={newFacultyEmail}
                        onChange={(e) => setNewFacultyEmail(e.target.value)}
                        placeholder="Enter official email address"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <input 
                        type="checkbox" 
                        id="newFacultyIsHOD"
                        checked={newFacultyIsHOD}
                        onChange={(e) => setNewFacultyIsHOD(e.target.checked)}
                        className="h-4.5 w-4.5 text-teal-650 border-slate-300 rounded focus:ring-teal-500 mr-2 cursor-pointer"
                      />
                      <label htmlFor="newFacultyIsHOD" className="text-xs font-bold text-slate-600 cursor-pointer select-none uppercase tracking-wider">Is Head of Department / HOD</label>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    {editingFacultyId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingFacultyId(null);
                          setNewFacultyName('');
                          setNewFacultyQual('');
                          setNewFacultyEmail('');
                          setNewFacultyIsHOD(false);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-md cursor-pointer"
                    >
                      {editingFacultyId ? 'Update Faculty Profile' : 'Save Faculty Profile'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Faculty Grid Preview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-slate-800 text-base mb-6">Current Faculty Directory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.map((member) => (
                    <div key={member.id} className="bg-slate-50 border border-slate-100 dark:border-slate-850 rounded-xl p-5 relative flex flex-col justify-between">
                      {member.isHOD && (
                        <span className="absolute top-0 right-0 bg-teal-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl">
                          HOD
                        </span>
                      )}
                      <div>
                        <h4 className="font-serif font-bold text-slate-800 text-base leading-tight mb-1">{member.name}</h4>
                        <div className="text-[10px] font-bold text-teal-750 uppercase tracking-wider mb-3">{member.role}</div>
                        <p className="text-xs text-slate-550 leading-relaxed mb-2 font-medium">{member.qual}</p>
                        <div className="text-[10px] text-slate-450 font-bold mb-1">DEPT: {member.dept}</div>
                        <div className="text-xs text-slate-500 font-semibold truncate">{member.email}</div>
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditFacultyClick(member)}
                          className="bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-750 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all border border-slate-205 flex items-center justify-center cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFaculty(member.id)}
                          className="text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 p-2 rounded-lg transition-colors border border-rose-100 hover:border-transparent flex items-center justify-center cursor-pointer"
                          title="Delete Faculty Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {faculty.length === 0 && (
                    <p className="col-span-full text-center py-12 text-slate-400 text-sm">No educators registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMISSIONS LIST */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold font-serif text-blue-950">Admissions Submission Log</h1>
                <span className="text-xs text-teal-850 font-bold bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">Entries: {admissions.length}</span>
              </div>

              {/* Admissions table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">CNIC</th>
                        <th className="px-6 py-4">Program</th>
                        <th className="px-6 py-4">Marks %</th>
                        <th className="px-6 py-4">Domicile</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {admissions.map((st, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 leading-snug">
                            {st.fullName}
                            <span className="block text-[10px] font-normal text-slate-400 mt-0.5">{st.phone}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-500 font-mono">{st.cnic}</td>
                          <td className="px-6 py-4 text-xs font-bold text-teal-750 uppercase">{st.program}</td>
                          <td className="px-6 py-4 font-bold">
                            {((st.matricMarks / st.matricTotal) * 100).toFixed(1)}%
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{st.matricMarks}/{st.matricTotal}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-550">{st.domicile}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${st.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : st.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                              {st.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedAdmission(st)}
                              className="bg-slate-100 hover:bg-slate-205 text-slate-700 font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all border border-slate-200 inline-flex items-center cursor-pointer"
                              title="View full details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleApproveAdmission(st.regId)}
                              disabled={st.status === 'Approved'}
                              className={`font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all inline-flex items-center cursor-pointer ${st.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-200' : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-transparent'}`}
                              title="Approve Admission"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAdmission(st.regId)}
                              disabled={st.status === 'Rejected'}
                              className={`font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all inline-flex items-center cursor-pointer ${st.status === 'Rejected' ? 'bg-rose-100 text-rose-700 cursor-not-allowed border border-rose-200' : 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-transparent'}`}
                              title="Reject Admission"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </button>
                            <button
                              onClick={() => handlePrintAdmission(st)}
                              className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all border border-blue-200 hover:border-transparent inline-flex items-center cursor-pointer"
                              title="Download Student PDF Form"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1" />
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                      {admissions.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-12 text-slate-400 text-sm">No applications submitted yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold font-serif text-blue-950">Student inquiries & Messages</h1>
                <span className="text-xs text-teal-850 font-bold bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider text-amber-800 bg-amber-50">Pending: {inquiries.filter(i => !i.read).length}</span>
              </div>

              {/* Messages list */}
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all ${inq.read ? 'border-slate-200 opacity-75' : 'border-amber-250 ring-2 ring-amber-500/10'}`}>
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {inq.date}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700">
                            Subject: {inq.subject}
                          </span>
                        </div>
                        {!inq.read && (
                          <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full tracking-widest animate-pulse">
                            New Message
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <div>
                          Sender Name: <span className="block text-slate-800 font-semibold normal-case text-sm mt-0.5">{inq.name}</span>
                        </div>
                        <div>
                          Email Address: <span className="block text-slate-850 font-semibold normal-case text-sm mt-0.5">{inq.email}</span>
                        </div>
                        <div>
                          Contact Number: <span className="block text-slate-850 font-semibold normal-case text-sm mt-0.5">{inq.phone || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {inq.message}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-5 flex justify-end gap-3">
                      {!inq.read && (
                        <button
                          onClick={() => handleMarkInquiryRead(inq.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-colors inline-flex items-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="bg-slate-50 hover:bg-rose-600 text-slate-500 hover:text-white border border-slate-200 hover:border-transparent font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-all inline-flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Delete Message
                      </button>
                    </div>
                  </div>
                ))}

                {inquiries.length === 0 && (
                  <p className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm">No messages received yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ACCOUNT SETTINGS */}
          {(activeTab === 'settings' || activeTab === 'college_info' || activeTab === 'principal') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold font-serif text-blue-950">College Info & Settings</h1>
                <span className="text-xs text-teal-850 font-bold bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">Console Config</span>
              </div>

              {settingsSaved && (
                <div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold p-4 rounded-xl text-center flex items-center justify-center">
                  <CheckCircle className="w-4.5 h-4.5 mr-2 text-teal-650" />
                  Website settings and login credentials have been saved to local database successfully.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 1. Admin Console Credentials */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-slate-800 text-base mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-1.5 text-teal-650" />
                    Admin Login Credentials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Name (Username)</label>
                      <input 
                        type="text" 
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Console Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Principal Profile Info */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center">
                    <Edit3 className="w-5 h-5 mr-1.5 text-teal-650" />
                    Principal Profile Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    <div className="sm:col-span-1 flex flex-col items-center">
                      <div className="w-32 h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3 shadow-inner">
                        <img src={principalImage} alt="Principal Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          id="principal-avatar-upload"
                          className="hidden"
                        />
                        <label 
                          htmlFor="principal-avatar-upload"
                          className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-colors inline-block"
                        >
                          Choose Photo File
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal Name</label>
                        <input 
                          type="text" 
                          required
                          value={principalName}
                          onChange={(e) => setPrincipalName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal Photo Link (URL)</label>
                        <input 
                          type="text" 
                          value={(principalImage && typeof principalImage === 'string' && principalImage.startsWith('data:')) ? '' : (principalImage || '')}
                          onChange={(e) => setPrincipalImage(e.target.value)}
                          placeholder="Image Link (will use uploaded file if blank)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Welcome Message Letter</label>
                    <textarea 
                      required
                      rows={8}
                      value={principalMessage}
                      onChange={(e) => setPrincipalMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>

                {/* 3. Admission Desk Info */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center">
                    <FileText className="w-5 h-5 mr-1.5 text-teal-650" />
                    Admission Desk Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admission Phone Number (Intermediate Inquiries)</label>
                      <input 
                        type="text" 
                        required
                        value={admissionPhone}
                        onChange={(e) => setAdmissionPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        placeholder="e.g. +92 (0963) 510111"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admission Email Address (BS Program Admissions)</label>
                      <input 
                        type="email" 
                        required
                        value={admissionEmail}
                        onChange={(e) => setAdmissionEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        placeholder="e.g. admissions@casdct.edu.pk"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Banner Text Settings */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center">
                    <Edit3 className="w-5 h-5 mr-1.5 text-teal-650" />
                    Homepage Hero Banner Text
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hero Banner Title</label>
                      <input 
                        type="text" 
                        required
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        placeholder="e.g. Empowering Minds, Shaping Futures"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hero Banner Description / Subtext</label>
                      <textarea 
                        required
                        rows={3}
                        value={heroDesc}
                        onChange={(e) => setHeroDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none leading-relaxed"
                        placeholder="Providing quality higher education..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* College General Contact Details settings */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center">
                    <Globe className="w-5 h-5 mr-1.5 text-teal-650" />
                    General College Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">College General Phone</label>
                      <input 
                        type="text" 
                        required
                        value={collegePhone}
                        onChange={(e) => setCollegePhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        placeholder="e.g. +92 (0963) 510111"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">College General Email</label>
                      <input 
                        type="email" 
                        required
                        value={collegeEmail}
                        onChange={(e) => setCollegeEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        placeholder="e.g. info@casdct.edu.pk"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Physical Address</label>
                    <input 
                      type="text" 
                      required
                      value={collegeAddress}
                      onChange={(e) => setCollegeAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      placeholder="e.g. Near City Canal, Tank City, Khyber Pakhtunkhwa (KP), Pakistan"
                    />
                  </div>
                </div>

                {/* 4. Stats Counter Cards Info */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center">
                    <Users className="w-5 h-5 mr-1.5 text-teal-650" />
                    Homepage Stats / Counter Cards Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Stat 1 */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block font-sans">Counter Stat 1</span>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Value</label>
                        <input 
                          type="text" 
                          required
                          value={stat1Value}
                          onChange={(e) => setStat1Value(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. 1,200+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Label</label>
                        <input 
                          type="text" 
                          required
                          value={stat1Label}
                          onChange={(e) => setStat1Label(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. Active Students"
                        />
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block font-sans">Counter Stat 2</span>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Value</label>
                        <input 
                          type="text" 
                          required
                          value={stat2Value}
                          onChange={(e) => setStat2Value(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. 45+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Label</label>
                        <input 
                          type="text" 
                          required
                          value={stat2Label}
                          onChange={(e) => setStat2Label(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. Qualified Lecturers"
                        />
                      </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block font-sans">Counter Stat 3</span>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Value</label>
                        <input 
                          type="text" 
                          required
                          value={stat3Value}
                          onChange={(e) => setStat3Value(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. 10+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Label</label>
                        <input 
                          type="text" 
                          required
                          value={stat3Label}
                          onChange={(e) => setStat3Label(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. BS & Inter Programs"
                        />
                      </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block font-sans">Counter Stat 4</span>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Value</label>
                        <input 
                          type="text" 
                          required
                          value={stat4Value}
                          onChange={(e) => setStat4Value(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. 100%"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Label</label>
                        <input 
                          type="text" 
                          required
                          value={stat4Label}
                          onChange={(e) => setStat4Label(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                          placeholder="e.g. Dedicated Support"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* News Ticker Announcements Settings */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center">
                    <Bell className="w-5 h-5 mr-1.5 text-teal-650" />
                    News Ticker Announcements
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    Manage the running announcement messages scrolling on the website header. These changes reflect instantly on the public pages.
                  </p>
                  
                  {/* List of existing ticker announcements */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {tickerAnnouncements.map((ann, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl gap-4">
                        <span className="text-xs text-slate-700 font-medium leading-relaxed">{ann}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = tickerAnnouncements.filter((_, i) => i !== idx);
                            setTickerAnnouncements(updated);
                            localStorage.setItem('casdct_ticker_announcements', JSON.stringify(updated));
                            window.dispatchEvent(new Event('casdct_ticker_update'));
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {tickerAnnouncements.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No custom announcements. Default permanent fallbacks are active.</p>
                    )}
                  </div>

                  {/* Form input to add a new ticker announcement */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newTickerAnnouncement}
                      onChange={(e) => setNewTickerAnnouncement(e.target.value)}
                      placeholder="Add new announcement message..."
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTickerAnnouncement.trim()) return;
                        const updated = [...tickerAnnouncements, newTickerAnnouncement.trim()];
                        setTickerAnnouncements(updated);
                        localStorage.setItem('casdct_ticker_announcements', JSON.stringify(updated));
                        setNewTickerAnnouncement('');
                        window.dispatchEvent(new Event('casdct_ticker_update'));
                      }}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button 
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-md cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Student Details Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 relative">
            <button 
              onClick={() => setSelectedAdmission(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 p-1 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">Student Profile Detail</span>
              <h2 className="text-xl font-bold font-serif text-slate-800 mt-2">{selectedAdmission.fullName}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Father's Name</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedAdmission.fatherName}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">CNIC / Form-B</span>
                <p className="font-semibold text-slate-850 font-mono mt-0.5">{selectedAdmission.cnic}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Email Address</span>
                <p className="font-semibold text-slate-805 mt-0.5">{selectedAdmission.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Mobile Number</span>
                <p className="font-semibold text-slate-850 mt-0.5">{selectedAdmission.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Program Applied</span>
                <p className="font-bold text-teal-700 uppercase mt-0.5">{selectedAdmission.program}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Matriculation Academic</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedAdmission.matricMarks} / {selectedAdmission.matricTotal} ({((selectedAdmission.matricMarks / selectedAdmission.matricTotal) * 100).toFixed(1)}%)</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">District of Domicile</span>
                <p className="font-semibold text-slate-805 mt-0.5">{selectedAdmission.domicile}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Gender</span>
                <p className="font-semibold text-slate-805 mt-0.5 capitalize">{selectedAdmission.gender}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Status</span>
                <p className="mt-0.5">
                  <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${selectedAdmission.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : selectedAdmission.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedAdmission.status || 'Pending'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Residential Address</span>
              <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">{selectedAdmission.address}</p>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-between items-center gap-3 border-t border-slate-100 pt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApproveAdmission(selectedAdmission.regId)}
                  disabled={selectedAdmission.status === 'Approved'}
                  className={`font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-colors inline-flex items-center cursor-pointer ${selectedAdmission.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Approve Admission
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectAdmission(selectedAdmission.regId)}
                  disabled={selectedAdmission.status === 'Rejected'}
                  className={`font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-colors inline-flex items-center cursor-pointer ${selectedAdmission.status === 'Rejected' ? 'bg-rose-100 text-rose-700 cursor-not-allowed border border-rose-200' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Reject
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => handlePrintAdmission(selectedAdmission)}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wide uppercase transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Download Student PDF Form
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedAdmission(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
