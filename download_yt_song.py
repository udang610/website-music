#!/usr/bin/env python3
"""
download_yt_song.py
Otomatis download lagu full dari YouTube (yt-dlp) + ambil cover HD official dari Apple Music/iTunes,
embed cover art ke dalam file .m4a menggunakan ffmpeg, dan daftarkan langsung ke js/app.js.

Cara pakai:
  python download_yt_song.py "Dewa 19" "Pupus"
  python download_yt_song.py "Arctic Monkeys" "505"
"""

import sys
import os
import re
import json
import urllib.parse
import urllib.request
import subprocess

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(ROOT_DIR, "audio")
COVERS_DIR = os.path.join(ROOT_DIR, "images", "covers")
APP_JS_PATH = os.path.join(ROOT_DIR, "js", "app.js")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)

def slugify(text):
    text = text.lower()
    text = re.sub(r'\[.*?\]|\(.*?\)', '', text)
    text = re.sub(r'[^a-z0-9\s_]', '', text)
    text = re.sub(r'\s+', '_', text.strip())
    return re.sub(r'_+', '_', text).strip('_')

def fetch_itunes_metadata(artist, title):
    query = f"{artist} {title}"
    encoded = urllib.parse.quote(query)
    url = f"https://itunes.apple.com/search?term={encoded}&entity=song&limit=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get('resultCount', 0) > 0:
                item = data['results'][0]
                art = item.get('artworkUrl100', '')
                if art:
                    art = art.replace('100x100bb', '1000x1000bb')
                return {
                    'title': item.get('trackName', title),
                    'artist': item.get('artistName', artist),
                    'album': item.get('collectionName', 'Single'),
                    'coverUrl': art,
                    'durationMs': item.get('trackTimeMillis', 0)
                }
    except Exception as e:
        print(f"[*] Notice: iTunes lookup error: {e}")
    return {
        'title': title,
        'artist': artist,
        'album': 'Single',
        'coverUrl': None,
        'durationMs': 0
    }

def download_official_cover(cover_url, target_path):
    if not cover_url:
        return False
    req = urllib.request.Request(cover_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp, open(target_path, 'wb') as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"[*] Failed to download cover: {e}")
        return False

def download_audio_ytdlp(artist, title, target_m4a):
    clean_q = f"{artist} {title} audio official"
    cmd = [
        "yt-dlp",
        "--extractor-args", "youtube:player_client=web,default",
        "-f", "140/ba[ext=m4a]/ba/b",
        "--no-playlist",
        "-o", target_m4a,
        f"ytsearch1:{clean_q}"
    ]
    print(f"[*] Downloading audio via yt-dlp: '{clean_q}'...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(target_m4a) and os.path.getsize(target_m4a) > 200000:
        return True
    print(f"[*] yt-dlp warning: {res.stderr[:200]}")
    return False

def embed_cover_and_tags(audio_path, cover_path, title, artist, album):
    temp_tagged = audio_path.replace(".m4a", "_tmp_tag.m4a")
    cmd = [
        "ffmpeg", "-y",
        "-i", audio_path,
        "-i", cover_path,
        "-map", "0:a",
        "-map", "1",
        "-c", "copy",
        "-disposition:v:0", "attached_pic",
        "-metadata", f"title={title}",
        "-metadata", f"artist={artist}",
        "-metadata", f"album={album}",
        temp_tagged
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(temp_tagged) and os.path.getsize(temp_tagged) > 200000:
        os.replace(temp_tagged, audio_path)
        return True
    return False

def register_in_app_js(clean_key, rel_audio, rel_cover):
    if not os.path.exists(APP_JS_PATH):
        return
    with open(APP_JS_PATH, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. Update realAudioTracks
    if clean_key not in code:
        code = code.replace(
            "const realAudioTracks = {\n",
            f"const realAudioTracks = {{\n  '{clean_key}': '{rel_audio}',\n"
        )
        code = code.replace(
            "const officialCovers = {\n",
            f"const officialCovers = {{\n  '{clean_key}': '{rel_cover}',\n"
        )
        with open(APP_JS_PATH, "w", encoding="utf-8") as f:
            f.write(code)
        print(f"[*] Registered in js/app.js: '{clean_key}' -> audio & cover")

def process_song(artist, title):
    slug_artist = slugify(artist)
    slug_title = slugify(title)
    file_slug = f"{slug_artist}_{slug_title}"
    clean_key = title.strip().lower()

    audio_filename = f"{file_slug}.m4a"
    audio_path = os.path.join(AUDIO_DIR, audio_filename)
    rel_audio = f"audio/{audio_filename}"

    cover_filename = f"{file_slug}.jpg"
    cover_path = os.path.join(COVERS_DIR, cover_filename)
    rel_cover = f"images/covers/{cover_filename}"

    print(f"\n==========================================")
    print(f"PROCESS: {artist} - {title}")
    print(f"==========================================")

    # 1. Fetch iTunes metadata
    print("[1/4] Mencari metadata & cover official Apple Music/iTunes HD...")
    meta = fetch_itunes_metadata(artist, title)
    official_title = meta['title']
    official_artist = meta['artist']
    official_album = meta['album']

    # 2. Download Official Cover
    print("[2/4] Mengunduh cover 1000x1000 HD...")
    if meta.get('coverUrl'):
        if download_official_cover(meta['coverUrl'], cover_path):
            print(f"      Cover tersimpan di: {rel_cover}")
    else:
        print("      Cover official tidak ditemukan di iTunes, menggunakan cover default.")

    # 3. Download Audio with yt-dlp
    print("[3/4] Mengunduh audio studio full dari YouTube (yt-dlp)...")
    if not os.path.exists(audio_path) or os.path.getsize(audio_path) < 200000:
        if download_audio_ytdlp(official_artist, official_title, audio_path):
            print(f"      Audio full tersimpan di: {rel_audio}")
        else:
            print("      Gagal mengunduh audio.")
            return False
    else:
        print(f"      Audio sudah ada: {rel_audio}")

    # 4. Embed Cover & Metadata with ffmpeg
    if os.path.exists(cover_path) and os.path.exists(audio_path):
        print("[4/4] Menggabungkan cover art & metadata ke file audio...")
        if embed_cover_and_tags(audio_path, cover_path, official_title, official_artist, official_album):
            print("      Cover art berhasil di-embed ke dalam file .m4a!")

    # 5. Register in js/app.js
    register_in_app_js(clean_key, rel_audio, rel_cover)
    print(f"\nSELESAI: Lagu '{official_title}' oleh '{official_artist}' siap diputar penuh dengan cover official!\n")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Penggunaan: python download_yt_song.py <Artis> <Judul Lagu>")
        print("Contoh:     python download_yt_song.py \"Dewa 19\" \"Pupus\"")
        sys.exit(1)
    artist_arg = sys.argv[1]
    title_arg = sys.argv[2]
    process_song(artist_arg, title_arg)
