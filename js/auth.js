// ================= DUAL ACCOUNTS & AUTH =================

// ================= DUAL ACCOUNTS & ACCESS CONFIGURATION =================
// Dhafin (PIN: 1006) & Nadia (PIN: 1809)
const ACCOUNTS = {
  '1006': {
    id: 'dhafin',
    name: 'Dhafin',
    pin: '1006',
    avatar: 'images/spotify_covers/me.jpeg',
    role: 'Curator',
    partnerId: 'nadia',
    partnerName: 'Nadia',
    partnerAvatar: 'images/spotify_covers/ndey.jpeg',
    partnerRole: 'Beloved'
  },
  '1809': {
    id: 'nadia',
    name: 'Nadia',
    pin: '1809',
    avatar: 'images/spotify_covers/ndey.jpeg',
    role: 'Beloved',
    partnerId: 'dhafin',
    partnerName: 'Dhafin',
    partnerAvatar: 'images/spotify_covers/me.jpeg',
    partnerRole: 'Curator'
  }
};

function getCurrentAccount() {
  const savedUserId = localStorage.getItem('romantic_current_user') || 'dhafin';
  if (savedUserId === 'nadia') return ACCOUNTS['1809'];
  return ACCOUNTS['1006'];
}

function applyAccountIdentity(account) {
  if (!account) return;
  state.yourName = account.name;
  state.yourAvatar = account.avatar;
  state.partnerName = account.partnerName;
  state.partnerAvatar = account.partnerAvatar;
  try {
    localStorage.setItem('romantic_current_user', account.id);
  } catch (e) { }

  // 1. Laporkan identitas login baru ini ke Supabase Presence secara realtime
  if (window.MusicDB && typeof window.MusicDB.trackPresence === 'function') {
    window.MusicDB.trackPresence(account.id);
  }

  // 2. Langsung update map status online lokal secara instan (user saat ini langsung Online)
  if (typeof presenceStateMap === 'object' && presenceStateMap) {
    presenceStateMap[account.id] = true;
    if (account.partnerId) {
      // Pastikan partner tidak salah dianggap online dari tab yang sama
      presenceStateMap[account.partnerId] = false;
    }
  }

  if (typeof hydrateUI === 'function') hydrateUI();
  if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
  if (typeof updateMainJamView === 'function') updateMainJamView();
  if (typeof populateProfileShowcaseView === 'function') populateProfileShowcaseView();
  if (typeof updatePresenceUI === 'function') updatePresenceUI();
}

function selectLoginProfile(userId) {
  const pinInput = document.getElementById('pinInput');
  if (pinInput) {
    pinInput.focus();
  }
}
