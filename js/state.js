// ================= STATE & STORAGE =================

let state = loadState();
let currentView = 'home';
let currentIndex = 0;
let currentPlayingPlaylistId = state.activePlaylistId || 'pl-ours';
let currentPlayingIndex = 0;
let currentPlayingTrack = null;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentFilter = 'all';
let vinylVisible = false;
let syncModeActive = true;

// Player Dual Engines
const audio = document.getElementById('audioPlayer');
let currentEngine = 'html5'; // default to html5 for instant local studio audio
let ytPlayer = null;
let isYtReady = false;
let ytScrubTimer = null;


function isLegacyPresetMemory(text) {
  const t = (text || '').trim();
  if (!t) return false;
  return LEGACY_PRESET_MEMORIES.has(t) || /^Lagu spesial dari album ".*" ✦$/.test(t);
}

// Mengosongkan catatan preset lama. Return true jika ada perubahan.
function purgePresetMemories(playlists) {
  let changed = false;
  (playlists || []).forEach(pl => {
    (pl.tracks || []).forEach(t => {
      if (isLegacyPresetMemory(t.memory)) {
        t.memory = '';
        changed = true;
      }
    });
  });
  return changed;
}

function loadState() {
  try {
    let saved = localStorage.getItem(STORAGE_KEY);

    // If current key is not yet populated, automatically migrate from previous saved state in localStorage!
    if (!saved) {
      const candidateKeys = [
        'romantic_spotify_v14_all_studio_audio_synced',
        'romantic_spotify_v13_all_studio_audio_synced',
        'romantic_spotify_v12_official_spotify_synced',
        'romantic_spotify_v11_real_studio_audio',
        'romantic_spotify_v10_real_studio_audio',
        'romantic_spotify_v9_real_studio_audio',
        'romantic_spotify_v8_real_audio'
      ];
      for (const k of candidateKeys) {
        const val = localStorage.getItem(k);
        if (val) {
          saved = val;
          console.log('Migrated custom user data from key:', k);
          break;
        }
      }
      if (!saved) {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('romantic_spotify_') && !k.endsWith('_pin') && !k.endsWith('_memories')) {
            const val = localStorage.getItem(k);
            if (val) {
              saved = val;
              console.log('Restored user data from:', k);
              break;
            }
          }
        }
      }
    }

    // Retrieve dedicated user profile customizations
    let savedProfileConfig = null;
    const rawProfile = localStorage.getItem('romantic_music_profile_config');
    if (rawProfile) {
      try {
        savedProfileConfig = JSON.parse(rawProfile);
      } catch (e) { }
    }

    let parsed = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        parsed = null;
      }
    }
    if (!parsed) {
      parsed = JSON.parse(JSON.stringify(defaultState));
    }

    // Restore custom PIN if user changed it
    const savedPin = localStorage.getItem('romantic_music_custom_pin');
    if (savedPin) {
      parsed.pinCode = savedPin;
    }

    // Restore user profile customizations if present
    if (savedProfileConfig) {
      if (savedProfileConfig.yourName) parsed.yourName = savedProfileConfig.yourName;
      if (savedProfileConfig.partnerName) parsed.partnerName = savedProfileConfig.partnerName;
      if (savedProfileConfig.yourAvatar) parsed.yourAvatar = savedProfileConfig.yourAvatar;
      if (savedProfileConfig.partnerAvatar) parsed.partnerAvatar = savedProfileConfig.partnerAvatar;
      if (savedProfileConfig.loveNote) parsed.loveNote = savedProfileConfig.loveNote;
      if (savedProfileConfig.profileUpdatedAt) parsed.profileUpdatedAt = Number(savedProfileConfig.profileUpdatedAt);
    }
    const savedProfTime = localStorage.getItem('romantic_music_profile_updated_at');
    if (savedProfTime) parsed.profileUpdatedAt = Number(savedProfTime);

    const savedPlTime = localStorage.getItem('romantic_music_playlists_updated_at');
    if (savedPlTime) parsed.playlistsUpdatedAt = Number(savedPlTime);

    const savedPolTime = localStorage.getItem('romantic_music_polaroids_updated_at');
    if (savedPolTime) parsed.polaroidsUpdatedAt = Number(savedPolTime);

    // Restore playlist metadata customizations (title, desc, cover)
    const rawPlCustom = localStorage.getItem('romantic_music_playlist_customizations');
    if (rawPlCustom) {
      try {
        const plCustom = JSON.parse(rawPlCustom);
        if (Array.isArray(parsed.playlists)) {
          parsed.playlists.forEach(pl => {
            if (plCustom[pl.id]) {
              if (plCustom[pl.id].title) pl.title = plCustom[pl.id].title;
              if (plCustom[pl.id].desc !== undefined) pl.desc = plCustom[pl.id].desc;
              if (plCustom[pl.id].cover) pl.cover = plCustom[pl.id].cover;
            }
          });
        }
      } catch(e){}
    }

    // Restore dedicated polaroid memories if user added or deleted any
    const savedPolaroids = localStorage.getItem('romantic_music_polaroid_memories');
    if (savedPolaroids !== null) {
      try {
        parsed.polaroidMemories = JSON.parse(savedPolaroids);
      } catch (e) {
        parsed.polaroidMemories = [];
      }
    }
    // Automatically purge old dummy sample photos (pol-1 to pol-4 or unsplash) from local cache
    if (Array.isArray(parsed.polaroidMemories)) {
      parsed.polaroidMemories = parsed.polaroidMemories.filter(p => !['pol-1', 'pol-2', 'pol-3', 'pol-4'].includes(p?.id) && !(p?.imageUrl && p.imageUrl.includes('images.unsplash.com')));
    } else {
      parsed.polaroidMemories = [];
    }

    // Deduplicate playlist IDs & auto-repair any corrupted default playlists
    if (parsed.playlists) {
      const seenIds = new Set();
      parsed.playlists = parsed.playlists.filter(pl => {
        if (!pl.id || seenIds.has(pl.id)) return false;
        seenIds.add(pl.id);
        return true;
      });

      parsed.playlists.forEach(pl => {
        if (pl.id !== 'pl-ours') {
          const defaultPl = defaultState.playlists.find(dp => dp.id === pl.id);
          if (defaultPl && pl.title === 'ours') {
            console.log(`✦ Auto-healing corrupted playlist title ${pl.id} back to: ${defaultPl.title}`);
            pl.title = defaultPl.title;
            pl.desc = defaultPl.desc;
          }
        }
      });
      parsed.playlists.forEach(pl => {
        if (!pl.tracks) {
          const defaultPl = defaultState.playlists.find(dp => dp.id === pl.id);
          pl.tracks = defaultPl && defaultPl.tracks ? JSON.parse(JSON.stringify(defaultPl.tracks)) : [];
        }

        if (['pl-ours', 'pl-1'].includes(pl.id)) {
          const hasDua = pl.tracks.some(t => (t.title || '').toLowerCase().includes('dua sejoli') || t.id === 't-dua-sejoli');
          if (!hasDua) {
            pl.tracks.push({
              id: 't-dua-sejoli',
              title: 'Dua Sejoli',
              artist: 'Dewa 19',
              album: 'Bintang Lima',
              memory: '',
              dateAdded: 'Feb 25, 2025',
              duration: '5:26',
              liked: true,
              cover: 'images/covers/dewa19_dua_sejoli.jpg',
              audioUrl: 'audio/dewa19_dua_sejoli.m4a',
              youtubeId: 'IU_v67PFnqk'
            });
          }
        }

        if (Array.isArray(pl.tracks)) {
          pl.tracks.forEach(t => {
            const lowTitle = (t.title || '').toLowerCase().trim();
            for (const [key, localPath] of Object.entries(realAudioTracks)) {
              if (lowTitle.includes(key)) {
                t.audioUrl = localPath;
              }
            }
            for (const [key, covPath] of Object.entries(officialCovers)) {
              if (lowTitle.includes(key)) {
                t.cover = covPath;
              }
            }
            if (lowTitle.includes('dua sejoli')) {
              t.cover = 'images/covers/dewa19_dua_sejoli.jpg';
              t.album = 'Bintang Lima';
            }
            if (lowTitle.includes('atlantis')) {
              t.youtubeId = 'gVAy3IZiL0s';
              t.audioUrl = 'audio/seafret_atlantis.m4a';
              t.duration = '4:18';
            }
            if (lowTitle.includes('pupus')) {
              t.youtubeId = '7v2AJiZXHjI';
              t.audioUrl = 'audio/dewa19_pupus.m4a';
              t.cover = 'images/covers/dewa19_pupus.jpg';
              t.duration = '5:05';
            }
            if (lowTitle.includes('separuh nafas')) {
              t.youtubeId = '0vuBZYWZPIc';
              t.audioUrl = 'audio/dewa19_separuh_nafas.m4a';
              t.cover = 'images/covers/dewa19_separuh_nafas.jpg';
              t.duration = '5:00';
            }
            if (lowTitle.includes('kangen')) {
              t.youtubeId = 'NSSBwftuG7A';
              t.audioUrl = 'audio/dewa19_kangen.m4a';
              t.cover = 'images/covers/dewa19_kangen.jpg';
              t.duration = '5:32';
            }
            if (lowTitle.includes('i think they call this love') || (t.artist || '').toLowerCase().includes('matthew ifield')) {
              t.title = 'I Think They Call This Love (Cover)';
              t.artist = 'Matthew Ifield';
              t.album = "I’ll Be Home For Christmas / I Think They Call This Love (Cover)";
              t.cover = 'images/covers/matthew_ifield_cover.jpg';
              t.audioUrl = 'audio/matthew_ifield_i_think_they_call_this_love.m4a';
              t.youtubeId = 'CnEqrgMlWLQ';
              t.duration = '3:16';
            }
          });
        }
      });
    }

    if (purgePresetMemories(parsed.playlists)) {
      console.log('✦ Preset Sweet Memory Notes dikosongkan agar bisa diisi sendiri');
      window.__pendingPresetPurgeSync = true;
    }

    // Dual accounts identity consistency: Dhafin (1006) / Nadia (1809)
    const activeUserId = localStorage.getItem('romantic_current_user') || 'dhafin';
    const acc = activeUserId === 'nadia' ? ACCOUNTS['1809'] : ACCOUNTS['1006'];
    if (acc) {
      parsed.yourName = acc.name;
      parsed.yourAvatar = acc.avatar;
      parsed.partnerName = acc.partnerName;
      parsed.partnerAvatar = acc.partnerAvatar;
    }

    // Default room chat is strictly empty unless user has joined an active room
    // Restore persistent couple chat messages (like WhatsApp, never wiped on refresh)
    const savedChatMessages = localStorage.getItem('romantic_music_chat_messages');
    if (savedChatMessages !== null) {
      try {
        const parsedChat = JSON.parse(savedChatMessages);
        if (Array.isArray(parsedChat) && parsedChat.length > 0) {
          const existingMsgs = Array.isArray(parsed.jamMessages) ? parsed.jamMessages : [];
          const seenMsgIds = new Set(parsedChat.map(m => m && m.id).filter(Boolean));
          existingMsgs.forEach(m => {
            if (m && m.id && !seenMsgIds.has(m.id)) {
              parsedChat.push(m);
              seenMsgIds.add(m.id);
            }
          });
          parsed.jamMessages = parsedChat;
        }
      } catch (e) { }
    }
    if (false && !localStorage.getItem('romantic_jam_room_id')) {
      parsed.jamMessages = [];
    }
    if (Array.isArray(parsed.jamMessages)) {
      parsed.jamMessages = parsed.jamMessages.filter(m => m && !String(m.text || '').includes('pakai cover album official'));
    parsed.jamMessages.forEach(m => {
      if (m && m.sender === 'system' && m.text && m.text.includes('Kamu memutar')) {
        m.text = m.text.replace('Kamu memutar', `${parsed.partnerName || 'Nadia'} memutar`);
      }
    });
    }

    const mergedState = { ...defaultState, ...parsed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
    return mergedState;
  } catch (e) {
    console.warn('Error loading state:', e);
  }
  const initState = JSON.parse(JSON.stringify(defaultState));
  const savedPin = localStorage.getItem('romantic_music_custom_pin');
  if (savedPin) initState.pinCode = savedPin;
  return initState;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Quota exceeded in saveState, cleaning older keys:', err);
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('romantic_spotify_v') && k !== STORAGE_KEY) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e2) {
      console.warn('Could not save full state to localStorage:', e2);
    }
  }

  try {
    const profileConfig = {
      yourName: state.yourName,
      partnerName: state.partnerName,
      yourAvatar: state.yourAvatar,
      partnerAvatar: state.partnerAvatar,
      loveNote: state.loveNote
    };
    localStorage.setItem('romantic_music_profile_config', JSON.stringify(profileConfig));
    if (Array.isArray(state.jamMessages)) {
      localStorage.setItem('romantic_music_chat_messages', JSON.stringify(state.jamMessages));
    }
  } catch (err) {
    console.warn('Could not save profile config:', err);
  }

  // Automatically sync updated state via MusicDB (per-row cloud sync)
  if (window.MusicDB && typeof window.MusicDB.scheduleFlush === 'function') {
    window.MusicDB.scheduleFlush();
  }
}

function triggerSupabaseSync() {
  if (window.MusicDB && typeof window.MusicDB.scheduleFlush === 'function') {
    window.MusicDB.scheduleFlush();
  }
}

async function pushStateToSupabase() {
  if (window.MusicDB && typeof window.MusicDB.flushNow === 'function') {
    return await window.MusicDB.flushNow();
  }
}

function initSupabaseSync() {
  if (!window.MusicDB || typeof window.MusicDB.init !== 'function') {
    console.warn('✦ [MusicDB] Layer not loaded, continuing offline.');
    return;
  }
  window.MusicDB.init({
    getState: () => state,
    getDefaults: () => defaultState,
    applyCloudState: (cloudState) => {
      if (!cloudState) return;
      if (cloudState.pinCode !== undefined) state.pinCode = cloudState.pinCode;
      if (cloudState.loveNote !== undefined) state.loveNote = cloudState.loveNote;
      if (Array.isArray(cloudState.polaroidMemories)) state.polaroidMemories = cloudState.polaroidMemories;
      if (Array.isArray(cloudState.jamMessages)) {
        const localMsgs = Array.isArray(state.jamMessages) ? state.jamMessages : [];
        const mergedMsgs = [...cloudState.jamMessages];
        const cloudIds = new Set(mergedMsgs.map(m => m && m.id).filter(Boolean));
        localMsgs.forEach(m => {
          if (m && m.id && !cloudIds.has(m.id)) {
            mergedMsgs.push(m);
            cloudIds.add(m.id);
          }
        });
        mergedMsgs.forEach(m => {
          if (m && m.sender === 'system' && m.text && m.text.includes('Kamu memutar')) {
            const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
            const pName = currentAcc ? currentAcc.partnerName : 'Nadia';
            m.text = m.text.replace('Kamu memutar', `${pName} memutar`);
          }
        });
        state.jamMessages = mergedMsgs;
      }

      // Jaga identitas user yang sedang aktif di browser ini (Dhafin / Nadia) agar tidak tertimpa
      if (typeof getCurrentAccount === 'function' && typeof applyAccountIdentity === 'function') {
        applyAccountIdentity(getCurrentAccount());
      }

      if (Array.isArray(cloudState.playlists) && cloudState.playlists.length > 0) {
        const special = (state.playlists || []).filter(p => p.isLikedSpecial || p.id === 'pl-liked');
        state.playlists = [...cloudState.playlists, ...special];

        // Pulihkan history lagu terakhir sesuai urutan playlist cloud terbaru jika player sedang idle
        if (!isPlaying && typeof restoreLastPlayedTrack === 'function') {
          restoreLastPlayedTrack(false);
        }
      }

      // Bersihkan catatan preset lama yang masih tersimpan di cloud, lalu sinkronkan balik
      if (purgePresetMemories(state.playlists) || window.__pendingPresetPurgeSync) {
        window.__pendingPresetPurgeSync = false;
        setTimeout(() => triggerSupabaseSync(), 0);
      }

      // Sync local cache
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('romantic_music_custom_pin', state.pinCode);
        localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
        localStorage.setItem('romantic_music_chat_messages', JSON.stringify(state.jamMessages || []));
        localStorage.setItem('romantic_music_profile_config', JSON.stringify({
          yourName: state.yourName,
          partnerName: state.partnerName,
          yourAvatar: state.yourAvatar,
          partnerAvatar: state.partnerAvatar,
          loveNote: state.loveNote
        }));
      } catch (e) { }

      // Re-hydrate UI with authoritative cloud state
      if (typeof hydrateUI === 'function') hydrateUI();
      if (typeof populateProfileShowcaseView === 'function') populateProfileShowcaseView();
      if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
      if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
      else if (currentView === 'playlist' && typeof renderTracklist === 'function') renderTracklist();
      else if (currentView === 'jam' && typeof updateMainJamView === 'function') {
        updateMainJamView();
        if (typeof renderJamChat === 'function') renderJamChat();
      } else if (currentView === 'gallery' && typeof renderPolaroidGallery === 'function') {
        renderPolaroidGallery();
      }
    },
    onRemoteChange: (table) => {
      if (table === 'couple_profile') {
        if (typeof hydrateUI === 'function') hydrateUI();
        if (typeof populateProfileShowcaseView === 'function') populateProfileShowcaseView();
        if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
        else if (currentView === 'jam' && typeof updateMainJamView === 'function') updateMainJamView();
      } else if (table === 'polaroids') {
        if (typeof renderPolaroidGallery === 'function') renderPolaroidGallery();
        const statPol = document.getElementById('heroStatsPolaroidCount');
        if (statPol) statPol.textContent = (state.polaroidMemories || []).length;
      } else if (table === 'playlists' || table === 'tracks') {
        if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
        if (currentView === 'playlist' && typeof renderTracklist === 'function') renderTracklist();
        else if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
      } else if (table === 'jam_messages') {
        if (typeof renderJamChat === 'function') renderJamChat();
        if (typeof renderMainJamChat === 'function') renderMainJamChat();
      }
    },
    onPlaybackSync: (payload) => {
      if (typeof handleRemotePlaybackSync === 'function') {
        handleRemotePlaybackSync(payload);
      }
    },
    onChatMessage: (payload) => {
      if (typeof handleRemoteChatMessage === 'function') {
        handleRemoteChatMessage(payload);
      }
    },
    onPresenceSync: (presences) => {
      if (typeof handlePresenceSync === 'function') {
        handlePresenceSync(presences);
      }
    },
    onGlobalPresenceSync: (presences) => {
      if (typeof handleGlobalPresenceSync === 'function') {
        handleGlobalPresenceSync(presences);
      }
    },
    onLocalMediaUploaded: () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
        localStorage.setItem('romantic_music_chat_messages', JSON.stringify(state.jamMessages || []));
      } catch (e) { }
    },
    onSynced: () => {
      console.log('✦ [MusicDB] Synchronized with cloud.');
    },
    onSyncError: (err) => {
      console.warn('✦ [MusicDB] Sync error:', err);
    }
  });
}


function getAllLikedTracks() {
  const allLiked = [];
  const seenIds = new Set();
  (state.playlists || []).forEach(pl => {
    (pl.tracks || []).forEach(t => {
      if (t.liked) {
        const uniqueKey = t.id || `${t.title}-${t.artist}`;
        if (!seenIds.has(uniqueKey)) {
          seenIds.add(uniqueKey);
          allLiked.push({ ...t, sourcePlaylistId: pl.id });
        }
      }
    });
  });
  return allLiked;
}

function getLikedSongsPlaylist() {
  const tracks = getAllLikedTracks();
  return {
    id: 'pl-liked',
    title: 'Liked Songs',
    desc: 'Kumpulan lagu favorit pilihan berdua',
    cover: 'images/spotify_covers/liked_cover.svg',
    isLikedSpecial: true,
    tracks: tracks
  };
}

function getActivePlaylist() {
  if (state.activePlaylistId === 'pl-liked') {
    return getLikedSongsPlaylist();
  }
  const pl = state.playlists.find(p => p.id === state.activePlaylistId);
  return pl || state.playlists[0] || defaultState.playlists[0];
}

function getActiveTracks() {
  const pl = getActivePlaylist();
  return pl && pl.tracks ? pl.tracks : [];
}

function getPlayingPlaylist() {
  if (currentPlayingPlaylistId === 'pl-liked') {
    return getLikedSongsPlaylist();
  }
  const pl = state.playlists.find(p => p.id === currentPlayingPlaylistId);
  return pl || getActivePlaylist();
}

function getPlayingTracks() {
  const pl = getPlayingPlaylist();
  return pl && pl.tracks ? pl.tracks : [];
}

function getPlayingTrack() {
  if (currentPlayingTrack) return currentPlayingTrack;
  const tracks = getPlayingTracks();
  return tracks[currentPlayingIndex] || getActiveTracks()[0] || null;
}

function openLikedSongs() {
  currentFilter = 'all';
  const label = document.getElementById('filterStatusLabel');
  if (label) label.textContent = 'Semua Lagu';
  navigateTo('playlist', 'pl-liked');
}

// Pulihkan history lagu terakhir yang benar-benar pernah dimainkan user
function restoreLastPlayedTrack(autoPlay = false) {
  try {
    const rawLast = localStorage.getItem('romantic_music_last_played');
    if (!rawLast) return false;
    const last = JSON.parse(rawLast);
    if (!last) return false;

    // Cari playlist tujuan
    let targetPl = null;
    if (last.playlistId) {
      if (last.playlistId === 'pl-liked') {
        targetPl = getLikedSongsPlaylist();
      } else {
        targetPl = (state.playlists || []).find(p => p.id === last.playlistId);
      }
    }
    if (!targetPl) {
      targetPl = (state.playlists && state.playlists[0]) || defaultState.playlists[0];
    }
    if (!targetPl || !targetPl.tracks || !targetPl.tracks.length) return false;

    // Cari track di dalam playlist target: cek ID -> cek Title -> cek numeric index
    let tIdx = -1;
    if (last.trackId) {
      tIdx = targetPl.tracks.findIndex(t => t.id === last.trackId);
    }
    if (tIdx === -1 && last.trackTitle) {
      const lowT = last.trackTitle.toLowerCase().trim();
      tIdx = targetPl.tracks.findIndex(t => t.title && t.title.toLowerCase().trim() === lowT);
    }
    if (tIdx === -1 && typeof last.trackIndex === 'number' && targetPl.tracks[last.trackIndex]) {
      tIdx = last.trackIndex;
    }

    if (tIdx !== -1) {
      currentPlayingPlaylistId = targetPl.id;
      state.activePlaylistId = targetPl.id;
      loadTrack(tIdx, autoPlay, targetPl.id);
      return true;
    }
  } catch (e) {
    console.warn('[MusicDB] Error restoring last played track:', e);
  }
  return false;
}

