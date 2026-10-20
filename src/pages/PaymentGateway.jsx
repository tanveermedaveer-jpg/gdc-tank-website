import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Upload, 
  FileText, 
  Printer, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Info,
  Building,
  X,
  Menu
} from 'lucide-react';
import { 
  getPaymentSettings, 
  subscribePaymentSettings, 
  publicFileRequest,
  compressImageFile 
} from '../lib/adminApi';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language: globalLang, setLanguage: setGlobalLang } = useLanguage();

  // Local language switcher state (synced with global language)
  const [lang, setLang] = useState(() => globalLang || 'en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Payment Settings from Admin Dashboard
  const [paymentSettings, setPaymentSettings] = useState(getPaymentSettings);

  // Applicant info (from navigation state, sessionStorage, or defaults)
  const [applicant, setApplicant] = useState(() => {
    const navState = location.state || {};
    const stored = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('casdct_current_applicant') || '{}');
      } catch {
        return {};
      }
    })();

    const initialId = navState.studentId || navState.regId || stored.studentId || stored.regId || ('CASDCT-' + Math.floor(100000 + Math.random() * 900000));
    const initialName = navState.studentName || navState.name || stored.studentName || stored.name || 'Hamza Tariq';
    const initialProgram = navState.program || stored.program || 'BS Computer Science';
    const isBs = initialProgram.toLowerCase().includes('bs');

    return {
      studentId: initialId,
      studentName: initialName,
      program: initialProgram,
      isBs: isBs
    };
  });

  // Verification Form State
  const [trxId, setTrxId] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Confirmation Slip Modal State
  const [showSlip, setShowSlip] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Sync with global language changes
  useEffect(() => {
    if (globalLang) setLang(globalLang);
  }, [globalLang]);

  // Subscribe to real-time Admin Payment Settings changes
  useEffect(() => {
    const unsubscribe = subscribePaymentSettings((settings) => {
      setPaymentSettings(settings);
    });
    return unsubscribe;
  }, []);

  // Compute fee based on selected program and live admin settings
  const payableAmount = applicant.isBs 
    ? (paymentSettings.bsFee || 500) 
    : (paymentSettings.interFee || 300);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ur' : 'en';
    setLang(next);
    if (setGlobalLang) setGlobalLang(next);
  };

  const handleCopyNumber = () => {
    const number = paymentSettings.easypaisaNumber || '0345-9876543';
    navigator.clipboard.writeText(number.replace(/\D/g, '') || number);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setFormError(lang === 'ur' ? 'صرف تصویری فائل (JPG, PNG) یا PDF منتخب کریں۔' : 'Please select an image file (JPG, PNG) or PDF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError(lang === 'ur' ? 'رسید فائل کا سائز 5 ایم بی سے کم ہونا چاہیے۔' : 'Receipt file size must be under 5 MB.');
      return;
    }

    setFormError('');
    setReceiptFile(file);

    if (file.type.startsWith('image/')) {
      const preview = await compressImageFile(file, 800, 800, 0.8);
      setReceiptPreview(preview);
    } else {
      setReceiptPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanTrx = trxId.trim();
    if (!cleanTrx) {
      setFormError(lang === 'ur' ? 'براہ کرم ایزی پیسہ ٹرانزیکشن آئی ڈی (TRX ID) درج کریں۔' : 'Please enter your EasyPaisa Transaction ID (TRX ID).');
      return;
    }

    // Typical EasyPaisa transaction IDs are 11 digits
    if (!/^\d{11}$/.test(cleanTrx) && cleanTrx.length < 8) {
      setFormError(lang === 'ur' ? 'براہ کرم درست 11 ہندسوں والی ٹرانزیکشن آئی ڈی درج کریں۔' : 'Please enter a valid 11-digit EasyPaisa TRX ID.');
      return;
    }

    if (!receiptFile) {
      setFormError(lang === 'ur' ? 'براہ کرم فیس کی رسید یا اسکرین شاٹ اپلوڈ کریں۔' : 'Please upload your payment receipt or screenshot.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionPayload = {
        studentId: applicant.studentId,
        studentName: applicant.studentName,
        program: applicant.program,
        amount: payableAmount,
        trxId: cleanTrx,
        notes: notes.trim(),
        paymentMethod: 'EasyPaisa'
      };

      await publicFileRequest('public.payment.submit', submissionPayload, receiptFile);

      const record = {
        ...submissionPayload,
        timestamp: new Date().toLocaleString(),
        receiptName: receiptFile.name,
        receiptUrl: receiptPreview
      };

      setSubmittedData(record);
      setShowSlip(true);

      // Save to session
      try {
        sessionStorage.setItem('casdct_paid_applicant', JSON.stringify(record));
      } catch (err) {
        console.warn('SessionStorage error:', err);
      }
    } catch (err) {
      console.error('Payment verification submission error:', err);
      setFormError(lang === 'ur' ? 'فیس کی تفصیلات جمع کرنے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔' : 'Error submitting payment details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUrdu = lang === 'ur';

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col ${isUrdu ? 'rtl font-serif' : 'ltr font-sans'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      
      {/* ---------------- TOP DEDICATED HEADER ---------------- */}
      <header className="sticky top-0 z-40 bg-[#0a3345] text-white shadow-md border-b border-teal-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* College Identity */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold text-lg shadow-inner">
                <Building className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold font-serif leading-tight group-hover:text-amber-300 transition-colors">
                  {isUrdu 
                    ? 'گورنمنٹ کیپٹن اشفاق شہید ڈگری کالج، ٹانک' 
                    : 'Captain Ashfaq Shaheed Degree College, Tank'}
                </h1>
                <p className="text-[11px] text-teal-200/80 tracking-wide font-sans">
                  {isUrdu ? 'داخلہ پورٹل برائے سال 2026-27' : 'Online Admission & Payment Portal'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <Link to="/" className="text-slate-200 hover:text-amber-300 transition-colors">
                {isUrdu ? 'صفحہ اول' : 'Home'}
              </Link>
              <Link to="/apply" className="text-slate-200 hover:text-amber-300 transition-colors">
                {isUrdu ? 'آن لائن داخلہ' : 'Apply Online'}
              </Link>
              <Link to="/academics" className="text-slate-200 hover:text-amber-300 transition-colors">
                {isUrdu ? 'فیس اسٹرکچر' : 'Fee Structure'}
              </Link>
              <Link to="/contact" className="text-slate-200 hover:text-amber-300 transition-colors">
                {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
              </Link>
            </nav>

            {/* Right Controls: Language Switcher & Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              {/* Dynamic Language Switcher Button */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-teal-300/30 text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                aria-label="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>{isUrdu ? 'English' : 'اردو'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white md:hidden hover:bg-white/10"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#072533] border-t border-teal-800/60 px-4 py-3 space-y-2 text-sm font-semibold">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-amber-300">
              {isUrdu ? 'صفحہ اول' : 'Home'}
            </Link>
            <Link to="/apply" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-amber-300">
              {isUrdu ? 'آن لائن داخلہ' : 'Apply Online'}
            </Link>
            <Link to="/academics" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-amber-300">
              {isUrdu ? 'فیس اسٹرکچر' : 'Fee Structure'}
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-amber-300">
              {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
            </Link>
          </div>
        )}
      </header>

      {/* ---------------- HERO TITLE SECTION ---------------- */}
      <section className="bg-gradient-to-b from-[#0a3345] via-[#0d3f54] to-slate-100 dark:to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUrdu ? 'سرکاری محفوظ گیٹ وے' : 'Official Secure Payment Gateway'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight leading-tight mb-3">
            {isUrdu 
              ? 'فیس کی ادائیگی اور تصدیق کا مرحلہ' 
              : 'Fee Payment & Verification Gateway'}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isUrdu
              ? 'درخواست فارم کی فیس ایزی پیسہ کے ذریعے جمع کرائیں اور تصدیق کے لیے 11 ہندسوں کی ٹرانزیکشن آئی ڈی (TRX ID) اور رسید درج کریں۔'
              : 'Complete your application process by transferring the processing fee via EasyPaisa and submitting your 11-digit Transaction ID (TRX ID) for instant administrative verification.'}
          </p>
        </div>

        {/* Decorative Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ---------------- MAIN THREE-CARD GRID LAYOUT ---------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* CARD 1: APPLICATION SUMMARY                               */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isUrdu ? 'کارڈ 1: درخواست کا خلاصہ' : 'Card 1: Application Summary'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isUrdu ? 'طالب علم کی معلومات' : 'Applicant Credentials'}
                  </p>
                </div>
              </div>
              <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {isUrdu ? 'مرحلہ 1' : 'Step 1'}
              </span>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              
              {/* Student Name */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {isUrdu ? 'طالب علم کا نام' : 'Student Name'}
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {applicant.studentName}
                </span>
              </div>

              {/* Application ID */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                    {isUrdu ? 'درخواست / اسٹوڈنٹ آئی ڈی' : 'Application / Tracking ID'}
                  </span>
                  <span className="text-base font-mono font-bold text-teal-700 dark:text-teal-400 tracking-wider">
                    {applicant.studentId}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  Auto-Gen
                </span>
              </div>

              {/* Program & Major Selection */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {isUrdu ? 'منتخب کردہ تعلیمی پروگرام' : 'Selected Program / Major'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {applicant.program}
                </span>

                {/* Quick Switcher for Testing/Demonstration */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {isUrdu ? 'پروگرام کی قسم تبدیل کریں:' : 'Switch program type:'}
                  </span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-700 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setApplicant(prev => ({ ...prev, program: 'FSc Pre-Medical', isBs: false }))}
                      className={`px-2 py-0.5 rounded-md transition-colors ${!applicant.isBs ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      Inter (Rs. {paymentSettings.interFee || 300})
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplicant(prev => ({ ...prev, program: 'BS Computer Science', isBs: true }))}
                      className={`px-2 py-0.5 rounded-md transition-colors ${applicant.isBs ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      BS (Rs. {paymentSettings.bsFee || 500})
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Payable Amount Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-teal-500/5 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider block">
                    {isUrdu ? 'کل واجب الادا فیس' : 'Total Payable Amount'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {applicant.isBs ? 'BS Degree Processing Fee' : 'Intermediate Processing Fee'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                    Rs. {payableAmount}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 2: EASYPAISA ACCOUNT DETAILS                         */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
            
            {/* Header with EasyPaisa Branding */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {/* EasyPaisa Iconic Green Badge */}
                <div className="w-10 h-10 rounded-xl bg-[#00ba50] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase text-[#00ba50] tracking-wider">
                      EasyPaisa
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {isUrdu ? 'آفیشل اکاؤنٹ' : 'Official Account'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isUrdu ? 'کارڈ 2: فیس بھیجنے کے لیے تفصیلات' : 'Card 2: Account Transfer Details'}
                  </p>
                </div>
              </div>
              <span className="bg-[#00ba50]/10 text-[#00ba50] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-[#00ba50]/20">
                {isUrdu ? 'مرحلہ 2' : 'Step 2'}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              
              {/* Account Title */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {isUrdu ? 'اکاؤنٹ کا نام / ٹائٹل' : 'EasyPaisa Account Title'}
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00ba50]" />
                  {paymentSettings.easypaisaTitle || 'GDC Tank Admission Fund'}
                </span>
              </div>

              {/* EasyPaisa Mobile Number Card with One-Click Copy */}
              <div className="p-4 rounded-2xl bg-[#00ba50]/5 border-2 border-[#00ba50]/30 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00ba50]">
                    {isUrdu ? 'ایزی پیسہ موبائل نمبر' : 'EasyPaisa Mobile Number'}
                  </span>
                  <span className="text-[10px] bg-[#00ba50]/15 text-[#00ba50] px-2 py-0.5 rounded-full font-bold">
                    Official
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-1.5">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-slate-900 dark:text-white">
                    {paymentSettings.easypaisaNumber || '0345-9876543'}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00ba50] hover:bg-[#009b43] text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                    title="Copy Account Number"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'کاپی ہوگیا' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'کاپی کریں' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Amount to Pay Highlight */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                    {isUrdu ? 'بھیجی جانے والی رقم:' : 'Amount to Transfer:'}
                  </span>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-400">
                    {isUrdu ? 'درست رقم ہی بھیجیں' : 'Send exact specified amount'}
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-amber-900 dark:text-amber-200">
                  Rs. {payableAmount}
                </span>
              </div>

              {/* Instructions on how to send money */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>
                    {isUrdu ? 'رقم بھیجنے کا طریقہ کار:' : 'How to send money via EasyPaisa:'}
                  </span>
                </p>
                <ol className="list-decimal list-inside space-y-1 leading-relaxed pl-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                  {isUrdu ? (
                    <>
                      <li>اپنے موبائل میں ایزی پیسہ ایپ کھولیں یا <b>*786#</b> ملائیں۔</li>
                      <li><b>"Money Transfer"</b> منتخب کر کے <b>"EasyPaisa Account"</b> پر کلک کریں۔</li>
                      <li>موبائل نمبر <b>{paymentSettings.easypaisaNumber}</b> درج کریں۔</li>
                      <li>اکاؤنٹ ٹائٹل <b>"{paymentSettings.easypaisaTitle}"</b> کی تصدیق کریں۔</li>
                      <li>فیس کی رقم <b>Rs. {payableAmount}</b> لکھ کر ٹرانزیکشن مکمل کریں۔</li>
                      <li>میسج سے <b>11 ہندسوں والی TRX ID</b> حاصل کریں اور رسید کا اسکرین شاٹ محفوظ کریں۔</li>
                    </>
                  ) : (
                    <>
                      <li>Open EasyPaisa Mobile App or dial <b>*786#</b> on your phone.</li>
                      <li>Select <b>"Send Money"</b> ➔ <b>"EasyPaisa Mobile Account"</b>.</li>
                      <li>Enter College Account: <b>{paymentSettings.easypaisaNumber}</b>.</li>
                      <li>Verify Title: <b>"{paymentSettings.easypaisaTitle}"</b>.</li>
                      <li>Enter exact amount: <b>Rs. {payableAmount}</b> and confirm with MPIN.</li>
                      <li>Note down the <b>11-digit TRX ID</b> and take a receipt screenshot.</li>
                    </>
                  )}
                </ol>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 3: PAYMENT VERIFICATION FORM (STUDENT INPUT)         */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isUrdu ? 'کارڈ 3: فیس تصدیقی فارم' : 'Card 3: Verification Form'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isUrdu ? 'ٹرانزیکشن اور رسید درج کریں' : 'Enter TRX ID & Upload Receipt'}
                  </p>
                </div>
              </div>
              <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {isUrdu ? 'مرحلہ 3' : 'Step 3'}
              </span>
            </div>

            {formError && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              
              {/* 1. TRX ID Input Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {isUrdu ? 'ایزی پیسہ ٹرانزیکشن آئی ڈی (TRX ID)' : 'EasyPaisa Transaction ID (TRX ID)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={trxId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setTrxId(val);
                    }}
                    placeholder={isUrdu ? 'مثال: 89412051234 (11 ہندسے)' : 'e.g., 89412051234 (11 digits)'}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                    {trxId.length}/11
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {isUrdu 
                    ? 'ایزی پیسہ کی جانب سے موصول ہونے والے میسج میں موجود 11 ہندسوں کی TRX ID درج کریں۔'
                    : '11-digit SMS confirmation code received from EasyPaisa (3737).'}
                </span>
              </div>

              {/* 2. Payment Receipt File Upload Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {isUrdu ? 'فیس کی رسید / اسکرین شاٹ اپلوڈ کریں' : 'Payment Receipt / Screenshot Upload'} <span className="text-rose-500">*</span>
                </label>

                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl p-4 text-center transition-colors bg-slate-50/60 dark:bg-slate-800/40">
                  <input
                    type="file"
                    required={!receiptFile}
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {receiptPreview ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <img 
                          src={receiptPreview} 
                          alt="Receipt Preview" 
                          className="h-28 max-w-full object-contain rounded-xl mx-auto shadow-sm border border-slate-200 dark:border-slate-700" 
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReceiptFile(null);
                            setReceiptPreview('');
                          }}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 hover:bg-rose-700 shadow-md cursor-pointer"
                          aria-label="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {receiptFile?.name} ({(receiptFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  ) : receiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                      <FileText className="w-5 h-5" />
                      <span>{receiptFile.name} ({(receiptFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isUrdu ? 'رسید منتخب کرنے کے لیے یہاں کلک کریں' : 'Click or Drag to Upload Receipt Slip'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        PNG, JPG, PDF (Max 5 MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Optional Notes Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{isUrdu ? 'اضافی نوٹ / ریمارکس' : 'Optional Remarks / Notes'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{isUrdu ? 'اختیاری' : 'Optional'}</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isUrdu ? 'کوئی اضافی تفصیلات یا بینک کا حوالہ درج کریں...' : 'Any optional remarks or payment reference notes...'}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
                />
              </div>

              {/* 4. Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isUrdu ? 'تصدیق جاری ہے...' : 'Submitting Verification...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-300" />
                      <span>
                        {isUrdu 
                          ? 'فیس جمع کریں اور درخواست مکمل کریں' 
                          : 'Submit & Complete Registration'}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* ---------------- FOOTER WARNING NOTICE ---------------- */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold uppercase tracking-wide mr-1.5">
              {isUrdu ? 'اہم ترین انتباہ:' : 'Important Note:'}
            </span>
            <span>
              {isUrdu
                ? 'غلط، جعلی، یا پہلے سے استعمال شدہ ٹرانزیکشن آئی ڈی (TRX ID) فراہم کرنے کی صورت میں آپ کی داخلہ درخواست فوری طور پر خارج کر دی جائے گی۔ کالج انتظامیہ ہر ٹرانزیکشن کی ایزی پیسہ ریکارڈ سے مکمل تصدیق کرتی ہے۔'
                : 'If an invalid, fake, or duplicated TRX ID is provided, your admission application will be rejected immediately. All transactions are cross-verified by the college administration against official EasyPaisa statements.'}
            </span>
          </div>
        </div>
      </main>

      {/* ---------------- OFFICIAL CONFIRMATION SLIP MODAL ---------------- */}
      {showSlip && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-h-[92vh] overflow-y-auto custom-scrollbar relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSlip(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slip Header with College Branding */}
            <div className="text-center pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3 border border-teal-200 dark:border-teal-800 shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Govt. Captain Ashfaq Shaheed Degree College, Tank
              </h2>
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-1 uppercase tracking-wider">
                Official Admission Fee Deposit & Verification Slip
              </p>
              <span className="inline-block mt-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                Status: Pending Verification by College Admin
              </span>
            </div>

            {/* Slip Details Grid */}
            <div className="mt-6 space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Student Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{submittedData.studentName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Tracking ID:</span>
                  <span className="font-bold font-mono text-teal-700 dark:text-teal-400">{submittedData.studentId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Applied Program:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{submittedData.program}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Amount Paid:</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-base">Rs. {submittedData.amount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">EasyPaisa TRX ID:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-base tracking-wider">{submittedData.trxId}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Submission Date & Time:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">{submittedData.timestamp}</span>
                </div>
              </div>

              {submittedData.receiptName && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Uploaded Receipt:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 truncate max-w-xs">{submittedData.receiptName}</span>
                </div>
              )}
            </div>

            {/* Slip Instructions */}
            <div className="mt-5 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-200 space-y-1">
              <p className="font-bold">Next Steps for Applicant:</p>
              <p className="leading-relaxed">
                Please print or screenshot this verification receipt. Once verified by the college administration, your name will be reflected on the verified merit list. Bring this slip along with your original documents at the time of interview.
              </p>
            </div>

            {/* Slip Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF Slip</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowSlip(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
