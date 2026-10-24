// ================= TRACK ACTIONS & SHARING =================

// ================= LIKE & DELETE ACTIONS =================
function toggleLikeTrack(idx) {
  const tracks = getActiveTracks();
  const track = tracks[idx];
  if (!track) return;

  const newLiked = !track.liked;
  track.liked = newLiked;

  // If in virtual Liked Songs playlist, update the original track across playlists
  if (state.activePlaylistId === 'pl-liked') {
    (state.playlists || []).forEach(pl => {
      (pl.tracks || []).forEach(t => {
        if ((t.id && t.id === track.id) || (t.title === track.title && t.artist === track.artist)) {
          t.liked = newLiked;
        }
      });
    });
  }

  saveState();
  if (currentView === 'playlist') {
    hydrateUI();
    renderTracklist();
  }
  if (idx === currentIndex) updateActiveTrackUI();
  renderHomeFavoritesList();
}

function toggleLikeCurrent() {
  const tracks = getActiveTracks();
  if (!tracks[currentIndex]) return;
  toggleLikeTrack(currentIndex);
  sendFloatingReaction('❤️', false);
}

function deleteTrack(idx) {
  const tracks = getActiveTracks();
  if (state.activePlaylistId === 'pl-liked') {
    // Un-like rather than destroy track when deleted from Liked Songs
    const track = tracks[idx];
    if (track) {
      toggleLikeTrack(idx);
      showToastNotification(`Lagu "${track.title}" dihapus dari Liked Songs`, 'info');
    }
    return;
  }

  if (tracks.length <= 1) {
    showToastNotification('Minimal harus ada 1 lagu di dalam playlist ya!', 'error');
    return;
  }
  const deleted = tracks.splice(idx, 1);
  if (currentIndex >= tracks.length) currentIndex = 0;
  saveState();
  hydrateUI();
  loadTrack(currentIndex, isPlaying);
  showToastNotification(`Lagu "${deleted[0]?.title}" dihapus`, 'info');
}

function switchPlaylistFilter(mode) {
  currentFilter = mode;
  const label = document.getElementById('filterStatusLabel');
  if (label) label.textContent = mode === 'liked' ? 'Lagu Favorit' : 'Semua Lagu';
  const libBtnLiked = document.getElementById('libBtnLiked');
  if (libBtnLiked) libBtnLiked.classList.toggle('border-[#3B2328]', mode === 'liked');
  if (currentView !== 'playlist') navigateTo('playlist');
  renderTracklist();
}

function openEditCurrentMemory() {
  const tracks = getActiveTracks();
  const current = tracks[currentIndex];
  if (!current) return;
  const modal = document.getElementById('memoryNoteModal');
  const input = document.getElementById('memoryNoteInput');
  const title = document.getElementById('memoryNoteTrackTitle');
  if (!modal || !input) return;
  if (title) title.textContent = `${current.title} — ${current.artist || ''}`;
  input.value = current.memory || '';
  updateMemoryNoteCounter();
  input.oninput = updateMemoryNoteCounter;
  input.onkeydown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveMemoryNote();
    if (e.key === 'Escape') closeMemoryNoteModal();
  };
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => input.focus(), 50);
}

function updateMemoryNoteCounter() {
  const input = document.getElementById('memoryNoteInput');
  const counter = document.getElementById('memoryNoteCounter');
  if (input && counter) counter.textContent = `${input.value.length}/${input.maxLength || 240}`;
}

function closeMemoryNoteModal() {
  const modal = document.getElementById('memoryNoteModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function saveMemoryNote() {
  const tracks = getActiveTracks();
  const current = tracks[currentIndex];
  const input = document.getElementById('memoryNoteInput');
  if (!current || !input) return closeMemoryNoteModal();
  const newMemory = input.value.trim();
  current.memory = newMemory;
  // Samakan catatan untuk lagu yang sama di playlist lain (mis. Liked Songs)
  (state.playlists || []).forEach(pl => (pl.tracks || []).forEach(t => {
    if (t !== current && t.id && t.id === current.id) t.memory = newMemory;
  }));
  saveState();
  updateActiveTrackUI();
  if (currentView === 'playlist') renderTracklist();
  closeMemoryNoteModal();
  showToastNotification(newMemory ? 'Sweet Memory Note tersimpan 💕' : 'Catatan dihapus', 'success');
}

// Render Sweet Memory Note (panel kanan + mobile) dengan empty state bila belum diisi
function renderMemoryNote(track) {
  const memory = (track && track.memory ? track.memory : '').trim();
  const textEl = document.getElementById('rightTrackMemory');
  const emptyEl = document.getElementById('rightTrackMemoryEmpty');
  if (textEl) {
    textEl.textContent = memory ? `"${memory}"` : '';
    textEl.classList.toggle('hidden', !memory);
  }
  if (emptyEl) emptyEl.classList.toggle('hidden', !!memory);

  const mobMemory = document.getElementById('mobileTrackMemory');
  if (mobMemory) {
    mobMemory.textContent = memory ? `"${memory}"` : '✍️ Ketuk untuk menulis kenangan lagu ini';
  }
}


// ================= DIRECT MP3 DOWNLOAD ENGINE =================
async function downloadTrackByIdx(index) {
  const tracks = getActiveTracks();
  const track = tracks[index];
  if (!track) {
    showToastNotification('Data lagu tidak ditemukan!', 'error');
    return;
  }
  downloadDirectSong(track.title, track.artist, track.audioUrl, track.youtubeId);
}

async function downloadDirectSong(title, artist, audioUrl, youtubeId) {
  showToastNotification(`Mempersiapkan unduhan "${title}"...`, 'info');
  const safeFilename = `${title} - ${artist}`.replace(/[/\\?%*:|"<>]/g, '_') + '.mp3';

  if (audioUrl && (audioUrl.startsWith('blob:') || audioUrl.startsWith('data:') || audioUrl.startsWith('audio/'))) {
    triggerBrowserDownload(audioUrl, safeFilename);
    showToastNotification(`Berhasil mengunduh "${title}"! 💕`, 'success');
    return;
  }

  if (audioUrl && audioUrl.startsWith('http') && !audioUrl.includes('youtube.com')) {
    try {
      const response = await fetch(audioUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        triggerBrowserDownload(objectUrl, safeFilename);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 20000);
        showToastNotification(`Lagu "${title}" tersimpan! 💕`, 'success');
        return;
      }
    } catch (e) {
      // fallback
    }
  }

  if (youtubeId) {
    const ytUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(ytUrl, '_blank');
    showToastNotification(`Membuka video resmi "${title}" di YouTube!`, 'info');
  } else if (audioUrl) {
    triggerBrowserDownload(audioUrl, safeFilename, true);
  }
}

function triggerBrowserDownload(url, filename, isExternal = false) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  if (isExternal) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function downloadCurrentTrack() {
  downloadTrackByIdx(currentIndex);
}


// ================= SHARE SONG FEATURE =================
let currentSharingTrack = null;

function findTrackByIdOrIdx(identifier) {
  const activeTracks = getActiveTracks();
  if (identifier === undefined || identifier === null) return activeTracks[currentIndex] || null;

  if (typeof identifier === 'number' || (!isNaN(identifier) && activeTracks[parseInt(identifier, 10)])) {
    const idx = parseInt(identifier, 10);
    if (activeTracks[idx]) return activeTracks[idx];
  }

  const strId = String(identifier).toLowerCase().trim();
  let found = activeTracks.find(t => (t.id && t.id.toLowerCase() === strId) || (t.title && t.title.toLowerCase().trim() === strId));
  if (found) return found;

  for (const pl of state.playlists) {
    found = pl.tracks.find(t => (t.id && t.id.toLowerCase() === strId) || (t.title && t.title.toLowerCase().trim() === strId));
    if (found) return found;
  }
  return activeTracks[currentIndex] || null;
}

function openShareSongModal(trackIdentifier) {
  const track = findTrackByIdOrIdx(trackIdentifier);
  if (!track) return;
  currentSharingTrack = track;

  const modal = document.getElementById('shareSongModal');
  const cover = document.getElementById('shareTrackCover');
  const title = document.getElementById('shareTrackTitle');
  const artist = document.getElementById('shareTrackArtist');
  const memory = document.getElementById('shareTrackMemory');
  const linkInput = document.getElementById('shareLinkInput');
  const waBtn = document.getElementById('shareWhatsAppBtn');

  if (cover) cover.src = track.cover;
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;
  if (memory) memory.textContent = `"${track.memory || 'Lagu spesial untuk kita berdua ✦'}"`;

  const baseUrl = window.location.origin + window.location.pathname;
  const shareParam = encodeURIComponent(track.id || track.title);
  const directLink = `${baseUrl}?play=${shareParam}`;
  if (linkInput) linkInput.value = directLink;

  const waText = encodeURIComponent(
    `Hai, dengerin lagu ini yuk di space musik kita:\n\n` +
    `🎵 *${track.title}* - ${track.artist}\n` +
    `✦ "${track.memory || 'Setiap nada mengingatkan momen manis bersama'}"\n\n` +
    `Buka & dengarkan langsung di sini:\n${directLink}`
  );
  if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function openShareSongModalCurrent() {
  const tracks = getActiveTracks();
  if (!tracks.length) return;
  openShareSongModal(tracks[currentIndex]?.id || currentIndex);
}

function closeShareSongModal() {
  const modal = document.getElementById('shareSongModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function copyShareLink() {
  const linkInput = document.getElementById('shareLinkInput');
  if (!linkInput) return;
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value).then(() => {
    showToastNotification('Link lagu disalin ke clipboard! ✦', 'success');
  }).catch(() => {
    document.execCommand('copy');
    showToastNotification('Link disalin ke clipboard! ✦', 'success');
  });
}

function copyRomanticQuote() {
  if (!currentSharingTrack) return;
  const track = currentSharingTrack;
  const baseUrl = window.location.origin + window.location.pathname;
  const shareParam = encodeURIComponent(track.id || track.title);
  const directLink = `${baseUrl}?play=${shareParam}`;

  const quoteText = `"${track.memory || 'Lagu indah untuk kita berdua ✦'}"\n— ${track.title} by ${track.artist}\n${directLink}`;
  navigator.clipboard.writeText(quoteText).then(() => {
    showToastNotification('Catatan & judul lagu disalin ke clipboard! ✦', 'success');
  }).catch(() => {
    showToastNotification('Teks berhasil disalin!', 'success');
  });
}


// ================= ADD SONG TO PLAYLIST FEATURE =================
let currentTrackForPlaylist = null;

function openAddToPlaylistModal(trackIdentifier) {
  let track = (typeof trackIdentifier === 'object' && trackIdentifier !== null)
    ? trackIdentifier
    : findTrackByIdOrIdx(trackIdentifier);

  if (!track && typeof getPlayingTrack === 'function') {
    track = getPlayingTrack();
  }
  if (!track) return;
  currentTrackForPlaylist = track;

  const modal = document.getElementById('addToPlaylistModal');
  const cover = document.getElementById('addToPlTrackCover');
  const title = document.getElementById('addToPlTrackTitle');
  const artist = document.getElementById('addToPlTrackArtist');

  if (cover) cover.src = track.cover || 'images/covers/those_eyes.jpg';
  if (title) title.textContent = track.title || 'Lagu';
  if (artist) artist.textContent = track.artist || '';

  renderAddToPlaylistItems();

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function openAddToPlaylistModalCurrent() {
  if (typeof getPlayingTrack === 'function') {
    const playing = getPlayingTrack();
    if (playing) {
      openAddToPlaylistModal(playing);
      return;
    }
  }
  const tracks = getActiveTracks();
  if (!tracks.length) return;
  openAddToPlaylistModal(tracks[currentIndex]?.id || currentIndex);
}

function closeAddToPlaylistModal() {
  const modal = document.getElementById('addToPlaylistModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderAddToPlaylistItems() {
  const container = document.getElementById('addToPlaylistItemsContainer');
  if (!container || !currentTrackForPlaylist) return;

  const track = currentTrackForPlaylist;
  const likedTracks = (typeof getAllLikedTracks === 'function') ? getAllLikedTracks() : [];
  const isAlreadyInLiked = likedTracks.some(t =>
    (t.id && track.id && t.id === track.id) ||
    (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
  );

  const regularHtml = state.playlists.map(pl => {
    const hasTrack = Array.isArray(pl.tracks) && pl.tracks.some(t =>
      (t.id && track.id && t.id === track.id) ||
      (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
    );

    return `
      <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9FA] hover:bg-[#FFE4E9]/40 border border-[#FFD2DC] transition">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${pl.cover || 'images/spotify_covers/jakarta.jpg'}" class="w-10 h-10 rounded-xl object-cover border border-[#FFD2DC] shrink-0 shadow-xs" alt="${pl.title}" />
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-[#3B2328] truncate">${pl.title}</h5>
            <p class="text-[11px] text-[#9A737C]">${(pl.tracks || []).length} lagu</p>
          </div>
        </div>
        <div>
          ${hasTrack ? `
            <span class="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-xs transition">
              <i class="fa-solid fa-check text-xs text-emerald-600"></i> Sudah Ada
            </span>
          ` : `
            <button type="button" onclick="event.stopPropagation(); addTrackToSelectedPlaylist('${pl.id}')" class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FA8072] to-[#E85D75] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95">
              <i class="fa-solid fa-plus text-xs"></i> Tambahkan
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  const likedCardHtml = `
    <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E9]/50 border border-[#FFB6C1] transition mb-2">
      <div class="flex items-center gap-3 min-w-0">
        <img src="images/spotify_covers/liked_cover.svg" class="w-10 h-10 rounded-xl object-cover border border-[#FFD2DC] shrink-0 shadow-xs" alt="Liked Songs" />
        <div class="min-w-0">
          <h5 class="text-xs font-bold text-[#3B2328] truncate">Liked Songs ❤️</h5>
          <p class="text-[11px] text-[#FA8072] font-semibold">${likedTracks.length} lagu favorit</p>
        </div>
      </div>
      <div>
        ${isAlreadyInLiked ? `
          <span class="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-xs transition">
            <i class="fa-solid fa-check text-xs text-emerald-600"></i> Favorit
          </span>
        ` : `
          <button type="button" onclick="event.stopPropagation(); addTrackToSelectedPlaylist('pl-liked')" class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FA8072] to-[#E85D75] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95">
            <i class="fa-solid fa-heart text-xs"></i> Tambahkan
          </button>
        `}
      </div>
    </div>
  `;

  container.innerHTML = likedCardHtml + regularHtml;
}

function addTrackToSelectedPlaylist(targetPlId) {
  if (!currentTrackForPlaylist) return;

  const track = currentTrackForPlaylist;

  // Handle adding to Liked Songs
  if (targetPlId === 'pl-liked') {
    const defaultPl = state.playlists.find(p => p.id === 'pl-ours') || state.playlists[0];
    if (defaultPl) {
      if (!Array.isArray(defaultPl.tracks)) defaultPl.tracks = [];
      const already = defaultPl.tracks.find(t =>
        (t.id && track.id && t.id === track.id) ||
        (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
      );
      if (already) {
        already.liked = true;
      } else {
        defaultPl.tracks.push({
          ...track,
          id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          liked: true,
          dateAdded: 'Baru saja'
        });
      }
      saveState();
      triggerSupabaseSync();
      if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
      if (typeof renderHomeFavoritesList === 'function') renderHomeFavoritesList();
      if (state.activePlaylistId === 'pl-liked' && typeof renderTracklist === 'function') renderTracklist();
      renderAddToPlaylistItems();
      showToastNotification(`Lagu '${track.title}' ditambahkan ke Liked Songs! ❤️`, 'success');
      return;
    }
  }

  const pl = state.playlists.find(p => p.id === targetPlId);
  if (!pl) return;

  if (!Array.isArray(pl.tracks)) {
    pl.tracks = [];
  }

  const alreadyIn = pl.tracks.some(t =>
    (t.id && track.id && t.id === track.id) ||
    (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
  );

  if (alreadyIn) {
    showToastNotification(`Lagu '${track.title}' sudah ada di playlist '${pl.title}'`, 'info');
    renderAddToPlaylistItems();
    return;
  }

  const newTrack = {
    ...track,
    id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    dateAdded: 'Baru saja'
  };
  pl.tracks.push(newTrack);
  saveState();
  triggerSupabaseSync();

  if (typeof renderHomePlaylistsGrid === 'function') renderHomePlaylistsGrid();
  if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
  if (state.activePlaylistId === targetPlId) {
    if (typeof renderTracklist === 'function') renderTracklist();
    if (typeof updatePlaylistHeader === 'function') updatePlaylistHeader();
  }

  // Immediately re-render items so button changes to "Sudah Ada"
  renderAddToPlaylistItems();
  showToastNotification(`Lagu '${track.title}' berhasil ditambahkan ke '${pl.title}'! 🎵`, 'success');
}

function openCreatePlaylistFromAddModal() {
  closeAddToPlaylistModal();
  openCreatePlaylistModal();
}

function checkUrlPlayParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const playParam = urlParams.get('play');
  if (!playParam) return;

  const target = decodeURIComponent(playParam).toLowerCase().trim();
  let targetPl = null;
  let targetTrackIdx = -1;

  for (const pl of state.playlists) {
    const idx = pl.tracks.findIndex(t =>
      (t.id && t.id.toLowerCase() === target) ||
      (t.title && t.title.toLowerCase().trim() === target)
    );
    if (idx !== -1) {
      targetPl = pl;
      targetTrackIdx = idx;
      break;
    }
  }

  if (targetPl && targetTrackIdx !== -1) {
    selectPlaylist(targetPl.id);
    setTimeout(() => {
      loadTrack(targetTrackIdx, true);
      const track = targetPl.tracks[targetTrackIdx];
      showToastNotification(`Memutar lagu yang dibagikan: ${track.title} 💕`, 'success');
    }, 400);
  }
}
