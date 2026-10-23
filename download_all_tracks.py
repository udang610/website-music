
import json
import os
import re
import subprocess
import urllib.parse
import urllib.request
import time
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"c:\Users\dell\.gemini\antigravity-ide\scratch\website-music"
AUDIO_DIR = os.path.join(ROOT_DIR, "audio")
COVERS_DIR = os.path.join(ROOT_DIR, "images", "covers")
PROGRESS_FILE = os.path.join(ROOT_DIR, "download_progress.json")
APP_JS = os.path.join(ROOT_DIR, "js", "app.js")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)

# Load existing progress if any
progress_map = {}
if os.path.exists(PROGRESS_FILE):
    try:
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            progress_map = json.load(f)
    except Exception:
        progress_map = {}

def clean_slug(title, artist):
    raw = f"{artist}_{title}".lower()
    # Strip brackets, featuring, etc.
    raw = re.sub(r'\[.*?\]|\(.*?\)', '', raw)
    # Remove non-alphanumeric except space and underscore
    raw = re.sub(r'[^a-z0-9\s_]', '', raw)
    raw = re.sub(r'\s+', '_', raw.strip())
    raw = re.sub(r'_+', '_', raw)
    return raw[:50].strip('_')

def get_itunes_cover(title, artist):
    clean_t = re.sub(r'\[.*?\]|\(.*?\)', '', title).strip()
    clean_a = re.sub(r'\[.*?\]|\(.*?\)', '', artist).strip()
    query = f"{clean_a} {clean_t}"
    encoded = urllib.parse.quote(query)
    for country in ['ID', 'US']:
        url = f"https://itunes.apple.com/search?term={encoded}&country={country}&entity=song&limit=3"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                data = json.loads(res.read().decode('utf-8'))
                if data.get('resultCount', 0) > 0:
                    for item in data['results']:
                        art = item.get('artworkUrl100', '')
                        if art:
                            return art.replace('100x100bb.jpg', '1000x1000bb.jpg').replace('100x100bb', '1000x1000bb')
        except Exception as e:
            pass
    return None

def download_file(url, target_path):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=12) as response, open(target_path, 'wb') as out_file:
            out_file.write(response.read())
        return True
    except Exception as e:
        return False

# Load unique tracks to download
with open(os.path.join(ROOT_DIR, "unique_tracks_to_download.json"), "r", encoding="utf-8") as f:
    tracks = json.load(f)

total = len(tracks)
print(f"==================================================")
print(f"🎵 STARTING BATCH DOWNLOAD FOR {total} UNIQUE SONGS")
print(f"==================================================")

for idx, t in enumerate(tracks, 1):
    title = t['title']
    artist = t['artist']
    key = f"{title.strip().lower()}::{artist.strip().lower()}"
    slug = clean_slug(title, artist)
    if not slug:
        slug = f"track_{idx}"

    print(f"\n[{idx}/{total}] Processing: \"{title}\" - {artist}")

    # Check progress map
    info = progress_map.get(key, {})

    # 1. Download Cover Image
    cover_filename = f"{slug}.jpg"
    cover_filepath = os.path.join(COVERS_DIR, cover_filename)
    rel_cover_path = f"images/covers/{cover_filename}"

    # If it's one of the initial 5 tracks, keep their existing cover
    if t.get('cover') and t['cover'].startswith('images/covers/') and os.path.exists(os.path.join(ROOT_DIR, t['cover'])):
        rel_cover_path = t['cover']
        print(f"   📸 Cover already exists: {rel_cover_path}")
    elif os.path.exists(cover_filepath) and os.path.getsize(cover_filepath) > 2000:
        print(f"   📸 Cover already downloaded: {rel_cover_path}")
    else:
        cover_url = get_itunes_cover(title, artist)
        if cover_url and download_file(cover_url, cover_filepath):
            print(f"   ✅ HD Cover downloaded: {rel_cover_path}")
        else:
            # Fallback to playlist cover or default
            rel_cover_path = t.get('cover') or "images/spotify_covers/jakarta.jpg"
            print(f"   ℹ️ Using fallback cover: {rel_cover_path}")

    # 2. Download Audio Track via yt-dlp
    audio_filename = f"{slug}.m4a"
    audio_filepath = os.path.join(AUDIO_DIR, audio_filename)
    rel_audio_path = f"audio/{audio_filename}"

    # If it's one of the initial 5 tracks, keep existing
    if t.get('audioUrl') and t['audioUrl'].startswith('audio/') and os.path.exists(os.path.join(ROOT_DIR, t['audioUrl'])):
        rel_audio_path = t['audioUrl']
        print(f"   🎵 Audio already exists: {rel_audio_path}")
    elif os.path.exists(audio_filepath) and os.path.getsize(audio_filepath) > 500000:
        print(f"   🎵 Audio already downloaded: {rel_audio_path} ({os.path.getsize(audio_filepath)/1024/1024:.1f} MB)")
    else:
        # Construct search query
        clean_t = re.sub(r'\[.*?\]|\(.*?\)', '', title).strip()
        clean_a = re.sub(r'\[.*?\]|\(.*?\)', '', artist).strip()
        search_query = f"ytsearch1:{clean_a} {clean_t} audio"
        output_template = os.path.join(AUDIO_DIR, f"{slug}.%(ext)s")

        cmd = [
            "yt-dlp",
            "-f", "ba[ext=m4a]/ba",
            "--no-playlist",
            "-o", output_template,
            search_query
        ]
        
        try:
            print(f"   ⬇️ Downloading audio from YouTube: \"{clean_a} {clean_t}\"...")
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60)
            
            # Find the downloaded file if extension differed
            downloaded = None
            for ext in ['.m4a', '.mp3', '.webm', '.opus']:
                cand = os.path.join(AUDIO_DIR, f"{slug}{ext}")
                if os.path.exists(cand) and os.path.getsize(cand) > 300000:
                    downloaded = cand
                    rel_audio_path = f"audio/{slug}{ext}"
                    break
            
            if downloaded:
                size_mb = os.path.getsize(downloaded) / (1024 * 1024)
                print(f"   ✅ Audio downloaded: {rel_audio_path} ({size_mb:.2f} MB)")
            else:
                print(f"   ⚠️ Could not download audio for {title}. Stderr: {res.stderr[:200]}")
                rel_audio_path = t.get('audioUrl', '')
        except subprocess.TimeoutExpired:
            print(f"   ⚠️ Download timed out for {title}")
            rel_audio_path = t.get('audioUrl', '')
        except Exception as err:
            print(f"   ⚠️ Error downloading {title}: {err}")
            rel_audio_path = t.get('audioUrl', '')

    # Save to progress map
    progress_map[key] = {
        "title": title,
        "artist": artist,
        "audioUrl": rel_audio_path,
        "cover": rel_cover_path
    }

    # Save progress to disk every 5 items
    if idx % 5 == 0 or idx == total:
        with open(PROGRESS_FILE, "w", encoding="utf-8") as pf:
            json.dump(progress_map, pf, indent=2, ensure_ascii=False)
        print(f"   💾 Saved progress: {idx}/{total} tracks processed.")

print(f"\n==================================================")
print(f"🎉 ALL DOWNLOADS COMPLETED! UPDATING JS/APP.JS...")
print(f"==================================================")

# Now update js/app.js with all downloaded audioUrls and covers
with open(APP_JS, "r", encoding="utf-8") as f:
    js_code = f.read()

# Bump storage key to v14
js_code = re.sub(r"const STORAGE_KEY = 'romantic_spotify_v\d+[^']*';", "const STORAGE_KEY = 'romantic_spotify_v14_all_studio_audio_synced';", js_code)

# Update each track in playlists
m = re.search(r'playlists:\s*(\[[\s\S]*?\n\s*jamMessages)', js_code)
if m:
    pls_str = m.group(1).rstrip()
    pls_str = re.sub(r',\s*jamMessages$', '', pls_str)
    pls_str = re.sub(r'\s*jamMessages$', '', pls_str)
    
    try:
        playlists = json.loads(pls_str)
        updated_count = 0
        for pl in playlists:
            for trk in pl['tracks']:
                k = f"{trk['title'].strip().lower()}::{trk['artist'].strip().lower()}"
                if k in progress_map:
                    data = progress_map[k]
                    if data.get('audioUrl'):
                        trk['audioUrl'] = data['audioUrl']
                    if data.get('cover'):
                        trk['cover'] = data['cover']
                    updated_count += 1
        
        formatted_pls = json.dumps(playlists, indent=4, ensure_ascii=False)
        new_pls_block = f"playlists: {formatted_pls},\n  jamMessages"
        js_code = js_code[:m.start()] + new_pls_block + js_code[m.end():]
        print(f"✅ Updated {updated_count} track entries in js/app.js!")
    except Exception as e:
        print("⚠️ Error updating playlists JSON in app.js:", e)

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(js_code)

print("🚀 Successfully synchronized all downloads with js/app.js!")
