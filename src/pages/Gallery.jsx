import { useState, useEffect } from 'react';
import { Eye, Image as ImageIcon, X, Download } from 'lucide-react';
import campusImg from '../assets/campus.png';
import logoImg from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function Gallery() {
  const { t } = useLanguage();
  const isUrdu = t('home') === '\u06c1\u0648\u0645';

  const [activeTab, setActiveTab] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const storedGallery = localStorage.getItem('casdct_gallery');
    const defaultGallery = [
      {
        id: 1,
        image: campusImg,
        title: 'College Front Campus View',
        titleEn: 'College Front Campus View',
        titleUr: 'کالج کا مرکزی کیمپس منظر',
        category: 'campus',
        desc: 'Beautiful view of the college lawn and academic blocks reflecting after rain.',
        descEn: 'Beautiful view of the college lawn and academic blocks reflecting after rain.',
        descUr: 'کالج کے سبزہ زار اور تعلیمی بلاکس کا خوبصورت منظر۔'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
        title: 'College Library & Reading Hall',
        titleEn: 'College Library & Reading Hall',
        titleUr: 'کالج لائبریری اور ریڈنگ ہال',
        category: 'facilities',
        desc: 'Students utilizing the references in the quiet study zones of the library.',
        descEn: 'Students utilizing the references in the quiet study zones of the library.',
        descUr: 'لائبریری کے پرسکون مطالعہ زون میں کتابوں سے استفادہ کرتے ہوئے طلباء۔'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        title: 'Sports & Athletics',
        titleEn: 'Sports & Athletics',
        titleUr: 'کھیل و سرگرمیاں',
        category: 'sports',
        desc: 'Academic session review for category sports.',
        descEn: 'Academic session review for category sports.',
        descUr: 'کالج میں کھیلوں اور غیر نصابی سرگرمیوں کا جائزہ۔'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
        title: 'Annual Sports Gala - Volleyball Tournament',
        titleEn: 'Annual Sports Gala - Volleyball Tournament',
        titleUr: 'سالانہ اسپورٹس گالا - والی بال ٹورنامنٹ',
        category: 'sports',
        desc: 'Intense volleyball matches played during the college annual sports week.',
        descEn: 'Intense volleyball matches played during the college annual sports week.',
        descUr: 'سالانہ سپورٹس ہفتے کے دوران کھیلے گئے والی بال کے دلچسپ میچ۔'
      },
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
        title: 'Science Lab - Chemistry Experiments',
        titleEn: 'Science Lab - Chemistry Experiments',
        titleUr: 'سائنس لیب - کیمسٹری تجربات',
        category: 'facilities',
        desc: 'F.Sc Pre-Medical students performing acid-base titration tests.',
        descEn: 'F.Sc Pre-Medical students performing acid-base titration tests.',
        descUr: 'کیمسٹری لیب میں تیزاب اور اساس کے تجربات کرتے ہوئے ایف ایس سی کے طلباء۔'
      },
      {
        id: 6,
        image: logoImg,
        title: 'College Official Shield/Emblem',
        titleEn: 'College Official Shield/Emblem',
        titleUr: 'کالج کا سرکاری شیلڈ و نشان',
        category: 'campus',
        desc: 'Government Degree College Tank official shield emblem displaying motivational Arabic calligraphy.',
        descEn: 'Government Degree College Tank official shield emblem displaying motivational Arabic calligraphy.',
        descUr: 'گورنمنٹ ڈگری کالج ٹانک کا سرکاری نشان جو عربی کی خطاطی کو ظاہر کرتا ہے۔'
      }
    ];

    if (storedGallery) {
      const parsed = JSON.parse(storedGallery);
      const normalized = parsed.map(item => {
        const def = defaultGallery.find(d => d.id === item.id);
        if (def) {
          return { ...def, ...item };
        }
        return item;
      });
      setGalleryItems(normalized);
    } else {
      localStorage.setItem('casdct_gallery', JSON.stringify(defaultGallery));
      setGalleryItems(defaultGallery);
    }
  }, []);

  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  const handleDownload = (imgUrl, title) => {
    const filename = title ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg` : 'gdc-tank-photo.jpg';
    fetch(imgUrl)
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(err => {
        console.error('Failed to download image directly:', err);
        window.open(imgUrl, '_blank');
      });
  };

  const tabLabels = {
    all: t('showAll'),
    campus: t('campus'),
    facilities: isUrdu ? '\u0633\u06c1\u0648\u0644\u06cc\u0627\u062a' : 'Facilities',
    sports: t('sports')
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('campusPhotoGallery')}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider">
            {t('galleryBannerSub')}
          </p>
        </div>
      </section>

      {/* Tabs and Grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'campus', 'facilities', 'sports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border transition-colors ${activeTab === tab ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 border-slate-205 text-slate-600 hover:bg-slate-100'}`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="group relative bg-slate-50 rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-200">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setSelectedImage(item)}
                      className="bg-white p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110 cursor-pointer focus:outline-none flex items-center justify-center"
                      title="Preview Photo"
                    >
                      <Eye className="w-5 h-5 text-teal-700" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold text-teal-750 uppercase tracking-widest block mb-1">
                    {tabLabels[item.category] || item.category}
                  </span>
                  <h3 className={`font-serif font-bold text-slate-800 text-base leading-tight mb-2 ${isUrdu ? 'text-right' : 'text-left'}`}>
                    {isUrdu ? (item.titleUr || item.title) : (item.titleEn || item.title)}
                  </h3>
                  <p className={`text-slate-500 text-xs leading-relaxed ${isUrdu ? 'text-right' : 'text-left'}`}>
                    {isUrdu ? (item.descUr || item.desc) : (item.descEn || item.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox / Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 p-4 sm:p-6 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-teal-400 bg-slate-900/60 p-2.5 rounded-full border border-slate-700/50 hover:scale-105 transition-all shadow-md focus:outline-none z-10 cursor-pointer flex items-center justify-center"
            aria-label="Close Preview"
            title="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div 
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Preview */}
            <div className="bg-slate-900/50 p-2 rounded-2xl border border-slate-800/80 shadow-2xl max-h-[70vh] flex items-center justify-center overflow-hidden">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                className="max-w-full max-h-[68vh] object-contain rounded-xl"
              />
            </div>

            {/* Info and Download Button Underneath */}
            <div className="mt-4 text-center max-w-xl space-y-3">
              <div>
                <h4 className="text-white text-base sm:text-lg font-bold font-serif leading-snug">
                  {isUrdu ? (selectedImage.titleUr || selectedImage.title) : (selectedImage.titleEn || selectedImage.title)}
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  {isUrdu ? (selectedImage.descUr || selectedImage.desc) : (selectedImage.descEn || selectedImage.desc)}
                </p>
              </div>

              {/* Download Button */}
              <button 
                type="button"
                onClick={() => handleDownload(selectedImage.image, selectedImage.title)}
                className="bg-teal-600 hover:bg-teal-705 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all focus:outline-none flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isUrdu ? '\u0641\u0648\u0679\u0648 \u0688\u0627\u0624\u0646 \u0644\u0648\u0688 \u06a9\u0631\u06cc\u06ba' : 'Download Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
