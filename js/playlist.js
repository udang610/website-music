// ================= PLAYLIST MANAGEMENT =================

// ================= CREATE & DELETE PLAYLIST =================
function openCreatePlaylistModal() {
  document.getElementById('newPlaylistTitle').value = '';
  document.getElementById('newPlaylistDesc').value = '';
  document.getElementById('newPlaylistCover').value = '';
  document.getElementById('createPlaylistModal').classList.remove('hidden');
  document.getElementById('createPlaylistModal').classList.add('flex');
}

function closeCreatePlaylistModal() {
  document.getElementById('createPlaylistModal').classList.add('hidden');
  document.getElementById('createPlaylistModal').classList.remove('flex');
}

function handleCreatePlaylistSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('newPlaylistTitle').value.trim();
  const desc = document.getElementById('newPlaylistDesc').value.trim() || 'Playlist kenangan kita berdua';
  const cover = document.getElementById('newPlaylistCover').value.trim() || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80';

  const newId = 'pl_' + Date.now();
  const newPl = {
    id: newId,
    title,
    desc,
    cover,
    tracks: []
  };

  state.playlists.push(newPl);
  state.activePlaylistId = newId;
  saveState();
  closeCreatePlaylistModal();

  showToastNotification(`Playlist "${title}" berhasil dibuat! ✨`, 'success');
  navigateTo('playlist', newId);
}

function deleteCurrentPlaylist() {
  const currentPl = getActivePlaylist();
  if (currentPl.isLikedSpecial || state.activePlaylistId === 'pl-liked') {
    showToastNotification('Playlist Liked Songs tidak dapat dihapus', 'info');
    return;
  }
  if (state.playlists.length <= 1) {
    showToastNotification('Minimal harus ada 1 playlist ya!', 'error');
    return;
  }
  if (confirm(`Yakin ingin menghapus playlist "${currentPl.title}"? Seluruh lagu di dalamnya akan terhapus.`)) {
    state.playlists = state.playlists.filter(p => p.id !== currentPl.id);
    state.activePlaylistId = state.playlists[0].id;
    saveState();
    showToastNotification(`Playlist "${currentPl.title}" telah dihapus`, 'info');
    navigateTo('home');
  }
}
