// ================= POLAROID MEMORIES GALLERY =================

// ================= POLAROID TRACK PREVIEW (MODAL 4) =================
function updatePolaroidModal(track) {
  if (!track) {
    track = (typeof getPlayingTrack === 'function' ? getPlayingTrack() : null) ||
      (state.playlists && state.playlists[0] && state.playlists[0].tracks && state.playlists[0].tracks[0]);
  }
  if (!track) return;

  const polaroidImg = document.getElementById('polaroidImg');
  const polaroidTitle = document.getElementById('polaroidTitle');
  const polaroidMemory = document.getElementById('polaroidMemory');

  if (polaroidImg) {
    polaroidImg.src = track.cover || 'images/spotify_covers/jakarta.jpg';
  }
  if (polaroidTitle) {
    polaroidTitle.textContent = `${track.title} — ${track.artist || ''}`;
  }

  // Teks sweet note HANYA akan muncul jika sebelumnya di field sweet note sudah diisi, polos tanpa button tambahan
  const memory = (track.memory || '').trim();
  if (polaroidMemory) {
    if (memory) {
      polaroidMemory.textContent = `"${memory}"`;
      polaroidMemory.classList.remove('hidden');
    } else {
      polaroidMemory.textContent = '';
      polaroidMemory.classList.add('hidden');
    }
  }
}

function togglePolaroidModal() {
  const modal = document.getElementById('polaroidModal');
  if (!modal) return;
  const isOpening = modal.classList.contains('hidden');
  modal.classList.toggle('hidden');
  modal.classList.toggle('flex');
  if (isOpening) {
    updatePolaroidModal();
  }
}


// ================= DEDICATED POLAROID MEMORIES GALLERY ENGINE =================
let pendingDeletePolaroidId = null;
let currentDetailPolaroidId = null;
let galleryFrameType = 'classic';
try {
  const savedFrame = localStorage.getItem('polaroid_gallery_frame_type');
  if (savedFrame) galleryFrameType = savedFrame;
} catch (e) { }

function setGalleryFrameType(type) {
  const allowed = ['classic', 'instax', 'filmstrip', 'scrapbook', 'slide'];
  if (!allowed.includes(type)) type = 'classic';
  galleryFrameType = type;
  try {
    localStorage.setItem('polaroid_gallery_frame_type', type);
  } catch (e) { }
  updateGalleryFrameTypeButtons();
  renderPolaroidGallery();
}

function updateGalleryFrameTypeButtons() {
  document.querySelectorAll('.gallery-frame-btn').forEach(btn => {
    const isCurrent = btn.getAttribute('data-frametype') === galleryFrameType;
    if (isCurrent) {
      btn.className = 'gallery-frame-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-[#FA8072] text-white shadow-md scale-105';
    } else {
      btn.className = 'gallery-frame-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white border border-[#FFD2DC] text-[#7A5862] hover:bg-[#FFF5F7] shadow-2xs';
    }
  });
}

function renderPolaroidGallery() {
  const container = document.getElementById('polaroidGalleryGrid');
  if (!container) return;

  updateGalleryFrameTypeButtons();

  const memories = state.polaroidMemories || [];
  const btnClearAll = document.getElementById('btnClearAllPolaroids');
  if (btnClearAll) {
    if (!memories.length) btnClearAll.classList.add('hidden');
    else btnClearAll.classList.remove('hidden');
  }
  if (!memories.length) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 rounded-3xl bg-[#FFF0F3] text-[#E85D75] flex items-center justify-center mx-auto mb-3 shadow-xs border border-[#FFD2DC]">
          <i class="fa-solid fa-camera-retro text-2xl"></i>
        </div>
        <h3 class="text-base font-extrabold text-[#3B2328]">Belum Ada Foto Polaroid</h3>
        <p class="text-xs text-[#9A737C] mt-1 mb-4">Yuk abadikan foto momen manis kalian berdua sekarang!</p>
        <button onclick="openAddPolaroidModal()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FA8072] to-[#E85D75] text-white text-xs font-bold shadow-md shadow-[#FA8072]/25 hover:opacity-95 transition">
          + Tambah
        </button>
      </div>
    `;
    return;
  }

  const tilts = ['polaroid-tilt-left', 'polaroid-tilt-right', 'polaroid-tilt-subtle', ''];

  container.innerHTML = memories.map((item, idx) => {
    const tiltClass = (typeof window !== 'undefined' && window.innerWidth < 1024) ? '' : tilts[idx % tilts.length];
    const hoverOverlay = `
      <div class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2 z-20" onclick="event.stopPropagation()">
        <button onclick="viewPolaroidDetail('${item.id}')" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#3B2328] hover:text-[#FA8072] flex items-center justify-center shadow-md transition" title="Lihat Foto Penuh">
          <i class="fa-solid fa-expand text-[10px] sm:text-xs"></i>
        </button>
        <button onclick="openEditPolaroidModal('${item.id}')" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#3B2328] hover:text-[#FA8072] flex items-center justify-center shadow-md transition" title="Edit Polaroid">
          <i class="fa-solid fa-pen-to-square text-[10px] sm:text-xs"></i>
        </button>
        <button onclick="confirmDeletePolaroid('${item.id}')" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-md transition" title="Hapus Polaroid">
          <i class="fa-solid fa-trash-can text-[10px] sm:text-xs"></i>
        </button>
      </div>
    `;

    // 1. Instax Mini Film Frame
    if (galleryFrameType === 'instax') {
      return `
        <div class="polaroid-card frame-type-instax w-full ${tiltClass} group cursor-pointer transition-all duration-300 relative bg-[#FCFAF8] border border-[#E5DCD4] p-2.5 sm:p-3 pb-8 sm:pb-9 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1" onclick="viewPolaroidDetail('${item.id}')">
          <div class="flex justify-between items-center px-1 mb-1.5 text-[9px] font-extrabold tracking-widest text-[#B5A599] uppercase">
            <span>INSTAX MINI</span>
            <span class="w-1.5 h-1.5 rounded-full bg-[#FA8072]/70"></span>
          </div>
          <div class="w-full aspect-[3/4] bg-[#F7F2EC] rounded-lg overflow-hidden mb-2 relative border border-[#EDE4DC] flex items-center justify-center shadow-xs">
            <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Instax photo" loading="lazy" />
            ${hoverOverlay}
          </div>
          <p class="font-handwriting text-base sm:text-lg text-[#42332B] text-center leading-snug px-1 line-clamp-2 min-h-[2.2rem] flex items-center justify-center">
            ${item.caption || 'Sweet Memory ✦'}
          </p>
          <div class="flex items-center justify-between text-[10px] font-semibold text-[#8C7A6E] mt-1 px-1">
            <span class="truncate max-w-[50%]">${item.date || 'Sweet moment'}</span>
            <span class="text-[#E85D75] truncate max-w-[48%] text-right">${item.location || 'Special place'}</span>
          </div>
        </div>
      `;
    }

    // 2. 35mm Film Strip Frame
    if (galleryFrameType === 'filmstrip') {
      return `
        <div class="polaroid-card frame-type-filmstrip w-full ${tiltClass} group cursor-pointer transition-all duration-300 relative bg-[#141216] border border-[#2B2533] text-white p-2.5 pb-4 rounded-xs shadow-xl hover:shadow-2xl hover:-translate-y-1" onclick="viewPolaroidDetail('${item.id}')">
          <div class="flex justify-between items-center px-1 py-1 mb-1">
            <span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span>
          </div>
          <div class="w-full aspect-[4/3] bg-neutral-900 rounded-none overflow-hidden relative border border-[#3A3342] flex items-center justify-center">
            <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="35mm Film photo" loading="lazy" />
            ${hoverOverlay}
          </div>
          <div class="flex justify-between items-center px-1 py-1 mt-1 mb-1">
            <span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span><span class="sprocket-hole"></span>
          </div>
          <div class="flex justify-between items-center text-[9px] font-mono text-[#F59E0B] px-1 font-bold">
            <span>▶ 24A</span>
            <span>PORTRA 400</span>
            <span>SAFETY FILM</span>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-neutral-100 text-center leading-snug px-1 line-clamp-2 min-h-[2rem] flex items-center justify-center mt-1">
            ${item.caption || '35mm Film Memory ✦'}
          </p>
          <div class="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-1 px-1">
            <span class="truncate max-w-[50%]">${item.date || 'Analog shot'}</span>
            <span class="text-[#FBBF24] truncate max-w-[48%] text-right">${item.location || 'Location'}</span>
          </div>
        </div>
      `;
    }

    // 3. Scrapbook Stamp Frame
    if (galleryFrameType === 'scrapbook') {
      return `
        <div class="polaroid-card frame-type-scrapbook w-full ${tiltClass} group cursor-pointer transition-all duration-300 relative bg-[#FAF6EE] border-2 border-dashed border-[#D2C3AA] p-3 sm:p-3.5 pb-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1" onclick="viewPolaroidDetail('${item.id}')">
          <div class="scrapbook-tape-left"></div>
          <div class="scrapbook-tape-right"></div>
          <div class="scrapbook-stamp-badge"><i class="fa-solid fa-stamp mr-0.5"></i> MEMORY</div>
          <div class="w-full aspect-square bg-[#F5ECE0] rounded-sm overflow-hidden mb-2.5 relative border border-[#E3D4C1] flex items-center justify-center shadow-2xs">
            <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Scrapbook photo" loading="lazy" />
            ${hoverOverlay}
          </div>
          <p class="font-handwriting text-base sm:text-lg text-[#3E2E20] text-center leading-snug px-1 line-clamp-2 min-h-[2.4rem] flex items-center justify-center">
            ${item.caption || 'Cerita kita berdua ✦'}
          </p>
          <div class="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#7A6450] mt-1.5 pt-1.5 border-t border-[#E8DEC8] px-1">
            <span class="truncate max-w-[50%]">${item.date || 'Sweet moment'}</span>
            <span class="text-[#E85D75] truncate max-w-[48%] text-right">${item.location || 'Special place'}</span>
          </div>
        </div>
      `;
    }

    // 4. Aesthetic Slide Mount Frame
    if (galleryFrameType === 'slide') {
      return `
        <div class="polaroid-card frame-type-slide w-full ${tiltClass} group cursor-pointer transition-all duration-300 relative bg-white border border-[#E5E7EB] p-3 sm:p-4 pb-5 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1" onclick="viewPolaroidDetail('${item.id}')">
          <div class="slide-binder-clip"></div>
          <div class="w-full aspect-square bg-[#F3F4F6] rounded-md overflow-hidden mb-2.5 relative ring-4 ring-neutral-100 shadow-inner flex items-center justify-center">
            <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Slide photo" loading="lazy" />
            ${hoverOverlay}
          </div>
          <p class="text-xs sm:text-sm font-bold text-[#1F2937] text-center leading-snug px-1 line-clamp-2 min-h-[2.2rem] flex items-center justify-center">
            ${item.caption || 'Slide Moment ✦'}
          </p>
          <div class="flex items-center justify-between text-[10px] font-medium text-[#6B7280] mt-1.5 pt-1.5 border-t border-neutral-100 px-1">
            <span class="truncate max-w-[50%]">${item.date || 'Date'}</span>
            <span class="text-[#FA8072] font-semibold truncate max-w-[48%] text-right">${item.location || 'Location'}</span>
          </div>
        </div>
      `;
    }

    // Default: Classic Polaroid Frame
    return `
      <div class="polaroid-card frame-type-classic w-full ${tiltClass} group cursor-pointer transition-all duration-300 relative bg-white border border-[#FFD2DC] p-3 sm:p-3.5 pb-6 sm:pb-7 rounded-sm shadow-md hover:shadow-xl hover:-translate-y-1" onclick="viewPolaroidDetail('${item.id}')">
        <div class="washi-tape"></div>
        <div class="w-full aspect-square bg-[#FFF5F7] rounded-sm overflow-hidden mb-2 sm:mb-2.5 relative border border-[#FFE4E9] flex items-center justify-center">
          <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Polaroid photo" loading="lazy" />
          ${hoverOverlay}
        </div>
        <p class="font-handwriting text-base sm:text-lg lg:text-xl text-[#3B2328] text-center leading-snug px-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
          ${item.caption || 'Kenangan manis berdua ✦'}
        </p>
        <div class="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#9A737C] mt-1.5 pt-1.5 border-t border-[#FFF0F3] px-1">
          <span class="truncate max-w-[50%]">${item.date || 'Sweet moment'}</span>
          <span class="text-[#FA8072] truncate max-w-[48%] text-right">${item.location || 'Special place'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function openAddPolaroidModal() {
  const modal = document.getElementById('addPolaroidModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Reset fields
  document.getElementById('newPolaroidUrl').value = '';
  document.getElementById('newPolaroidCaption').value = '';
  document.getElementById('newPolaroidDate').value = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('newPolaroidLocation').value = 'Di Hati Kita';
  document.getElementById('polaroidPreviewThumb').src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80';
  document.getElementById('polaroidPreviewCaptionText').textContent = 'Cerita foto kita...';
  document.getElementById('polaroidPreviewDateText').textContent = 'Hari ini';
}

function closeAddPolaroidModal() {
  const modal = document.getElementById('addPolaroidModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function previewPolaroidImage(url) {
  if (url && url.trim()) {
    document.getElementById('polaroidPreviewThumb').src = url.trim();
  }
}

function handlePolaroidUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    document.getElementById('newPolaroidUrl').value = dataUrl;
    document.getElementById('polaroidPreviewThumb').src = dataUrl;
  };
  reader.readAsDataURL(file);
}

function saveNewPolaroid(event) {
  event.preventDefault();
  const url = document.getElementById('newPolaroidUrl').value.trim() || document.getElementById('polaroidPreviewThumb').src;
  const caption = document.getElementById('newPolaroidCaption').value.trim();
  const date = document.getElementById('newPolaroidDate').value.trim() || 'Hari ini';
  const location = document.getElementById('newPolaroidLocation').value.trim() || 'Tempat Spesial';

  if (!caption) {
    showToastNotification('Tulis cerita untuk foto ini ya', 'error');
    return;
  }

  const newPol = {
    id: 'pol-' + Date.now(),
    imageUrl: url,
    caption: caption,
    date: date,
    location: location
  };

  if (!state.polaroidMemories) state.polaroidMemories = [];
  state.polaroidMemories.unshift(newPol);
  localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
  saveState();
  triggerSupabaseSync();
  closeAddPolaroidModal();
  renderPolaroidGallery();
  showToastNotification('Foto polaroid baru berhasil disimpan ke Galeri! ✨', 'success');
}


// ================= POLAROID EDIT ENGINE =================
function openEditPolaroidModal(id) {
  const pol = (state.polaroidMemories || []).find(p => p.id === id);
  if (!pol) {
    showToastNotification('Foto polaroid tidak ditemukan', 'error');
    return;
  }
  const modal = document.getElementById('editPolaroidModal');
  if (!modal) return;

  document.getElementById('editPolaroidId').value = pol.id;
  document.getElementById('editPolaroidUrl').value = pol.imageUrl || '';
  document.getElementById('editPolaroidCaption').value = pol.caption || '';
  document.getElementById('editPolaroidDate').value = pol.date || '';
  document.getElementById('editPolaroidLocation').value = pol.location || '';
  document.getElementById('editPolaroidPreviewThumb').src = pol.imageUrl || '';
  document.getElementById('editPolaroidPreviewCaptionText').textContent = pol.caption || 'Cerita foto kita...';
  document.getElementById('editPolaroidPreviewDateText').textContent = pol.date || 'Hari ini';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeEditPolaroidModal() {
  const modal = document.getElementById('editPolaroidModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function previewEditPolaroidImage(url) {
  if (url && url.trim()) {
    document.getElementById('editPolaroidPreviewThumb').src = url.trim();
  }
}

function handleEditPolaroidUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    document.getElementById('editPolaroidUrl').value = dataUrl;
    document.getElementById('editPolaroidPreviewThumb').src = dataUrl;
  };
  reader.readAsDataURL(file);
}

function saveEditPolaroid(event) {
  event.preventDefault();
  const id = document.getElementById('editPolaroidId').value;
  const pol = (state.polaroidMemories || []).find(p => p.id === id);
  if (!pol) {
    showToastNotification('Gagal menemukan data polaroid', 'error');
    return;
  }

  const url = document.getElementById('editPolaroidUrl').value.trim() || document.getElementById('editPolaroidPreviewThumb').src;
  const caption = document.getElementById('editPolaroidCaption').value.trim();
  const date = document.getElementById('editPolaroidDate').value.trim() || 'Hari ini';
  const location = document.getElementById('editPolaroidLocation').value.trim() || 'Tempat Spesial';

  if (!caption) {
    showToastNotification('Tulis cerita untuk foto ini ya', 'error');
    return;
  }

  pol.imageUrl = url || pol.imageUrl;
  pol.caption = caption;
  pol.date = date;
  pol.location = location;

  localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
  saveState();
  triggerSupabaseSync();
  closeEditPolaroidModal();
  renderPolaroidGallery();

  // If detail modal is open for this item, refresh it
  if (currentDetailPolaroidId === id) {
    viewPolaroidDetail(id);
  }

  showToastNotification('Foto polaroid berhasil diperbarui! ✨', 'success');
}

function openEditFromDetail() {
  if (!currentDetailPolaroidId) return;
  closePolaroidDetailModal();
  openEditPolaroidModal(currentDetailPolaroidId);
}


// ================= POLAROID DELETE CONFIRMATION ENGINE =================
function confirmDeletePolaroid(id) {
  pendingDeletePolaroidId = id;
  const pol = (state.polaroidMemories || []).find(p => p.id === id);
  const titleEl = document.getElementById('confirmDeletePolaroidTitle');
  const descEl = document.getElementById('confirmDeletePolaroidDesc');
  const btnTextEl = document.getElementById('confirmDeletePolaroidBtnText');

  if (titleEl) titleEl.textContent = 'Hapus Foto Polaroid?';
  if (descEl) {
    descEl.textContent = pol?.caption
      ? `Apakah kamu yakin ingin menghapus foto "${pol.caption}" dari galeri kenangan?`
      : 'Foto kenangan ini akan dihapus dari galeri memori berdua. Yakin ingin menghapusnya?';
  }
  if (btnTextEl) btnTextEl.textContent = 'Ya, Hapus';

  const modal = document.getElementById('confirmDeletePolaroidModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function confirmClearAllPolaroids() {
  pendingDeletePolaroidId = '__ALL__';
  const titleEl = document.getElementById('confirmDeletePolaroidTitle');
  const descEl = document.getElementById('confirmDeletePolaroidDesc');
  const btnTextEl = document.getElementById('confirmDeletePolaroidBtnText');

  if (titleEl) titleEl.textContent = 'Hapus Semua Foto?';
  if (descEl) descEl.textContent = 'Semua foto polaroid kenangan manis berdua akan dihapus. Tindakan ini tidak dapat dibatalkan. Yakin ingin menghapus semuanya?';
  if (btnTextEl) btnTextEl.textContent = 'Hapus Semua';

  const modal = document.getElementById('confirmDeletePolaroidModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function confirmDeleteFromDetail() {
  if (!currentDetailPolaroidId) return;
  confirmDeletePolaroid(currentDetailPolaroidId);
}

function closeConfirmDeletePolaroidModal() {
  pendingDeletePolaroidId = null;
  const modal = document.getElementById('confirmDeletePolaroidModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function executeDeletePolaroid() {
  const targetId = pendingDeletePolaroidId;
  closeConfirmDeletePolaroidModal();
  if (!targetId) return;

  if (targetId === '__ALL__') {
    state.polaroidMemories = [];
    localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify([]));
    saveState();
    triggerSupabaseSync();
    closePolaroidDetailModal();
    renderPolaroidGallery();
    showToastNotification('Seluruh foto polaroid telah dihapus', 'info');
  } else {
    state.polaroidMemories = (state.polaroidMemories || []).filter(p => p.id !== targetId);
    localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
    saveState();
    triggerSupabaseSync();
    if (currentDetailPolaroidId === targetId) {
      closePolaroidDetailModal();
    }
    renderPolaroidGallery();
    showToastNotification('Foto polaroid telah dihapus', 'info');
  }
}

// Deprecated direct fallbacks in case called externally
function deletePolaroid(id) {
  confirmDeletePolaroid(id);
}

function clearAllPolaroids() {
  confirmClearAllPolaroids();
}

function viewPolaroidDetail(id) {
  const pol = (state.polaroidMemories || []).find(p => p.id === id);
  if (!pol) return;
  currentDetailPolaroidId = id;
  document.getElementById('detailPolaroidImg').src = pol.imageUrl;
  document.getElementById('detailPolaroidCaption').textContent = `"${pol.caption || 'Momen manis kita'}"`;
  document.getElementById('detailPolaroidDate').textContent = pol.date || 'Sweet Day';
  document.getElementById('detailPolaroidLocation').textContent = pol.location || 'Our Secret Place';

  const modal = document.getElementById('polaroidDetailModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closePolaroidDetailModal() {
  currentDetailPolaroidId = null;
  const modal = document.getElementById('polaroidDetailModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

