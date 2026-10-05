import { getApp, getApps, initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyALahSZsbze9tUoHLu4h5lGsn2VtvJ3Yf4',
  authDomain: 'degree-college-tank.firebaseapp.com',
  projectId: 'degree-college-tank',
  storageBucket: 'degree-college-tank.firebasestorage.app',
  messagingSenderId: '145322900505',
  appId: '1:145322900505:web:9a59fdd9b031ead2e9be88',
  measurementId: 'G-7R8LHDCK8Z'
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
