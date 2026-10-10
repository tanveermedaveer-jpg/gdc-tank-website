import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRequest, getAdminSessionUsername, signOutAdmin } from '../lib/adminApi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('admissions');
  const [data, setData] = useState({
    username: getAdminSessionUsername(),
    admissions: [],
    gallery: [],
    faculty: [],
    circulars: [],
    settings: {}
  });

  useEffect(() => {
    let isMounted = true;
    adminRequest('admin.bootstrap')
      .then(res => {
        if (isMounted && res) {
          setData(prev => ({ ...prev, ...res }));
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Admin Dashboard Load Error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load data');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleLogout = () => {
    signOutAdmin();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f8', fontFamily: 'sans-serif' }}>
        <h2>ایڈمن ڈیش بورڈ لوڈ ہو رہا ہے، براہ کرم انتظار کریں...</h2>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#0f172a', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '30px', color: '#38bdf8' }}>کالج ایڈمن پینل</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '12px 15px', cursor: 'pointer', background: activeTab === 'admissions' ? '#1e293b' : 'transparent', borderRadius: '6px', marginBottom: '8px' }} onClick={() => setActiveTab('admissions')}>
              ادارہ جاتی داخلے (Admissions)
            </li>
            <li style={{ padding: '12px 15px', cursor: 'pointer', background: activeTab === 'gallery' ? '#1e293b' : 'transparent', borderRadius: '6px', marginBottom: '8px' }} onClick={() => setActiveTab('gallery')}>
              فوٹو گیلری (Gallery)
            </li>
            <li style={{ padding: '12px 15px', cursor: 'pointer', background: activeTab === 'faculty' ? '#1e293b' : 'transparent', borderRadius: '6px', marginBottom: '8px' }} onClick={() => setActiveTab('faculty')}>
              فیکلٹی ممبران (Faculty)
            </li>
            <li style={{ padding: '12px 15px', cursor: 'pointer', background: activeTab === 'circulars' ? '#1e293b' : 'transparent', borderRadius: '6px', marginBottom: '8px' }} onClick={() => setActiveTab('circulars')}>
              نوٹسز اور سرکولرز (Notices)
            </li>
          </ul>
        </div>
        <div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            لاگ آؤٹ (Logout)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>خوش آمدید، {data.username}</h1>
          <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>گوگل شیٹس کنیکتد</span>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
            خرابی پیش آئی: {error}
          </div>
        )}

        {/* Admissions Tab */}
        {activeTab === 'admissions' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>تمام داخلہ فارمز ({Array.isArray(data.admissions) ? data.admissions.length : 0})</h3>
            {Array.isArray(data.admissions) && data.admissions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e1' }}>Student ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e1' }}>Name</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e1' }}>Father Name</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e1' }}>Program</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e1' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.admissions.map((adm, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}>{adm[0] || adm.regId || adm.student_id || '-'}</td>
                      <td style={{ padding: '10px' }}>{adm[1] || adm.fullName || adm.name || '-'}</td>
                      <td style={{ padding: '10px' }}>{adm[2] || adm.fatherName || '-'}</td>
                      <td style={{ padding: '10px' }}>{adm[10] || adm.program || '-'}</td>
                      <td style={{ padding: '10px' }}>{adm[28] || adm.status || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#64748b', marginTop: '10px' }}>ابھی تک کوئی داخلہ فارم جمع نہیں ہوا یا گوگل شیٹس سے ڈیٹا لوڈ ہو رہا ہے۔</p>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>فوٹو گیلری ({Array.isArray(data.gallery) ? data.gallery.length : 0})</h3>
            <p style={{ color: '#64748b', marginTop: '10px' }}>گیلری کا ڈیٹا یہاں ظاہر ہوگا۔</p>
          </div>
        )}

        {/* Faculty Tab */}
        {activeTab === 'faculty' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>فیکلٹی ممبران ({Array.isArray(data.faculty) ? data.faculty.length : 0})</h3>
            <p style={{ color: '#64748b', marginTop: '10px' }}>فیکلٹی کا ڈیٹا یہاں ظاہر ہوگا۔</p>
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === 'circulars' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>نوٹسز اور سرکولرز ({Array.isArray(data.circulars) ? data.circulars.length : 0})</h3>
            <p style={{ color: '#64748b', marginTop: '10px' }}>نوٹسز کا ڈیٹا یہاں ظاہر ہوگا۔</p>
          </div>
        )}
      </div>
    </div>
  );
}
