const DATABASE_NAME = 'casdct-media-assets';
const STORE_NAME = 'assets';

let databasePromise;

const openDatabase = () => {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support persistent media uploads.'));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open media storage.'));
    request.onblocked = () => reject(new Error('Media storage is blocked by another browser tab.'));
  }).catch((error) => {
    databasePromise = undefined;
    throw error;
  });

  return databasePromise;
};

const runTransaction = async (mode, operation) => {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = operation(store);
    let result;

    if (request) {
      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => reject(request.error || new Error('Unable to access saved media.'));
      transaction.oncomplete = () => resolve(result);
    } else {
      transaction.oncomplete = () => resolve();
    }
    transaction.onabort = () => reject(transaction.error || new Error('Media storage transaction failed.'));
    transaction.onerror = () => reject(transaction.error || new Error('Media storage transaction failed.'));
  });
};

export const saveMediaAsset = (key, file) =>
  runTransaction('readwrite', store => store.put({ key, file }));

export const getMediaAsset = async (key) => {
  const record = await runTransaction('readonly', store => store.get(key));
  return record?.file || null;
};

export const deleteMediaAsset = (key) =>
  runTransaction('readwrite', store => store.delete(key));
