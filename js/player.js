// ================= DUAL AUDIO ENGINE & PLAYBACK =================

// ================= YOUTUBE REAL AUDIO ENGINE =================
window.onYouTubeIframeAPIReady = function () {
  const curTrack = (typeof getPlayingTrack === 'function') ? getPlayingTrack() : null;
  const initialYtId = (curTrack && curTrack.youtubeId) ? curTrack.youtubeId : '';

  ytPlayer = new YT.Player('ytPlayer', {
    height: '10',
    width: '10',
    videoId: initialYtId,
    playerVars: {
      autoplay: 0,
      playsinline: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      modestbranding: 1
    },
    events: {
      onReady: () => {
        isYtReady = true;
        console.log('YouTube Real Audio Engine ready');
        const t = (typeof getPlayingTrack === 'function') ? getPlayingTrack() : null;
        if (t && t.youtubeId && ytPlayer && ytPlayer.cueVideoById) {
          try { ytPlayer.cueVideoById(t.youtubeId); } catch (e) {}
        }
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          isPlaying = true;
          updatePlayButtons();
          startYtScrubber();
          if (currentView === 'playlist') renderTracklist();
        } else if (event.data === YT.PlayerState.PAUSED) {
          isPlaying = false;
          updatePlayButtons();
          stopYtScrubber();
          if (currentView === 'playlist') renderTracklist();
        } else if (event.data === YT.PlayerState.ENDED) {
          stopYtScrubber();
          if (isRepeat) {
            ytPlayer.seekTo(0, true);
            ytPlayer.playVideo();
          } else {
            nextTrack();
          }
        }
      },
      onError: (err) => {
        console.warn('YouTube notice, falling back to direct stream:', err);
        const t = getActiveTracks()[currentIndex];
        if (t && t.audioUrl) {
          currentEngine = 'html5';
          audio.src = t.audioUrl;
          if (isPlaying) {
            playAudio();
          }
        }
      }
    }
  });
};

function startYtScrubber() {
  stopYtScrubber();
  ytScrubTimer = setInterval(() => {
    if (isYtReady && ytPlayer && ytPlayer.getCurrentTime && isPlaying) {
      const cur = ytPlayer.getCurrentTime();
      const dur = ytPlayer.getDuration();
      if (dur && isFinite(dur) && dur > 0) {
        const pct = (cur / dur) * 100;
        const progressSlider = document.getElementById('progressSlider');
        if (progressSlider) progressSlider.value = pct;
        const curEl = document.getElementById('currentTimeText');
        if (curEl) curEl.textContent = formatTime(cur);
        const durEl = document.getElementById('durationTimeText');
        if (durEl) durEl.textContent = formatTime(dur);

        const mobSlider = document.getElementById('mobileProgressSlider');
        if (mobSlider) mobSlider.value = pct;
        const mobCur = document.getElementById('mobileCurrentTimeText');
        if (mobCur) mobCur.textContent = formatTime(cur);
        const mobDur = document.getElementById('mobileDurationTimeText');
        if (mobDur) mobDur.textContent = formatTime(dur);

        const tracks = getActiveTracks();
        if (tracks[currentIndex] && (!tracks[currentIndex].duration || tracks[currentIndex].duration === 'Full')) {
          tracks[currentIndex].duration = formatTime(dur);
          saveState();
          if (currentView === 'playlist') renderTracklist();
        }

        // MediaSession API position state sync
        updateMediaSessionPositionState();
      }
    }
  }, 300);
}

function stopYtScrubber() {
  if (ytScrubTimer) {
    clearInterval(ytScrubTimer);
    ytScrubTimer = null;
  }
}


// ================= DUAL ENGINE PLAYBACK (YOUTUBE REAL AUDIO + HTML5 AUDIO) =================
function loadTrack(index, autoPlay = true, playlistId = null) {
  if (playlistId) {
    currentPlayingPlaylistId = playlistId;
  }
  const tracks = getPlayingTracks();
  if (!tracks.length) return;
  currentPlayingIndex = (index + tracks.length) % tracks.length;
  currentIndex = currentPlayingIndex;
  const track = tracks[currentPlayingIndex];
  currentPlayingTrack = track;

  // Persist last played track so it is automatically restored on next visit
  try {
    const lastPlayedData = {
      playlistId: currentPlayingPlaylistId,
      trackIndex: currentPlayingIndex,
      trackId: track.id || null,
      trackTitle: track.title || null
    };
    localStorage.setItem('romantic_music_last_played', JSON.stringify(lastPlayedData));
  } catch (e) { }

  updateActiveTrackUI();
  if (currentView === 'playlist') renderTracklist();

  // If track matches local full audio file in realAudioTracks, prefer local file
  const lowTitle = (track.title || '').toLowerCase();
  const lowArtist = (track.artist || '').toLowerCase();
  const cleanSearch = `${lowTitle} ${lowArtist}`.replace(/[^a-z0-9]/g, ' ');

  if (typeof realAudioTracks !== 'undefined' && realAudioTracks) {
    for (const [key, localPath] of Object.entries(realAudioTracks)) {
      if (lowTitle.includes(key) || cleanSearch.includes(key)) {
        track.audioUrl = localPath;
        break;
      }
    }
  }

  // Also check officialCovers
  if (typeof officialCovers !== 'undefined' && officialCovers) {
    for (const [key, covPath] of Object.entries(officialCovers)) {
      if (lowTitle.includes(key) || cleanSearch.includes(key)) {
        track.cover = covPath;
        const bCover = document.getElementById('bottomTrackCover');
        if (bCover) bCover.src = covPath;
        const miniThumb = document.getElementById('actionMiniThumb');
        if (miniThumb) miniThumb.src = covPath;
        const heroCover = document.getElementById('heroVinylCover');
        if (heroCover) heroCover.src = covPath;
        const mobCover = document.getElementById('mobileVinylCenterArt');
        if (mobCover) mobCover.src = covPath;
        break;
      }
    }
  }

  // If track has a 30s preview link but also has youtubeId, strip the 30s link so full song plays!
  if (track.audioUrl && (track.audioUrl.includes('AudioPreview') || track.audioUrl.includes('itunes.apple.com') || track.audioUrl.includes('audio-ssl'))) {
    if (track.youtubeId) {
      track.audioUrl = '';
    }
  }

  // If track has neither audioUrl nor youtubeId, dynamically resolve full YouTube track
  if (!track.audioUrl && !track.youtubeId && track.title) {
    const qStr = `${track.artist || ''} ${track.title || ''}`.trim();
    fetch(`/api/search-youtube?q=${encodeURIComponent(qStr)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.youtubeId) {
          track.youtubeId = data.youtubeId;
          if (currentPlayingTrack === track) {
            currentEngine = 'youtube';
            if (isYtReady && ytPlayer) {
              if (isPlaying && ytPlayer.loadVideoById) {
                ytPlayer.loadVideoById(track.youtubeId);
              } else if (ytPlayer.cueVideoById) {
                ytPlayer.cueVideoById(track.youtubeId);
              }
            }
          }
        }
      }).catch(() => {});
  }

  // Check audio sources:
  // 1. Is it a real local full audio file?
  const isLocalFullAudio = track.audioUrl && (track.audioUrl.startsWith('audio/') || track.audioUrl.startsWith('blob:'));

  if (isLocalFullAudio) {
    // Play full studio local file via HTML5
    currentEngine = 'html5';
    if (isYtReady && ytPlayer && ytPlayer.pauseVideo) {
      try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    stopYtScrubber();
    if (!audio.src || !audio.src.includes(track.audioUrl)) {
      audio.src = track.audioUrl;
      audio.load();
    }
    if (autoPlay) {
      playAudio();
    }
  } else if (track.youtubeId) {
    // 2. Play full studio track via YouTube (NEVER 30s preview when YouTube full track is present!)
    currentEngine = 'youtube';
    try { audio.pause(); } catch (e) {}
    if (isYtReady && ytPlayer && ytPlayer.loadVideoById) {
      if (autoPlay) {
        ytPlayer.loadVideoById(track.youtubeId);
      } else {
        ytPlayer.cueVideoById(track.youtubeId);
      }
    } else {
      setTimeout(() => {
        if (isYtReady && ytPlayer && ytPlayer.loadVideoById) {
          if (autoPlay) ytPlayer.loadVideoById(track.youtubeId);
          else ytPlayer.cueVideoById(track.youtubeId);
        }
      }, 300);
    }
  } else if (track.audioUrl) {
    // 3. Last fallback: only if no local audio AND no YouTube stream was found
    currentEngine = 'html5';
    if (isYtReady && ytPlayer && ytPlayer.pauseVideo) {
      try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    stopYtScrubber();
    if (!audio.src || !audio.src.includes(track.audioUrl)) {
      audio.src = track.audioUrl;
      audio.load();
    }
    if (autoPlay) {
      playAudio();
    }
  }

  // Spotify Jam: Broadcast track change to partner
  if (!isRemotePlaybackSync && typeof syncModeActive !== 'undefined' && syncModeActive) {
    if (typeof broadcastPlaybackState === 'function') {
      broadcastPlaybackState('TRACK_CHANGE', 0, autoPlay);
    }
  }
}

function playTrackByObject(trackObj) {
  const tracks = getActiveTracks();
  const foundIdx = tracks.findIndex(t => t.id === trackObj.id);
  if (foundIdx !== -1) {
    loadTrack(foundIdx, true, state.activePlaylistId);
  } else {
    // Fallback direct play
    currentPlayingTrack = trackObj;
    updateActiveTrackUI();
    const isMobile = (window.innerWidth < 1024) || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (trackObj.audioUrl && (isMobile || !trackObj.youtubeId)) {
      currentEngine = 'html5';
      if (ytPlayer && ytPlayer.pauseVideo) try { ytPlayer.pauseVideo(); } catch (e) {}
      stopYtScrubber();
      audio.src = trackObj.audioUrl;
      audio.load();
      playAudio();
    } else if (trackObj.youtubeId && isYtReady && ytPlayer) {
      currentEngine = 'youtube';
      try { audio.pause(); } catch (e) {}
      ytPlayer.loadVideoById(trackObj.youtubeId);
    } else if (trackObj.audioUrl) {
      currentEngine = 'html5';
      audio.src = trackObj.audioUrl;
      audio.load();
      playAudio();
    }
  }
}

function updateActiveTrackUI() {
  const track = getPlayingTrack();
  if (!track) return;

  const playingPl = getPlayingPlaylist();
  const canvasPlName = document.getElementById('rightCanvasPlaylistName');
  if (canvasPlName && playingPl) {
    canvasPlName.textContent = playingPl.title;
  }

  // Bottom Player Bar
  document.getElementById('bottomTrackCover').src = track.cover;
  document.getElementById('bottomTrackTitle').textContent = track.title;
  document.getElementById('bottomTrackArtist').textContent = track.artist;

  // Action bar mini preview thumb
  const miniThumb = document.getElementById('actionMiniThumb');
  if (miniThumb) miniThumb.src = track.cover;

  // Right Canvas Panel
  document.getElementById('rightCanvasImage').src = track.cover;
  document.getElementById('vinylCenterArt').src = track.cover;
  document.getElementById('rightTrackTitle').textContent = track.title;
  document.getElementById('rightTrackArtist').textContent = track.artist;
  renderMemoryNote(track);

  // Polaroid Modal
  if (typeof updatePolaroidModal === 'function') {
    updatePolaroidModal(track);
  }

  // Like status
  const likeIcon = track.liked ? '<i class="fa-solid fa-heart text-[#FF4D6D]"></i>' : '<i class="fa-regular fa-heart text-white"></i>';
  document.getElementById('rightLikeBtn').innerHTML = likeIcon;

  // Mobile Turntable Center Art & Meta
  const mobCover = document.getElementById('mobileVinylCenterArt');
  if (mobCover) mobCover.src = track.cover;
  const mobTitle = document.getElementById('mobileTrackTitle');
  if (mobTitle) mobTitle.textContent = track.title;
  const mobArtist = document.getElementById('mobileTrackArtist');
  if (mobArtist) mobArtist.textContent = track.artist;
  // Mobile memory note di-render oleh renderMemoryNote()

  const mobLikeBtn = document.getElementById('mobileLikeBtn');
  if (mobLikeBtn) {
    mobLikeBtn.innerHTML = track.liked
      ? '<i class="fa-solid fa-heart text-[#FF4D6D]"></i>'
      : '<i class="fa-regular fa-heart text-[#9A737C]"></i>';
  }

  // Dedicated Listening Together View Card (Selalu sinkron dengan player bawah & canvas!)
  const mainJamCover = document.getElementById('mainJamCurrentCover');
  if (mainJamCover) mainJamCover.src = track.cover;
  const mainJamTitle = document.getElementById('mainJamCurrentTitle');
  if (mainJamTitle) mainJamTitle.textContent = track.title;
  const mainJamArtist = document.getElementById('mainJamCurrentArtist');
  if (mainJamArtist) mainJamArtist.textContent = track.artist;
  const mainJamPlayIcon = document.getElementById('mainJamPlayIcon');
  if (mainJamPlayIcon) {
    mainJamPlayIcon.className = isPlaying ? 'fa-solid fa-pause text-lg' : 'fa-solid fa-play text-lg ml-0.5';
  }

  // MediaSession API: Sync Lock Screen & Bluetooth Headset Metadata
  updateMediaSessionMetadata(track);
}

function selectTrackFromList(index) {
  isRemotePlaybackSync = false;
  if (typeof lastRemoteSyncTime !== 'undefined') lastRemoteSyncTime = 0;
  const tracks = getActiveTracks();
  const targetTrack = tracks[index];
  const currentPlaying = getPlayingTrack();
  const isSameTrack = Boolean(currentPlaying && targetTrack && (
    (targetTrack.id && currentPlaying.id === targetTrack.id) ||
    (targetTrack.title && currentPlaying.title && targetTrack.title.toLowerCase().trim() === currentPlaying.title.toLowerCase().trim())
  ));
  const isPlayingThisPlaylist = currentPlayingPlaylistId === state.activePlaylistId;

  if (isPlayingThisPlaylist && isSameTrack && isPlaying) {
    togglePlay();
  } else {
    loadTrack(index, true, state.activePlaylistId);
    if (syncModeActive && targetTrack) {
      broadcastJamSystemNote(`🎧 Kamu memutar "${targetTrack.title}" untuk didengarkan berdua`);
    }
  }
  // Buka tampilan piringan hitam estetik secara detail jika di mobile
  if (window.innerWidth < 1024) {
    openMobileDetailPlayer();
  }
}

function playAudio() {
  if (!audio.src || audio.src === window.location.href) {
    const track = getPlayingTrack();
    if (track && track.audioUrl) {
      audio.src = track.audioUrl;
      audio.load();
    }
  }
  const promise = audio.play();
  if (promise !== undefined) {
    promise.then(() => {
      isPlaying = true;
      updatePlayButtons();
      if (currentView === 'playlist') renderTracklist();

      // Spotify Jam: broadcast PLAY
      if (!isRemotePlaybackSync && typeof syncModeActive !== 'undefined' && syncModeActive) {
        if (typeof broadcastPlaybackState === 'function') {
          broadcastPlaybackState('PLAY', audio.currentTime || 0, true);
        }
      }
    }).catch(err => {
      console.warn('Audio playback notice:', err);
      if (err && (err.name === 'NotAllowedError' || String(err).includes('interact'))) {
        const track = typeof getPlayingTrack === 'function' ? getPlayingTrack() : null;
        const currentAcc = (typeof getCurrentAccount === 'function') ? getCurrentAccount() : null;
        const partnerName = currentAcc ? currentAcc.partnerName : 'Pasangan';
        if (typeof showToastNotification === 'function' && track) {
          showToastNotification(`🎧 ${partnerName} memutar "${track.title}" • Ketuk layar untuk dengar bareng 💕`, 'music');
        }
      }
      // Fallback to YouTube if available
      const track = getPlayingTrack();
      if (track && track.youtubeId && isYtReady && ytPlayer && ytPlayer.loadVideoById) {
        currentEngine = 'youtube';
    if (isPlaying && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(track.youtubeId);
    } else if (ytPlayer.cueVideoById) {
      ytPlayer.cueVideoById(track.youtubeId);
    }
      } else {
        isPlaying = false;
        updatePlayButtons();
      }
    });
  }
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  updatePlayButtons();
  if (currentView === 'playlist') renderTracklist();

  // Spotify Jam: broadcast PAUSE
  if (!isRemotePlaybackSync && typeof syncModeActive !== 'undefined' && syncModeActive) {
    if (typeof broadcastPlaybackState === 'function') {
      const curPos = (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.getCurrentTime)
        ? ytPlayer.getCurrentTime()
        : (audio.currentTime || 0);
      broadcastPlaybackState('PAUSE', curPos, false);
    }
  }
}

function togglePlay() {
  isRemotePlaybackSync = false;
  if (typeof lastRemoteSyncTime !== 'undefined') lastRemoteSyncTime = 0;
  const track = getPlayingTrack();
  if (!track) {
    const plTracks = getPlayingTracks();
    if (plTracks && plTracks.length) {
      loadTrack(0, true, currentPlayingPlaylistId);
      return;
    }
    const actTracks = getActiveTracks();
    if (actTracks && actTracks.length) {
      loadTrack(0, true, state.activePlaylistId);
      return;
    }
    return;
  }

  if (isPlaying) {
    if (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.pauseVideo) {
      try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    pauseAudio();
  } else {
    if (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
      isPlaying = true;
      updatePlayButtons();
      if (!isRemotePlaybackSync && typeof syncModeActive !== 'undefined' && syncModeActive) {
        if (typeof broadcastPlaybackState === 'function') {
          broadcastPlaybackState('PLAY', ytPlayer.getCurrentTime ? ytPlayer.getCurrentTime() : 0, true);
        }
      }
    } else {
      playAudio();
    }
  }
}

function updatePlayButtons() {
  const heroIcon = document.getElementById('heroPlayIcon');
  const bottomIcon = document.getElementById('bottomPlayIcon');
  const vinylDisc = document.getElementById('vinylDisc');
  const vinylTonearm = document.getElementById('vinylTonearm');
  const mainJamPlayIcon = document.getElementById('mainJamPlayIcon');
  const mobilePlayIcon = document.getElementById('mobilePlayIcon');
  const mobileVinylDisc = document.getElementById('mobileVinylDisc');
  const mobileVinylTonearm = document.getElementById('mobileVinylTonearm');

  if (isPlaying) {
    if (heroIcon) heroIcon.className = 'fa-solid fa-pause text-xl';
    bottomIcon.className = 'fa-solid fa-pause text-xs';
    if (vinylDisc) vinylDisc.classList.add('playing');
    if (vinylTonearm) vinylTonearm.classList.add('playing');
    if (mainJamPlayIcon) mainJamPlayIcon.className = 'fa-solid fa-pause text-xl';
    if (mobilePlayIcon) mobilePlayIcon.className = 'fa-solid fa-pause text-2xl text-white';
    if (mobileVinylDisc) mobileVinylDisc.classList.add('playing');
    if (mobileVinylTonearm) mobileVinylTonearm.classList.add('playing');
  } else {
    if (heroIcon) heroIcon.className = 'fa-solid fa-play text-xl ml-0.5';
    bottomIcon.className = 'fa-solid fa-play text-xs ml-0.5';
    if (vinylDisc) vinylDisc.classList.remove('playing');
    if (vinylTonearm) vinylTonearm.classList.remove('playing');
    if (mainJamPlayIcon) mainJamPlayIcon.className = 'fa-solid fa-play text-xl ml-0.5';
    if (mobilePlayIcon) mobilePlayIcon.className = 'fa-solid fa-play text-2xl ml-1 text-white';
    if (mobileVinylDisc) mobileVinylDisc.classList.remove('playing');
    if (mobileVinylTonearm) mobileVinylTonearm.classList.remove('playing');
  }

  // MediaSession API: Sync Playback State (Lock Screen Play/Pause)
  updateMediaSessionPlaybackState();
}

function nextTrack() {
  const tracks = getPlayingTracks();
  if (!tracks.length) return;
  if (isShuffle) {
    const rand = Math.floor(Math.random() * tracks.length);
    loadTrack(rand, true, currentPlayingPlaylistId);
  } else {
    loadTrack(currentPlayingIndex + 1, true, currentPlayingPlaylistId);
  }
}

function prevTrack() {
  if (currentEngine === 'youtube' && isYtReady && ytPlayer) {
    if (ytPlayer.getCurrentTime() > 3) {
      ytPlayer.seekTo(0, true);
    } else {
      loadTrack(currentPlayingIndex - 1, true, currentPlayingPlaylistId);
    }
  } else {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      loadTrack(currentPlayingIndex - 1, true, currentPlayingPlaylistId);
    }
  }
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  const btnTop = document.getElementById('btnShuffleTop');
  if (btnTop) btnTop.classList.toggle('text-[#FA8072]', isShuffle);
  const btnBottom = document.getElementById('btnShuffleBottom');
  if (btnBottom) btnBottom.classList.toggle('text-[#FA8072]', isShuffle);
  const mobShuffle = document.getElementById('mobileShuffleBtn');
  if (mobShuffle) mobShuffle.classList.toggle('text-[#FA8072]', isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  const btnBottom = document.getElementById('btnRepeatBottom');
  if (btnBottom) btnBottom.classList.toggle('text-[#FA8072]', isRepeat);
}

// HTML5 Audio Time & Metadata Updates
audio.addEventListener('timeupdate', () => {
  if (currentEngine === 'html5' && audio.duration && isFinite(audio.duration)) {
    const pct = (audio.currentTime / audio.duration) * 100;
    const progressSlider = document.getElementById('progressSlider');
    if (progressSlider) progressSlider.value = pct;
    const curEl = document.getElementById('currentTimeText');
    if (curEl) curEl.textContent = formatTime(audio.currentTime);
    const durEl = document.getElementById('durationTimeText');
    if (durEl) durEl.textContent = formatTime(audio.duration);

    const mobSlider = document.getElementById('mobileProgressSlider');
    if (mobSlider) mobSlider.value = pct;
    const mobCur = document.getElementById('mobileCurrentTimeText');
    if (mobCur) mobCur.textContent = formatTime(audio.currentTime);
    const mobDur = document.getElementById('mobileDurationTimeText');
    if (mobDur) mobDur.textContent = formatTime(audio.duration);

    // MediaSession API position state sync
    updateMediaSessionPositionState();
  }
});

audio.addEventListener('loadedmetadata', () => {
  if (currentEngine === 'html5' && audio.duration && isFinite(audio.duration)) {
    // Never overwrite song duration if audio source is an iTunes 30-second snippet!
    const isSnippet = audio.src && (audio.src.includes('audio-ssl') || audio.src.includes('itunes.apple.com'));
    if (isSnippet) return;

    const dur = formatTime(audio.duration);
    const durEl = document.getElementById('durationTimeText');
    if (durEl) durEl.textContent = dur;
    const mobDur = document.getElementById('mobileDurationTimeText');
    if (mobDur) mobDur.textContent = dur;
    const tracks = getActiveTracks();
    if (tracks[currentIndex]) {
      tracks[currentIndex].duration = dur;
      saveState();
      if (currentView === 'playlist') renderTracklist();
    }
  }
});

audio.addEventListener('ended', () => {
  if (currentEngine === 'html5') {
    const track = getPlayingTrack();
    const isSnippet = track && track.audioUrl && (track.audioUrl.includes('audio-ssl') || track.audioUrl.includes('itunes.apple.com'));
    if (isSnippet) {
      isPlaying = false;
      updatePlayButtons();
      showToastNotification('Cuplikan resmi 30 detik selesai. Jalankan script python untuk audio full! 🎵', 'info');
      return;
    }
    if (isRepeat) {
      audio.currentTime = 0;
      playAudio();
    } else {
      nextTrack();
    }
  }
});

audio.addEventListener('error', (e) => {
  console.warn('HTML5 Audio error event:', e);
  const track = getPlayingTrack();
  if (track && track.youtubeId && isYtReady && ytPlayer && ytPlayer.loadVideoById) {
    currentEngine = 'youtube';
    ytPlayer.loadVideoById(track.youtubeId);
  } else {
    isPlaying = false;
    updatePlayButtons();
  }
});

function seekAudio(val) {
  let targetSec = 0;
  if (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.getDuration) {
    const dur = ytPlayer.getDuration();
    if (dur && isFinite(dur)) {
      targetSec = (val / 100) * dur;
      ytPlayer.seekTo(targetSec, true);
    }
  } else if (audio.duration) {
    targetSec = (val / 100) * audio.duration;
    audio.currentTime = targetSec;
  }

  // MediaSession API position state sync
  updateMediaSessionPositionState();

  // Spotify Jam: broadcast debounced seek to partner
  if (!isRemotePlaybackSync && typeof syncModeActive !== 'undefined' && syncModeActive) {
    if (typeof scheduleBroadcastSeek === 'function') {
      scheduleBroadcastSeek(targetSec);
    }
  }
}

function changeVolume(val) {
  audio.volume = parseFloat(val);
  if (isYtReady && ytPlayer && ytPlayer.setVolume) {
    ytPlayer.setVolume(parseFloat(val) * 100);
  }
}

function toggleMute() {
  audio.muted = !audio.muted;
  if (isYtReady && ytPlayer && ytPlayer.isMuted) {
    if (audio.muted) ytPlayer.mute();
    else ytPlayer.unMute();
  }
  document.getElementById('volumeIcon').className = audio.muted
    ? 'fa-solid fa-volume-xmark text-xs cursor-pointer text-rose-500'
    : 'fa-solid fa-volume-high text-xs cursor-pointer hover:text-[#FA8072]';
}

function formatTime(sec) {
  if (isNaN(sec) || !isFinite(sec)) return '0:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Extract YouTube ID from various YouTube URL formats
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// =====================================================================
// MEDIASESSION API INTEGRATION (LOCK SCREEN & BLUETOOTH HEADPHONE CONTROLS)
// =====================================================================

function getCurrentPlaybackSeconds() {
  if (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.getCurrentTime) {
    try {
      const cur = ytPlayer.getCurrentTime();
      return (cur && isFinite(cur)) ? cur : 0;
    } catch (e) {
      return 0;
    }
  }
  return (audio && isFinite(audio.currentTime)) ? (audio.currentTime || 0) : 0;
}

function getCurrentPlaybackDuration() {
  if (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.getDuration) {
    try {
      const dur = ytPlayer.getDuration();
      return (dur && isFinite(dur)) ? dur : 0;
    } catch (e) {
      return 0;
    }
  }
  return (audio && isFinite(audio.duration)) ? (audio.duration || 0) : 0;
}

function seekToSeconds(sec) {
  if (typeof sec !== 'number' || isNaN(sec) || !isFinite(sec)) return;
  sec = Math.max(0, sec);
  const dur = getCurrentPlaybackDuration();
  if (dur > 0 && sec > dur) sec = dur;

  if (currentEngine === 'youtube' && isYtReady && ytPlayer && ytPlayer.seekTo) {
    try { ytPlayer.seekTo(sec, true); } catch (e) {}
  } else if (audio && audio.duration) {
    try { audio.currentTime = sec; } catch (e) {}
  }

  // Update slider UI
  if (dur > 0) {
    const pct = (sec / dur) * 100;
    const progressSlider = document.getElementById('progressSlider');
    if (progressSlider) progressSlider.value = pct;
    const mobSlider = document.getElementById('mobileProgressSlider');
    if (mobSlider) mobSlider.value = pct;
  }
  const curEl = document.getElementById('currentTimeText');
  if (curEl) curEl.textContent = formatTime(sec);
  const mobCur = document.getElementById('mobileCurrentTimeText');
  if (mobCur) mobCur.textContent = formatTime(sec);

  // Sync position with MediaSession
  updateMediaSessionPositionState();

  // Spotify Jam: broadcast seek to partner
  if (!isRemotePlaybackSync && typeof syncModeActive !== 'undefined' && syncModeActive) {
    if (typeof scheduleBroadcastSeek === 'function') {
      scheduleBroadcastSeek(sec);
    }
  }
}

function updateMediaSessionMetadata(track) {
  if (!('mediaSession' in navigator) || !track) return;

  const currentPl = (typeof getPlayingPlaylist === 'function') ? getPlayingPlaylist() : null;
  let albumName = 'Lullaby • Our Melodies 💕';
  if (currentPl && currentPl.title) {
    albumName = `Lullaby • ${currentPl.title}`;
  }

  // Convert cover URL to absolute URL and upgrade iTunes covers to 1000x1000 HD
  let rawCover = track.cover || 'images/icons/icon-512.png';
  if (typeof rawCover === 'string' && rawCover.includes('apple.com')) {
    rawCover = rawCover.replace(/\/\d+x\d+bb\./, '/1000x1000bb.');
  }

  let artworkUrl = rawCover;
  try {
    artworkUrl = new URL(artworkUrl, window.location.href).href;
  } catch (e) {}

  // Determine correct MIME type for OS bitmap renderer
  let mimeType = 'image/jpeg';
  const cleanExt = (artworkUrl.split('?')[0] || '').toLowerCase();
  if (cleanExt.endsWith('.png')) mimeType = 'image/png';
  else if (cleanExt.endsWith('.webp')) mimeType = 'image/webp';
  else if (cleanExt.endsWith('.svg')) mimeType = 'image/svg+xml';

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || 'Lullaby',
      artist: track.artist || 'Our Melodies',
      album: albumName,
      artwork: [
        { src: artworkUrl, sizes: '96x96', type: mimeType },
        { src: artworkUrl, sizes: '128x128', type: mimeType },
        { src: artworkUrl, sizes: '192x192', type: mimeType },
        { src: artworkUrl, sizes: '256x256', type: mimeType },
        { src: artworkUrl, sizes: '384x384', type: mimeType },
        { src: artworkUrl, sizes: '512x512', type: mimeType },
        { src: artworkUrl, sizes: '1024x1024', type: mimeType }
      ]
    });
  } catch (err) {
    console.warn('[MediaSession] Metadata update error:', err);
  }

  updateMediaSessionPlaybackState();
  updateMediaSessionPositionState();
}

function updateMediaSessionPlaybackState() {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  } catch (e) {}
}

function updateMediaSessionPositionState() {
  if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession)) return;
  try {
    const duration = getCurrentPlaybackDuration();
    const position = getCurrentPlaybackSeconds();
    if (duration > 0 && position >= 0 && position <= duration) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1.0,
        position: position
      });
    }
  } catch (e) {
    // Silently ignore position errors during rapid transitions
  }
}

let isMediaSessionInitialized = false;
function initMediaSession() {
  if (!('mediaSession' in navigator) || isMediaSessionInitialized) return;
  isMediaSessionInitialized = true;

  const safeAction = (action, handler) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (e) {
      // Action might not be supported on this browser version
    }
  };

  safeAction('play', () => {
    if (!isPlaying) togglePlay();
  });

  safeAction('pause', () => {
    if (isPlaying) togglePlay();
  });

  safeAction('previoustrack', () => {
    prevTrack();
  });

  safeAction('nexttrack', () => {
    nextTrack();
  });

  safeAction('seekto', (details) => {
    if (details && typeof details.seekTime === 'number') {
      seekToSeconds(details.seekTime);
    }
  });

  safeAction('seekbackward', (details) => {
    const skipTime = (details && details.seekOffset) ? details.seekOffset : 10;
    const curTime = getCurrentPlaybackSeconds();
    seekToSeconds(Math.max(0, curTime - skipTime));
  });

  safeAction('seekforward', (details) => {
    const skipTime = (details && details.seekOffset) ? details.seekOffset : 10;
    const curTime = getCurrentPlaybackSeconds();
    const dur = getCurrentPlaybackDuration();
    seekToSeconds(dur > 0 ? Math.min(dur, curTime + skipTime) : (curTime + skipTime));
  });

  safeAction('stop', () => {
    if (isPlaying) togglePlay();
  });
}

// Auto-initialize MediaSession
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaSession, { once: true });
  } else {
    initMediaSession();
  }
}

