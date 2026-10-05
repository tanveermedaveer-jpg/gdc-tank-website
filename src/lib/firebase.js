const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const startSubscription = (createListener, onError) => {
  let isActive = true;
  let unsubscribe = () => {};

  if (!isFirebaseConfigured) {
    onError(new Error('Firebase Firestore is not configured.'));
    return () => {};
  }

  Promise.all([import('firebase/app'), import('firebase/firestore')])
    .then(([appSdk, firestoreSdk]) => {
      if (!isActive) return;
      const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(firebaseConfig);
      unsubscribe = createListener(firestoreSdk.getFirestore(app), firestoreSdk);
    })
    .catch((error) => {
      if (isActive) onError(error);
    });

  return () => {
    isActive = false;
    unsubscribe();
  };
};

export const subscribeApprovedGallery = (onItems, onError) =>
  startSubscription((firestore, sdk) => sdk.onSnapshot(
    sdk.query(sdk.collection(firestore, 'galleryMedia'), sdk.where('status', '==', 'approved')),
    (snapshot) => {
      onItems(snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))));
    },
    onError
  ), onError);

export const subscribeHomeContent = (onContent, onError) =>
  startSubscription((firestore, sdk) => sdk.onSnapshot(
    sdk.doc(firestore, 'siteContent', 'home'),
    (snapshot) => onContent(snapshot.exists() ? snapshot.data() : {}),
    onError
  ), onError);
