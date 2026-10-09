import { useParams, Link } from 'react-router-dom';
import { BookOpen, Calendar, Award, CheckCircle, ShieldAlert, GraduationCap, ArrowRight } from 'lucide-react';
import campusImg from '../../assets/campus.png';
import { useLanguage } from '../../context/LanguageContext';

export default function ProgramDetail() {
  const { programId } = useParams();
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const programDataEn = {
    'pre-medical': {
      title: 'F.Sc Pre-Medical',
      level: 'Intermediate (Higher Secondary School Certificate - HSSC)',
      duration: '2 Years (Annual System)',
      eligibility: 'Matric (Science) with at least 45% marks from a recognized board, subject to merit cutoff.',
      description: 'The F.Sc Pre-Medical program is designed to prepare students for higher studies in medicine, dentistry, pharmacy, nursing, and allied health sciences. It provides a solid foundation in experimental and theoretical biological sciences.',
      subjects: [
        'Biology (Theory & Practical)',
        'Chemistry (Theory & Practical)',
        'Physics (Theory & Practical)',
        'English (Compulsory)',
        'Urdu (Compulsory)',
        'Islamic Education (Part I) / Civic Studies',
        'Pakistan Studies (Part II)'
      ],
      careers: [
        'MBBS / BDS (Medical & Dental Colleges)',
        'Doctor of Pharmacy (Pharm-D)',
        'BS Nursing / BS Allied Health Sciences',
        'Doctor of Veterinary Medicine (DVM)',
        'BS Zoology, Botany, Biotechnology'
      ]
    },
    'pre-engineering': {
      title: 'F.Sc Pre-Engineering',
      level: 'Intermediate (Higher Secondary School Certificate - HSSC)',
      duration: '2 Years (Annual System)',
      eligibility: 'Matric (Science) with Mathematics, with at least 45% marks from a recognized board, subject to merit cutoff.',
      description: 'The F.Sc Pre-Engineering program equips students with mathematical, analytical, and physical science foundations. This program opens pathways to engineering and technological universities.',
      subjects: [
        'Mathematics (Pure & Applied)',
        'Chemistry (Theory & Practical)',
        'Physics (Theory & Practical)',
        'English (Compulsory)',
        'Urdu (Compulsory)',
        'Islamic Education (Part I)',
        'Pakistan Studies (Part II)'
      ],
      careers: [
        'BE / BS in Civil, Electrical, Mechanical, Software Engineering',
        'BS Computer Science / Information Technology',
        'BS Physics, Mathematics, Architecture',
        'Defense Services (Army, Air Force, Navy Commissions)',
        'Aviation and Aeronautics'
      ]
    },
    'ics': {
      title: 'ICS (Intermediate in Computer Science)',
      level: 'Intermediate (Higher Secondary School Certificate - HSSC)',
      duration: '2 Years (Annual System)',
      eligibility: 'Matric (Science or General with Computer Science), with at least 45% marks from a recognized board.',
      description: 'ICS is a highly popular stream that provides fundamental computer science knowledge combined with mathematics and physics (or statistics/economics). It is designed to prepare students for the rapid advancements of the digital world.',
      subjects: [
        'Computer Science (Theory & Practical)',
        'Mathematics (Compulsory)',
        'Physics (Theory & Practical) OR Statistics',
        'English (Compulsory)',
        'Urdu (Compulsory)',
        'Islamic Education (Part I)',
        'Pakistan Studies (Part II)'
      ],
      careers: [
        'BS Computer Science (BS CS)',
        'BS Software Engineering (BS SE)',
        'BS Information Technology (BS IT)',
        'BS Cyber Security / Data Science / AI',
        'Web & Mobile App Development fields'
      ]
    },
    'fa': {
      title: 'FA (Faculty of Arts)',
      level: 'Intermediate (Higher Secondary School Certificate - HSSC)',
      duration: '2 Years (Annual System)',
      eligibility: 'Matric (Arts or Science) with passing marks (usually 33% or 45% based on merit guidelines).',
      description: 'The Faculty of Arts (FA) program offers a broad spectrum of subjects in humanities, social sciences, and languages. It is tailored for students interested in writing, administration, law, and social services.',
      subjects: [
        'English (Compulsory)',
        'Urdu (Compulsory)',
        'Islamic Studies (Compulsory - Part I)',
        'Pakistan Studies (Compulsory - Part II)',
        'Elective 1 (e.g., Islamic Studies Elective / Civics)',
        'Elective 2 (e.g., History / Political Science)',
        'Elective 3 (e.g., Economics / Pashto / Arabic)'
      ],
      careers: [
        'Bachelor of Laws (LLB)',
        'BS English, Urdu, History, Political Science',
        'BS International Relations, Sociology',
        'Civil Services (CSS/PMS examinations prep)',
        'Journalism and Media Studies'
      ]
    },
    'bs-computer-science': {
      title: 'BS Computer Science',
      level: 'Undergraduate (BS - Honors)',
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (ICS / F.Sc Pre-Engineering or equivalent with Math) with at least 50% marks.',
      description: 'The BS CS program provides a solid foundation in programming, software engineering, databases, algorithms, cybersecurity, and artificial intelligence, affiliated with Gomal University.',
      subjects: [
        'Programming Fundamentals (C++ / Python)',
        'Object Oriented Programming & Data Structures',
        'Database Systems & Web Engineering',
        'Operating Systems & Computer Networks',
        'Software Engineering & Software Quality Assurance',
        'Artificial Intelligence & Machine Learning',
        'Final Year Capstone Project (Semester VII-VIII)'
      ],
      careers: [
        'Software Engineer & Full Stack Web Developer',
        'Mobile Application Developer (iOS/Android)',
        'Database Administrator & Systems Analyst',
        'Cybersecurity Specialist & Network Engineer',
        'IT Consultant & Tech Entrepreneur'
      ]
    },
    'bs-chemistry': {
      title: 'BS Chemistry',
      level: 'Undergraduate (BS - Honors)',
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (F.Sc Pre-Medical / Pre-Engineering) with Chemistry, with at least 45% marks.',
      description: 'The BS Chemistry program offers deep theoretical and experimental training across organic, inorganic, physical, and analytical chemistry, affiliated with Gomal University.',
      subjects: [
        'Organic Chemistry (Theory & Practical)',
        'Inorganic Chemistry (Theory & Practical)',
        'Physical Chemistry (Theory & Practical)',
        'Analytical Chemistry & Spectroscopy',
        'Biochemistry & Environmental Chemistry',
        'Research Methodology & Final Year Thesis'
      ],
      careers: [
        'Chemical Analyst & Quality Control Inspector',
        'Pharmaceutical Researcher & Lab Scientist',
        'Chemical Industry Consultant',
        'Chemistry Lecturer / Teacher',
        'Environmental Protection Officer'
      ]
    },
    'bs-physics': {
      title: 'BS Physics',
      level: 'Undergraduate (BS - Honors)',
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (F.Sc Pre-Engineering / ICS) with Physics and Math, with at least 45% marks.',
      description: 'The BS Physics program explores classical mechanics, electromagnetism, quantum mechanics, modern physics, and computational physics, affiliated with Gomal University.',
      subjects: [
        'Classical Mechanics & Thermodynamics',
        'Electromagnetism & Waves and Optics',
        'Quantum Mechanics (I & II)',
        'Mathematical Methods of Physics',
        'Nuclear Physics & Solid State Physics',
        'Computational Physics & Lab Internships'
      ],
      careers: [
        'Scientific Officer / Researcher',
        'Laboratory Director & Test Engineer',
        'Energy Sector Specialist',
        'Physics Teacher / Lecturer',
        'Geophysicist & Data Analyst'
      ]
    },
    'bs-english': {
      title: 'BS English (Literature & Linguistics)',
      level: 'Undergraduate (BS - Honors)',
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (F.Sc, ICS, FA, I.Com) with at least 45% marks.',
      description: 'The BS English program offers a comprehensive study of classic and contemporary English literature, alongside syntax, phonetics, and applied linguistics, affiliated with Gomal University.',
      subjects: [
        'Introduction to English Literature & Poetry',
        'History of English Literature & Drama',
        'Introduction to Linguistics & Phonology',
        'Sociolinguistics & Psycholinguistics',
        'Short Stories, Novels, & Prose Studies',
        'Creative Writing & Research Methodology'
      ],
      careers: [
        'English Language Lecturer & Professor',
        'Content Writer, Copywriter & Editor',
        'Public Relations (PR) Officer & Media Liaison',
        'Civil Service Officers (CSS/PMS prep track)',
        'Journalist & Digital Broadcaster'
      ]
    },
    'bs-political-science': {
      title: 'BS Political Science',
      level: 'Undergraduate (BS - Honors)',
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (FA, F.Sc, ICS) with at least 45% marks.',
      description: 'The BS Political Science program analyzes political theory, comparative politics, international relations, public policy, and constitutional law, affiliated with Gomal University.',
      subjects: [
        'Introduction to Political Science & Ideologies',
        'Western Political Thought & Philosophies',
        'Muslim Political Thought & Philosophies',
        'Comparative Politics & Foreign Policies',
        'International Relations (IR) & Global Politics',
        'Public Administration & Public Policy in Pakistan'
      ],
      careers: [
        'Public Policy Analyst & Researcher',
        'Government Administrator & Officer (Scale-17)',
        'Political Consultant & Campaign Manager',
        'Lecturer / Educator (Political Science)',
        'NGO / Civil Society Program Officer'
      ]
    }
  };

  const programDataUr = {
    'pre-medical': {
      title: 'ایف ایس سی پری میڈیکل',
      level: 'انٹرمیڈیٹ (ہائر سیکنڈری اسکول سرٹیفکیٹ - HSSC)',
      duration: '2 سال (سالانہ نظام)',
      eligibility: 'کسی تسلیم شدہ بورڈ سے کم از کم 45 فیصد نمبروں کے ساتھ میٹرک (سائنس)، میرٹ لسٹ کے مطابق۔',
      description: 'ایف ایس سی پری میڈیکل پروگرام طلباء کو طب، دندان سازی، فارمیسی، نرسنگ اور متعلقہ ہیلتھ سائنسز میں اعلیٰ تعلیم کے لیے تیار کرنے کے لیے ڈیزائن کیا گیا ہے۔ یہ حیاتیاتی علوم میں مضبوط بنیاد فراہم کرتا ہے۔',
      subjects: [
        'بیالوجی / حیاتیاتی علوم (نظریاتی و عملی)',
        'کیمسٹری / کیمیا (نظریاتی و عملی)',
        'فزکس / طبیعیات (نظریاتی و عملی)',
        'انگریزی (لازمی)',
        'اردو (لازمی)',
        'اسلامی تعلیم (پہلا سال) / شہریت',
        'مطالعہ پاکستان (دوسرا سال)'
      ],
      careers: [
        'MBBS / BDS (میڈیکل اور ڈینٹل کالجز)',
        'ڈاکٹر آف فارمیسی (Pharm-D)',
        'بی ایس نرسنگ / بی ایس الائیڈ ہیلتھ سائنسز',
        'ڈاکٹر آف ویٹرنری میڈیسن (DVM)',
        'بی ایس زولوجی، بوٹنی، بائیو ٹیکنالوجی'
      ]
    },
    'pre-engineering': {
      title: 'ایف ایس سی پری انجینئرنگ',
      level: 'انٹرمیڈیٹ (ہائر سیکنڈری اسکول سرٹیفکیٹ - HSSC)',
      duration: '2 سال (سالانہ نظام)',
      eligibility: 'کسی تسلیم شدہ بورڈ سے ریاضی کے ساتھ میٹرک (سائنس) میں کم از کم 45 فیصد نمبر، میرٹ لسٹ کے مطابق۔',
      description: 'ایف ایس سی پری انجینئرنگ پروگرام طلباء کو ریاضیاتی، تجزیاتی اور طبعی سائنس کے علوم سے آراستہ کرتا ہے۔ یہ پروگرام انجینئرنگ اور ٹیکنالوجی کی یونیورسٹیوں کے راستے کھولتا ہے۔',
      subjects: [
        'ریاضی (ریاضیاتی علوم)',
        'کیمسٹری / کیمیا (نظریاتی و عملی)',
        'فزکس / طبیعیات (نظریاتی و عملی)',
        'انگریزی (لازمی)',
        'اردو (لازمی)',
        'اسلامی تعلیم (پہلا سال)',
        'مطالعہ پاکستان (دوسرا سال)'
      ],
      careers: [
        'سول، الیکٹریکل، مکینیکل اور سافٹ ویئر انجینئرنگ میں BE / BS',
        'بی ایس کمپیوٹر سائنس / انفارمیشن ٹیکنالوجی',
        'بی ایس فزکس، ریاضی، آرکیٹیکچر',
        'دفاعی خدمات (پاک فوج، فضائیہ، بحریہ میں کمیشن)',
        'ایوی ایشن اور ایروناٹکس'
      ]
    },
    'ics': {
      title: 'آئی سی ایس (کمپیوٹر سائنس)',
      level: 'انٹرمیڈیٹ (ہائر سیکنڈری اسکول سرٹیفکیٹ - HSSC)',
      duration: '2 سال (سالانہ نظام)',
      eligibility: 'کسی تسلیم شدہ بورڈ سے میٹرک (سائنس یا کمپیوٹر سائنس کے ساتھ جنرل گروپ) میں کم از کم 45 فیصد نمبر۔',
      description: 'آئی سی ایس ایک انتہائی مقبول شعبہ ہے جو ریاضی اور طبیعیات کے ساتھ کمپیوٹر سائنس کا بنیادی علم فراہم کرتا ہے۔ یہ ڈیجیٹل دنیا کی تیز رفتار ترقی کے لیے تیار کرتا ہے۔',
      subjects: [
        'کمپیوٹر سائنس (نظریاتی و عملی)',
        'ریاضی (لازمی)',
        'فزکس (نظریاتی و عملی) یا شماریات',
        'انگریزی (لازمی)',
        'اردو (لازمی)',
        'اسلامی تعلیم (پہلا سال)',
        'مطالعہ پاکستان (دوسرا سال)'
      ],
      careers: [
        'بی ایس کمپیوٹر سائنس (BS CS)',
        'بی ایس سافٹ ویئر انجینئرنگ (BS SE)',
        'بی ایس انفارمیشن ٹیکنالوجی (BS IT)',
        'بی ایس سائبر سیکیورٹی / ڈیٹا سائنس / AI',
        'ویب اور موبائل ایپ ڈویلپمنٹ'
      ]
    },
    'fa': {
      title: 'ایف اے (آرٹس)',
      level: 'انٹرمیڈیٹ (ہائر سیکنڈری اسکول سرٹیفکیٹ - HSSC)',
      duration: '2 سال (سالانہ نظام)',
      eligibility: 'کسی تسلیم شدہ بورڈ سے میٹرک (آرٹس یا سائنس) میں پاسنگ نمبر (قواعد کے مطابق 33٪ یا 45٪)۔',
      description: 'فیکلٹی آف آرٹس (FA) پروگرام ہیومینیٹیز، سوشل سائنسز اور زبانوں میں مضامین کی ایک وسیع رینج پیش کرتا ہے۔ یہ تحریر، انتظامیہ، قانون اور سماجی خدمات میں دلچسپی رکھنے والے طلباء کے لیے ہے۔',
      subjects: [
        'انگریزی (لازمی)',
        'اردو (لازمی)',
        'اسلامی مطالعہ (لازمی - پہلا سال)',
        'مطالعہ پاکستان (لازمی - دوسرا سال)',
        'اختیاری مضمون 1 (مثلاً اسلامیات اختیاری / شہریت)',
        'اختیاری مضمون 2 (مثلاً تاریخ / سیاسیات)',
        'اختیاری مضمون 3 (مثلاً معاشیات / پشتو / عربی)'
      ],
      careers: [
        'بیچلر آف لاز (LLB)',
        'بی ایس انگلش، اردو، تاریخ، سیاسیات',
        'بی ایس انٹرنیشنل ریلیشنز، عمرانیات',
        'سول سروسز (CSS/PMS امتحانات کی تیاری)',
        'صحافت اور میڈیا اسٹڈیز'
      ]
    },
    'bs-computer-science': {
      title: 'بی ایس کمپیوٹر سائنس',
      level: 'انڈرگریجویٹ (بی ایس - آنرز)',
      duration: '4 سال (8 سمسٹر)',
      eligibility: 'کم از کم 50 فیصد نمبروں کے ساتھ انٹرمیڈیٹ (ICS / F.Sc پری انجینئرنگ یا مساوی مع ریاضی)۔',
      description: 'بی ایس سی ایس پروگرام گومل یونیورسٹی سے منسلک ہے اور پروگرامنگ، سافٹ ویئر انجینئرنگ، ڈیٹا بیس، الگورتھم، سائبر سیکیورٹی اور مصنوعی ذہانت میں مضبوط بنیاد فراہم کرتا ہے۔',
      subjects: [
        'پروگرامنگ کے بنیادی اصول (C++ / Python)',
        'آبجیکٹ اورینٹڈ پروگرامنگ اور ڈیٹا اسٹرکچرز',
        'ڈیٹا بیس سسٹمز اور ویب انجینئرنگ',
        'آپریٹنگ سسٹمز اور کمپیوٹر نیٹ ورکس',
        'سافٹ ویئر انجینئرنگ اور سافٹ ویئر کوالٹی ایشورنس',
        'مصنوعی ذہانت اور مشین لرننگ',
        'فائنل ایئر کیپسٹون پروجیکٹ (سمسٹر VII-VIII)'
      ],
      careers: [
        'سافٹ ویئر انجینئر اور فل اسٹیک ویب ڈویلپر',
        'موبائل ایپلی کیشن ڈویلپر (iOS/Android)',
        'ڈیٹا بیس ایڈمنسٹریٹر اور سسٹمز انالسٹ',
        'سائبر سیکیورٹی اسپیشلسٹ اور نیٹ ورک انجینئر',
        'آئی ٹی کنسلٹنٹ اور ٹیک کاروباری'
      ]
    },
    'bs-chemistry': {
      title: 'بی ایس کیمسٹری',
      level: 'انڈرگریجویٹ (بی ایس - آنرز)',
      duration: '4 سال (8 سمسٹر)',
      eligibility: 'کم از کم 45 فیصد نمبروں کے ساتھ انٹرمیڈیٹ (F.Sc پری میڈیکل / پری انجینئرنگ مع کیمسٹری)۔',
      description: 'بی ایس کیمسٹری پروگرام گومل یونیورسٹی سے منسلک ہے اور نامیاتی (organic)، غیر نامیاتی (inorganic)، طبعی (physical)، اور تجزیاتی (analytical) کیمسٹری میں گہری نظریاتی اور عملی تربیت فراہم کرتا ہے۔',
      subjects: [
        'نامیاتی کیمسٹری (نظریاتی و عملی)',
        'غیر نامیاتی کیمسٹری (نظریاتی و عملی)',
        'طبعی کیمسٹری (نظریاتی و عملی)',
        'تجزیاتی کیمسٹری اور سپیکٹروسکوپی',
        'بائیو کیمسٹری اور ماحولیاتی کیمسٹری',
        'تحقیقی طریقہ کار اور فائنل ایئر تھیسس'
      ],
      careers: [
        'کیمیائی تجزیہ کار اور کوالٹی کنٹرول انسپکٹر',
        'فارماسیوٹیکل محقق اور لیب سائنسدان',
        'کیمیائی صنعت کے کنسلٹنٹ',
        'کیمسٹری لیکچرر / ٹیچر',
        'ماحولیاتی تحفظ کے افسر'
      ]
    },
    'bs-physics': {
      title: 'بی ایس فزکس',
      level: 'انڈرگریجویٹ (بی ایس - آنرز)',
      duration: '4 سال (8 سمسٹر)',
      eligibility: 'فزکس اور ریاضی کے ساتھ انٹرمیڈیٹ (F.Sc پری انجینئرنگ / ICS) مع کم از کم 45 فیصد نمبر۔',
      description: 'بی ایس فزکس پروگرام کلاسیکی میکانکس، برقی مقناطیسیت (electromagnetism)، کوانٹم میکانکس، جدید طبیعیات، اور کمپیوٹیشنل فزکس کا احاطہ کرتا ہے، گومل یونیورسٹی سے الحاق شدہ ہے۔',
      subjects: [
        'کلاسیکی میکانکس اور تھرمو ڈائنامکس',
        'برقی مقناطیسیت اور لہریں و آپٹکس',
        'کوانٹم میکانکس (I اور II)',
        'فزکس کے ریاضیاتی طریقے',
        'نیوکلیئر فزکس اور سالڈ اسٹیٹ فزکس',
        'کمپیوٹیشنل فزکس اور لیب انٹرن شپس'
      ],
      careers: [
        'سائنسی افسر / محقق',
        'لیبارٹری ڈائریکٹر اور ٹیسٹ انجینئر',
        'توانائی کے شعبے کے ماہر',
        'فزکس ٹیچر / لیکچرر',
        'جیو فزکسٹ اور ڈیٹا اینالسٹ'
      ]
    },
    'bs-english': {
      title: 'بی ایس انگلش (ادب و لسانیات)',
      level: 'انڈرگریجویٹ (بی ایس - آنرز)',
      duration: '4 سال (8 سمسٹر)',
      eligibility: 'کم از کم 45 فیصد نمبروں کے ساتھ انٹرمیڈیٹ (F.Sc, ICS, FA, I.Com)۔',
      description: 'بی ایس انگلش پروگرام کلاسک اور عصری انگریزی ادب کے ساتھ ساتھ نحو (syntax)، صوتیات (phonetics)، اور لاگو لسانیات (applied linguistics) کا ایک جامع مطالعہ پیش کرتا ہے، گومل یونیورسٹی سے الحاق شدہ ہے۔',
      subjects: [
        'انگریزی ادب اور شاعری کا تعارف',
        'انگریزی ادب کی تاریخ اور ڈرامہ',
        'لسانیات اور صوتیات کا تعارف',
        'سوشیو لنگوسٹکس اور سائیکو لنگوسٹکس',
        'مختصر کہانیاں، ناول، اور نثر کا مطالعہ',
        'تخلیقی تحریر اور تحقیقی طریقہ کار'
      ],
      careers: [
        'انگریزی زبان کے لیکچرر اور پروفیسر',
        'کونٹینٹ رائٹر، کاپی رائٹر اور ایڈیٹر',
        'پبلک ریلیشنز (PR) آفیسر اور میڈیا رابطہ کار',
        'سول سروسز افسران (CSS/PMS ٹریک)',
        'صحافی اور ڈیجیٹل براڈکاسٹر'
      ]
    },
    'bs-political-science': {
      title: 'بی ایس پولیٹیکل سائنس',
      level: 'انڈرگریجویٹ (بی ایس - آنرز)',
      duration: '4 سال (8 سمسٹر)',
      eligibility: 'کم از کم 45 فیصد نمبروں کے ساتھ انٹرمیڈیٹ (FA, F.Sc, ICS)۔',
      description: 'بی ایس پولیٹیکل سائنس پروگرام سیاسی نظریہ، تقابلی سیاست، بین الاقوامی تعلقات، پبلک پالیسی اور آئینی قانون کا تجزیہ کرتا ہے، گومل یونیورسٹی سے الحاق شدہ ہے۔',
      subjects: [
        'سیاسیات اور نظریات کا تعارف',
        'مغربی سیاسی فکر اور فلسفے',
        'مسلم سیاسی فکر اور فلسفے',
        'تقابلی سیاست اور خارجہ پالیسیاں',
        'بین الاقوامی تعلقات (IR) اور عالمی سیاست',
        'پاکستان میں پبلک ایڈمنسٹریشن اور پبلک پالیسی'
      ],
      careers: [
        'پبلک پالیسی اینالسٹ اور محقق',
        'سرکاری ایڈمنسٹریٹر اور آفیسر (اسکیل-17)',
        'سیاسی مشیر اور مہم کے مینیجر',
        'لیکچرر / معلم (سیاسیات)',
        'این جی او / سول سوسائٹی پروگرام آفیسر'
      ]
    }
  };

  const programData = isUrdu ? programDataUr : programDataEn;

  // اگر یوزر صرف /academics پر آئے (کوئی specific programId نہ ہو) تو تمام پروگرامز کا اوورویو دکھائیں
  if (!programId) {
    return (
      <div className="w-full bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs text-teal-600 font-bold uppercase tracking-widest bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full mb-4">
              <GraduationCap className="w-4 h-4" /> {isUrdu ? 'کیپٹن اشفاق شہید ڈگری کالج ٹانک' : 'Captain Ashfaq Shaheed Degree College Tank'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-4">
              {isUrdu ? 'ہمارے تعلیمی پروگرامز' : 'Our Academic Programs'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isUrdu 
                ? 'انٹرمیڈیٹ (HSSC) اور 4 سالہ بی ایس (BS) ڈگری پروگرامز جو طلباء کو روشن مستقبل اور پیشہ ورانہ کامیابی کے لیے تیار کرتے ہیں۔'
                : 'Explore our intermediate and undergraduate programs designed to shape your academic and professional career.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(programData).map(([id, prog]) => (
              <div key={id} className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif mb-2 group-hover:text-teal-700 transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-3">
                    {prog.level}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {prog.description}
                  </p>
                </div>
                <Link
                  to={`/academics/${id}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full flex items-center justify-center gap-2 text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-teal-600/20"
                >
                  {isUrdu ? 'تفصیلات دیکھیں' : 'View Program Details'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentProgram = programData[programId] || programData['pre-medical'];

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{currentProgram.title}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {currentProgram.level}
          </p>
        </div>
      </section>

      {/* Main Details */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" dir={isUrdu ? 'rtl' : 'ltr'}>
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className={isUrdu ? 'text-right' : 'text-left'}>
                <h2 className="text-2xl font-bold text-blue-950 font-serif mb-4">
                  {isUrdu ? 'پروگرام کا جائزہ' : 'Program Overview'}
                </h2>
                <p className="text-slate-650 leading-relaxed text-base">
                  {currentProgram.description}
                </p>
              </div>

              {/* Course Subjects Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
                <h3 className={`text-xl font-bold text-slate-800 font-serif mb-4 flex items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <BookOpen className={`w-5 h-5 text-teal-650 ${isUrdu ? 'ml-2' : 'mr-2'}`} />
                  {isUrdu ? 'پیش کردہ بنیادی مضامین' : 'Key Subjects Offered'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentProgram.subjects.map((sub, idx) => (
                    <div key={idx} className={`flex items-center text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:scale-[1.03] hover:shadow-md transition-all duration-300 transform will-change-transform ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                      <CheckCircle className={`w-4 h-4 text-teal-600 flex-shrink-0 ${isUrdu ? 'ml-2.5' : 'mr-2.5'}`} />
                      <span className="text-sm font-medium">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Future Careers & Pathways */}
              <div className={isUrdu ? 'text-right' : 'text-left'}>
                <h3 className={`text-xl font-bold text-slate-800 font-serif mb-4 flex items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <GraduationCap className={`w-6 h-6 text-teal-650 ${isUrdu ? 'ml-2' : 'mr-2'}`} />
                  {isUrdu ? 'مستقبل کے کیریئر اور راستے' : 'Future Careers & Pathways'}
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {isUrdu 
                    ? 'اس پروگرام کی تکمیل پر، طلباء معروف پیشہ ورانہ یونیورسٹیوں میں داخلہ لینے اور مختلف شعبوں میں کیریئر بنانے کے لیے مکمل طور پر اہل اور تیار ہوتے ہیں:'
                    : 'Upon completion of this program, students are fully eligible and prepared to seek admissions in leading professional universities and pursue diverse careers:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentProgram.careers.map((career, idx) => (
                    <div key={idx} className={`flex items-start text-slate-600 text-sm ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                      <ArrowRight className={`w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0 ${isUrdu ? 'ml-2.5 rotate-180' : 'mr-2.5'}`} />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar info */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
                <h3 className={`text-lg font-bold text-blue-950 font-serif border-b border-slate-200 pb-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
                  {isUrdu ? 'فوری تفصیلات' : 'Quick Details'}
                </h3>
                
                <div className="space-y-4">
                  <div className={isUrdu ? 'text-right' : 'text-left'}>
                    <span className="text-slate-500 font-semibold text-xs uppercase block">
                      {isUrdu ? 'دورانیہ' : 'Duration'}
                    </span>
                    <span className={`text-slate-800 font-bold flex items-center mt-0.5 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                      <Calendar className={`w-4.5 h-4.5 text-teal-600 ${isUrdu ? 'ml-1.5' : 'mr-1.5'}`} />
                      {currentProgram.duration}
                    </span>
                  </div>

                  <div className={isUrdu ? 'text-right' : 'text-left'}>
                    <span className="text-slate-500 font-semibold text-xs uppercase block">
                      {isUrdu ? 'کم پیشگی تعلیمی سطح' : 'Min. Academic Level'}
                    </span>
                    <span className="text-slate-800 font-bold block mt-0.5">{currentProgram.level}</span>
                  </div>

                  <div className={`border p-4 rounded-xl text-sm ${isUrdu ? 'text-right bg-amber-50/40 border-amber-200 text-amber-900' : 'bg-amber-50 border-amber-250 text-amber-900'}`}>
                    <span className={`font-bold flex items-center mb-1 text-amber-950 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                      <ShieldAlert className={`w-4 h-4 text-amber-700 ${isUrdu ? 'ml-1' : 'mr-1'}`} />
                      {isUrdu ? 'اہلیت کا معیار' : 'Eligibility Criteria'}
                    </span>
                    {currentProgram.eligibility}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Link 
                    to="/apply" 
                    className="w-full block text-center bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-950 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors"
                  >
                    {isUrdu ? 'اس پروگرام کے لیے درخواست دیں' : 'Apply for this Program'}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
