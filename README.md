# ✦ Our Melodies — Romantic Music Workspace

Website pemutar musik estetik khusus untuk pasangan dengan perpaduan tema **Soft Pink, Salmon Coral, & White**, terinspirasi dari tampilan Spotify Web & Jam Session.

---

## 📁 Struktur Direktori Proyek

```
website-music/
├── index.html         # Halaman utama aplikasi (Spotify 3-Panel Layout & Modals)
├── css/
│   └── style.css      # Styling khusus, animasi floating reaksi, slider, equalizer, & vinyl
├── js/
│   └── app.js         # Logika pemutar audio, pencarian iTunes HD, Listening Together, & LocalStorage
└── README.md          # Panduan penggunaan & kustomisasi
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
3. **Download Langsung Audio MP3 (Offline Ready):**
   - Klik ikon panah unduh (`↓`) langsung dari Bottom Player Bar, baris lagu, atau kanvas visual Now Playing untuk menyimpan file audio langsung ke folder Downloads.
4. **Listening Together (Couple Jam Session):**
   - Tab "Listening Together" di panel kanan dengan avatar berdua yang tersinkronisasi soundwave, ruang obrolan (*Live Couple Chat*), dan tombol reaksi emoji melayang.
5. **Kustomisasi Penuh & Tersimpan Otomatis:**
   - Ubah PIN, nama pasangan, foto avatar berdua, cover, dan isi surat cinta (*Love Note*) kapan saja. Seluruh data tersimpan otomatis di browser (*LocalStorage*).

---

## 🚀 Cara Menjalankan Website

1. Cukup klik ganda (double click) file `index.html` untuk langsung membukanya di browser favoritmu (Chrome, Edge, Firefox, Safari).
2. Atau jalankan local server jika diperlukan:
   ```bash
   npx serve .
   ```

---

## 🌐 Cara Deploy Gratis Agar Bisa Diakses Pasangan Lewat HP / Laptop

Kamu bisa langsung meng-upload folder `website-music` ini ke layanan hosting gratis berikut dalam hitungan menit:
- **Vercel**: Drag & drop folder `website-music` ke dashboard Vercel.
- **Netlify**: Drag & drop folder `website-music` ke Netlify Drop (https://app.netlify.com/drop).
- **GitHub Pages**: Buat repositori baru di GitHub, upload seluruh file di folder ini, lalu aktifkan GitHub Pages di menu Settings.

Kirimkan tautan (*link*) web tersebut ke pasanganmu beserta PIN rahasianya 💕!
