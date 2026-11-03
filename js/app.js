// ================= APPLICATION ENTRY POINT & LIFECYCLE =================

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  // 1. Fast safety dismiss: segera sembunyikan intro loader agar web terbuka kilat
  setTimeout(dismissLoadingScreen, 300);

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
  try {
    const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
    if (currentAcc && typeof applyAccountIdentity === 'function') {
      applyAccountIdentity(currentAcc);
    }
  } catch (e) { }

  try { hydrateUI(); } catch (e) { console.warn('hydrateUI note:', e); }
  try { navigateTo('home'); } catch (e) { console.warn('navigateTo note:', e); }

  // Pulihkan history lagu terakhir
  try {
    const restored = restoreLastPlayedTrack(false);
    if (!restored && state.playlists && state.playlists[0] && state.playlists[0].tracks && state.playlists[0].tracks.length > 0) {
      loadTrack(0, false, state.playlists[0].id);
    }
  } catch (e) { }

  try { renderJamChat(); } catch (e) { }
  try { hydrateItunesCovers(); } catch (e) { }
  try { checkUrlPlayParam(); } catch (e) { }
  try { initSupabaseSync(); } catch (e) { }
  try { initJamRoomSession(); } catch (e) { }
  try {
    if (typeof updateGalleryFrameTypeButtons === 'function') updateGalleryFrameTypeButtons();
    if (typeof updateMiniJamStatusCard === 'function') updateMiniJamStatusCard();
  } catch (e) { }

  // Register Service Worker for PWA & TWA Android APK
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('[PWA] Service Worker active:', reg.scope);
      if (reg) {
        reg.update().catch(() => {});
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New update ready.');
              }
            });
          }
        });
      }
    }).catch((err) => {
      console.warn('[PWA] Service Worker note:', err);
    });
  }

  // Final confirmation to dismiss loading screen
  dismissLoadingScreen();
});

function dismissLoadingScreen() {
  const loader = document.getElementById('appLoadingScreen');
  if (!loader || loader.dataset.dismissed) return;
  loader.dataset.dismissed = 'true';
  loader.classList.add('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    loader.classList.add('hidden');
    loader.style.display = 'none';
  }, 400);
}

// Fallback safety in case DOMContentLoaded has already passed or takes too long
window.addEventListener('load', dismissLoadingScreen, { once: true });
setTimeout(dismissLoadingScreen, 800);
