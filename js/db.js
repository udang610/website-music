// =====================================================================
// MusicDB — Normalized Supabase data layer (v2)
// ---------------------------------------------------------------------
// - Supabase is the single source of truth; localStorage is only a cache.
// - Every change is written PER ROW (diff against the last known cloud
//   snapshot), so a stale device can never overwrite data it didn't touch.
// - Inline base64 images are compressed and moved to Supabase Storage.
// - One-time migration from the legacy `app_config` JSON blob.
// =====================================================================
(function () {
  const SUPABASE_URL = 'https://onikjvzkbhpbubnqjmib.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaWtqdnprYmhwYnVibnFqbWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjEyMzgsImV4cCI6MjEwODEzNzIzOH0.VvnY63Ysf3q73_owAdYVeBn96rQEkhDZyqwY4s3W1Gc';

  const BUCKET = 'media';
  const PROFILE_ID = 'main';
  const LEGACY_ROW_ID = 'romantic_music_state';
  const DEVICE_MERGE_FLAG = 'romantic_music_db_v2_device_merged';
  const T = {
    profile: 'couple_profile',
    playlists: 'playlists',
    tracks: 'tracks',
    polaroids: 'polaroids',
    messages: 'jam_messages'
  };

  let client = null;
  let hooks = {};
  let snapshot = null;          // last known cloud rows, keyed maps
  let deletedPolaroidIds = new Set();
  let ready = false;
  let flushTimer = null;
  let flushing = false;
  let flushAgain = false;
  let channel = null;
  let initPromise = null;

  // ---------------- utils ----------------
  const str = (v) => (v === undefined || v === null) ? '' : String(v);
  const isInlineImage = (v) => typeof v === 'string' && v.startsWith('data:image');
  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const trackKey = (pid, id) => `${pid}::${id}`;
  const byPosition = (a, b) => (Number(a.position) || 0) - (Number(b.position) || 0);

  function getClient() {
    if (!client && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (e) {
        console.warn('[MusicDB] Supabase init error:', e);
      }
    }
    return client;
  }

  // Compare only the keys of the local row (cloud rows carry extra columns)
  function rowEq(local, cloud) {
    if (!local && !cloud) return true;
    if (!local || !cloud) return false;
    return Object.keys(local).every(k => str(local[k]) === str(cloud[k]));
  }

  function emptySnapshot() {
    return { profile: null, playlists: {}, tracks: {}, polaroids: {}, messages: {} };
  }

  // ---------------- state <-> rows ----------------
  function isSyncablePlaylist(pl) {
    return pl && pl.id && !pl.isLikedSpecial && pl.id !== 'pl-liked';
  }

  function cleanAudioUrl(u) {
    u = str(u);
    return (u.startsWith('data:') || u.startsWith('blob:')) ? '' : u;
  }

  function ensureIds(st) {
    (st.playlists || []).forEach(pl => {
      if (!pl.id) pl.id = uid('pl');
      (pl.tracks || []).forEach(t => { if (!t.id) t.id = uid('t'); });
    });
    (st.polaroidMemories || []).forEach(p => { if (!p.id) p.id = uid('pol'); });
    (st.jamMessages || []).forEach(m => { if (!m.id) m.id = uid('msg'); });
  }

  function toRows(st) {
    const rows = {
      profile: {
        id: PROFILE_ID,
        pin_code: str(st.pinCode) || '1806',
        your_name: str(st.yourName),
        partner_name: str(st.partnerName),
        your_avatar_url: str(st.yourAvatar),
        partner_avatar_url: str(st.partnerAvatar),
        love_note: str(st.loveNote)
      },
      playlists: {},
      tracks: {},
      polaroids: {},
      messages: {}
    };

    (st.playlists || []).filter(isSyncablePlaylist).forEach((pl, i) => {
      rows.playlists[pl.id] = {
        id: pl.id,
        title: str(pl.title) || 'Untitled',
        description: str(pl.desc),
        cover_url: str(pl.cover),
        position: i
      };
      const seen = new Set();
      (pl.tracks || []).forEach((t, j) => {
        if (!t.id || seen.has(t.id)) return;
        seen.add(t.id);
        rows.tracks[trackKey(pl.id, t.id)] = {
          playlist_id: pl.id,
          id: t.id,
          title: str(t.title) || 'Untitled',
          artist: str(t.artist),
          album: str(t.album),
          memory: str(t.memory),
          date_added: str(t.dateAdded),
          duration: str(t.duration) || 'Full',
          liked: !!t.liked,
          cover_url: str(t.cover),
          youtube_id: t.youtubeId || null,
          audio_url: cleanAudioUrl(t.audioUrl),
          position: j
        };
      });
    });

    (st.polaroidMemories || []).forEach((p, i) => {
      if (!p.id || rows.polaroids[p.id]) return;
      rows.polaroids[p.id] = {
        id: p.id,
        image_url: str(p.imageUrl),
        caption: str(p.caption),
        memory_date: str(p.date),
        location: str(p.location),
        position: i
      };
    });

    (st.jamMessages || []).forEach((m, i) => {
      if (!m.id || rows.messages[m.id]) return;
      rows.messages[m.id] = {
        id: m.id,
        sender: str(m.sender) || 'system',
        text: str(m.text),
        time_label: str(m.time),
        position: i
      };
    });

    return rows;
  }

  const trackFromRow = (r) => ({
    id: r.id,
    title: r.title,
    artist: r.artist || '',
    album: r.album || '',
    memory: r.memory || '',
    dateAdded: r.date_added || '',
    duration: r.duration || 'Full',
    liked: !!r.liked,
    cover: r.cover_url || '',
    youtubeId: r.youtube_id || null,
    audioUrl: r.audio_url || ''
  });
  const polaroidFromRow = (r) => ({
    id: r.id,
    imageUrl: r.image_url,
    caption: r.caption || '',
    date: r.memory_date || '',
    location: r.location || ''
  });
  const messageFromRow = (r) => ({ id: r.id, sender: r.sender, text: r.text, time: r.time_label || '' });

  function applyProfileRow(target, r, defaults) {
    defaults = defaults || {};
    target.pinCode = r.pin_code || defaults.pinCode || '1806';
    target.yourName = r.your_name || defaults.yourName || '';
    target.partnerName = r.partner_name || defaults.partnerName || '';
    target.yourAvatar = r.your_avatar_url || defaults.yourAvatar || '';
    target.partnerAvatar = r.partner_avatar_url || defaults.partnerAvatar || '';
    target.loveNote = r.love_note !== null && r.love_note !== undefined ? r.love_note : (defaults.loveNote || '');
  }

  function fromFetched(d, defaults) {
    const out = {};
    if (d.profile) applyProfileRow(out, d.profile, defaults);

    const tracksBy = {};
    [...d.tracks].sort(byPosition).forEach(r => {
      (tracksBy[r.playlist_id] = tracksBy[r.playlist_id] || []).push(trackFromRow(r));
    });
    out.playlists = [...d.playlists].sort(byPosition).map(r => ({
      id: r.id,
      title: r.title,
      desc: r.description || '',
      cover: r.cover_url || '',
      tracks: tracksBy[r.id] || []
    }));
    out.polaroidMemories = d.polaroids.filter(r => !r.deleted_at).sort(byPosition).map(polaroidFromRow);
    out.jamMessages = [...d.messages].sort(byPosition).map(messageFromRow);
    return out;
  }

  function snapshotFromFetched(d) {
    const snap = emptySnapshot();
    snap.profile = d.profile || null;
    d.playlists.forEach(r => { snap.playlists[r.id] = r; });
    d.tracks.forEach(r => { snap.tracks[trackKey(r.playlist_id, r.id)] = r; });
    d.polaroids.filter(r => !r.deleted_at).forEach(r => { snap.polaroids[r.id] = r; });
    d.messages.forEach(r => { snap.messages[r.id] = r; });
    return snap;
  }

  // ---------------- merge helpers (migration / first run per device) ----------------
  function isCustomValue(field, value, defaults) {
    if (!value) return false;
    return !defaults || value !== defaults[field];
  }

  /**
   * Merge `extra` into `base` without dropping anything from base.
   * - profile: `preferExtraProfile` decides who wins when both are customized.
   * - lists: union by id (polaroids in `blockedPolaroidIds` are never resurrected).
   */
  function mergeStates(base, extra, opts) {
    const { defaults, preferExtraProfile, blockedPolaroidIds } = opts;
    const out = JSON.parse(JSON.stringify(base || {}));
    if (!extra) return out;

    ['pinCode', 'yourName', 'partnerName', 'yourAvatar', 'partnerAvatar', 'loveNote'].forEach(f => {
      const baseCustom = isCustomValue(f, out[f], defaults);
      const extraCustom = isCustomValue(f, extra[f], defaults);
      if (extraCustom && (!baseCustom || preferExtraProfile)) out[f] = extra[f];
      else if (!out[f] && extra[f]) out[f] = extra[f];
    });

    // Polaroids: local-only items go first (they are most likely the newest)
    const basePols = out.polaroidMemories || [];
    const baseIds = new Set(basePols.map(p => p.id));
    const baseSig = new Set(basePols.map(p => `${p.caption}|${p.date}`));
    const extraPols = (extra.polaroidMemories || []).filter(p =>
      p && p.id && !baseIds.has(p.id) && !baseSig.has(`${p.caption}|${p.date}`) &&
      !(blockedPolaroidIds && blockedPolaroidIds.has(p.id)));
    out.polaroidMemories = [...extraPols, ...basePols];

    // Playlists & tracks
    out.playlists = out.playlists || [];
    (extra.playlists || []).filter(isSyncablePlaylist).forEach(ePl => {
      const bPl = out.playlists.find(p => p.id === ePl.id);
      if (!bPl) {
        out.playlists.push(JSON.parse(JSON.stringify(ePl)));
        return;
      }
      bPl.tracks = bPl.tracks || [];
      (ePl.tracks || []).forEach(et => {
        const k = (et.id || `${et.title}-${et.artist}`).toLowerCase();
        const exists = bPl.tracks.some(bt => (bt.id || `${bt.title}-${bt.artist}`).toLowerCase() === k);
        if (!exists) bPl.tracks.push({ ...et });
      });
    });

    // Jam messages
    out.jamMessages = out.jamMessages || [];
    const msgSig = new Set(out.jamMessages.map(m => m.id || `${m.sender}|${m.text}|${m.time}`));
    (extra.jamMessages || []).forEach(m => {
      const sig = m.id || `${m.sender}|${m.text}|${m.time}`;
      if (!msgSig.has(sig) && !msgSig.has(`${m.sender}|${m.text}|${m.time}`)) {
        out.jamMessages.push({ ...m });
        msgSig.add(sig);
      }
    });

    return out;
  }

  function legacyBlobToState(blob) {
    if (!blob || typeof blob !== 'object' || blob.test) return null;
    const st = {
      pinCode: blob.pinCode,
      yourName: blob.yourName,
      partnerName: blob.partnerName,
      yourAvatar: blob.yourAvatar,
      partnerAvatar: blob.partnerAvatar,
      loveNote: blob.loveNote,
      polaroidMemories: Array.isArray(blob.polaroidMemories) ? blob.polaroidMemories : [],
      jamMessages: Array.isArray(blob.jamMessages) ? blob.jamMessages : [],
      playlists: Array.isArray(blob.playlists) ? blob.playlists : []
    };
    return st;
  }

  // ---------------- media upload ----------------
  function compressToBlob(dataUrl, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', quality);
      };
      img.onerror = () => reject(new Error('Image decode failed'));
      img.src = dataUrl;
    });
  }

  let storageWarned = false;
  async function uploadInline(dataUrl, path, maxDim) {
    try {
      const blob = await compressToBlob(dataUrl, maxDim, 0.82);
      const { error } = await client.storage.from(BUCKET).upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '31536000'
      });
      if (error) throw error;
      const { data } = client.storage.from(BUCKET).getPublicUrl(path);
      return data && data.publicUrl ? data.publicUrl : null;
    } catch (e) {
      if (!storageWarned) {
        storageWarned = true;
        console.warn('[MusicDB] Storage upload failed, keeping inline image:', e);
      }
      return null;
    }
  }

  async function uploadInlineImages(st) {
    let changed = false;
    const ts = Date.now();
    const swap = async (obj, field, path, maxDim) => {
      if (!isInlineImage(obj[field])) return;
      const url = await uploadInline(obj[field], path, maxDim);
      if (url) { obj[field] = url; changed = true; }
    };

    await swap(st, 'yourAvatar', `avatars/you-${ts}.jpg`, 400);
    await swap(st, 'partnerAvatar', `avatars/partner-${ts}.jpg`, 400);
    for (const pl of (st.playlists || []).filter(isSyncablePlaylist)) {
      await swap(pl, 'cover', `covers/${pl.id}-${ts}.jpg`, 900);
      for (const t of (pl.tracks || [])) {
        await swap(t, 'cover', `covers/track-${t.id}-${ts}.jpg`, 600);
      }
    }
    for (const p of (st.polaroidMemories || [])) {
      await swap(p, 'imageUrl', `polaroids/${p.id}-${ts}.jpg`, 1280);
    }
    return changed;
  }

  // ---------------- cloud I/O ----------------
  async function fetchAll() {
    const [p, pl, tr, po, ms] = await Promise.all([
      client.from(T.profile).select('*').eq('id', PROFILE_ID).maybeSingle(),
      client.from(T.playlists).select('*'),
      client.from(T.tracks).select('*'),
      client.from(T.polaroids).select('*'),
      client.from(T.messages).select('*')
    ]);
    for (const r of [p, pl, tr, po, ms]) if (r.error) throw r.error;
    return {
      profile: p.data || null,
      playlists: pl.data || [],
      tracks: tr.data || [],
      polaroids: po.data || [],
      messages: ms.data || []
    };
  }

  async function fetchLegacyBlob() {
    try {
      const { data, error } = await client.from('app_config').select('data').eq('id', LEGACY_ROW_ID).maybeSingle();
      if (error) return null;
      return data ? data.data : null;
    } catch (e) {
      return null;
    }
  }

  function diffMap(prev, next) {
    const up = [];
    const del = [];
    Object.keys(next).forEach(k => { if (!rowEq(next[k], prev[k])) up.push(next[k]); });
    Object.keys(prev).forEach(k => { if (!next[k]) del.push(prev[k]); });
    return { up, del };
  }

  async function upsertRows(table, rows, onConflict) {
    if (!rows.length) return [];
    const q = client.from(table).upsert(rows, onConflict ? { onConflict } : undefined).select();
    const { data, error } = await q;
    if (error) throw error;
    return data || rows;
  }

  async function applyDiff(next) {
    const prev = snapshot;

    // 1. Profile
    if (!rowEq(next.profile, prev.profile)) {
      const [saved] = await upsertRows(T.profile, [next.profile]);
      snapshot.profile = saved || next.profile;
    }

    // 2. Playlists (upsert first because tracks reference them)
    const pl = diffMap(prev.playlists, next.playlists);
    (await upsertRows(T.playlists, pl.up)).forEach(r => { snapshot.playlists[r.id] = r; });

    // 3. Tracks
    const tr = diffMap(prev.tracks, next.tracks);
    (await upsertRows(T.tracks, tr.up, 'playlist_id,id')).forEach(r => {
      snapshot.tracks[trackKey(r.playlist_id, r.id)] = r;
    });
    const delByPl = {};
    tr.del.forEach(r => { (delByPl[r.playlist_id] = delByPl[r.playlist_id] || []).push(r.id); });
    for (const pid of Object.keys(delByPl)) {
      if (!next.playlists[pid] && prev.playlists[pid]) continue; // cascade handles it
      const { error } = await client.from(T.tracks).delete().eq('playlist_id', pid).in('id', delByPl[pid]);
      if (error) throw error;
      delByPl[pid].forEach(id => delete snapshot.tracks[trackKey(pid, id)]);
    }

    // 4. Playlist deletes (guard against accidental wipe of all playlists)
    if (pl.del.length && Object.keys(next.playlists).length > 0) {
      const ids = pl.del.map(r => r.id);
      const { error } = await client.from(T.playlists).delete().in('id', ids);
      if (error) throw error;
      ids.forEach(id => {
        delete snapshot.playlists[id];
        Object.keys(snapshot.tracks).forEach(k => { if (k.startsWith(`${id}::`)) delete snapshot.tracks[k]; });
      });
    }

    // 5. Polaroids (soft delete)
    const po = diffMap(prev.polaroids, next.polaroids);
    (await upsertRows(T.polaroids, po.up.map(r => ({ ...r, deleted_at: null })))).forEach(r => {
      snapshot.polaroids[r.id] = r;
      deletedPolaroidIds.delete(r.id);
    });
    if (po.del.length) {
      const ids = po.del.map(r => r.id);
      const { error } = await client.from(T.polaroids).update({ deleted_at: new Date().toISOString() }).in('id', ids);
      if (error) throw error;
      ids.forEach(id => { delete snapshot.polaroids[id]; deletedPolaroidIds.add(id); });
    }

    // 6. Jam messages
    const ms = diffMap(prev.messages, next.messages);
    (await upsertRows(T.messages, ms.up)).forEach(r => { snapshot.messages[r.id] = r; });
    if (ms.del.length) {
      const ids = ms.del.map(r => r.id);
      const { error } = await client.from(T.messages).delete().in('id', ids);
      if (error) throw error;
      ids.forEach(id => delete snapshot.messages[id]);
    }

    return pl.up.length + tr.up.length + tr.del.length + pl.del.length + po.up.length + po.del.length + ms.up.length + ms.del.length;
  }

  // ---------------- flush (local -> cloud) ----------------
  async function flush() {
    if (!ready || !getClient()) return false;
    if (flushing) { flushAgain = true; return true; }
    flushing = true;
    let ok = true;
    try {
      const st = hooks.getState();
      ensureIds(st);
      if (await uploadInlineImages(st)) {
        if (hooks.onLocalMediaUploaded) hooks.onLocalMediaUploaded();
      }
      const changes = await applyDiff(toRows(st));
      if (changes) console.log(`✦ [MusicDB] ${changes} row(s) synced`);
      if (hooks.onSynced) hooks.onSynced();
    } catch (e) {
      ok = false;
      console.warn('[MusicDB] Sync failed, will retry:', e);
      if (hooks.onSyncError) hooks.onSyncError(e);
      clearTimeout(flushTimer);
      flushTimer = setTimeout(flush, 5000);
    } finally {
      flushing = false;
      if (flushAgain) {
        flushAgain = false;
        scheduleFlush(50);
      }
    }
    return ok;
  }

  function scheduleFlush(delay) {
    if (!ready) return;
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, typeof delay === 'number' ? delay : 600);
  }

  async function flushNow() {
    clearTimeout(flushTimer);
    if (!ready) return false;
    // wait for any in-flight flush, then run a fresh one
    while (flushing) await new Promise(r => setTimeout(r, 50));
    return flush();
  }

  // ---------------- realtime (cloud -> local) ----------------
  function isStaleEcho(snapRow, incoming) {
    if (!snapRow || !snapRow.updated_at || !incoming || !incoming.updated_at) return false;
    return new Date(incoming.updated_at).getTime() < new Date(snapRow.updated_at).getTime();
  }

  function resortByPosition(arr, keyFn, snapMap) {
    const pos = (item) => {
      const r = snapMap[keyFn(item)];
      return r ? Number(r.position) || 0 : Number.MAX_SAFE_INTEGER;
    };
    arr.sort((a, b) => pos(a) - pos(b));
  }

  function handleRemote(table, payload) {
    if (!snapshot) return;
    const st = hooks.getState();
    const cur = toRows(st);
    const isDel = payload.eventType === 'DELETE';
    const row = isDel ? payload.old : payload.new;
    if (!row) return;
    let touched = false;

    if (table === T.profile) {
      if (isDel || isStaleEcho(snapshot.profile, row)) return;
      const dirty = !rowEq(cur.profile, snapshot.profile);
      snapshot.profile = row;
      if (!dirty && !rowEq(cur.profile, row)) {
        applyProfileRow(st, row, hooks.getDefaults ? hooks.getDefaults() : null);
        touched = true;
      }
    }

    if (table === T.playlists) {
      const id = row.id;
      const dirty = !rowEq(cur.playlists[id], snapshot.playlists[id]);
      if (isDel) {
        delete snapshot.playlists[id];
        const idx = st.playlists.findIndex(p => p.id === id);
        if (idx !== -1) { st.playlists.splice(idx, 1); touched = true; }
      } else if (!isStaleEcho(snapshot.playlists[id], row)) {
        snapshot.playlists[id] = row;
        if (!dirty) {
          let pl = st.playlists.find(p => p.id === id);
          if (!pl) {
            pl = { id, title: row.title, desc: row.description || '', cover: row.cover_url || '', tracks: [] };
            st.playlists.push(pl);
            touched = true;
          } else if (!rowEq(cur.playlists[id], row)) {
            pl.title = row.title;
            pl.desc = row.description || '';
            pl.cover = row.cover_url || '';
            touched = true;
          }
        }
        const virtual = st.playlists.filter(p => !isSyncablePlaylist(p));
        const real = st.playlists.filter(isSyncablePlaylist);
        resortByPosition(real, p => p.id, snapshot.playlists);
        st.playlists.splice(0, st.playlists.length, ...real, ...virtual);
      }
    }

    if (table === T.tracks) {
      const key = trackKey(row.playlist_id, row.id);
      const dirty = !rowEq(cur.tracks[key], snapshot.tracks[key]);
      const pl = st.playlists.find(p => p.id === row.playlist_id);
      if (isDel) {
        delete snapshot.tracks[key];
        if (pl && pl.tracks) {
          const idx = pl.tracks.findIndex(t => t.id === row.id);
          if (idx !== -1) { pl.tracks.splice(idx, 1); touched = true; }
        }
      } else if (!isStaleEcho(snapshot.tracks[key], row)) {
        snapshot.tracks[key] = row;
        if (pl && !dirty) {
          pl.tracks = pl.tracks || [];
          const idx = pl.tracks.findIndex(t => t.id === row.id);
          if (idx === -1) { pl.tracks.push(trackFromRow(row)); touched = true; }
          else if (!rowEq(cur.tracks[key], row)) { Object.assign(pl.tracks[idx], trackFromRow(row)); touched = true; }
          resortByPosition(pl.tracks, t => trackKey(pl.id, t.id), snapshot.tracks);
        }
      }
    }

    if (table === T.polaroids) {
      const id = row.id;
      const removed = isDel || !!row.deleted_at;
      const dirty = !rowEq(cur.polaroids[id], snapshot.polaroids[id]);
      st.polaroidMemories = st.polaroidMemories || [];
      if (removed) {
        delete snapshot.polaroids[id];
        deletedPolaroidIds.add(id);
        const idx = st.polaroidMemories.findIndex(p => p.id === id);
        if (idx !== -1) { st.polaroidMemories.splice(idx, 1); touched = true; }
      } else if (!isStaleEcho(snapshot.polaroids[id], row)) {
        snapshot.polaroids[id] = row;
        deletedPolaroidIds.delete(id);
        if (!dirty) {
          const idx = st.polaroidMemories.findIndex(p => p.id === id);
          if (idx === -1) { st.polaroidMemories.push(polaroidFromRow(row)); touched = true; }
          else if (!rowEq(cur.polaroids[id], row)) { Object.assign(st.polaroidMemories[idx], polaroidFromRow(row)); touched = true; }
          resortByPosition(st.polaroidMemories, p => p.id, snapshot.polaroids);
        }
      }
    }

    if (table === T.messages) {
      const id = row.id;
      st.jamMessages = st.jamMessages || [];
      if (isDel) {
        delete snapshot.messages[id];
        const idx = st.jamMessages.findIndex(m => m.id === id);
        if (idx !== -1) { st.jamMessages.splice(idx, 1); touched = true; }
      } else {
        snapshot.messages[id] = row;
        if (!st.jamMessages.some(m => m.id === id)) {
          st.jamMessages.push(messageFromRow(row));
          resortByPosition(st.jamMessages, m => m.id, snapshot.messages);
          touched = true;
        }
      }
    }

    if (touched && hooks.onRemoteChange) hooks.onRemoteChange(table);
  }

  const DEVICE_SESSION_ID = 'dev-' + Math.random().toString(36).slice(2, 9) + '-' + Date.now();
  let jamChannel = null;
  let activeJamRoomId = null;

  function connectJamRoom(roomId) {
    const cleanId = String(roomId || '').trim().toUpperCase();
    if (!cleanId) return false;

    const cli = getClient();
    if (!cli) return false;

    if (jamChannel) {
      try { cli.removeChannel(jamChannel); } catch (e) {}
      jamChannel = null;
    }

    activeJamRoomId = cleanId;
    jamChannel = cli.channel(`jam-room-${cleanId}`, {
      config: { broadcast: { self: false } }
    });

    jamChannel.on('broadcast', { event: 'playback_sync' }, ({ payload }) => {
      if (payload && payload.senderDeviceId !== DEVICE_SESSION_ID && hooks.onPlaybackSync) {
        try {
          hooks.onPlaybackSync(payload);
        } catch (e) {
          console.warn('[MusicDB] onPlaybackSync error:', e);
        }
      }
    });

    jamChannel.on('presence', { event: 'sync' }, () => {
      if (hooks.onPresenceSync) {
        try {
          const presences = jamChannel.presenceState();
          hooks.onPresenceSync(presences);
        } catch (e) {}
      }
    });

    jamChannel.subscribe(status => {
      console.log(`✦ [MusicDB] Jam Room (${cleanId}) Realtime:`, status);
      if (status === 'SUBSCRIBED') {
        const userState = hooks.getState ? hooks.getState() : {};
        jamChannel.track({
          deviceId: DEVICE_SESSION_ID,
          userName: userState.yourName || 'Partner',
          roomId: cleanId,
          onlineAt: Date.now()
        });
      }
    });
    return true;
  }

  function leaveJamRoom() {
    const cli = getClient();
    if (jamChannel && cli) {
      try { cli.removeChannel(jamChannel); } catch (e) {}
    }
    jamChannel = null;
    activeJamRoomId = null;
    console.log('✦ [MusicDB] Left Jam Room. Private playback active.');
  }

  function broadcastPlayback(payload) {
    if (!jamChannel || !activeJamRoomId) return false;
    try {
      jamChannel.send({
        type: 'broadcast',
        event: 'playback_sync',
        payload: {
          ...payload,
          roomId: activeJamRoomId,
          senderDeviceId: DEVICE_SESSION_ID,
          sentAt: Date.now()
        }
      });
      return true;
    } catch (e) {
      console.warn('[MusicDB] broadcastPlayback error:', e);
      return false;
    }
  }

  function subscribe() {
    if (channel) return;
    channel = client.channel('music-db-v2');

    // 1. Database table sync (selalu aktif untuk data, playlist, memori, profil)
    Object.values(T).forEach(table => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        try { handleRemote(table, payload); } catch (e) { console.warn('[MusicDB] realtime handler error:', e); }
      });
    });

    channel.subscribe(status => {
      console.log('✦ [MusicDB] DB Sync Realtime:', status);
    });
  }

  // ---------------- init ----------------
  async function doInit() {
    if (!getClient()) {
      console.warn('[MusicDB] Supabase client unavailable — running local-only.');
      return false;
    }
    const defaults = hooks.getDefaults ? hooks.getDefaults() : null;
    const local = hooks.getState();
    ensureIds(local);

    const fetched = await fetchAll();
    deletedPolaroidIds = new Set(fetched.polaroids.filter(r => r.deleted_at).map(r => r.id));
    let next;

    if (!fetched.profile) {
      // Fresh normalized tables → one-time migration from legacy blob + this device's cache
      console.log('✦ [MusicDB] Migrating legacy app_config blob into normalized tables...');
      const legacy = legacyBlobToState(await fetchLegacyBlob());
      const base = legacy || local;
      next = mergeStates(base, legacy ? local : null, {
        defaults,
        preferExtraProfile: true,   // this device's customized profile wins over the old blob
        blockedPolaroidIds: deletedPolaroidIds
      });
      if (!next.playlists || !next.playlists.length) next.playlists = local.playlists;
    } else {
      const cloud = fromFetched(fetched, defaults);
      if (!cloud.playlists.length) cloud.playlists = local.playlists;
      // Filter out any dummy unsplash sample polaroids
      if (Array.isArray(cloud.polaroidMemories)) {
        cloud.polaroidMemories = cloud.polaroidMemories.filter(p => !['pol-1', 'pol-2', 'pol-3', 'pol-4'].includes(p.id) && !(p.imageUrl && p.imageUrl.includes('images.unsplash.com')));
      }
      next = cloud;
    }

    snapshot = snapshotFromFetched(fetched);
    ensureIds(next);
    hooks.applyCloudState(next);
    ready = true;
    subscribe();

    const ok = await flush();
    if (ok) {
      try { localStorage.setItem(DEVICE_MERGE_FLAG, String(Date.now())); } catch (e) { }
    }
    console.log('✦ [MusicDB] Ready (cloud is source of truth).');
    return true;
  }

  function init(h) {
    hooks = h || {};
    if (!initPromise) {
      initPromise = doInit().catch(e => {
        console.warn('[MusicDB] init failed:', e);
        if (hooks.onInitError) hooks.onInitError(e);
        initPromise = null; // allow retry
        return false;
      });
    }
    return initPromise;
  }

  window.addEventListener('online', () => {
    if (!ready && hooks.getState) init(hooks);
    else scheduleFlush(200);
  });

  window.MusicDB = {
    init,
    scheduleFlush,
    flushNow,
    isReady: () => ready,
    broadcastPlayback,
    connectJamRoom,
    leaveJamRoom,
    getActiveJamRoomId: () => activeJamRoomId,
    getDeviceId: () => DEVICE_SESSION_ID
  };
})();
