// ================= MODALS & POPUPS =================

// ================= FULL MP3 UPLOAD & ITUNES SEARCH =================
function handleFullMp3Upload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const badge = document.getElementById('fullAudioSelectedBadge');
  const badgeName = document.getElementById('fullAudioFileName');
  if (badge && badgeName) {
    badgeName.textContent = file.name;
    badge.classList.remove('hidden');
  }

  const rawName = file.name.replace(/\.[^/.]+$/, '');
  let detectedTitle = rawName;
  let detectedArtist = '';
  if (rawName.includes(' - ')) {
    const parts = rawName.split(' - ');
    detectedArtist = parts[0].trim();
    detectedTitle = parts[1].trim();
  }
  document.getElementById('inputSongTitle').value = detectedTitle;
  document.getElementById('inputSongArtist').value = detectedArtist;

  const reader = new FileReader();
  reader.onload = (e) => {
    const audioData = e.target.result;
    document.getElementById('inputSongAudio').value = audioData;

    const tempAudio = new Audio();
    tempAudio.src = audioData;
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        const durStr = formatTime(tempAudio.duration);
        showToastNotification(`File "${file.name}" siap diputar Full (${durStr})! 💕`, 'success');
      }
    });
  };
  reader.readAsDataURL(file);

  tryAutoFetchCover(detectedTitle, detectedArtist);
}

async function tryAutoFetchCover(title, artist) {
  if (!title) return;
  try {
    const q = encodeURIComponent(`${title} ${artist || ''}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const hit = data.results[0];
      const hdCover = hit.artworkUrl100.replace('100x100bb', '600x600bb');
      document.getElementById('inputSongCover').value = hdCover;
      if (!document.getElementById('inputSongArtist').value && hit.artistName) {
        document.getElementById('inputSongArtist').value = hit.artistName;
      }
    }
  } catch (e) {
    // optional
  }
}

function useDefaultFullAudioStream() {
  const randAudio = defaultFullAudioPool[Math.floor(Math.random() * defaultFullAudioPool.length)];
  document.getElementById('inputSongAudio').value = randAudio;
  showToastNotification('Sample audio full dipilih!', 'info');
}

let currentItunesSearchResults = [];
let itunesAudioPreviewObj = null;

function formatDurationMs(ms) {
  if (!ms || isNaN(ms)) return 'Full';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function toggleItunesPreview(url, btn) {
  if (!url) return;
  if (itunesAudioPreviewObj && itunesAudioPreviewObj.src === url && !itunesAudioPreviewObj.paused) {
    itunesAudioPreviewObj.pause();
    btn.innerHTML = '<i class="fa-solid fa-play text-xs ml-0.5"></i>';
    return;
  }
  if (itunesAudioPreviewObj) {
    itunesAudioPreviewObj.pause();
  }
  itunesAudioPreviewObj = new Audio(url);
  itunesAudioPreviewObj.play().catch(() => {});
  btn.innerHTML = '<i class="fa-solid fa-pause text-xs"></i>';
  itunesAudioPreviewObj.onended = () => {
    btn.innerHTML = '<i class="fa-solid fa-play text-xs ml-0.5"></i>';
  };
}

async function searchItunesSong() {
  const query = document.getElementById('itunesSearchQuery').value.trim();
  if (!query) return;

  const resultsBox = document.getElementById('itunesResultsList');
  resultsBox.innerHTML = '<div class="p-4 text-center text-xs text-[#9A737C]"><i class="fa-solid fa-spinner animate-spin text-[#FA8072] mr-1.5"></i> Mencari dari seluruh katalog musik official (Indonesia & Global)...</div>';
  resultsBox.classList.remove('hidden');

  try {
    const q = encodeURIComponent(query);
    // Cari secara paralel di etalase Indonesia (sangat lengkap untuk Reality Club, Pamungkas, Dewa 19, Hindia, dll.)
    // DAN etalase Global (untuk artis barat/mancanegara) secara simultan
    const [resId, resGlobal] = await Promise.allSettled([
      fetch(`https://itunes.apple.com/search?term=${q}&entity=song&country=ID&limit=30`).then(r => r.json()),
      fetch(`https://itunes.apple.com/search?term=${q}&entity=song&country=US&limit=25`).then(r => r.json())
    ]);

    const resultsId = (resId.status === 'fulfilled' && resId.value && Array.isArray(resId.value.results)) ? resId.value.results : [];
    const resultsUs = (resGlobal.status === 'fulfilled' && resGlobal.value && Array.isArray(resGlobal.value.results)) ? resGlobal.value.results : [];

    const combined = [...resultsId, ...resultsUs];
    const seen = new Set();
    const finalResults = [];

    for (const item of combined) {
      if (!item || !item.trackName) continue;
      const key = `${(item.trackName || '').toLowerCase().trim()}::${(item.artistName || '').toLowerCase().trim()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      finalResults.push(item);
    }

    if (finalResults.length === 0) {
      resultsBox.innerHTML = '<div class="p-4 text-center text-xs text-[#9A737C]">Lagu tidak ditemukan. Coba ketik judul atau nama artis lain, atau gunakan opsi manual di bawah.</div>';
      return;
    }

    currentItunesSearchResults = finalResults;

    resultsBox.innerHTML = finalResults.map((item, idx) => {
      const hdCover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : 'images/spotify_covers/jakarta.jpg';
      const dur = formatDurationMs(item.trackTimeMillis);
      const safeTitle = (item.trackName || 'Track').replace(/"/g, '&quot;');
      const safeArtist = (item.artistName || 'Artist').replace(/"/g, '&quot;');
      const safeAlbum = (item.collectionName || 'Single').replace(/"/g, '&quot;');

      return `
        <div class="flex items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-white hover:bg-[#FFE4E9]/40 border border-[#FFD2DC] transition shadow-2xs">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <img src="${item.artworkUrl100}" class="w-12 h-12 rounded-xl object-cover border border-[#FFD2DC] shrink-0 shadow-xs" alt="${safeTitle}" />
            <div class="min-w-0 flex-1">
              <p class="text-xs font-extrabold text-[#3B2328] truncate">${safeTitle}</p>
              <p class="text-[11px] text-[#9A737C] truncate">${safeArtist} • <span class="text-[#FA8072] font-semibold">${safeAlbum}</span></p>
              <span class="text-[10px] text-[#9A737C] font-medium">${dur}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            ${item.previewUrl ? `
              <button type="button" onclick="toggleItunesPreview('${item.previewUrl}', this)" class="w-7 h-7 rounded-full bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#FA8072] flex items-center justify-center transition shadow-xs" title="Putar Cuplikan Studio">
                <i class="fa-solid fa-play text-[10px] ml-0.5"></i>
              </button>
            ` : ''}
            <button type="button" onclick="quickAddSongDirectly(${idx}, this)" class="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FA8072] to-[#E85D75] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer">
              <i class="fa-solid fa-plus text-xs"></i> Tambah
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    resultsBox.innerHTML = '<div class="p-3 text-center text-xs text-rose-500">Gagal mengambil data online. Pastikan koneksi internet aktif.</div>';
  }
}

async function quickAddSongDirectly(idx, btn) {
  try {
    if (itunesAudioPreviewObj) {
      itunesAudioPreviewObj.pause();
      itunesAudioPreviewObj = null;
    }
    const idxNum = parseInt(idx, 10);
    const item = (currentItunesSearchResults && currentItunesSearchResults[idxNum]) 
      ? currentItunesSearchResults[idxNum] 
      : null;

    if (!item) {
      showToastNotification('Data lagu tidak ditemukan dari hasil pencarian', 'error');
      return;
    }

    // Read target playlist from dropdown or active playlist
    const targetSelect = document.getElementById('targetPlaylistSelect');
    let targetPlId = (targetSelect && targetSelect.value) ? targetSelect.value : (state.activePlaylistId || 'pl-ours');
    if (targetPlId === 'pl-liked') {
      targetPlId = 'pl-ours';
    }

    let targetPl = (state.playlists || []).find(p => p.id === targetPlId);
    if (!targetPl) {
      targetPl = (state.playlists || []).find(p => p.id === 'pl-ours') || (state.playlists || [])[0];
    }
    if (!targetPl) {
      showToastNotification('Playlist tujuan tidak ditemukan', 'error');
      return;
    }
    if (!Array.isArray(targetPl.tracks)) {
      targetPl.tracks = [];
    }

    const songTitle = (item.trackName || 'Lagu Baru').trim();
    const artistName = (item.artistName || 'Artis').trim();

    // Check if song already exists in target playlist
    const alreadyExists = targetPl.tracks.some(t =>
      (t.title && t.title.toLowerCase().trim() === songTitle.toLowerCase()) &&
      (t.artist && t.artist.toLowerCase().trim() === artistName.toLowerCase())
    );

    const buttonEl = btn ? (btn.closest('button') || btn) : null;

    if (alreadyExists) {
      if (buttonEl) {
        buttonEl.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Sudah Ada';
        buttonEl.className = 'px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-default';
        buttonEl.disabled = true;
      }
      showToastNotification(`"${songTitle}" sudah ada di playlist "${targetPl.title}"! ✨`, 'info');
      return;
    }

    // Temporary loading indicator on button
    if (buttonEl) {
      buttonEl.innerHTML = '<i class="fa-solid fa-cloud-arrow-down animate-bounce text-xs"></i> Menyimpan ke DB...';
      buttonEl.disabled = true;
    }

    const ultraHdCover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '1000x1000bb') : 'images/spotify_covers/jakarta.jpg';

    let matchedAudioUrl = '';
    let matchedYoutubeId = null;
    const lowTitle = songTitle.toLowerCase();
    const lowArtist = artistName.toLowerCase();
    const cleanSearch = `${lowTitle} ${lowArtist}`.replace(/[^a-z0-9]/g, ' ');

    // 1. Check local full audio files first
    if (typeof realAudioTracks !== 'undefined' && realAudioTracks) {
      for (const [key, localPath] of Object.entries(realAudioTracks)) {
        if (lowTitle.includes(key) || cleanSearch.includes(key)) {
          matchedAudioUrl = localPath;
          break;
        }
      }
    }

    // 2. Check local official covers
    let finalCover = ultraHdCover;
    if (typeof officialCovers !== 'undefined' && officialCovers) {
      for (const [key, covPath] of Object.entries(officialCovers)) {
        if (lowTitle.includes(key) || cleanSearch.includes(key)) {
          finalCover = covPath;
          break;
        }
      }
    }

    // 3. Check static YouTube catalog for full video streaming
    if (typeof realSongCatalog !== 'undefined' && realSongCatalog) {
      for (const [key, yId] of Object.entries(realSongCatalog)) {
        if (lowTitle.includes(key) || cleanSearch.includes(key)) {
          matchedYoutubeId = yId;
          break;
        }
      }
    }

    // 4. Dynamic YouTube resolution: Automatically resolve full song from YouTube API in real time!
    if (!matchedAudioUrl && !matchedYoutubeId) {
      try {
        const queryStr = `${artistName} ${songTitle}`;
        const ytRes = await fetch(`/api/search-youtube?q=${encodeURIComponent(queryStr)}`);
        if (ytRes.ok) {
          const ytData = await ytRes.json();
          if (ytData && ytData.youtubeId) {
            matchedYoutubeId = ytData.youtubeId;
          }
        }
      } catch (ytErr) {
        console.warn('Dynamic YouTube stream notice:', ytErr);
      }
    }

    // 5. Fallback preview stream
    if (!matchedAudioUrl && item.previewUrl) {
      matchedAudioUrl = item.previewUrl;
    }

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const trackObj = {
      id: `t-online-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: songTitle,
      artist: artistName,
      album: item.collectionName || 'Single',
      cover: finalCover,
      audioUrl: matchedAudioUrl,
      youtubeId: matchedYoutubeId,
      duration: (typeof formatDurationMs === 'function' ? formatDurationMs(item.trackTimeMillis) : 'Full') || 'Full',
      memory: '',
      dateAdded: today,
      liked: false
    };

    targetPl.tracks.push(trackObj);
    saveState();

    // Otomatis terdownload & tersimpan langsung ke database Supabase
    if (window.MusicDB && typeof window.MusicDB.flushNow === 'function') {
      try {
        await window.MusicDB.flushNow();
      } catch (dbErr) {
        console.warn('[MusicDB] direct flush notice:', dbErr);
      }
    } else {
      triggerSupabaseSync();
    }

    // Immediate UI reflection in the background
    if (currentView === 'playlist' && state.activePlaylistId === targetPl.id) {
      if (typeof renderTracklist === 'function') renderTracklist();
    }
    if (typeof hydrateUI === 'function') hydrateUI();
    if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
    if (typeof renderHomeFavoritesList === 'function') renderHomeFavoritesList();
    if (typeof renderHomePlaylistsGrid === 'function') renderHomePlaylistsGrid();

    // Button feedback state
    if (buttonEl) {
      buttonEl.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Tersimpan di Database';
      buttonEl.className = 'px-3 py-1.5 rounded-full bg-[#1DB954] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-default';
      buttonEl.disabled = true;
    }

    showToastNotification(`✓ "${songTitle}" berhasil diunduh & tersimpan di database! 🎵`, 'success');
  } catch (err) {
    console.error('Error adding song directly:', err);
    showToastNotification('Terjadi kendala: ' + err.message, 'error');
  }
}

window.quickAddSongDirectly = quickAddSongDirectly;
window.quickAddOnlineSongToPlaylist = quickAddSongDirectly;

function selectItunesResult(title, artist, cover) {
  document.getElementById('inputSongTitle').value = title;
  document.getElementById('inputSongArtist').value = artist;
  document.getElementById('inputSongCover').value = cover;

  // Check if known in our real catalog
  const lowTitle = title.toLowerCase();
  for (const [key, yId] of Object.entries(realSongCatalog)) {
    if (lowTitle.includes(key)) {
      document.getElementById('inputSongAudio').value = `https://www.youtube.com/watch?v=${yId}`;
      break;
    }
  }

  document.getElementById('itunesResultsList').classList.add('hidden');
  showToastNotification(`Data "${title}" terpilih!`, 'success');
}

function compressImageFile(file, maxDim, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => callback(e.target.result);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function compressDataUrlIfNeeded(dataUrl, maxDim = 700, quality = 0.8) {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return resolve(dataUrl);
    }
    if (dataUrl.length < 50000) {
      return resolve(dataUrl);
    }
    const timer = setTimeout(() => {
      resolve(dataUrl);
    }, 2000);
    const img = new Image();
    img.onload = () => {
      clearTimeout(timer);
      try {
        let width = img.width;
        let height = img.height;
        if (!width || !height) return resolve(dataUrl);
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

function handleFileUpload(event, targetInputId) {
  const file = event.target.files[0];
  if (!file) return;
  const isAvatar = targetInputId.includes('Avatar');
  const maxDim = isAvatar ? 300 : 700;
  const quality = isAvatar ? 0.8 : 0.8;

  if (file.type && file.type.startsWith('image/')) {
    compressImageFile(file, maxDim, quality, (compressedDataUrl) => {
      const input = document.getElementById(targetInputId);
      if (input) input.value = compressedDataUrl;
      if (targetInputId === 'editPlaylistCover') {
        const prev = document.getElementById('editPlaylistCoverPreview');
        if (prev) prev.src = compressedDataUrl;
      }
      showToastNotification(`Foto "${file.name}" siap disimpan! ✨`, 'success');
    });
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      const input = document.getElementById(targetInputId);
      if (input) input.value = e.target.result;
      if (targetInputId === 'editPlaylistCover') {
        const prev = document.getElementById('editPlaylistCoverPreview');
        if (prev) prev.src = e.target.result;
      }
      showToastNotification(`File "${file.name}" berhasil diunggah!`, 'success');
    };
    reader.readAsDataURL(file);
  }
}

function saveNewSong(e) {
  e.preventDefault();
  const title = document.getElementById('inputSongTitle').value.trim();
  const artist = document.getElementById('inputSongArtist').value.trim();
  const memory = document.getElementById('inputSongMemory').value.trim();
  const targetPlSelect = document.getElementById('targetPlaylistSelect');
  const targetPlId = (targetPlSelect && targetPlSelect.value) ? targetPlSelect.value : state.activePlaylistId;
  const activePl = (state.playlists || []).find(p => p.id === targetPlId) || getActivePlaylist();
  const cover = document.getElementById('inputSongCover').value.trim() || activePl.cover;
  let audioInput = document.getElementById('inputSongAudio').value.trim();

  // Extract YouTube ID if link was provided
  const ytId = extractYouTubeId(audioInput);
  let finalYoutubeId = ytId;

  // Check real catalog if not explicit
  if (!finalYoutubeId) {
    const low = title.toLowerCase();
    for (const [key, id] of Object.entries(realSongCatalog)) {
      if (low.includes(key)) {
        finalYoutubeId = id;
        break;
      }
    }
  }

  let finalAudioUrl = audioInput;
  if (!finalYoutubeId && typeof realAudioTracks !== 'undefined' && realAudioTracks) {
    const lowT = title.toLowerCase();
    for (const [key, localPath] of Object.entries(realAudioTracks)) {
      if (lowT.includes(key)) {
        finalAudioUrl = localPath;
        break;
      }
    }
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newTrack = {
    id: 't_' + Date.now(),
    title,
    artist,
    album: 'Single',
    memory: memory || '',
    dateAdded: today,
    duration: finalYoutubeId ? 'Full Official' : 'Full',
    liked: true,
    cover,
    youtubeId: finalYoutubeId,
    audioUrl: finalAudioUrl
  };

  // If local audio file, read metadata duration
  if (finalAudioUrl && finalAudioUrl.startsWith('data:audio/')) {
    const tempAudio = new Audio();
    tempAudio.src = finalAudioUrl;
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        newTrack.duration = formatTime(tempAudio.duration);
        saveState();
        if (currentView === 'playlist') renderTracklist();
      }
    });
  }

  activePl.tracks.push(newTrack);
  saveState();

  // Otomatis tersimpan langsung ke database Supabase
  if (window.MusicDB && typeof window.MusicDB.flushNow === 'function') {
    window.MusicDB.flushNow().catch(e => console.warn('[MusicDB] manual add flush notice:', e));
  } else {
    triggerSupabaseSync();
  }

  hydrateUI();
  closeAddSongModal();

  if (currentView === 'playlist') renderTracklist();
  renderHomeFavoritesList();
  showToastNotification(`Lagu "${title}" berhasil ditambahkan ke playlist! ✨`, 'success');

  if (!isPlaying) {
    loadTrack(activePl.tracks.length - 1, true);
  }
}


// ================= MODALS CONTROLS =================
function openAddSongModal() {
  document.getElementById('inputSongTitle').value = '';
  document.getElementById('inputSongArtist').value = '';
  document.getElementById('inputSongMemory').value = '';
  document.getElementById('inputSongCover').value = '';
  document.getElementById('inputSongAudio').value = '';
  const badge = document.getElementById('fullAudioSelectedBadge');
  if (badge) badge.classList.add('hidden');

  // Populate target playlist dropdown with active playlist pre-selected
  const targetSelect = document.getElementById('targetPlaylistSelect');
  if (targetSelect && state.playlists) {
    const activeId = (state.activePlaylistId && state.activePlaylistId !== 'pl-liked')
      ? state.activePlaylistId
      : (state.playlists[0]?.id || 'pl-ours');

    targetSelect.innerHTML = state.playlists.map(p => {
      const isSel = (p.id === activeId) ? 'selected' : '';
      const safeTitle = (p.title || p.id).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<option value="${p.id}" ${isSel}>${safeTitle}</option>`;
    }).join('');
  }

  document.getElementById('addSongModal').classList.remove('hidden');
  document.getElementById('addSongModal').classList.add('flex');
}
function closeAddSongModal() {
  document.getElementById('addSongModal').classList.add('hidden');
  document.getElementById('addSongModal').classList.remove('flex');
}

let isShowcasePinRevealed = false;

function populateProfileShowcaseView() {
  const activePl = getActivePlaylist();

  const currentAcc = getCurrentAccount();
  const yourAv = document.getElementById('showcaseYourAvatar');
  if (yourAv) yourAv.src = currentAcc.avatar;
  const partnerAv = document.getElementById('showcasePartnerAvatar');
  if (partnerAv) partnerAv.src = currentAcc.partnerAvatar;

  const yourName = document.getElementById('showcaseYourName');
  if (yourName) yourName.textContent = currentAcc.name;
  const yourRole = document.getElementById('showcaseYourRole');
  if (yourRole) yourRole.textContent = currentAcc.role;

  const partnerName = document.getElementById('showcasePartnerName');
  if (partnerName) partnerName.textContent = currentAcc.partnerName;
  const partnerRole = document.getElementById('showcasePartnerRole');
  if (partnerRole) partnerRole.textContent = currentAcc.partnerRole;

  const plCover = document.getElementById('showcasePlaylistCover');
  if (plCover) plCover.src = activePl.cover;
  const plTitle = document.getElementById('showcasePlaylistTitle');
  if (plTitle) plTitle.textContent = activePl.title;
  const plDesc = document.getElementById('showcasePlaylistDesc');
  if (plDesc) plDesc.textContent = activePl.desc || 'after rain and lean with u <3';

  const loveNote = document.getElementById('showcaseLoveNote');
  if (loveNote) {
    loveNote.textContent = state.loveNote ? `"${state.loveNote}"` : '"Belum ada surat cinta yang ditulis..."';
  }

  // Stats
  const statPl = document.getElementById('showcaseStatPlaylists');
  if (statPl) statPl.textContent = state.playlists.length;
  const statTracks = document.getElementById('showcaseStatTracks');
  if (statTracks) {
    const totalTracks = state.playlists.reduce((acc, p) => acc + (p.tracks ? p.tracks.length : 0), 0);
    statTracks.textContent = totalTracks;
  }
  const statPol = document.getElementById('showcaseStatPolaroids');
  if (statPol) statPol.textContent = (state.polaroidMemories || []).length;

  // Reset PIN display to masked
  isShowcasePinRevealed = false;
  const pinDisplay = document.getElementById('showcasePinDisplay');
  if (pinDisplay) pinDisplay.textContent = '•••• (Tersimpan Aman)';
  const pinText = document.getElementById('showcasePinActionText');
  if (pinText) pinText.textContent = 'Lihat';
  const pinIcon = document.getElementById('showcasePinIcon');
  if (pinIcon) pinIcon.className = 'fa-regular fa-eye';

  // Pastikan indikator status online Dhafin & Nadia terupdate
  if (typeof updatePresenceUI === 'function') {
    updatePresenceUI();
  }
}

function toggleShowcasePin() {
  const pinDisplay = document.getElementById('showcasePinDisplay');
  const pinText = document.getElementById('showcasePinActionText');
  const pinIcon = document.getElementById('showcasePinIcon');

  isShowcasePinRevealed = !isShowcasePinRevealed;
  if (isShowcasePinRevealed) {
    if (pinDisplay) pinDisplay.textContent = 'Dhafin: 1006 | Nadia: 1809';
    if (pinText) pinText.textContent = 'Sembunyi';
    if (pinIcon) pinIcon.className = 'fa-regular fa-eye-slash';
  } else {
    if (pinDisplay) pinDisplay.textContent = '•••• (Tersimpan Aman)';
    if (pinText) pinText.textContent = 'Lihat';
    if (pinIcon) pinIcon.className = 'fa-regular fa-eye';
  }
}

function switchToProfileEditMode() {
  const showcaseView = document.getElementById('profileShowcaseView');
  const editView = document.getElementById('profileEditView');
  if (showcaseView) showcaseView.classList.add('hidden');
  if (editView) {
    editView.classList.remove('hidden');
    editView.classList.add('view-fade-enter');
  }
}

function switchToProfileShowcaseMode() {
  const showcaseView = document.getElementById('profileShowcaseView');
  const editView = document.getElementById('profileEditView');
  if (editView) editView.classList.add('hidden');
  if (showcaseView) {
    showcaseView.classList.remove('hidden');
    showcaseView.classList.add('view-fade-enter');
  }
}

function openProfileModal() {
  if (document.getElementById('setPinCode')) {
    document.getElementById('setPinCode').value = localStorage.getItem('romantic_music_custom_pin') || state.pinCode || '1806';
  }
  if (document.getElementById('setYourName')) document.getElementById('setYourName').value = state.yourName || '';
  if (document.getElementById('setPartnerName')) document.getElementById('setPartnerName').value = state.partnerName || '';
  if (document.getElementById('setYourAvatar')) document.getElementById('setYourAvatar').value = state.yourAvatar || '';
  if (document.getElementById('setPartnerAvatar')) document.getElementById('setPartnerAvatar').value = state.partnerAvatar || '';
  if (document.getElementById('setLoveNote')) document.getElementById('setLoveNote').value = state.loveNote || '';

  switchToProfileShowcaseMode();
  populateProfileShowcaseView();

  const modal = document.getElementById('profileModal') || document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal') || document.getElementById('settingsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Aliases for compatibility
function openSettingsModal() { openProfileModal(); }
function closeSettingsModal() { closeProfileModal(); }

function openEditPlaylistModal() {
  const activePl = getActivePlaylist();
  if (activePl.isLikedSpecial || state.activePlaylistId === 'pl-liked') {
    showToastNotification('Playlist Liked Songs tidak dapat diedit', 'info');
    return;
  }
  if (document.getElementById('editPlaylistTitle')) {
    document.getElementById('editPlaylistTitle').value = activePl.title || '';
  }
  if (document.getElementById('editPlaylistDesc')) {
    document.getElementById('editPlaylistDesc').value = activePl.desc || '';
  }
  if (document.getElementById('editPlaylistCover')) {
    document.getElementById('editPlaylistCover').value = activePl.cover || '';
  }
  if (document.getElementById('editPlaylistCoverPreview')) {
    document.getElementById('editPlaylistCoverPreview').src = activePl.cover || 'images/spotify_covers/jakarta.jpg';
  }

  const modal = document.getElementById('editPlaylistModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeEditPlaylistModal() {
  const modal = document.getElementById('editPlaylistModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function saveProfileOnlySettings(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  const saveBtn = document.getElementById('btnSaveProfileOnly') || document.getElementById('btnSaveSettings');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan... ⏳';
  }

  try {
    const newPin = (document.getElementById('setPinCode')?.value || '').trim() || '1806';
    state.pinCode = newPin;

    let rawYourAvatar = (document.getElementById('setYourAvatar')?.value || '').trim();
    let rawPartnerAvatar = (document.getElementById('setPartnerAvatar')?.value || '').trim();

    const [compressedYourAvatar, compressedPartnerAvatar] = await Promise.all([
      compressDataUrlIfNeeded(rawYourAvatar, 300, 0.8),
      compressDataUrlIfNeeded(rawPartnerAvatar, 300, 0.8)
    ]);

    if (compressedYourAvatar) state.yourAvatar = compressedYourAvatar;
    if (compressedPartnerAvatar) state.partnerAvatar = compressedPartnerAvatar;

    state.yourName = (document.getElementById('setYourName')?.value || '').trim() || 'Kamu';
    state.partnerName = (document.getElementById('setPartnerName')?.value || '').trim() || 'Sayang';
    state.loveNote = document.getElementById('setLoveNote')?.value || '';
    state.profileUpdatedAt = Date.now();

    // Immediately persist directly to dedicated keys
    try {
      localStorage.setItem('romantic_music_custom_pin', newPin);
      localStorage.setItem('romantic_music_profile_updated_at', state.profileUpdatedAt.toString());
      const profileConfig = {
        yourName: state.yourName,
        partnerName: state.partnerName,
        yourAvatar: state.yourAvatar,
        partnerAvatar: state.partnerAvatar,
        loveNote: state.loveNote,
        profileUpdatedAt: state.profileUpdatedAt
      };
      localStorage.setItem('romantic_music_profile_config', JSON.stringify(profileConfig));
    } catch (err) {
      console.warn('Dedicated profile localStorage warn:', err);
    }

    saveState();
    hydrateUI();
    if (currentView === 'home') renderHomeView();
    else if (currentView === 'jam') updateMainJamView();

    populateProfileShowcaseView();
    switchToProfileShowcaseMode();

    await pushStateToSupabase();
    showToastNotification('Profil & PIN berhasil disimpan! 💕', 'success');
  } catch (err) {
    console.error('Error saving profile settings:', err);
    showToastNotification('Gagal menyimpan profil: ' + err.message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Simpan Profil';
    }
  }
}

async function savePlaylistOnlySettings(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  const saveBtn = document.getElementById('btnSavePlaylistOnly');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan... ⏳';
  }

  try {
    const activePl = getActivePlaylist();
    if (activePl) {
      activePl.title = (document.getElementById('editPlaylistTitle')?.value || '').trim() || activePl.title || '✦ our melodies.';
      activePl.desc = (document.getElementById('editPlaylistDesc')?.value || '').trim();

      let rawCover = (document.getElementById('editPlaylistCover')?.value || '').trim();
      const compressedCover = await compressDataUrlIfNeeded(rawCover, 700, 0.8);
      if (compressedCover) {
        activePl.cover = compressedCover;
      }

      state.playlistsUpdatedAt = Date.now();
      try {
        localStorage.setItem('romantic_music_playlists_updated_at', state.playlistsUpdatedAt.toString());
        let plCustom = {};
        const rawPlCustom = localStorage.getItem('romantic_music_playlist_customizations');
        if (rawPlCustom) { try { plCustom = JSON.parse(rawPlCustom); } catch(e){} }
        plCustom[activePl.id] = {
          title: activePl.title,
          desc: activePl.desc,
          cover: activePl.cover,
          updatedAt: state.playlistsUpdatedAt
        };
        localStorage.setItem('romantic_music_playlist_customizations', JSON.stringify(plCustom));
      } catch(e){}
    }

    saveState();
    hydrateUI();
    if (currentView === 'playlist') renderTracklist();
    else if (currentView === 'home') renderHomeView();

    await pushStateToSupabase();
    closeEditPlaylistModal();
    showToastNotification('Detail playlist berhasil diperbarui! 🎵', 'success');
  } catch (err) {
    console.error('Error saving playlist details:', err);
    showToastNotification('Gagal menyimpan playlist: ' + err.message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Simpan Playlist';
    }
  }
}

// Wrapper for backward compatibility
async function savePlaylistSettings(e) {
  return saveProfileOnlySettings(e);
}

function resetDefaultData() {
  if (confirm('Reset seluruh playlist dan bersihkan data lama agar lagu berdurasi full?')) {
    localStorage.clear();
    location.reload();
  }
}

function openLoveNoteModal() {
  document.getElementById('loveNoteModal').classList.remove('hidden');
  document.getElementById('loveNoteModal').classList.add('flex');
}
function closeLoveNoteModal() {
  document.getElementById('loveNoteModal').classList.add('hidden');
  document.getElementById('loveNoteModal').classList.remove('flex');
}


// ================= TOAST NOTIFICATION SYSTEM =================
let toastTimeout = null;
function showToastNotification(message, type = 'info', opt = {}) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMsg');
  const titleEl = document.getElementById('toastTitle');
  const iconEl = document.getElementById('toastIcon');
  const thumbEl = document.getElementById('toastThumb');
  if (!toast || !msgEl) return;

  clearTimeout(toastTimeout);

  msgEl.textContent = message;

  if (titleEl) {
    if (type === 'success') titleEl.textContent = opt.title || 'Berhasil';
    else if (type === 'error') titleEl.textContent = opt.title || 'Perhatian';
    else if (type === 'music') titleEl.textContent = opt.title || 'Now Playing';
    else titleEl.textContent = opt.title || 'Lullaby';
  }

  // Thumb vs Icon
  const curTrack = (typeof getPlayingTrack === 'function') ? getPlayingTrack() : null;
  const thumbSrc = opt.thumb || (type === 'music' && curTrack ? curTrack.cover : null);

  if (thumbEl && thumbSrc) {
    thumbEl.src = thumbSrc;
    thumbEl.classList.remove('hidden');
    if (iconEl) iconEl.classList.add('hidden');
  } else {
    if (thumbEl) thumbEl.classList.add('hidden');
    if (iconEl) {
      iconEl.classList.remove('hidden');
      if (type === 'success') {
        iconEl.className = 'fa-solid fa-circle-check text-emerald-400 text-xs';
      } else if (type === 'error') {
        iconEl.className = 'fa-solid fa-circle-exclamation text-rose-400 text-xs';
      } else if (type === 'music') {
        iconEl.className = 'fa-solid fa-music text-[#FA8072] text-xs';
      } else {
        iconEl.className = 'fa-solid fa-sparkles text-[#FA8072] text-xs';
      }
    }
  }

  toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  toastTimeout = setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3200);
}


// ================= MOBILE FULLSCREEN TURNTABLE DETAIL MODAL =================
function openMobileDetailPlayer() {
  const modal = document.getElementById('mobileDetailPlayerModal');
  if (modal) {
    modal.classList.remove('translate-y-full');
    modal.classList.add('translate-y-0');
  }
}

function closeMobileDetailPlayer() {
  const modal = document.getElementById('mobileDetailPlayerModal');
  if (modal) {
    modal.classList.remove('translate-y-0');
    modal.classList.add('translate-y-full');
  }
}


// ================= MOBILE PLAYLIST DRAWER ENGINE =================
function openMobilePlaylistDrawer() {
  renderMobileDrawerPlaylists();
  renderMobileDrawerTracklist();
  const drawer = document.getElementById('mobilePlaylistDrawer');
  const backdrop = document.getElementById('mobilePlaylistDrawerBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    void backdrop.offsetWidth;
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-y-full');
  }
}

function closeMobilePlaylistDrawer() {
  const drawer = document.getElementById('mobilePlaylistDrawer');
  const backdrop = document.getElementById('mobilePlaylistDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-y-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }
}

function renderMobileDrawerPlaylists() {
  const bar = document.getElementById('mobileDrawerPlaylistsBar');
  if (!bar) return;

  bar.innerHTML = state.playlists.map(pl => {
    const isCurrent = pl.id === state.activePlaylistId;
    return `
      <button onclick="selectMobileDrawerPlaylist('${pl.id}')"
        class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${isCurrent ? 'bg-gradient-to-r from-[#FA8072] to-[#E85D75] text-white shadow-xs' : 'bg-[#FFF5F7] text-[#3B2328] border border-[#FFD2DC]'}">
        <i class="fa-solid fa-compact-disc text-[10px]"></i>
        <span>${pl.title}</span>
        <span class="text-[10px] opacity-80">(${pl.tracks ? pl.tracks.length : 0})</span>
      </button>
    `;
  }).join('');
}

function selectMobileDrawerPlaylist(plId) {
  state.activePlaylistId = plId;
  saveState();
  hydrateUI();
  if (currentView === 'playlist') renderTracklist();
  renderMobileDrawerPlaylists();
  renderMobileDrawerTracklist();
  const pl = getActivePlaylist();
  const sub = document.getElementById('mobileDrawerSubtitle');
  if (sub && pl) sub.textContent = pl.desc || `${pl.tracks.length} lagu romantis`;
}

function renderMobileDrawerTracklist() {
  const container = document.getElementById('mobileDrawerTracklist');
  if (!container) return;
  const query = (document.getElementById('mobileDrawerSearchInput')?.value || '').toLowerCase().trim();
  const tracks = getActiveTracks();

  const filtered = tracks
    .map((track, idx) => ({ ...track, originalIndex: idx }))
    .filter(item => {
      if (!query) return true;
      return item.title.toLowerCase().includes(query) ||
        item.artist.toLowerCase().includes(query) ||
        (item.memory || '').toLowerCase().includes(query);
    });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-[#9A737C]">
        <i class="fa-solid fa-music text-xl mb-1.5 text-[#FA8072]"></i>
        <p class="text-xs font-bold">Lagu tidak ditemukan</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((track, displayIdx) => {
    const currentPlaying = getPlayingTrack();
    const isPlayingThisPlaylist = currentPlayingPlaylistId === state.activePlaylistId;
    const isCurrent = isPlayingThisPlaylist && (
      (currentPlaying && (currentPlaying.id === track.id || currentPlaying.title.toLowerCase() === track.title.toLowerCase())) ||
      track.originalIndex === currentPlayingIndex
    );

    return `
      <div onclick="selectTrackFromList(${track.originalIndex})"
        class="flex items-center justify-between p-2 rounded-2xl cursor-pointer transition ${isCurrent ? 'bg-[#FFE4E9] text-[#E85D75] font-bold' : 'hover:bg-[#FFF5F7] text-[#3B2328]'}">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-6 text-center text-xs text-[#9A737C] shrink-0">
            ${isCurrent && isPlaying ? `
              <div class="inline-flex items-end gap-0.5 h-3">
                <span class="eq-bar"></span>
                <span class="eq-bar"></span>
                <span class="eq-bar"></span>
              </div>
            ` : `<span class="text-xs font-semibold">${displayIdx + 1}</span>`}
          </div>
          <img src="${track.cover}" class="w-10 h-10 rounded-xl object-cover border border-[#FFD2DC] shrink-0" alt="${track.title}" />
          <div class="min-w-0 flex-1 truncate">
            <h5 class="text-xs font-extrabold truncate ${isCurrent ? 'text-[#E85D75]' : 'text-[#3B2328]'}">${track.title}</h5>
            <p class="text-[10px] text-[#9A737C] truncate">${track.artist} ${track.memory ? '• <i>"' + track.memory.substring(0, 24) + '..."</i>' : ''}</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0 pl-2" onclick="event.stopPropagation()">
          <button onclick="toggleLikeTrack(${track.originalIndex}); renderMobileDrawerTracklist();"
            class="w-8 h-8 rounded-full flex items-center justify-center ${track.liked ? 'text-[#FA8072]' : 'text-[#9A737C]'}">
            <i class="${track.liked ? 'fa-solid' : 'fa-regular'} fa-heart text-xs"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}


