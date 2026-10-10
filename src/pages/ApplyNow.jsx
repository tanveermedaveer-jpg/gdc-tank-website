import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
   import { supabase } from '../supabase.js';

const ApplyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    programType: 'BS Program (4-Year)',
    program: 'BS Computer Science',
    studyGroup: 'Pre-Medical',
    shift: 'Morning',
    studentName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    cnic: '',
    fatherCnic: '',
    mobile: '',
    whatsapp: '',
    domicile: '',
    address: '',
    matricMarks: '',
    matricTotal: '1100',
    matricYear: '2025',
    matricBoard: 'BISE DI Khan',
    intermediateMarks: '',
    intermediateTotal: '1100',
    intermediateYear: '2026',
    intermediateBoard: 'BISE DI Khan',
  });

  const [language, setLanguage] = useState('en');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const studentId = 'CASDCT-' + Math.floor(100000 + Math.random() * 900000);

    const newApplication = {
      id: studentId,
     ...formData,
      appliedAt: new Date().toISOString()
    };

    const { data, error } = await supabase
     .from('admissions')
     .insert([newApplication])
     .select();

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
      console.log(error);
    } else {
      // Local backup bhi rakh lete hain
      const existing = JSON.parse(localStorage.getItem('admissions_list') || '[]');
      localStorage.setItem('admissions_list', JSON.stringify([newApplication,...existing]));

      if (language === 'ur') {
        alert(`مبارک ہو! آپ کی داخلہ درخواست کامیابی سے جمع ہو گئی ہے۔\nآپ کی اسٹوڈنٹ آئی ڈی: ${studentId}`);
      } else {
        alert(`Application Submitted Successfully!\nYour Student ID: ${studentId}`);
      }
      navigate('/');
    }
  };

  const isIntermediate = formData.programType.includes('Intermediate');
  const t = {
    en: {
      title: "Online Admission Application Portal",
      session: "ACADEMIC SESSION 2026-27 • INTERMEDIATE & BS PROGRAMS",
      formTitle: "Student Registration Form",
      formSubtitle: "Fill out your credentials accurately for merit list generation",
      step1: "STEP 1: DEGREE & PROGRAM SELECTION",
      programLevel: "PROGRAM LEVEL *",
      programLevelOption1: "BS Program (4-Year)",
      programLevelOption2: "Intermediate Program (F.Sc / F.A / ICS)",
      discipline: "DESIRED DISCIPLINE / MAJOR *",
      studyGroup: "STUDY GROUP *",
      shift: "SHIFT *",
      shiftMorning: "Morning",
      shiftEvening: "Evening",
      step2: "STEP 2: APPLICANT PERSONAL INFORMATION",
      studentName: "STUDENT'S FULL NAME (BLOCK LETTERS) *",
      studentNamePlaceholder: "Enter your full name",
      fatherName: "FATHER'S NAME (BLOCK LETTERS) *",
      fatherNamePlaceholder: "Enter father's name",
      dob: "DATE OF BIRTH *",
      gender: "GENDER *",
      genderMale: "Male",
      genderFemale: "Female",
      cnic: "STUDENT CNIC / B-FORM NUMBER *",
      fatherCnic: "FATHER CNIC NUMBER *",
      mobile: "ACTIVE MOBILE NUMBER *",
      whatsapp: "WHATSAPP NUMBER",
      domicile: "DOMICILE DISTRICT *",
      domicilePlaceholder: "e.g. D.I. Khan",
      address: "POSTAL / RESIDENTIAL ADDRESS *",
      step3: "STEP 3: ACADEMIC BACKGROUND",
      matricRecord: "MATRICULATION RECORD (Required)",
      obtainedMarks: "OBTAINED MARKS *",
      totalMarks: "TOTAL MARKS *",
      passingYear: "PASSING YEAR *",
      board: "BOARD *",
      intermediateRecord: "INTERMEDIATE RECORD (Required for BS Programs)",
      step4: "STEP 4: REQUIRED DOCUMENTS SCAN UPLOADS",
      photo: "PASSPORT SIZE PHOTOGRAPH *",
      matricDmc: "MATRIC DMC / CERTIFICATE *",
      intermediateDmc: "INTERMEDIATE DMC *",
      cnicCopies: "STUDENT CNIC / B-FORM & FATHER CNIC *",
      submit: "SUBMIT ADMISSION APPLICATION",
      guidelines: "Admission Guidelines",
      guideline1: "Ensure all personal and academic records match your original board documents.",
      guideline2: "Merit is calculated automatically based on your entered marks and total marks.",
      guideline3: "Keep your generated Student ID secure for future merit list checks and status updates.",
      needHelp: "NEED HELP?",
      helpText: "Contact college administration desk or call us at:"
    },
    ur: {
      title: "آن لائن داخلہ درخواست پورٹل",
      session: "تعلیمی سال 2026-27 • انٹرمیڈیٹ اور BS پروگرامز",
      formTitle: "طالب علم کا رجسٹریشن فارم",
      formSubtitle: "میرٹ لسٹ کی تیاری کے لیے اپنی اسناد درست طریقے سے پُر کریں",
      step1: "مرحلہ 1: ڈگری اور پروگرام کا انتخاب",
      programLevel: "پروگرام کی سطح *",
      programLevelOption1: "BS پروگرام (4 سالہ)",
      programLevelOption2: "انٹرمیڈیٹ پروگرام (F.Sc / F.A / ICS)",
      discipline: "مطلوبہ ڈسپلن / میجر *",
      studyGroup: "مطالعہ گروپ *",
      shift: "شفٹ *",
      shiftMorning: "صبح",
      shiftEvening: "شام",
      step2: "مرحلہ 2: درخواست دہندہ کی ذاتی معلومات",
      studentName: "طالب علم کا پورا نام (بلاک حروف میں) *",
      studentNamePlaceholder: "اپنا پورا نام درج کریں",
      fatherName: "والد کا نام (بلاک حروف میں) *",
      fatherNamePlaceholder: "والد کا نام درج کریں",
      dob: "تاریخ پیدائش *",
      gender: "جنس *",
      genderMale: "مرد",
      genderFemale: "عورت",
      cnic: "طالب علم کا شناختی کارڈ / بے فارم نمبر *",
      fatherCnic: "والد کا شناختی کارڈ نمبر *",
      mobile: "فعال موبائل نمبر *",
      whatsapp: "واٹس ایپ نمبر",
      domicile: "ڈومیسائل ضلع *",
      domicilePlaceholder: "مثلا ڈیرہ اسماعیل خان",
      address: "پوسٹل / رہائشی پتہ *",
      step3: "مرحلہ 3: تعلیمی پس منظر",
      matricRecord: "میٹرک کا ریکارڈ (لازمی)",
      obtainedMarks: "حاصل کردہ نمبر *",
      totalMarks: "کل نمبر *",
      passingYear: "پاسنگ سال *",
      board: "بورڈ *",
      intermediateRecord: "انٹرمیڈیٹ کا ریکارڈ (BS پروگرامز کے لیے ضروری)",
      step4: "مرحلہ 4: مطلوبہ دستاویزات کی اسکین اپ لوڈز",
      photo: "پاسپورٹ سائز تصویر *",
      matricDmc: "میٹرک DMC / سرٹیفکیٹ *",
      intermediateDmc: "انٹرمیڈیٹ DMC *",
      cnicCopies: "طالب علم CNIC / بے فارم اور والد CNIC *",
      submit: "داخلہ کی درخواست جمع کروائیں",
      guidelines: "داخلہ کے رہنما خطوط",
      guideline1: "یقینی بنائیں کہ تمام ذاتی اور تعلیمی ریکارڈ آپ کے اصل بورڈ دستاویزات سے مماثل ہوں۔",
      guideline2: "میرٹ کا حساب خود بخود آپ کے درج کردہ نمبروں اور کل نمبروں کی بنیاد پر کیا جاتا ہے۔",
      guideline3: "مستقبل کی میرٹ لسٹ چیک اور اسٹیٹس اپ ڈیٹس کے لیے اپنی تیار کردہ اسٹوڈنٹ ID کو محفوظ رکھیں۔",
      needHelp: "مدد چاہیے؟",
      helpText: "کالج ایڈمنسٹریشن ڈیسک سے رابطہ کریں یا ہمیں کال کریں:"
    }
  };
  const x = t[language];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <div className="bg-[#0b1b3d] text-white py-12 text-center relative shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">{x.title}</h2>
          <p className="text-teal-400 text-xs md:text-sm tracking-widest mt-2 uppercase font-semibold">{x.session}</p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100 mb-6">
              <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl text-lg">🎓</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{x.formTitle}</h3>
                <p className="text-xs text-gray-500">{x.formSubtitle}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-teal-50/40 rounded-xl p-5 border border-teal-100">
                <span className="text-xs font-bold text-teal-800 tracking-wider uppercase block mb-3">{x.step1}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{x.programLevel}</label>
                    <select name="programType" value={formData.programType} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option value="BS Program (4-Year)">{x.programLevelOption1}</option>
                      <option value="Intermediate Program (F.Sc / F.A / ICS)">{x.programLevelOption2}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{x.discipline}</label>
                    <select name="program" value={formData.program} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      {isIntermediate? (<><option>F.Sc Pre-Medical</option><option>F.Sc Pre-Engineering</option><option>ICS (Computer Science)</option><option>F.A (Arts & Humanities)</option></>) : (<><option>BS Computer Science</option><option>BS English</option><option>BS Zoology / Botany</option><option>BS Mathematics</option></>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{x.studyGroup}</label>
                    <select name="studyGroup" value={formData.studyGroup} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option>Pre-Medical</option><option>Pre-Engineering</option><option>Computer Science</option><option>Humanities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{x.shift}</label>
                    <select name="shift" value={formData.shift} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                      <option value="Morning">{x.shiftMorning}</option><option value="Evening">{x.shiftEvening}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">{x.step2}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.studentName}</label><input type="text" name="studentName" placeholder={x.studentNamePlaceholder} value={formData.studentName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.fatherName}</label><input type="text" name="fatherName" placeholder={x.fatherNamePlaceholder} value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.dob}</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.gender}</label><select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"><option value="Male">{x.genderMale}</option><option value="Female">{x.genderFemale}</option></select></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.cnic}</label><input type="text" name="cnic" placeholder="12101-1234567-1" value={formData.cnic} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.fatherCnic}</label><input type="text" name="fatherCnic" placeholder="12101-1234567-1" value={formData.fatherCnic} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.mobile}</label><input type="text" name="mobile" placeholder="03001234567" value={formData.mobile} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.whatsapp}</label><input type="text" name="whatsapp" placeholder="03001234567" value={formData.whatsapp} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.domicile}</label><input type="text" name="domicile" placeholder={x.domicilePlaceholder} value={formData.domicile} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">{x.address}</label><input type="text" name="address" placeholder="House No, Street, Area, City" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required /></div>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-4">{x.step3}</span>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-teal-800 block mb-2">{x.matricRecord}</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.obtainedMarks}</label><input type="number" name="matricMarks" value={formData.matricMarks} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required /></div>
                      <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.totalMarks}</label><input type="number" name="matricTotal" value={formData.matricTotal} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required /></div>
                      <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.passingYear}</label><input type="text" name="matricYear" value={formData.matricYear} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required /></div>
                      <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.board}</label><input type="text" name="matricBoard" value={formData.matricBoard} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required /></div>
                    </div>
                  </div>
                  {!isIntermediate && (
                    <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200">
                      <span className="text-xs font-bold text-teal-900 block mb-2">{x.intermediateRecord}</span>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.obtainedMarks}</label><input type="number" name="intermediateMarks" value={formData.intermediateMarks} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required={!isIntermediate} /></div>
                        <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.totalMarks}</label><input type="number" name="intermediateTotal" value={formData.intermediateTotal} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required={!isIntermediate} /></div>
                        <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.passingYear}</label><input type="text" name="intermediateYear" value={formData.intermediateYear} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required={!isIntermediate} /></div>
                        <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">{x.board}</label><input type="text" name="intermediateBoard" value={formData.intermediateBoard} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm outline-none" required={!isIntermediate} /></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full bg-[#009688] hover:bg-teal-700 text-white font-semibold py-4 rounded-xl shadow-md transition duration-200 text-sm tracking-wide uppercase">
                  {loading? 'Submitting...' : x.submit}
                </button>
              </div>
            </form>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900">{language === 'ur'? 'زبان / Language' : 'Language / زبان'}</h4>
                <div className="flex items-center space-x-2 bg-teal-50 p-1 rounded-full">
                  <button onClick={() => setLanguage('en')} className={`text-xs px-3 py-1 rounded-full transition-all ${language === 'en'? 'bg-[#009688] text-white shadow' : 'text-teal-700 hover:bg-teal-100'}`}>English</button>
                  <button onClick={() => setLanguage('ur')} className={`text-xs px-3 py-1 rounded-full transition-all ${language === 'ur'? 'bg-[#009688] text-white shadow' : 'text-teal-700 hover:bg-teal-100'}`}>اردو</button>
                </div>
              </div>
              <p className="text-xs text-gray-500">{language === 'ur'? 'فارم کو اپنی پسندیدہ زبان میں دیکھنے کے لیے بٹن دبائیں۔' : 'Press the button to view the form in your preferred language.'}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm mb-4"><span>🛡️</span><span>{x.guidelines}</span></div>
              <ul className="space-y-4 text-xs text-gray-600 list-decimal list-inside">
                <li className="pl-1"><span>{x.guideline1}</span></li>
                <li className="pl-1"><span>{x.guideline2}</span></li>
                <li className="pl-1"><span>{x.guideline3}</span></li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-100 bg-teal-50/50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-900 mb-1">{x.needHelp}</h4>
                <p className="text-[11px] text-gray-500 mb-2">{x.helpText}</p>
                <a href="tel:+923065927447" className="text-xs font-bold text-teal-700 hover:underline">+92 306 5927447</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default ApplyPage;
