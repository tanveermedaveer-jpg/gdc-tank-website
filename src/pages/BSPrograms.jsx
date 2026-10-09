import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function BSPrograms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bsMajors = [
    { 
      id: 'bs-computer-science', 
      title: 'BS Computer Science', 
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (Pre-Engineering / ICS / Pre-Medical with Math) with min 50% marks.',
      desc: 'Specialized major focusing on software engineering, algorithms, database systems, web development, and modern computing technologies.' 
    },
    { 
      id: 'bs-chemistry', 
      title: 'BS Chemistry', 
      duration: '4 Years (8 Semesters)',
      eligibility: 'FSc Pre-Medical or Pre-Engineering with min 50% marks.',
      desc: 'Advanced study of organic, inorganic, and physical chemical sciences, laboratory research techniques, and industrial applications.' 
    },
    { 
      id: 'bs-physics', 
      title: 'BS Physics', 
      duration: '4 Years (8 Semesters)',
      eligibility: 'FSc Pre-Engineering or ICS (with Physics) with min 50% marks.',
      desc: 'Explore theoretical and experimental physics, quantum mechanics, electromagnetism, and modern electronics.' 
    },
    { 
      id: 'bs-english', 
      title: 'BS English', 
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (Any discipline) with min 45-50% marks.',
      desc: 'Comprehensive study of English literature, linguistics, phonetics, communication skills, and advanced creative writing.' 
    },
    { 
      id: 'bs-political-science', 
      title: 'BS Political Science', 
      duration: '4 Years (8 Semesters)',
      eligibility: 'Intermediate (Any discipline) with min 45-50% marks.',
      desc: 'In-depth study of political systems, governance, public administration, international relations, and constitutional history.' 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs text-teal-400 font-bold uppercase tracking-widest bg-teal-950/80 border border-teal-800/50 px-4 py-1.5 rounded-full mb-4">
            <GraduationCap className="w-4 h-4" /> Higher Education Commission (HEC) Aligned
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif mb-4 tracking-tight">
            BS 4-Year Degree Programs
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Shape your professional future with our HEC-recognized 4-year bachelor programs, led by highly qualified faculty and equipped with modern facilities.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bsMajors.map((major) => (
            <div 
              key={major.id} 
              className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-3 group-hover:text-teal-700 transition-colors">
                  {major.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {major.desc}
                </p>

                {/* Details Meta */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-6 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span><strong>Duration:</strong> {major.duration}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Eligibility:</strong> {major.eligibility}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/apply"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full flex items-center justify-center gap-2 text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-teal-600/20"
                >
                  Apply For Admission <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Box */}
        <div className="mt-16 bg-teal-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <Award className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-3">Ready to Join Captain Ashfaq Shaheed Degree College?</h2>
            <p className="text-teal-100 text-sm sm:text-base mb-8">
              Admissions for the academic session are open. Secure your future in top-tier science, arts, and computing disciplines.
            </p>
            <Link 
              to="/apply"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 bg-white text-teal-900 hover:bg-teal-50 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg"
            >
              Online Admission Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
