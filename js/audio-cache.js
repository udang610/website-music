// =====================================================================
// Lullaby Smart Audio Cache Engine (IndexedDB Local Storage)
// Menyimpan audio penuh di memori internal HP / browser untuk pemutaran
// instan 0.05 detik (Zero Buffering) tanpa kuota internet & offline ready!
// =====================================================================

(function () {
  const DB_NAME = 'LullabyAudioDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'cached_tracks';

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('[AudioCache] IndexedDB not supported by this browser.');
        return resolve(null);
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
          store.createIndex('trackId', 'trackId', { unique: false });
          store.createIndex('savedAt', 'savedAt', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => {
        console.warn('[AudioCache] Error opening IndexedDB:', e);
        resolve(null);
      };
    });
    return dbPromise;
  }

  function getCacheKey(track) {
    if (!track) return '';
    if (track.id) return String(track.id).trim().toLowerCase();
    const t = (track.title || '').trim().toLowerCase();
    const a = (track.artist || '').trim().toLowerCase();
    return `${t}__${a}`.replace(/[^a-z0-9_]/g, '');
  }

  // Simpan Blob Audio ke IndexedDB
  async function saveTrackAudio(track, blob, customMeta = {}) {
    if (!track || !blob) return false;
    const db = await openDB();
    if (!db) return false;

    const cacheKey = getCacheKey(track);
    if (!cacheKey) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          cacheKey: cacheKey,
          trackId: track.id || cacheKey,
          title: track.title || 'Unknown Title',
          artist: track.artist || 'Unknown Artist',
          album: track.album || '',
          cover: track.cover || '',
          duration: track.duration || '',
          audioBlob: blob,
          mimeType: blob.type || 'audio/mpeg',
          sizeBytes: blob.size,
          savedAt: Date.now(),
          ...customMeta
        };

        const req = store.put(record);
        req.onsuccess = () => {
          console.log(`⚡ [AudioCache] Berhasil menyimpan "${track.title}" (${(blob.size / (1024 * 1024)).toFixed(2)} MB)`);
          notifyCacheChanged(cacheKey, true);
          resolve(true);
        };
        req.onerror = (e) => {
          console.warn('[AudioCache] Gagal menyimpan audio ke IndexedDB:', e);
          resolve(false);
        };
      } catch (err) {
        console.warn('[AudioCache] Transaction error:', err);
        resolve(false);
      }
    });
  }

  // Ambil Audio Blob dari IndexedDB
  async function getTrackAudio(track) {
    if (!track) return null;
    const db = await openDB();
    if (!db) return null;

    const cacheKey = getCacheKey(track);
    if (!cacheKey) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cacheKey);

        req.onsuccess = () => {
          const record = req.result;
          if (record && record.audioBlob) {
            const objectUrl = URL.createObjectURL(record.audioBlob);
            resolve({
              ...record,
              objectUrl: objectUrl
            });
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  // Cek apakah track sudah ada di cache
  async function hasTrackAudio(track) {
    if (!track) return false;
    const db = await openDB();
    if (!db) return false;
    const cacheKey = getCacheKey(track);
    if (!cacheKey) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cacheKey);
        req.onsuccess = () => resolve(Boolean(req.result && req.result.audioBlob));
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  // Unduh audio dari URL yang valid dan simpan ke IndexedDB
  async function downloadAndCacheUrl(track, audioUrl) {
    if (!track || !audioUrl) return false;
    if (audioUrl.startsWith('blob:')) return false;

    try {
      console.log(`[AudioCache] Mengunduh stream audio "${track.title}"...`);
      const resp = await fetch(audioUrl, { mode: 'cors' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      if (blob.size < 50000) {
        // File terlalu kecil atau bukan audio penuh
        return false;
      }
      return await saveTrackAudio(track, blob);
    } catch (e) {
      console.warn(`[AudioCache] Gagal mengunduh audio "${track.title}":`, e);
      return false;
    }
  }

  // Hapus track dari cache
  async function deleteTrackAudio(track) {
    if (!track) return false;
    const db = await openDB();
    if (!db) return false;
    const cacheKey = getCacheKey(track);
    if (!cacheKey) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(cacheKey);
        req.onsuccess = () => {
          notifyCacheChanged(cacheKey, false);
          resolve(true);
        };
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  // Dapatkan seluruh daftar ID track yang tersimpan
  async function getAllCachedTrackKeys() {
    const db = await openDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  // Listeners untuk perubahan cache (memperbarui badge UI)
  const listeners = new Set();
  function onCacheChange(fn) {
    if (typeof fn === 'function') listeners.add(fn);
  }
  function notifyCacheChanged(key, isCached) {
    listeners.forEach((fn) => {
      try { fn(key, isCached); } catch (e) {}
    });
  }

  window.AudioCache = {
    saveTrackAudio,
    getTrackAudio,
    hasTrackAudio,
    downloadAndCacheUrl,
    deleteTrackAudio,
    getAllCachedTrackKeys,
    getCacheKey,
    onCacheChange
  };

  console.log('⚡ [Lullaby] Smart Audio Cache Engine initialized.');
})();
