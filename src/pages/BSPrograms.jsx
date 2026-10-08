import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BSPrograms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bsMajors = [
    { id: 'bs-computer-science', title: 'BS Computer Science', desc: 'Specialized major in software, programming, and modern computing technologies.' },
    { id: 'bs-chemistry', title: 'BS Chemistry', desc: 'Advanced study of chemical sciences, laboratory research, and industrial applications.' },
    { id: 'bs-physics', title: 'BS Physics', desc: 'Explore theoretical and experimental physics, mechanics, and modern electronics.' },
    { id: 'bs-english', title: 'BS English', desc: 'Literature, linguistics, communication, and advanced writing skills.' },
    { id: 'bs-political-science', title: 'BS Political Science', desc: 'Study of governance, political systems, international relations, and public policies.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs text-teal-600 font-bold uppercase tracking-widest bg-teal-50 px-3.5 py-1.5 rounded-full">
            Degree Programs (BS 4-Year)
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif mt-4 mb-4">
            BS 4-Year Programs & Majors
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Choose from our specialized 4-year degree programs designed to build professional expertise and career excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bsMajors.map((major) => (
            <div key={major.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">{major.title}</h3>
                <p className="text-slate-600 text-sm mb-6">{major.desc}</p>
              </div>
              <Link
                to={`/academics/${major.id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors block"
              >
                View Program Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
