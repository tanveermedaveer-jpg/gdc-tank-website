import { useState, useEffect } from 'react';
import { Eye, Image as ImageIcon, X, Download, Plus, Upload, CheckCircle2, Video } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { useLanguage } from '../context/LanguageContext';
import { publicFileRequest, publicRequest } from '../lib/adminApi';

const GALLERY_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
  'video/ogg', 'video/x-msvideo'
];

export default function Gallery() {
  const { t } = useLanguage();
  const isUrdu = t('home') === 'ہوم';

  const [activeTab, setActiveTab] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('facilities');
  const [uploadFile, setUploadFile] = useState(null);        // actual File object
  const [uploadFilePreview, setUploadFilePreview] = useState(''); // object URL for preview
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [galleryError, setGalleryError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadApprovedGallery = async () => {
      try {
        const items = await publicRequest('public.gallery');
        if (!isMounted) return;
        setGalleryItems((items || []).map(item => ({
          ...item,
          image: item.publicUrl,
          mediaUrl: item.publicUrl
        })));
        setGalleryError('');
      } catch (error) {
        if (!isMounted) return;
        console.error('Unable to load shared approved gallery media:', error);
        setGalleryError('Gallery items could not be loaded. Please try again later.');
      }
    };

    loadApprovedGallery();
    const refreshTimer = window.setInterval(loadApprovedGallery, 30000);
    window.addEventListener('casdct_media_updated', loadApprovedGallery);
    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('casdct_media_updated', loadApprovedGallery);
    };
  }, []);

  // Handle file selection — auto-detect type and create preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!GALLERY_FILE_TYPES.includes(file.type) || file.size > 10 * 1024 * 1024) {
      setUploadError('Choose a supported image or video file no larger than 10 MB.');
      if (uploadFilePreview) URL.revokeObjectURL(uploadFilePreview);
      setUploadFile(null);
      setUploadFilePreview('');
      e.target.value = '';
      return;
    }
    setUploadError('');
    setUploadFile(file);
    // Revoke any previous object URL to avoid memory leaks
    if (uploadFilePreview) URL.revokeObjectURL(uploadFilePreview);
    setUploadFilePreview(URL.createObjectURL(file));
  };

  // Public submissions are stored centrally and remain pending until admin approval.
  const handleSubmitMedia = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFile) return;

    setIsSubmitting(true);
    setUploadError('');
    try {
      await publicFileRequest('public.gallery.upload', {
        title: uploadTitle.trim(),
        category: uploadCategory,
        description: uploadDesc.trim(),
        uploaderName: uploaderName.trim()
      }, uploadFile, 'media_file');
      window.dispatchEvent(new Event('casdct_media_updated'));

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setUploadTitle('');
        setUploadFile(null);
        setUploadFilePreview('');
        setUploadDesc('');
        setUploaderName('');
      }, 2500);
    } catch (error) {
      console.error('Unable to submit gallery media:', error);
      setUploadError(error.message || 'Unable to submit this gallery media.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => () => {
    if (uploadFilePreview) URL.revokeObjectURL(uploadFilePreview);
  }, [uploadFilePreview]);

  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  const handleDownload = (imgUrl, title, fileName) => {
    const filename = fileName || (title ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg` : 'gdc-tank-photo.jpg');
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
    facilities: isUrdu ? 'سہولیات' : 'Facilities',
    sports: t('sports')
  };

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 z-0">
          <img src={campusImg} alt="Campus" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-950 opacity-90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">{t('campusPhotoGallery')}</h1>
          <p className="text-teal-300 text-sm sm:text-base font-semibold max-w-xl mx-auto uppercase tracking-wider mb-6">
            {t('galleryBannerSub')}
          </p>

          {/* Visitor Upload Instructions */}
          <p className="text-slate-300 text-sm max-w-lg mx-auto mb-5 leading-relaxed">
            {isUrdu
              ? 'اپنی کیمپس کی یادیں اور تصاویر کالج انتظامیہ کے ساتھ شیئر کریں۔ اپ لوڈ کردہ میڈیا ایڈمن کی منظوری کے بعد گیلری میں شائع ہوگا۔'
              : 'Share your campus memories and photos with the college administration. Uploads will appear in the public gallery after admin approval.'}
          </p>

          {/* Single Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-all text-sm uppercase tracking-wide cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>{isUrdu ? 'تصویر یا ویڈیو اپ لوڈ کریں' : 'Upload Media / Share with College'}</span>
          </button>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Category Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <ImageIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{isUrdu ? 'منظور شدہ تصاویر و ویڈیوز' : 'Approved Campus Media'}</span>
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-200/70 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-300/60 dark:border-slate-800">
              {['all', 'facilities', 'sports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Items Grid */}
          {galleryError ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-semibold text-rose-700">
              {galleryError}
            </p>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm space-y-3 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                {isUrdu ? 'گیلری کی کوئی آئٹم موجود نہیں' : 'No gallery items uploaded yet.'}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {isUrdu
                  ? 'ایڈمن کی منظوری کے بعد کیمپس کے بہترین لمحات یہاں ظاہر ہوں گے۔'
                  : 'Approved campus moments will appear here. Use the Upload button above to share your photos and videos with the admin.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-950">
                      {item.type === 'video' ? (
                        <video
                          src={item.mediaUrl}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = campusImg;
                          }}
                        />
                      )}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg">
                            <Video className="w-6 h-6 fill-current" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-teal-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4">
                    <span className="text-[11px] font-semibold text-slate-400">
                      By: {item.uploadedBy}
                    </span>
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isUrdu ? 'دیکھیں' : 'View Full'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* USER UPLOAD MEDIA MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {isUrdu ? 'میڈیا اپ لوڈ کریں' : 'Upload Photo / Video'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isUrdu ? 'ایڈمن کی منظوری کے بعد گیلری میں شائع ہوگی' : 'Submissions will be displayed after Admin Approval.'}
                </p>
              </div>
            </div>

            {uploadSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base">Success!</h4>
                <p className="text-xs leading-relaxed">Your media has been successfully submitted to the college admin. It will be reviewed and published in the public gallery shortly after approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitMedia} className="space-y-4">
                {uploadError && (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                    {uploadError}
                  </p>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    maxLength={180}
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter a descriptive title..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="facilities">Facilities</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                {/* File Browse Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Photo / Video File</label>
                  <label
                    htmlFor="gallery-file-upload"
                    className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      uploadFile
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-950/20'
                    } py-5 px-4`}
                  >
                    {uploadFile ? (
                      <div className="text-center space-y-1">
                        {uploadFile.type.startsWith('video/') ? (
                          <Video className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
                        )}
                        <p className="text-xs font-bold text-teal-700 dark:text-teal-300 truncate max-w-xs">{uploadFile.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {uploadFile.size > 1024 * 1024
                            ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`
                            : `${Math.round(uploadFile.size / 1024)} KB`}
                          {' • '}{uploadFile.type.startsWith('video/') ? 'Video' : 'Image'}
                        </p>
                        <p className="text-[10px] text-teal-500 font-semibold">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <span className="text-teal-600 dark:text-teal-400 font-bold">Click to browse</span> or drag & drop
                        </p>
                        <p className="text-[10px] text-slate-400">Supported images and videos (max 10 MB)</p>
                      </div>
                    )}
                    <input
                      id="gallery-file-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/quicktime,video/webm,video/x-m4v,video/ogg,video/x-msvideo"
                      required
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Your Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder="Enter your name or student ID..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    placeholder="Add a brief caption or context..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><Upload className="w-3.5 h-3.5" /> Submit for Approval</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-slate-950/60 p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-h-[70vh] flex items-center justify-center bg-black">
              {selectedImage.type === 'video' ? (
                <video src={selectedImage.mediaUrl} controls autoPlay className="max-h-[70vh] w-full object-contain" />
              ) : (
                <img src={selectedImage.image} alt={selectedImage.title} className="max-h-[70vh] w-full object-contain" />
              )}
            </div>

            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div>
                <h3 className="text-lg font-bold font-serif">{selectedImage.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedImage.desc}</p>
              </div>
              <button
                onClick={() => handleDownload(
                  selectedImage.type === 'video' ? selectedImage.mediaUrl : selectedImage.image,
                  selectedImage.title,
                  selectedImage.fileName
                )}
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Media</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
