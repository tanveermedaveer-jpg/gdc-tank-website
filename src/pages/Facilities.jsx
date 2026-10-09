import React from 'react';
import { Laptop, BookOpen, Microscope, Trophy, Home as HomeIcon, Bus } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';

export default function Facilities() {
  const { t } = useLanguage();

  const facs = [
    {
      icon: <Laptop className="w-8 h-8 text-teal-650" />,
      title: t('computerLabTitle'),
      desc: t('computerLabDesc')
    },
    {
      icon: <BookOpen className="w-8 h-8 text-teal-650" />,
      title: t('centralLibraryTitle'),
      desc: t('centralLibraryDesc')
    },
    {
      icon: <Microscope className="w-8 h-8 text-teal-650" />,
      title: t('scienceLabsTitle'),
      desc: t('scienceLabsDesc')
    },
    {
      icon: <Trophy className="w-8 h-8 text-teal-650" />,
      title: t('sportsGroundTitle'),
      desc: t('sportsGroundDesc')
    },
    {
      icon: <HomeIcon className="w-8 h-8 text-teal-650" />,
      title: t('hostelFacilityTitle'),
      desc: t('hostelFacilityDesc')
    },
    {
      icon: <Bus className="w-8 h-8 text-teal-650" />,
      title: t('transportTitle'),
      desc: t('transportDesc')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative">
          <div className="absolute inset-0 z-0">
            <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('campusFacilities')}</h1>
            <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
              {t('facilitiesBannerSub')}
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 font-serif">{t('stateOfArt')}</h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                {t('facilitiesSubDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facs.map((f, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col items-start">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                    {f.icon}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
