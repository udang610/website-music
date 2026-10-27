// ================= APPLICATION ENTRY POINT & LIFECYCLE =================

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  // Check persisted login / unlock session
  try {
    if (localStorage.getItem('romantic_music_unlocked') === 'true') {
      const lock = document.getElementById('lockScreen');
      if (lock) {
        lock.style.display = 'none';
        lock.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      }
    }
  } catch (e) { }

  // Pulihkan identitas akun aktif (Dhafin / Nadia)
  const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
  if (currentAcc && typeof applyAccountIdentity === 'function') {
    applyAccountIdentity(currentAcc);
  }

  hydrateUI();
  navigateTo('home');

  // Pulihkan history lagu terakhir
  const restored = restoreLastPlayedTrack(false);
  if (!restored && state.playlists && state.playlists[0] && state.playlists[0].tracks && state.playlists[0].tracks.length > 0) {
    loadTrack(0, false, state.playlists[0].id);
  }

  renderJamChat();
  hydrateItunesCovers();
  checkUrlPlayParam();
  initSupabaseSync();
  initJamRoomSession();
  if (typeof updateGalleryFrameTypeButtons === 'function') {
    updateGalleryFrameTypeButtons();
  }
  if (typeof updateMiniJamStatusCard === 'function') {
    updateMiniJamStatusCard();
  }

  // Register Service Worker for PWA & TWA Android APK
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('[PWA] Service Worker active:', reg.scope);
    }).catch((err) => {
      console.warn('[PWA] Service Worker note:', err);
    });
  }
});
