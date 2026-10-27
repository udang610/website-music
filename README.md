# ✦ Our Melodies — Romantic Music Workspace

Website pemutar musik estetik khusus untuk pasangan dengan perpaduan tema **Soft Pink, Salmon Coral, & White**, terinspirasi dari tampilan Spotify Web & Jam Session.

---

## 📁 Struktur Direktori Proyek

```
website-music/
├── index.html         # Halaman utama aplikasi (Spotify 3-Panel Layout & Modals)
├── manifest.webmanifest # Web App Manifest untuk PWA & TWA Android APK
├── sw.js              # Service Worker (offline shell & instant loading)
├── css/
│   └── style.css      # Styling khusus, animasi floating reaksi, slider, equalizer, & vinyl
├── js/
│   ├── db.js          # Supabase Realtime & normalized cloud sync (v2)
│   ├── data.js        # Default state, catalog YouTube ID, cover HD, audio preset
│   ├── auth.js        # Dual accounts (Dhafin 1006 / Nadia 1809), switch profile
│   ├── state.js       # State runtime, LocalStorage cache & cloud sync hooks
│   ├── player.js      # Dual audio engine (HTML5 + YouTube), MediaSession API lockscreen controls
│   ├── views.js       # Navigasi view (Home, Playlist, Polaroid, Jam), tracklist, lock screen
│   ├── playlist.js    # Manajemen Playlist (CRUD, tambah, edit, hapus)
│   ├── track-actions.js # Like, hapus, download MP3, add to playlist, share song
│   ├── jam.js         # Listening Together (Jam session realtime, couple chat, floating reaction)
│   ├── polaroid.js    # Polaroid Memories Gallery (masonry grid, frame styling, CRUD)
│   ├── modals.js      # Pencarian lagu iTunes/YouTube, MP3 upload, love-note modal, drawer mobile
│   └── app.js         # Bootstrap orchestrator, lifecycle entry point, & SW registration
├── scripts/           # Skrip utilitas & pemeliharaan offline
│   ├── download_all_tracks.py
│   ├── download_yt_song.py
│   ├── check_tracks.js
│   ├── check_generic_covers.js
│   └── find_missing.js
└── README.md          # Panduan penggunaan, kustomisasi, & build APK
```

---

## ✨ Fitur-Fitur Utama

1. **Simple Home Page & Multi-Playlist:**
   - **Home Page Bersih & Manis:** Menampilkan sapaan dinamis sesuai waktu (*Selamat Pagi/Siang/Sore/Malam*), kartu kutipan cinta berdua, dan ringkasan lagu favorit.
   - **Fitur Buat Playlist Baru:** Tombol `+ Buat Playlist Baru` untuk membuat playlist tak terbatas (cth: *Late Night Acoustic*, *Roadtrip Bareng*, dll.) lengkap dengan judul, deskripsi, dan foto cover.
   - **Navigasi Cepat:** Beralih antar-playlist dengan mudah melalui sidebar kiri maupun kartu grid di Home Page.
2. **Lagu Full Durasi (Bukan 30 Detik):**
   - Mendukung pemutaran lagu penuh (3–7+ menit tanpa terpotong).
   - Pengguna dapat meng-upload file MP3 lokal atau memasukkan link audio MP3 full langsung.
3. **MediaSession API (Lock Screen & Bluetooth Headphone Controls):**
   - Menampilkan judul lagu, artis, album, dan foto cover HD pada **Lock Screen HP (iOS / Android)**, Notification Drawer, CarPlay, dan Smartwatch.
   - Kontrol Play, Pause, Next, Previous, dan Seek langsung dari tombol fisik/sentuh headset Bluetooth tanpa perlu membuka browser.
4. **Download Langsung Audio MP3 (Offline Ready):**
   - Klik ikon panah unduh (`↓`) langsung dari Bottom Player Bar, baris lagu, atau kanvas visual Now Playing untuk menyimpan file audio langsung ke folder Downloads.
5. **Listening Together (Couple Jam Session):**
   - Tab "Listening Together" di panel kanan dengan avatar berdua yang tersinkronisasi soundwave, ruang obrolan (*Live Couple Chat*), dan tombol reaksi emoji melayang.
6. **Kustomisasi Penuh & Tersimpan Otomatis:**
   - Ubah PIN, nama pasangan, foto avatar berdua, cover, dan isi surat cinta (*Love Note*) kapan saja. Seluruh data tersimpan otomatis di browser (*LocalStorage*) dan tersinkronisasi ke cloud (Supabase).
7. **PWA (Progressive Web App) & Installable:**
   - Dapat di-install ke layar utama HP (*Add to Home Screen*) dan berjalan dalam mode aplikasi mandiri (*Standalone Fullscreen*) tanpa bilah URL browser.

---

## 📱 Cara Menjadikan File APK Android (via PWABuilder / TWA)

Aplikasi ini sudah dilengkapi dengan **`manifest.webmanifest`**, ikon HD vinyl, dan **`sw.js` (Service Worker)** yang memenuhi standar Google Trusted Web Activity (TWA):

1. **Deploy Website**:
   - Pastikan kode terbaru sudah di-push ke GitHub dan di-hosting (misal: di [Vercel](https://vercel.com/) atau Netlify / GitHub Pages).
2. **Buka PWABuilder**:
   - Masuk ke situs **[PWABuilder.com](https://www.pwabuilder.com/)**.
3. **Masukkan URL Website**:
   - Ketik URL website Lullaby kamu (misal: `https://lullaby-music.vercel.app`), lalu klik **Start**.
   - PWABuilder akan memverifikasi Manifest dan Service Worker (skor siap 100%).
4. **Generate APK**:
   - Klik tab **Android** $\rightarrow$ **Package for Android**.
   - Unduh file `.apk` (ukuran hanya ~2–4 MB).
5. **Kirim & Install di HP**:
   - Kirimkan file `.apk` tersebut ke HP pasanganmu via WhatsApp/Telegram untuk langsung di-install!
   - **Kelebihan Auto-Update**: Setiap kali kamu mengubah lagu atau kode di GitHub, aplikasi di HP pasangan **otomatis ter-update** tanpa harus meng-install ulang file APK! 💕

---

## 🚀 Cara Menjalankan Website Secara Lokal

1. Cukup klik ganda (double click) file `index.html` untuk langsung membukanya di browser favoritmu (Chrome, Edge, Firefox, Safari).
2. Atau jalankan local server jika diperlukan:
   ```bash
   npx serve .
   ```

