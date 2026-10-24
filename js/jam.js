// ================= LISTENING TOGETHER & JAM SESSION =================

// ================= LISTENING TOGETHER (SPOTIFY JAM REALTIME SYNC) =================
let isRemotePlaybackSync = false;
let remoteSyncUnlockTimer = null;
let seekDebounceTimer = null;
let currentJamRoomId = '';

function initJamRoomSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    const cleanParam = decodeURIComponent(roomParam).trim().toUpperCase();
    if (cleanParam) {
      currentJamRoomId = cleanParam;
      localStorage.setItem('romantic_jam_room_id', currentJamRoomId);
      setTimeout(() => {
        showToastNotification(`Terhubung ke Jam Room: ${currentJamRoomId} 💕`, 'success');
      }, 700);
    }
  } else {
    // Secara default room chat kosong & user harus membuat room baru atau memasukkan ID Room
    currentJamRoomId = '';
    localStorage.removeItem('romantic_jam_room_id');
    state.jamMessages = [];
  }

  if (currentJamRoomId && window.MusicDB && typeof window.MusicDB.connectJamRoom === 'function') {
    window.MusicDB.connectJamRoom(currentJamRoomId);
  }
  renderJamRoomUI();
}

function renderJamRoomUI() {
  const connectedBar = document.getElementById('jamConnectedBar');
  const disconnectedBar = document.getElementById('jamDisconnectedBar');
  const activeCodeEl = document.getElementById('jamActiveRoomCode');
  const syncBadge = document.getElementById('jamSessionSyncBadge');
  const chatInput = document.getElementById('mainJamChatInput');
  const chatSendBtn = document.getElementById('mainJamChatSendBtn');

  if (currentJamRoomId) {
    if (connectedBar) connectedBar.classList.remove('hidden');
    if (disconnectedBar) disconnectedBar.classList.add('hidden');
    if (activeCodeEl) activeCodeEl.textContent = currentJamRoomId;
    if (syncBadge) syncBadge.textContent = '100% Synced';
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.placeholder = 'Ketik pesan untuk pasanganmu...';
    }
    if (chatSendBtn) chatSendBtn.disabled = false;
  } else {
    if (connectedBar) connectedBar.classList.add('hidden');
    if (disconnectedBar) disconnectedBar.classList.remove('hidden');
    if (syncBadge) syncBadge.textContent = 'Mode Pribadi';
    if (chatInput) {
      chatInput.disabled = true;
      chatInput.placeholder = 'Buat atau gabung room di atas untuk mulai chat...';
    }
    if (chatSendBtn) chatSendBtn.disabled = true;
  }

  renderMainJamChat();
  if (typeof updateMiniJamStatusCard === 'function') {
    updateMiniJamStatusCard();
  }
}

// Sinkronisasi status card Mini Listening Together di panel kanan
function updateMiniJamStatusCard() {
  const cardTitle = document.getElementById('miniJamTitle');
  const cardDesc = document.getElementById('miniJamDesc');
  const cardBadge = document.getElementById('miniJamLiveBadge');
  const cardBtn = document.getElementById('miniJamBtn');
  const avatar1 = document.getElementById('miniJamAvatar1');
  const avatar2 = document.getElementById('miniJamAvatar2');
  if (!cardTitle || !cardDesc || !cardBtn) return;

  const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
  const partnerName = currentAcc ? currentAcc.partnerName : (state.partnerName || 'Nadia');
  const partnerId = currentAcc && currentAcc.id === 'nadia' ? 'dhafin' : 'nadia';
  const isPartnerOnline = Boolean(presenceStateMap && presenceStateMap[partnerId]);

  if (avatar1 && state.yourAvatar) avatar1.src = state.yourAvatar;
  if (avatar2 && state.partnerAvatar) avatar2.src = state.partnerAvatar;

  if (currentJamRoomId) {
    // State B: Sedang ada room yang terbuat / Jamming Together aktif
    cardTitle.textContent = `Room: ${currentJamRoomId}`;
    if (cardBadge) cardBadge.classList.remove('hidden');
    cardDesc.textContent = `${partnerName} (${isPartnerOnline ? 'Online 🟢' : 'Offline ⚪'}) • Sinkron Aktif`;
    cardBtn.textContent = 'Buka Jam';
    cardBtn.className = 'shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FA8072] to-[#E85D75] text-white text-xs font-bold shadow-xs hover:opacity-95 transition whitespace-nowrap';
    if (avatar2) avatar2.className = 'w-8 h-8 rounded-full object-cover ring-2 ring-[#FA8072] live-ring shadow-xs';
  } else {
    // State A: Belum ada room yang terbuat / belum jamming together
    cardTitle.textContent = 'Listening Together';
    if (cardBadge) cardBadge.classList.add('hidden');
    cardDesc.textContent = isPartnerOnline 
      ? `${partnerName} sedang online 🟢 • Dengar bareng!` 
      : 'Belum ada sesi aktif • Ajak pasanganmu 💕';
    cardBtn.textContent = 'Mulai Jam';
    cardBtn.className = 'shrink-0 px-3 py-1.5 rounded-xl bg-white border border-[#FFD2DC] text-[#E85D75] text-xs font-bold shadow-2xs hover:bg-[#FA8072] hover:text-white hover:border-[#FA8072] transition whitespace-nowrap';
    if (avatar2) avatar2.className = 'w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-2xs';
  }
}

function joinJamRoom(roomId) {
  const clean = String(roomId || '').trim().toUpperCase();
  if (!clean) return;

  if (currentJamRoomId !== clean) {
    // Masuk ke room baru: bersihkan chat sebelumnya agar selalu mulai bersih
    state.jamMessages = [];
    saveState();
  }

  currentJamRoomId = clean;
  localStorage.setItem('romantic_jam_room_id', currentJamRoomId);
  if (window.MusicDB && typeof window.MusicDB.connectJamRoom === 'function') {
    window.MusicDB.connectJamRoom(currentJamRoomId);
  }
  renderJamRoomUI();
  showToastNotification(`Berhasil bergabung ke Sesi: ${currentJamRoomId} ✦`, 'success');

  // Broadcast current track to partner if host is playing
  if (isPlaying) {
    broadcastPlaybackState('PLAY', audio.currentTime || 0, true);
  }
}

function joinJamRoomFromInput() {
  const input = document.getElementById('inputJamRoomId');
  const val = input ? input.value.trim() : '';
  if (!val) {
    showToastNotification('Silakan masukkan ID Room terlebih dahulu', 'warning');
    return;
  }
  joinJamRoom(val);
  if (input) input.value = '';
}

function createRandomJamRoom() {
  const prefixes = ['LUV', 'JAM', 'NDEY', 'DHAF', 'LOVE'];
  const pfx = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  joinJamRoom(`${pfx}-${num}`);
  showToastNotification(`Room baru dibuat: ${currentJamRoomId} 💕 Bagikan link atau kodenya ke pasanganmu!`, 'success');
}

function leaveCurrentJamRoom() {
  currentJamRoomId = '';
  localStorage.removeItem('romantic_jam_room_id');
  state.jamMessages = [];
  saveState();
  if (window.MusicDB && typeof window.MusicDB.leaveJamRoom === 'function') {
    window.MusicDB.leaveJamRoom();
  }
  renderJamRoomUI();
  showToastNotification('Mode pribadi aktif. Kamu telah keluar dari sesi bersama.', 'info');
}

function handleRemoteChatMessage(payload) {
  if (!payload || !currentJamRoomId) return;
  if (payload.roomId && payload.roomId !== currentJamRoomId) return;

  const currentAcc = getCurrentAccount();
  if (payload.senderId && payload.senderId === currentAcc.id) return; // abaikan pesan sendiri

  if (!state.jamMessages) state.jamMessages = [];
  if (payload.id && state.jamMessages.some(m => m.id === payload.id)) return;

  state.jamMessages.push({
    id: payload.id,
    roomId: payload.roomId,
    senderId: payload.senderId,
    senderName: payload.senderName || currentAcc.partnerName,
    senderAvatar: payload.senderAvatar || currentAcc.partnerAvatar,
    sender: 'partner',
    text: payload.text,
    time: payload.time || getCurrentTimeStr()
  });

  saveState();
  renderMainJamChat();
  renderJamChat();
  sendFloatingReaction('💌', false);
}

function broadcastPlaybackState(action, position, playingStatus) {
  if (isRemotePlaybackSync) return;
  if (!currentJamRoomId) return; // Mode pribadi: jangan broadcast jika belum join room!
  if (typeof syncModeActive !== 'undefined' && !syncModeActive) return;

  const track = getPlayingTrack();
  if (!track) return;

  if (window.MusicDB && typeof window.MusicDB.broadcastPlayback === 'function') {
    const curPos = typeof position === 'number'
      ? position
      : ((currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.getCurrentTime)
          ? ytPlayer.getCurrentTime()
          : (audio.currentTime || 0));

    const isCurrentlyPlaying = typeof playingStatus === 'boolean' ? playingStatus : isPlaying;

    window.MusicDB.broadcastPlayback({
      action: action, // 'PLAY' | 'PAUSE' | 'SEEK' | 'TRACK_CHANGE'
      trackId: track.id || '',
      trackTitle: track.title || '',
      trackArtist: track.artist || '',
      playlistId: currentPlayingPlaylistId,
      position: curPos,
      isPlaying: isCurrentlyPlaying,
      senderName: state.yourName || 'Pasangan',
      roomId: currentJamRoomId
    });
  }
}

function scheduleBroadcastSeek(targetSec) {
  clearTimeout(seekDebounceTimer);
  seekDebounceTimer = setTimeout(() => {
    broadcastPlaybackState('SEEK', targetSec, isPlaying);
  }, 220);
}

function handleRemotePlaybackSync(payload) {
  if (!payload || !syncModeActive || !currentJamRoomId) return;
  if (payload.roomId && payload.roomId !== currentJamRoomId) return; // Abaikan paket dari room lain!
  const myDeviceId = window.MusicDB && window.MusicDB.getDeviceId ? window.MusicDB.getDeviceId() : null;
  if (payload.senderDeviceId && myDeviceId && payload.senderDeviceId === myDeviceId) return;

  if (payload.action === 'REACTION' && payload.emoji) {
    spawnReactionAnimation(payload.emoji);
    updateJamLiveActivity(`Sayang (${payload.senderName || 'Pasangan'}) mengirim reaksi: ${payload.emoji}`);
    return;
  }

  isRemotePlaybackSync = true;
  clearTimeout(remoteSyncUnlockTimer);

  try {
    const currentTrack = getPlayingTrack();
    const playingTracks = getPlayingTracks();

    // Latency & drift compensation
    const now = Date.now();
    const networkLatencySec = Math.max(0, Math.min(4, (now - (payload.sentAt || now)) / 1000));
    const targetSeconds = Math.max(0, (payload.position || 0) + (payload.isPlaying ? networkLatencySec : 0));

    // Check track match
    let trackIdx = -1;
    if (payload.trackId) {
      trackIdx = playingTracks.findIndex(t => t.id === payload.trackId);
    }
    if (trackIdx === -1 && payload.trackTitle) {
      trackIdx = playingTracks.findIndex(t => t.title && t.title.toLowerCase().trim() === payload.trackTitle.toLowerCase().trim());
    }

    const isSameTrack = currentTrack && (
      (payload.trackId && currentTrack.id === payload.trackId) ||
      (payload.trackTitle && currentTrack.title && currentTrack.title.toLowerCase().trim() === payload.trackTitle.toLowerCase().trim())
    );

    if (!isSameTrack && trackIdx !== -1) {
      // Switch track and seek
      loadTrack(trackIdx, payload.isPlaying, payload.playlistId || currentPlayingPlaylistId);
      setTimeout(() => {
        applyDirectSeekAndPlay(targetSeconds, payload.isPlaying);
      }, 400);
    } else {
      // Same track: check drift
      const currentSec = (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.getCurrentTime)
        ? ytPlayer.getCurrentTime()
        : (audio.currentTime || 0);

      const drift = Math.abs(currentSec - targetSeconds);

      if (payload.action === 'SEEK' || drift > 1.2) {
        applyDirectSeekAndPlay(targetSeconds, payload.isPlaying);
      } else {
        if (payload.isPlaying && !isPlaying) {
          applyDirectSeekAndPlay(targetSeconds, true);
        } else if (!payload.isPlaying && isPlaying) {
          applyDirectSeekAndPlay(targetSeconds, false);
        }
      }
    }

    // Status update in Listening Together
    const actionMap = {
      'PLAY': 'memutar',
      'PAUSE': 'menjeda',
      'SEEK': 'menggeser durasi',
      'TRACK_CHANGE': 'memutar lagu'
    };
    const act = actionMap[payload.action] || 'memutar';
    const partnerName = payload.senderName || state.partnerName || 'Pasangan';
    updateJamLiveActivity(`🎧 ${partnerName} ${act} "${payload.trackTitle || ''}" (Synced)`);

  } catch (err) {
    console.warn('[SpotifyJam] Remote sync error:', err);
  } finally {
    remoteSyncUnlockTimer = setTimeout(() => {
      isRemotePlaybackSync = false;
    }, 700);
  }
}

function applyDirectSeekAndPlay(targetSec, shouldPlay) {
  if (currentEngine === 'youtube' && isYtReady && ytPlayer) {
    if (ytPlayer.seekTo) ytPlayer.seekTo(targetSec, true);
    if (shouldPlay && ytPlayer.playVideo) {
      ytPlayer.playVideo();
      isPlaying = true;
      updatePlayButtons();
    } else if (!shouldPlay && ytPlayer.pauseVideo) {
      try { ytPlayer.pauseVideo(); } catch (e) {}
      pauseAudio();
    }
  } else if (audio) {
    try {
      audio.currentTime = targetSec;
    } catch (e) {}
    if (shouldPlay) {
      playAudio();
    } else {
      pauseAudio();
    }
  }
}

function handlePresenceSync(presences) {
  if (!presences) return;
  const myDeviceId = window.MusicDB && window.MusicDB.getDeviceId ? window.MusicDB.getDeviceId() : null;
  let otherOnline = false;
  let otherDeviceName = state.partnerName || 'Nadia';

  Object.values(presences).forEach(deviceList => {
    (deviceList || []).forEach(dev => {
      if (dev.deviceId && dev.deviceId !== myDeviceId) {
        otherOnline = true;
        if (dev.userName) otherDeviceName = dev.userName;
      }
    });
  });

  const miniStatus = document.getElementById('miniPartnerStatusName');
  const miniJamAvatar2 = document.getElementById('miniJamAvatar2');
  if (miniStatus) miniStatus.textContent = otherDeviceName;
  if (miniJamAvatar2) {
    if (otherOnline) miniJamAvatar2.classList.add('live-ring');
    else miniJamAvatar2.classList.remove('live-ring');
  }
}

let presenceStateMap = {
  dhafin: false,
  nadia: false
};

function handleGlobalPresenceSync(presences) {
  const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
  const myUserId = (currentAcc ? currentAcc.id : (localStorage.getItem('romantic_current_user') || 'dhafin')).toLowerCase().trim();
  const myDeviceId = (window.MusicDB && typeof window.MusicDB.getDeviceId === 'function') ? window.MusicDB.getDeviceId() : null;

  const activeUserIds = new Set();
  activeUserIds.add(myUserId);

  if (presences && typeof presences === 'object') {
    Object.values(presences).forEach(deviceList => {
      if (Array.isArray(deviceList)) {
        deviceList.forEach(dev => {
          if (dev && dev.userId) {
            const devUser = String(dev.userId).toLowerCase().trim();
            // Abaikan data lama dari perangkat ini jika userId-nya berbeda dengan user yang aktif sekarang
            if (myDeviceId && dev.deviceId === myDeviceId && devUser !== myUserId) {
              return;
            }
            activeUserIds.add(devUser);
          }
        });
      }
    });
  }

  presenceStateMap.dhafin = activeUserIds.has('dhafin');
  presenceStateMap.nadia = activeUserIds.has('nadia');

  updatePresenceUI();
}

function updatePresenceUI() {
  const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
  if (!currentAcc) return;
  const yourId = (currentAcc.id || 'dhafin').toLowerCase();
  const partnerId = (currentAcc.partnerId || 'nadia').toLowerCase();

  // User yang sedang membuka browser ini SELALU 100% Online
  const isYourOnline = true;
  // Partner online jika terdeteksi di presenceStateMap (dari perangkat lain)
  const isPartnerOnline = (partnerId !== yourId) ? Boolean(presenceStateMap[partnerId]) : false;

  // 1. Update Profile Showcase Modal (Foto 2)
  const yourDot = document.getElementById('showcaseYourOnlineDot');
  const yourBadge = document.getElementById('showcaseYourStatusBadge');
  if (yourDot) {
    yourDot.className = isYourOnline
      ? 'absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs'
      : 'absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white shadow-xs';
    yourDot.title = isYourOnline ? 'Sedang Membuka Web' : 'Offline';
  }
  if (yourBadge) {
    yourBadge.className = isYourOnline
      ? 'inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'
      : 'inline-flex items-center gap-1 mt-1 text-[9px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200';
    yourBadge.innerHTML = isYourOnline
      ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online'
      : '<span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Offline';
  }

  const partnerDot = document.getElementById('showcasePartnerOnlineDot');
  const partnerBadge = document.getElementById('showcasePartnerStatusBadge');
  if (partnerDot) {
    partnerDot.className = isPartnerOnline
      ? 'absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs'
      : 'absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white shadow-xs';
    partnerDot.title = isPartnerOnline ? 'Sedang Membuka Web' : 'Offline';
  }
  if (partnerBadge) {
    partnerBadge.className = isPartnerOnline
      ? 'inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'
      : 'inline-flex items-center gap-1 mt-1 text-[9px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200';
    partnerBadge.innerHTML = isPartnerOnline
      ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online'
      : '<span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Offline';
  }

  // 2. Update mini partner status in Top Navbar
  const miniStatus = document.getElementById('miniPartnerStatusName');
  if (miniStatus) {
    miniStatus.innerHTML = `${currentAcc.partnerName} ${isPartnerOnline ? '<span class="text-emerald-500 text-[10px] font-bold">• Online</span>' : '<span class="text-[#9A737C] text-[10px] font-medium">• Offline</span>'}`;
  }
  if (typeof updateMiniJamStatusCard === 'function') {
    updateMiniJamStatusCard();
  }
}

// Global presence heartbeat: laporkan ke cloud setiap 25 detik
setInterval(() => {
  if (window.MusicDB && typeof window.MusicDB.trackPresence === 'function') {
    window.MusicDB.trackPresence();
  }
}, 25000);

// Unlock audio context on first touch for mobile devices
(function initMobileAudioUnlock() {
  const unlock = () => {
    if (audio) audio.load();
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('click', unlock, { once: true, passive: true });
})();

function toggleSyncMode() {
  const chk = document.getElementById('syncPlayToggle');
  if (chk) syncModeActive = chk.checked;
  const statusTxt = document.getElementById('jamLiveActivityText');
  if (!statusTxt) return;
  statusTxt.textContent = syncModeActive
    ? '🎧 Mendengarkan di detik yang sama'
    : '⏸ Sinkronisasi pemutaran dinonaktifkan';
}

function sendFloatingReaction(emoji, echoPartner = true) {
  spawnReactionAnimation(emoji);
  if (syncModeActive && window.MusicDB && typeof window.MusicDB.broadcastPlayback === 'function') {
    window.MusicDB.broadcastPlayback({
      action: 'REACTION',
      emoji: emoji,
      senderName: state.yourName || 'Pasangan'
    });
  }
  if (echoPartner) {
    setTimeout(() => {
      const partnerEmojis = ['🥰', '❤️', '🥺', '✨', '🌸'];
      const randomEcho = partnerEmojis[Math.floor(Math.random() * partnerEmojis.length)];
      spawnReactionAnimation(randomEcho);
      updateJamLiveActivity(`Sayang baru saja mengirim reaksi: ${randomEcho}`);
    }, 900);
  }
}

function spawnReactionAnimation(emoji) {
  const stage = document.getElementById('reactionStage');
  if (!stage) return;
  const el = document.createElement('div');
  el.className = 'floating-emoji';
  el.textContent = emoji;
  const randomOffset = (Math.random() * 40 - 20);
  el.style.right = `${24 + randomOffset}px`;
  stage.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}

function updateJamLiveActivity(text) {
  const el = document.getElementById('jamLiveActivityText');
  if (!el) return;
  el.textContent = text;
  setTimeout(() => {
    el.textContent = syncModeActive ? '🎧 Mendengarkan di detik yang sama' : 'Sinkronisasi siap';
  }, 4000);
}

function broadcastJamSystemNote(msg) {
  state.jamMessages.push({
    sender: 'system',
    text: msg,
    time: getCurrentTimeStr()
  });
  saveState();
  renderJamChat();
}

// Chat hanya ada di menu Listening Together; fungsi lama diteruskan ke renderer utama
function renderJamChat() {
  if (typeof renderMainJamChat === 'function') renderMainJamChat();
}


// ================= CHAT EMOJI POP-UP =================
const CHAT_INSERT_EMOJIS = ['😊', '😂', '🥰', '😍', '😘', '🥺', '😭', '😳', '😴', '🤗', '😌', '😜', '❤️', '💕', '💖', '🤍', '🌸', '✨', '🌙', '☕', '🎧', '🎶', '🔥', '👍'];

function buildChatEmojiInsertGrid() {
  const grid = document.getElementById('chatEmojiInsertGrid');
  if (!grid || grid.dataset.built) return;
  grid.innerHTML = CHAT_INSERT_EMOJIS.map(e =>
    `<button type="button" class="chat-emoji-btn chat-emoji-btn--sm" onclick="insertEmojiToChat('${e}')">${e}</button>`
  ).join('');
  grid.dataset.built = '1';
}

function toggleChatEmojiPopup(event) {
  if (event) event.stopPropagation();
  const popup = document.getElementById('chatEmojiPopup');
  if (!popup) return;
  buildChatEmojiInsertGrid();
  const willOpen = popup.classList.contains('hidden');
  popup.classList.toggle('hidden', !willOpen);
  const btn = document.getElementById('chatEmojiToggleBtn');
  if (btn) btn.setAttribute('aria-expanded', String(willOpen));
}

function closeChatEmojiPopup() {
  const popup = document.getElementById('chatEmojiPopup');
  if (popup) popup.classList.add('hidden');
  const btn = document.getElementById('chatEmojiToggleBtn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function insertEmojiToChat(emoji) {
  const input = document.getElementById('mainJamChatInput');
  if (!input) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = input.value.slice(0, start) + emoji + input.value.slice(end);
  const caret = start + emoji.length;
  input.focus();
  input.setSelectionRange(caret, caret);
}

function sendChatPopupReaction(emoji) {
  sendFloatingReaction(emoji, true);
  closeChatEmojiPopup();
}

// Tutup pop-up emoji saat klik di luar atau tekan Escape
document.addEventListener('click', (e) => {
  const popup = document.getElementById('chatEmojiPopup');
  if (!popup || popup.classList.contains('hidden')) return;
  const btn = document.getElementById('chatEmojiToggleBtn');
  if (!popup.contains(e.target) && !(btn && btn.contains(e.target))) closeChatEmojiPopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeChatEmojiPopup();
});

function simulatePartnerChatReply(userMessage) {
  const tracks = getActiveTracks();
  const currentSong = tracks[currentIndex]?.title || 'lagu ini';
  const sweetReplies = [
    `Iyaa, aku lagi dengerin "${currentSong}" juga nih sambil senyum-senyum ✦`,
    `Suka banget melodinya yang pas bagian ini ✨`,
    `Nanti malam kita dengerin bareng lagi yaa!`,
    `Lagu ini bener-bener ngingetin aku pas momen kita jalan bareng ✨`,
    `Lagu ini tenang banget dan punya banyak memori.`
  ];
  const reply = sweetReplies[Math.floor(Math.random() * sweetReplies.length)];
  const currentAcc = getCurrentAccount();

  if (!state.jamMessages) state.jamMessages = [];
  state.jamMessages.push({
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    roomId: currentJamRoomId,
    senderId: currentAcc.partnerId,
    senderName: currentAcc.partnerName,
    senderAvatar: currentAcc.partnerAvatar,
    sender: 'partner',
    text: reply,
    time: getCurrentTimeStr()
  });
  saveState();
  renderJamChat();
}

function simulatePartnerSweetAction() {
  const tracks = getActiveTracks();
  const currentSong = tracks[currentIndex]?.title || 'lagu kita';
  sendFloatingReaction('✦', false);
  broadcastJamSystemNote(`✦ Pasanganmu membagikan momen mendengarkan "${currentSong}"`);
}

function copyInviteLink() {
  const code = currentJamRoomId || document.getElementById('jamActiveRoomCode')?.textContent || 'LUV-2407';
  const url = `${window.location.origin}${window.location.pathname}?room=${code}`;
  navigator.clipboard.writeText(url).then(() => {
    showToastNotification(`Link Jam Session (${code}) disalin!`, 'success');
  }).catch(() => {
    alert(`Salin link sesi berdua: ${url}`);
  });
}

function getCurrentTimeStr() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}


// ================= DEDICATED LISTENING TOGETHER VIEW HELPERS =================
function updateMainJamView() {
  const currentTrack = getPlayingTrack() || getActiveTracks()[currentIndex] || {};
  const currentCover = currentTrack.cover || 'images/spotify_covers/jakarta.jpg';
  const coverEl = document.getElementById('mainJamCurrentCover');
  if (coverEl) coverEl.src = currentCover;

  const titleEl = document.getElementById('mainJamCurrentTitle');
  if (titleEl) titleEl.textContent = currentTrack.title || 'Belum ada lagu';

  const artistEl = document.getElementById('mainJamCurrentArtist');
  if (artistEl) artistEl.textContent = currentTrack.artist || 'Pilih lagu untuk diputar';

  const playIcon = document.getElementById('mainJamPlayIcon');
  if (playIcon) {
    playIcon.className = isPlaying ? 'fa-solid fa-pause text-lg' : 'fa-solid fa-play text-lg ml-0.5';
  }

  const youAv = document.getElementById('mainJamAvatarYou');
  if (youAv) youAv.src = state.yourAvatar;
  const partnerAv = document.getElementById('mainJamAvatarPartner');
  if (partnerAv) partnerAv.src = state.partnerAvatar;

  const nameYou = document.getElementById('mainJamNameYou');
  if (nameYou) nameYou.textContent = state.yourName;
  const namePartner = document.getElementById('mainJamNamePartner');
  if (namePartner) namePartner.textContent = state.partnerName;

  renderMainJamChat();
  renderJamRoomUI();
}

function renderMainJamChat() {
  const container = document.getElementById('mainJamChatContainer');
  if (!container) return;

  if (!currentJamRoomId) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center p-6 text-[#9A737C]">
        <div class="w-12 h-12 rounded-full bg-[#FFF0F3] border border-[#FFD2DC] flex items-center justify-center text-[#FA8072] mb-3 text-lg">
          <i class="fa-solid fa-door-open"></i>
        </div>
        <p class="text-xs font-bold text-[#3B2328]">Belum Terhubung ke Room</p>
        <p class="text-[11px] text-[#9A737C] mt-1 max-w-[240px]">Room chat secara default kosong. Klik <b>"+ Buat Baru"</b> atau masukkan ID Room di atas untuk mulai mengobrol & mendengarkan musik bersama 💕</p>
      </div>
    `;
    return;
  }

  const messages = state.jamMessages || [];
  if (messages.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center p-6 text-[#9A737C]">
        <div class="w-12 h-12 rounded-full bg-[#FFF0F3] border border-[#FFD2DC] flex items-center justify-center text-[#FA8072] mb-3 text-lg">
          <i class="fa-solid fa-sparkles"></i>
        </div>
        <p class="text-xs font-bold text-[#3B2328]">Room Sesi Aktif: <span class="font-mono text-[#FA8072]">${currentJamRoomId}</span></p>
        <p class="text-[11px] text-[#9A737C] mt-1 max-w-[250px]">Kirim pesan pertama ke pasanganmu atau mulai putar lagu bersama 🎵</p>
      </div>
    `;
    return;
  }

  const currentAcc = getCurrentAccount();
  container.innerHTML = messages.map(msg => {
    if (msg.sender === 'system') {
      return `
        <div class="text-center py-1">
          <span class="text-[10px] bg-[#FFF0F3] text-[#E85D75] px-2.5 py-0.5 rounded-full border border-[#FFD2DC]">${msg.text}</span>
        </div>
      `;
    }
    const isYou = (msg.senderId && msg.senderId === currentAcc.id) || (msg.sender === 'you' && (!msg.senderId || msg.senderId === currentAcc.id));
    const senderName = isYou ? currentAcc.name : (msg.senderName || currentAcc.partnerName);
    const senderAvatar = isYou ? currentAcc.avatar : (msg.senderAvatar || currentAcc.partnerAvatar);

    return `
      <div class="flex items-end gap-2 mb-2 ${isYou ? 'flex-row-reverse' : 'flex-row'}">
        <img src="${senderAvatar}" class="w-6 h-6 rounded-full object-cover border border-[#FFD2DC] shrink-0 mb-1 shadow-xs" alt="${senderName}" />
        <div class="flex flex-col ${isYou ? 'items-end' : 'items-start'} max-w-[80%]">
          <div class="flex items-center gap-1.5 mb-0.5 px-1">
            <span class="text-[10px] font-bold ${isYou ? 'text-[#FA8072]' : 'text-[#7A4E58]'}">${senderName}</span>
            <span class="text-[9px] text-[#9A737C]">${msg.time}</span>
          </div>
          <div class="px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${isYou
            ? 'bg-gradient-to-r from-[#FA8072] to-[#E85D75] text-white rounded-tr-none shadow-xs'
            : 'bg-[#FFF0F3] border border-[#FFD2DC] text-[#3B2328] rounded-tl-none shadow-xs'
          }">
            ${msg.text}
          </div>
        </div>
      </div>
    `;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

function sendMainJamChatMessage(event) {
  if (event) event.preventDefault();
  if (!currentJamRoomId) {
    showToastNotification('Silakan buat atau gabung room terlebih dahulu', 'warning');
    return;
  }

  const input = document.getElementById('mainJamChatInput');
  const text = (input?.value || '').trim();
  if (!text) return;

  const currentAcc = getCurrentAccount();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const msg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    roomId: currentJamRoomId,
    senderId: currentAcc.id,
    senderName: currentAcc.name,
    senderAvatar: currentAcc.avatar,
    sender: 'you',
    text: text,
    time: timeStr
  };

  if (!state.jamMessages) state.jamMessages = [];
  state.jamMessages.push(msg);
  saveState();

  if (window.MusicDB && typeof window.MusicDB.broadcastChatMessage === 'function') {
    window.MusicDB.broadcastChatMessage(msg);
  }

  input.value = '';
  renderMainJamChat();
  renderJamChat();
  sendFloatingReaction('💌', true);
}
