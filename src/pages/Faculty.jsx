import { useState, useEffect } from 'react';
import { Users, GraduationCap, Mail, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import campusImg from '../assets/campus.png';

export default function Faculty() {
  const { t } = useLanguage();
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const storedFaculty = localStorage.getItem('casdct_faculty');
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty));
    } else {
      const defaultFaculty = [
        {
          id: 1,
          name: 'Prof. Shabir Ahmad',
          role: 'Principal / Head of Institution',
          qual: 'M.Phil English Literature (Peshawar University)',
          dept: 'Administration / English',
          email: 'principal@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 2,
          name: 'Mr. Muhammad Imran',
          role: 'HOD / Lecturer',
          qual: 'MS Computer Science (Gomal University)',
          dept: 'Computer Science',
          email: 'imran.cs@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 3,
          name: 'Dr. Shakeel Ahmad',
          role: 'HOD / Assistant Professor',
          qual: 'Ph.D Organic Chemistry (Quaid-e-Azam University)',
          dept: 'Chemistry',
          email: 'shakeel.chem@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 4,
          name: 'Mr. Najeeb-ur-Rehman',
          role: 'HOD / Lecturer',
          qual: 'M.Sc Physics (Peshawar University)',
          dept: 'Physics',
          email: 'najeeb.phys@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 5,
          name: 'Mr. Habib-ur-Rehman',
          role: 'HOD / Assistant Professor',
          qual: 'M.Phil Zoology (Gomal University)',
          dept: 'Biological Sciences (Zoology)',
          email: 'habib.zoo@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 6,
          name: 'Mr. Tariq Rafiq',
          role: 'HOD / Lecturer',
          qual: 'MA English Language & Literature (NUML)',
          dept: 'English',
          email: 'tariq.eng@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 7,
          name: 'Mr. Shaukat Khan',
          role: 'HOD / Lecturer',
          qual: 'MA Islamic Studies (Gomal University)',
          dept: 'Islamic Studies & Humanities',
          email: 'shaukat.isl@casdct.edu.pk',
          isHOD: true
        },
        {
          id: 8,
          name: 'Mr. Asif Mahmud',
          role: 'Lecturer',
          qual: 'M.Sc Applied Mathematics (Peshawar University)',
          dept: 'Mathematics',
          email: 'asif.math@casdct.edu.pk',
          isHOD: false
        },
        {
          id: 9,
          name: 'Mr. Zia-ur-Rehman',
          role: 'Lecturer',
          qual: 'M.Phil Urdu (Peshawar University)',
          dept: 'Urdu',
          email: 'zia.urdu@casdct.edu.pk',
          isHOD: false
        }
      ];
      localStorage.setItem('casdct_faculty', JSON.stringify(defaultFaculty));
      setFaculty(defaultFaculty);
    }
  }, []);

  const translateFacultyField = (text) => {
    const isUrdu = t('home') === 'ہوم';
    if (!isUrdu || !text) return text;

    const dict = {
      // Roles
      'Principal / Head of Institution': 'پرنسپل / سربراہ ادارہ',
      'HOD / Assistant Professor': 'ایچ او ڈی / اسسٹنٹ پروفیسر',
      'Assistant Professor': 'اسسٹنٹ پروفیسر',
      'HOD / Lecturer': 'ایچ او ڈی / لیکچرار',
      'Lecturer': 'لیکچرار',
      'Principal / Head': 'پرنسپل / سربراہ',

      // Departments
      'Administration / English': 'انتظامیہ / انگریزی',
      'Computer Science': 'کمپیوٹر سائنس',
      'Chemistry': 'کیمسٹری',
      'Physics': 'فزکس',
      'Biological Sciences (Zoology)': 'بیالوجیکل سائنسز (زولوجی)',
      'Biological Sciences (Botany)': 'بیالوجیکل سائنسز (بوٹنی)',
      'English': 'انگلش',
      'Islamic Studies & Humanities': 'اسلامیات و ہیومینیٹیز',
      'Mathematics': 'میتھمیٹکس',
      'Urdu': 'اردو',

      // Universities
      'Quaid-e-Azam University': 'قائد اعظم یونیورسٹی',
      'Gomal University': 'گومل یونیورسٹی',
      'Peshawar University': 'پشاور یونیورسٹی',
      'NUML': 'نمل (NUML)',

      // Names & Prefixes
      'Prof. Shabir Ahmad': 'پروفیسر شبیر احمد',
      'Dr. Shakeel Ahmad': 'ڈاکٹر شکیل احمد',
      'Mr. Muhammad Imran': 'مسٹر محمد عمران',
      'Mr. Habib-ur-Rehman': 'مسٹر حبیب الرحمٰن',
      'Mr. Najeeb-ur-Rehman': 'مسٹر نجیب الرحمٰن',
      'Mr. Tariq Rafiq': 'مسٹر طارق رفیق',
      'Mr. Shaukat Khan': 'مسٹر شوکت خان',
      'Mr. Asif Mahmud': 'مسٹر آصف محمود',
      'Mr. Zia-ur-Rehman': 'مسٹر ضیاء الرحمٰن',

      // Degree qualifications
      'M.Phil English Literature': 'ایم فل انگلش لٹریچر',
      'MS Computer Science': 'ایم ایس کمپیوٹر سائنس',
      'Ph.D Organic Chemistry': 'پی ایچ ڈی آرگینک کیمسٹری',
      'M.Sc Physics': 'ایم ایس سی فزکس',
      'M.Phil Zoology': 'ایم فل زولوجی',
      'MA English Language & Literature': 'ایم اے انگلش لینگویج اینڈ لٹریچر',
      'MA Islamic Studies': 'ایم اے اسلامیات',
      'M.Sc Applied Mathematics': 'ایم ایس سی اپلائیڈ میتھمیٹکس',
      'M.Phil Urdu': 'ایم فل اردو'
    };

    if (dict[text]) return dict[text];

    let result = text;
    Object.keys(dict).forEach(key => {
      result = result.replace(key, dict[key]);
    });
    return result;
  };

  return (
    <div className="flex-grow">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('ourTeachingFaculty')}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {t('facultyBannerSub')}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">{t('meetOurEducators')}</h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {t('facultyDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:scale-[1.03] hover:shadow-lg transition-all duration-300 transform will-change-transform relative overflow-hidden">
                {member.isHOD && (
                  <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {t('adminHod')}
                  </div>
                )}
                <div>
                  {/* Avatar Placeholder */}
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-teal-600" />
                  </div>
                  
                  <h3 className="font-serif font-bold text-lg text-slate-800 leading-tight mb-1">
                    {translateFacultyField(member.name)}
                  </h3>
                  <div className="text-xs font-bold text-teal-700 mb-4">{translateFacultyField(member.role)}</div>

                  <div className="space-y-2 mt-4 text-xs sm:text-sm text-slate-650">
                    <div className="flex items-start">
                      <GraduationCap className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{translateFacultyField(member.qual)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-slate-500 mr-1.5 text-xs uppercase">{t('department')}:</span>
                      <span className="font-semibold text-slate-700">{translateFacultyField(member.dept)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 mt-6 flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 mr-2" />
                  <a href={`mailto:${member.email}`} className="text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors">
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
