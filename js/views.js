// ================= VIEWS & NAVIGATION =================

// Fetch HD album covers without touching audio streams
async function hydrateItunesCovers() {
  const tracks = getActiveTracks();
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i];
    // If already has official local cover, preserve it
    if (t.cover && t.cover.startsWith('images/covers/')) continue;

    if (!t.cover || t.cover.includes('images.unsplash.com')) {
      try {
        const q = encodeURIComponent(`${t.title} ${t.artist}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const hit = data.results[0];
          t.cover = hit.artworkUrl100.replace('100x100bb', '1000x1000bb');
        }
      } catch (err) {
        // Fallback remains intact
      }
    }
  }
  saveState();
  if (currentView === 'playlist') renderTracklist();
  updateActiveTrackUI();
}

function hydrateUI() {
  const activePl = getActivePlaylist();
  document.getElementById('heroPlaylistTitle').textContent = activePl.title;
  document.getElementById('rightCanvasPlaylistName').textContent = activePl.title;
  document.getElementById('heroPlaylistDesc').textContent = activePl.desc;
  document.getElementById('heroPlaylistCover').src = activePl.cover;

  document.getElementById('heroCuratorName').textContent = state.yourName;
  document.getElementById('heroCuratorAvatar').src = state.yourAvatar;
  document.getElementById('navAvatarYou').src = state.yourAvatar;
  document.getElementById('navAvatarPartner').src = state.partnerAvatar;

  document.getElementById('miniJamAvatar1').src = state.yourAvatar;
  document.getElementById('miniJamAvatar2').src = state.partnerAvatar;

  const miniPartnerNameEl = document.getElementById('miniPartnerStatusName');
  if (miniPartnerNameEl) miniPartnerNameEl.textContent = state.partnerName;
  if (typeof updateMiniJamStatusCard === 'function') updateMiniJamStatusCard();
  document.getElementById('loveNoteDisplay').textContent = state.loveNote;

  const trackCount = (activePl && activePl.tracks) ? activePl.tracks.length : 0;
  document.getElementById('heroStatsCount').textContent = `${trackCount} songs, about infinite love`;

  // Mobile Top Bar Avatars
  const mobYou = document.getElementById('mobileNavAvatarYou');
  if (mobYou) mobYou.src = state.yourAvatar;
  const mobPartner = document.getElementById('mobileNavAvatarPartner');
  if (mobPartner) mobPartner.src = state.partnerAvatar;

  // Toggle Edit/Delete buttons if on special virtual playlist
  const btnDelete = document.getElementById('btnDeletePlaylist');
  const btnEdit = document.querySelector('button[onclick="openEditPlaylistModal()"]');
  if (btnDelete) {
    btnDelete.style.display = activePl.isLikedSpecial ? 'none' : '';
  }
  if (btnEdit) {
    btnEdit.style.display = activePl.isLikedSpecial ? 'none' : '';
  }

  const coverOverlay = document.getElementById('heroCoverChangeOverlay');
  if (coverOverlay) {
    coverOverlay.style.display = activePl.isLikedSpecial ? 'none' : '';
  }

  renderSidebarPlaylists();
}


// ================= NAVIGATION: HOME <-> PLAYLIST <-> POLAROID =================
function navigateTo(view, playlistId = null) {
  currentView = view;
  if (playlistId) {
    state.activePlaylistId = playlistId;
    saveState();
  }

  const homeView = document.getElementById('homeView');
  const playlistView = document.getElementById('playlistView');
  const polaroidView = document.getElementById('polaroidView');
  const listeningTogetherView = document.getElementById('listeningTogetherView');

  // Sidebar buttons active state
  const btnHome = document.getElementById('sidebarBtnHome');
  const btnPolaroid = document.getElementById('sidebarBtnPolaroid');
  const btnJam = document.getElementById('sidebarBtnJam');

  if (btnHome) {
    if (view === 'home') {
      btnHome.className = 'w-11 h-11 rounded-xl bg-[#FFF0F3] text-[#FA8072] border border-[#FFD2DC] flex items-center justify-center shadow-xs transition';
    } else {
      btnHome.className = 'w-11 h-11 rounded-xl text-[#9A737C] hover:text-[#FA8072] hover:bg-[#FFF5F7] flex items-center justify-center transition';
    }
  }

  if (btnPolaroid) {
    if (view === 'polaroid') {
      btnPolaroid.className = 'w-11 h-11 rounded-xl bg-gradient-to-br from-[#FA8072] to-[#E85D75] text-white flex items-center justify-center shadow-md shadow-[#FA8072]/30 scale-105 transition';
    } else {
      btnPolaroid.className = 'w-11 h-11 rounded-xl bg-[#FFF0F3] border border-[#FFD2DC] flex items-center justify-center text-[#E85D75] hover:bg-[#FFE4E9] hover:scale-105 transition';
    }
  }

  if (btnJam) {
    if (view === 'jam') {
      btnJam.className = 'w-11 h-11 rounded-xl bg-gradient-to-br from-[#FA8072] to-[#E85D75] text-white flex items-center justify-center shadow-md shadow-[#FA8072]/30 scale-105 transition relative';
    } else {
      btnJam.className = 'w-11 h-11 rounded-xl bg-[#FFF0F3] border border-[#FFD2DC] flex items-center justify-center text-[#FA8072] hover:bg-[#FFE4E9] hover:scale-105 transition relative';
    }
  }

  const libBtnLiked = document.getElementById('libBtnLiked');
  if (libBtnLiked) {
    const isLikedActive = state.activePlaylistId === 'pl-liked' && view === 'playlist';
    if (isLikedActive) {
      libBtnLiked.classList.add('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.remove('border-[#FFD2DC]');
    } else {
      libBtnLiked.classList.remove('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.add('border-[#FFD2DC]');
    }
  }

  const allViews = [homeView, playlistView, polaroidView, listeningTogetherView].filter(Boolean);
  allViews.forEach(v => {
    v.classList.add('hidden');
    v.classList.remove('view-fade-enter');
  });

  let activeViewEl = null;
  if (view === 'home') {
    activeViewEl = homeView;
    renderHomeView();
  } else if (view === 'polaroid') {
    activeViewEl = polaroidView;
    renderPolaroidGallery();
  } else if (view === 'jam') {
    activeViewEl = listeningTogetherView;
    updateMainJamView();
  } else {
    activeViewEl = playlistView;
    hydrateUI();
    renderTracklist();
  }

  if (activeViewEl) {
    activeViewEl.classList.remove('hidden');
    activeViewEl.classList.add('view-fade-enter');
  }

  const centerMain = document.getElementById('centerMain');
  if (centerMain) centerMain.scrollTop = 0;

  renderSidebarPlaylists();
}


// ================= RENDER HOME VIEW =================
function renderHomeView() {
  const hr = new Date().getHours();
  let greet = 'Selamat Malam';
  if (hr >= 4 && hr < 11) greet = 'Selamat Pagi';
  else if (hr >= 11 && hr < 15) greet = 'Selamat Siang';
  else if (hr >= 15 && hr < 19) greet = 'Selamat Sore';

  const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
  const userName = currentAcc ? currentAcc.name : (state.yourName || 'Sayang');

  const greetingEl = document.getElementById('homeGreetingTitle');
  if (greetingEl) {
    greetingEl.textContent = `${greet}, ${userName}`;
  }

  renderHomePlaylistsGrid();
  renderHomeFavoritesList();
}

function renderHomePlaylistsGrid() {
  const container = document.getElementById('homePlaylistsGrid');
  if (!container) return;

  const htmlCards = state.playlists.map(pl => {
    const isCurrent = pl.id === state.activePlaylistId;
    return `
      <div onclick="navigateTo('playlist', '${pl.id}')"
        class="playlist-card group bg-white border ${isCurrent ? 'border-[#FA8072] ring-2 ring-[#FA8072]/20' : 'border-[#FFD2DC]'} rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md cursor-pointer transition relative flex flex-col justify-between">
        
        <div>
          <!-- Thumbnail with hover play overlay -->
          <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2 sm:mb-3 bg-[#FFF5F7]">
            <img src="${pl.cover}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${pl.title}" />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FA8072] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                <i class="fa-solid fa-play ml-0.5 text-xs sm:text-base"></i>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="flex items-center justify-between gap-1 mb-1">
            <h3 class="font-extrabold text-[#3B2328] text-xs sm:text-sm md:text-base group-hover:text-[#FA8072] transition truncate">${pl.title}</h3>
            <span class="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#E85D75] shrink-0 border border-[#FFD2DC]">
              ${pl.tracks.length}
            </span>
          </div>
          <p class="text-[11px] sm:text-xs text-[#9A737C] line-clamp-2 leading-relaxed">${pl.desc || 'Playlist kenangan berdua'}</p>
        </div>

        <div class="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#FFF0F3] flex items-center justify-between text-xs">
          <span class="text-[10px] sm:text-[11px] font-semibold text-[#FA8072] flex items-center gap-1">
            <i class="fa-solid fa-headphones text-[10px]"></i> <span class="hidden sm:inline">Buka & </span>Putar
          </span>
          <i class="fa-solid fa-arrow-right text-[#9A737C] group-hover:translate-x-1 transition text-[10px]"></i>
        </div>
      </div>
    `;
  }).join('');

  // Dashed "+ Buat Playlist Baru" Card
  const createCard = `
    <div onclick="openCreatePlaylistModal()"
      class="group border-2 border-dashed border-[#FFD2DC] hover:border-[#FA8072] rounded-2xl p-3 sm:p-6 bg-[#FFF9FA] hover:bg-[#FFF0F3]/60 cursor-pointer transition flex flex-col items-center justify-center text-center min-h-[160px] sm:min-h-[220px]">
      <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#FFD2DC] text-[#FA8072] group-hover:bg-[#FA8072] group-hover:text-white flex items-center justify-center mb-2 sm:mb-3 shadow-xs group-hover:scale-110 transition">
        <i class="fa-solid fa-plus text-base sm:text-xl"></i>
      </div>
      <h4 class="font-extrabold text-[#3B2328] text-xs sm:text-sm group-hover:text-[#FA8072] transition">Buat Playlist Baru</h4>
      <p class="text-[10px] sm:text-xs text-[#9A737C] mt-0.5 sm:mt-1 max-w-[180px] line-clamp-2">Koleksi lagu baru kita</p>
    </div>
  `;

  container.innerHTML = htmlCards + createCard;
}

function renderHomeFavoritesList() {
  const container = document.getElementById('homeFavoritesList');
  if (!container) return;

  const allLiked = [];
  state.playlists.forEach(pl => {
    pl.tracks.forEach(t => {
      if (t.liked) allLiked.push({ ...t, playlistId: pl.id });
    });
  });

  if (allLiked.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-6 text-center rounded-2xl bg-[#FFF5F7] border border-[#FFD2DC] text-[#9A737C] text-xs">
        <i class="fa-solid fa-heart text-[#FA8072] text-xl mb-1.5"></i>
        <p class="font-bold">Belum ada lagu yang ditandai favorit</p>
        <p class="text-[11px] mt-0.5">Klik ikon hati pada lagu apa saja untuk menambahkannya ke sini!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = allLiked.slice(0, 6).map(track => `
    <div class="p-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FFD2DC] flex items-center justify-between gap-3 hover:bg-[#FFE4E9]/60 transition">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${track.cover}" class="w-11 h-11 rounded-xl object-cover border border-[#FFD2DC] shrink-0" alt="${track.title}" />
        <div class="min-w-0">
          <p class="text-xs font-bold text-[#3B2328] truncate">${track.title}</p>
          <p class="text-[11px] text-[#9A737C] truncate">${track.artist} • <span class="text-[#FA8072] font-semibold">${track.duration || 'Full'}</span></p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button onclick="downloadDirectSong('${track.title}', '${track.artist}', '${track.audioUrl || ''}')" class="w-7 h-7 rounded-full bg-white text-[#9A737C] hover:text-[#FA8072] flex items-center justify-center shadow-xs transition" title="Download MP3">
          <i class="fa-solid fa-download text-[11px]"></i>
        </button>
        <button onclick="playTrackByObject(${JSON.stringify(track).replace(/"/g, '&quot;')})" class="w-7 h-7 rounded-full bg-[#FA8072] text-white flex items-center justify-center shadow-xs hover:scale-105 transition" title="Putar">
          <i class="fa-solid fa-play text-[10px] ml-0.5"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Custom Sidebar Tooltip System (Pink-bordered Card with Dark Text)
function showSidebarTooltip(el) {
  // Never show popup tooltip on mobile touch devices
  if (window.innerWidth < 1024) return;
  const tooltip = document.getElementById('sidebarPlaylistTooltip');
  if (!tooltip || !el) return;
  const title = el.getAttribute('data-title') || '';
  const desc = el.getAttribute('data-desc') || '';
  if (!title) return;

  const titleEl = tooltip.querySelector('.tooltip-title');
  const descEl = tooltip.querySelector('.tooltip-desc');
  if (titleEl) titleEl.textContent = title;
  if (descEl) {
    if (desc) {
      descEl.textContent = desc;
      descEl.classList.remove('hidden');
    } else {
      descEl.classList.add('hidden');
    }
  }

  // Calculate position relative to sidebar icon
  const rect = el.getBoundingClientRect();
  tooltip.style.visibility = 'hidden';
  tooltip.classList.remove('hidden');
  const tooltipHeight = tooltip.offsetHeight || 32;
  const top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
  const left = rect.right + 12;

  tooltip.style.top = `${Math.max(10, top)}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.visibility = 'visible';

  requestAnimationFrame(() => {
    tooltip.classList.remove('opacity-0');
  });
}

function hideSidebarTooltip() {
  const tooltip = document.getElementById('sidebarPlaylistTooltip');
  if (!tooltip) return;
  tooltip.classList.add('opacity-0');
  setTimeout(() => {
    if (tooltip.classList.contains('opacity-0')) {
      tooltip.classList.add('hidden');
    }
  }, 150);
}

function renderSidebarPlaylists() {
  const container = document.getElementById('sidebarPlaylistsContainer');
  if (!container) return;

  container.innerHTML = state.playlists.map(pl => {
    const isCurrent = pl.id === state.activePlaylistId && currentView === 'playlist';
    const safeTitle = (pl.title || 'Playlist').replace(/"/g, '&quot;');
    const safeDesc = pl.desc ? pl.desc.replace(/"/g, '&quot;') : (pl.tracks ? pl.tracks.length + ' lagu' : '');
    return `
      <button onclick="navigateTo('playlist', '${pl.id}')"
        data-title="${safeTitle}"
        data-desc="${safeDesc}"
        onmouseenter="showSidebarTooltip(this)"
        onmouseleave="hideSidebarTooltip()"
        class="relative group w-11 h-11 rounded-xl overflow-hidden border-2 ${isCurrent ? 'border-[#FA8072] ring-2 ring-[#FA8072]/30 scale-105' : 'border-[#FFD2DC]'} shadow-xs transition transform hover:scale-105">
        <img src="${pl.cover}" class="w-full h-full object-cover" alt="${safeTitle}" />
      </button>
    `;
  }).join('');

  const libBtnLiked = document.getElementById('libBtnLiked');
  if (libBtnLiked) {
    const isLikedActive = state.activePlaylistId === 'pl-liked' && currentView === 'playlist';
    if (isLikedActive) {
      libBtnLiked.classList.add('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.remove('border-[#FFD2DC]');
    } else {
      libBtnLiked.classList.remove('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.add('border-[#FFD2DC]');
    }
  }
}


// ================= LOCK SCREEN (DUAL ACCOUNTS: DHAFIN 1006 / NADIA 1809) =================
function unlockApp() {
  const input = document.getElementById('pinInput');
  const val = (input?.value || '').trim();
  const matchedAccount = ACCOUNTS[val];

  if (matchedAccount) {
    try {
      localStorage.setItem('romantic_music_unlocked', 'true');
      localStorage.setItem('romantic_current_user', matchedAccount.id);
    } catch (e) { }

    applyAccountIdentity(matchedAccount);

    showToastNotification(`Selamat datang kembali, ${matchedAccount.name}! 💕`, 'success');

    const lock = document.getElementById('lockScreen');
    if (lock) {
      lock.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        lock.classList.add('hidden');
        lock.style.display = 'none';
      }, 450);
    }
  } else {
    const err = document.getElementById('pinError');
    if (err) {
      err.textContent = 'PIN belum tepat. Masukkan PIN Dhafin (1006) atau Nadia (1809) 🥺';
      err.classList.remove('hidden');
    }

    const wrapper = document.getElementById('pinInputWrapper');
    if (wrapper) {
      wrapper.classList.add('animate-shake');
      if (input) {
        input.classList.add('border-rose-400');
        input.classList.remove('border-[#FFD2DC]');
      }
      setTimeout(() => {
        wrapper.classList.remove('animate-shake');
        if (input) {
          input.classList.remove('border-rose-400');
          input.classList.add('border-[#FFD2DC]');
          input.value = '';
          input.focus();
        }
      }, 650);
    }
  }
}

function logOutApp() {
  try {
    localStorage.removeItem('romantic_music_unlocked');
  } catch (e) { }

  if (typeof closeProfileModal === 'function') closeProfileModal();
  if (typeof closeSettingsModal === 'function') closeSettingsModal();
  if (isPlaying) {
    togglePlay();
  }
  const lock = document.getElementById('lockScreen');
  if (lock) {
    lock.style.display = '';
    lock.classList.remove('hidden');
    void lock.offsetWidth;
    lock.classList.remove('opacity-0', 'pointer-events-none');
  }
  const input = document.getElementById('pinInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 200);
  }
  const err = document.getElementById('pinError');
  if (err) err.classList.add('hidden');
  showToastNotification('Berhasil keluar. Masukkan PIN untuk masuk kembali 🔒', 'info');
}

// Auto-submit on 4 digits or Enter key
document.getElementById('pinInput')?.addEventListener('input', (e) => {
  const err = document.getElementById('pinError');
  if (err && !err.classList.contains('hidden')) {
    err.classList.add('hidden');
  }
  if (e.target.value.length === 4) {
    setTimeout(unlockApp, 150);
  }
});

document.getElementById('pinInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlockApp();
});


// ================= RENDER TRACKLIST =================
function renderTracklist() {
  const container = document.getElementById('tracklistContainer');
  const query = (document.getElementById('globalSearchInput')?.value || '').toLowerCase();
  const tracks = getActiveTracks();

  const filtered = tracks
    .map((track, idx) => ({ ...track, originalIndex: idx }))
    .filter(item => {
      if (currentFilter === 'liked' && !item.liked) return false;
      if (query && !item.title.toLowerCase().includes(query) && !item.artist.toLowerCase().includes(query) && !(item.memory || '').toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-[#9A737C]">
        <i class="fa-solid fa-music text-2xl mb-2 text-[#FA8072]"></i>
        <p class="text-sm font-bold">Belum ada lagu di playlist ini</p>
        <button onclick="openAddSongModal()" class="mt-3 px-4 py-2 rounded-full bg-[#FFE4E9] text-[#E85D75] text-xs font-bold hover:bg-[#FA8072] hover:text-white transition shadow-xs">
          + Tambah Lagu Baru
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((track, displayIdx) => {
    const currentPlaying = getPlayingTrack();
    const isPlayingThisPlaylist = currentPlayingPlaylistId === state.activePlaylistId;
    const isCurrent = isPlayingThisPlaylist && Boolean(currentPlaying && (
      (track.id && currentPlaying.id === track.id) ||
      (track.title && currentPlaying.title && track.title.toLowerCase().trim() === currentPlaying.title.toLowerCase().trim())
    ));
    return `
      <div onclick="selectTrackFromList(${track.originalIndex})"
        class="track-row group grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-xl cursor-pointer transition ${isCurrent ? 'bg-[#FFE4E9]/70 text-[#E85D75]' : 'hover:bg-[#FFF5F7]'}">
        
        <!-- # Column / Equalizer -->
        <div class="col-span-1 text-center text-xs font-bold text-[#9A737C]">
          ${isCurrent && isPlaying ? `
            <div class="inline-flex items-end gap-0.5 h-3.5">
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
            </div>
          ` : `
            <span class="track-num-text ${isCurrent ? 'text-[#E85D75] font-extrabold' : ''}">${displayIdx + 1}</span>
            <span class="track-play-hover hidden items-center justify-center text-[#FA8072]">
              <i class="fa-solid fa-play text-xs"></i>
            </span>
          `}
        </div>

        <!-- Title + Thumbnail + Artist -->
        <div class="col-span-6 sm:col-span-4 flex items-center gap-3 min-w-0">
          <img src="${track.cover}" class="w-10 h-10 rounded-lg object-cover border border-[#FFD2DC] shrink-0" alt="${track.title}" />
          <div class="min-w-0">
            <p class="text-sm font-bold truncate ${isCurrent ? 'text-[#E85D75]' : 'text-[#3B2328]'}">${track.title}</p>
            <p class="text-xs text-[#9A737C] truncate">${track.artist} ${track.youtubeId ? '• <span class="text-[10px] text-[#FA8072] font-semibold">Official Audio</span>' : ''}</p>
          </div>
        </div>

        <!-- Sweet Memory Note Column -->
        <div class="hidden sm:block sm:col-span-5 md:col-span-3 min-w-0">
          <p class="text-xs text-[#9A737C] truncate italic" title="${track.memory || ''}">
            ${track.memory || track.album || 'Our special track 💕'}
          </p>
        </div>

        <!-- Date Added -->
        <div class="hidden md:block md:col-span-2 text-xs text-[#9A737C]">
          ${track.dateAdded || 'Recently'}
        </div>

        <!-- Duration + Add to Playlist + Share + Download + Like + Delete -->
        <div class="col-span-5 sm:col-span-2 flex items-center justify-end gap-1.5 text-xs text-[#9A737C]" onclick="event.stopPropagation()">
          <button onclick="openAddToPlaylistModal('${track.id || track.originalIndex}')" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-[#FA8072] hover:scale-110 transition p-1" title="Masukkan ke Playlist">
            <i class="fa-solid fa-folder-plus text-xs"></i>
          </button>
          <button onclick="openShareSongModal('${track.id || track.originalIndex}')" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-[#FA8072] hover:scale-110 transition p-1" title="Bagikan Lagu">
            <i class="fa-solid fa-share-nodes text-xs"></i>
          </button>
          <button onclick="downloadTrackByIdx(${track.originalIndex})" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-[#FA8072] hover:scale-110 transition p-1" title="Download Audio MP3">
            <i class="fa-solid fa-download text-xs"></i>
          </button>
          <button onclick="toggleLikeTrack(${track.originalIndex})" class="hover:scale-110 transition ${track.liked ? 'text-[#FA8072]' : 'opacity-0 group-hover:opacity-100 text-[#9A737C]'} p-1" title="Suka">
            <i class="${track.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <span class="w-8 text-right font-medium text-[11px]">${track.duration || 'Full'}</span>
          <button onclick="deleteTrack(${track.originalIndex})" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-rose-500 transition p-1" title="Hapus lagu">
            <i class="fa-solid fa-trash-can text-[11px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}


// ================= RIGHT PANEL CONTROLS =================
// Panel kanan kini hanya "Now Playing". Listening Together dibuka lewat menu khusus.
function switchRightPanelTab(tab) {
  if (tab === 'jam') navigateTo('jam');
}

function toggleVinylMode() {
  vinylVisible = !vinylVisible;
  const overlay = document.getElementById('vinylOverlay');
  const canvasImg = document.getElementById('rightCanvasImage');
  const btn = document.getElementById('vinylToggleBtn');
  const icon = document.getElementById('vinylToggleIcon');
  const vinylDisc = document.getElementById('vinylDisc');
  const vinylTonearm = document.getElementById('vinylTonearm');

  if (vinylVisible) {
    if (overlay) {
      overlay.classList.remove('vinyl-slide-inactive');
      overlay.classList.add('vinyl-slide-active');
    }
    if (canvasImg) {
      canvasImg.classList.add('canvas-slide-dimmed');
    }
    if (icon) icon.className = 'fa-solid fa-image text-emerald-300 text-xs';
    if (btn) btn.title = 'Beralih ke Canvas View';
  } else {
    if (overlay) {
      overlay.classList.remove('vinyl-slide-active');
      overlay.classList.add('vinyl-slide-inactive');
    }
    if (canvasImg) {
      canvasImg.classList.remove('canvas-slide-dimmed');
    }
    if (icon) icon.className = 'fa-solid fa-record-vinyl text-[#FA8072] text-xs';
    if (btn) btn.title = 'Beralih ke Vinyl View';
  }

  if (vinylDisc) {
    if (isPlaying) {
      vinylDisc.classList.add('playing');
    } else {
      vinylDisc.classList.remove('playing');
    }
  }
  if (vinylTonearm) {
    if (isPlaying) {
      vinylTonearm.classList.add('playing');
    } else {
      vinylTonearm.classList.remove('playing');
    }
  }
}

// Track Extra Actions Drawer (Expandable 3-Dots Menu)
let isMoreActionsTrackOpen = false;

function toggleMoreActionsTrack(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const drawer = document.getElementById('moreActionsDrawer');
  const btn = document.getElementById('btnMoreActionsTrack');
  const icon = document.getElementById('iconMoreActionsTrack');
  if (!drawer) return;

  isMoreActionsTrackOpen = !isMoreActionsTrackOpen;

  if (isMoreActionsTrackOpen) {
    drawer.classList.remove('max-w-0', 'opacity-0', 'pointer-events-none');
    drawer.classList.add('max-w-[130px]', 'opacity-100', 'pointer-events-auto');
    if (btn) {
      btn.classList.add('bg-white/40', 'text-[#FA8072]');
      btn.title = 'Tutup Opsi';
    }
    if (icon) icon.className = 'fa-solid fa-xmark text-xs';
  } else {
    drawer.classList.remove('max-w-[130px]', 'opacity-100', 'pointer-events-auto');
    drawer.classList.add('max-w-0', 'opacity-0', 'pointer-events-none');
    if (btn) {
      btn.classList.remove('bg-white/40', 'text-[#FA8072]');
      btn.title = 'Opsi Lainnya';
    }
    if (icon) icon.className = 'fa-solid fa-ellipsis text-xs';
  }
}

// Auto-close more actions drawer when clicking outside
document.addEventListener('click', (e) => {
  if (!isMoreActionsTrackOpen) return;
  const drawer = document.getElementById('moreActionsDrawer');
  const btn = document.getElementById('btnMoreActionsTrack');
  if (drawer && btn && !drawer.contains(e.target) && !btn.contains(e.target)) {
    isMoreActionsTrackOpen = false;
    drawer.classList.remove('max-w-[130px]', 'opacity-100', 'pointer-events-auto');
    drawer.classList.add('max-w-0', 'opacity-0', 'pointer-events-none');
    btn.classList.remove('bg-white/40', 'text-[#FA8072]');
    btn.title = 'Opsi Lainnya';
    const icon = document.getElementById('iconMoreActionsTrack');
    if (icon) icon.className = 'fa-solid fa-ellipsis text-xs';
  }
});
