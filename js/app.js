// ================= REAL AUDIO ENGINE & STATE =================
const STORAGE_KEY = 'romantic_spotify_v15_all_covers_synced';

// Cloud sync is handled by js/db.js (window.MusicDB) — normalized Supabase tables, per-row writes.


// Verified Genuine Studio Audio Tracks stored locally
const realAudioTracks = {
  'from the start': 'audio/laufey_from_the_start.m4a',
  'last night on earth': 'audio/green_day_last_night_on_earth.m4a',
  'apocalypse': 'audio/cigarettes_after_sex_apocalypse.m4a',
  'i think they call this love': 'audio/matthew_ifield_i_think_they_call_this_love.m4a',
  'matthew ifield': 'audio/matthew_ifield_i_think_they_call_this_love.m4a',
  'those eyes': 'audio/new_west_those_eyes.m4a',
  'atlantis': 'audio/seafret_atlantis.m4a',
  'terbuang dalam waktu': 'audio/barasuara_terbuang_dalam_waktu.m4a',
  'best part': 'audio/daniel_caesar_best_part.m4a',
  'mistikus cinta': 'audio/dewa19_mistikus_cinta.m4a',
  'dua sejoli': 'audio/dewa19_dua_sejoli.m4a',
  'i wanna be yours': 'audio/arctic_monkeys_i_wanna_be_yours.m4a',
  'sialan': 'audio/adrian_khalif_juicy_luicy_sialan.m4a',
  'back to friends': 'audio/sombr_back_to_friends.m4a',
  'alexandra': 'audio/reality_club_alexandra.m4a',
  'obsessed': 'audio/zandros_limi_obsessed.m4a',
  'untungnya, hidup harus tetap berjalan': 'audio/bernadya_untungnya_hidup_harus_tetap_berjalan.m4a',
  'peradaban': 'audio/feast_peradaban.m4a',
  'pupus': 'audio/dewa19_pupus.m4a',
  'separuh nafas': 'audio/dewa19_separuh_nafas.m4a',
  'kangen': 'audio/dewa19_kangen.m4a'
};

// Official 1000x1000 HD Album Covers from Apple Music / iTunes
const officialCovers = {
  'from the start': 'images/covers/laufey_from_the_start.jpg',
  'last night on earth': 'images/covers/green_day_last_night_on_earth.jpg',
  'apocalypse': 'images/covers/cigarettes_after_sex_apocalypse.jpg',
  'i think they call this love': 'images/covers/matthew_ifield_cover.jpg',
  'matthew ifield': 'images/covers/matthew_ifield_cover.jpg',
  'those eyes': 'images/covers/those_eyes.jpg',
  'atlantis': 'images/covers/atlantis.jpg',
  'terbuang dalam waktu': 'images/covers/terbuang_dalam_waktu.jpg',
  'best part': 'images/covers/best_part.jpg',
  'mistikus cinta': 'images/covers/mistikus_cinta.jpg',
  'dua sejoli': 'images/covers/dua_sejoli.jpg',
  'i wanna be yours': 'images/covers/i_wanna_be_yours.jpg',
  'sialan': 'images/covers/sialan.jpg',
  'back to friends': 'images/covers/back_to_friends.jpg',
  'alexandra': 'images/covers/alexandra.jpg',
  'obsessed': 'images/covers/obsessed.jpg',
  'untungnya, hidup harus tetap berjalan': 'images/covers/untungnya.jpg',
  'peradaban': 'images/covers/peradaban.jpg',
  'pupus': 'images/covers/dewa19_pupus.jpg',
  'separuh nafas': 'images/covers/dewa19_separuh_nafas.jpg',
  'kangen': 'images/covers/dewa19_kangen.jpg'
};

// Verified YouTube Official Audio Catalog
const realSongCatalog = {
  'those eyes': '1-xGerv5FOk',
  'atlantis': 'gVAy3IZiL0s',
  'terbuang dalam waktu': 'J40iXb6D_24',
  'best part': 'hKgl5-lkT8U',
  'mistikus cinta': 'qZdYnlWJlPw',
  'dua sejoli': 'IU_v67PFnqk',
  'pupus': '1YxVpvdj27c',
  'separuh nafas': 'a8mFfM4aU9k',
  'kangen': 'O6fM0z8y1d4',
  'aku milikmu': 'w9yYQyN5WpA',
  'i wanna be yours': 'nyuo9-OjNNg',
  'sialan': 'z-kZ8u7sJqM',
  'back to friends': 'Jg6nBf62X7U',
  'alexandra': 'G-8g7l0eC8w',
  'obsessed': 'pB6-s3o114w',
  'untungnya, hidup harus tetap berjalan': 'p5oK8Qk3i2g',
  'peradaban': '2kZ7Q9e8k0o'
};

const defaultFullAudioPool = Object.values(realAudioTracks);

const defaultState = {
  pinCode: '1806',
  yourName: 'Dhafin',
  partnerName: 'Nadia',
  yourAvatar: 'images/spotify_covers/me.jpeg',
  partnerAvatar: 'images/spotify_covers/ndey.jpeg',
  loveNote: "Hai Nadey,\nSetiap lagu di dalam playlist ini punya potongan cerita tentang kita. Kapan pun kamu kangen atau lagi capek, putar lagu-lagu ini ya. Kita juga bisa nyalain fitur Listening Together biar berasa dengerin bareng terus! I love you more than words can say 🤍",
  activePlaylistId: 'pl-ours',
  playlists: [
    {
      "id": "pl-ours",
      "title": "✦ our melodies.",
      "desc": "after rain and lean with u <3 — lagu-lagu pengingat cerita kita berdua",
      "cover": "images/spotify_covers/jakarta.jpg",
      "tracks": [
        {
          "id": "t1",
          "title": "Those Eyes",
          "artist": "New West",
          "album": "Those Eyes - Single",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "3:41",
          "liked": true,
          "cover": "images/covers/those_eyes.jpg",
          "audioUrl": "audio/new_west_those_eyes.m4a",
          "youtubeId": "1-xGerv5FOk"
        },
        {
          "id": "t2",
          "title": "Atlantis",
          "artist": "Seafret",
          "album": "Tell Me It's Real",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "4:02",
          "liked": true,
          "cover": "images/covers/atlantis.jpg",
          "audioUrl": "audio/seafret_atlantis.m4a",
          "youtubeId": "gVAy3IZiL0s"
        },
        {
          "id": "t3",
          "title": "Terbuang Dalam Waktu",
          "artist": "Barasuara",
          "album": "Pikiran dan Perjalanan",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "4:32",
          "liked": true,
          "cover": "images/covers/terbuang_dalam_waktu.jpg",
          "audioUrl": "audio/barasuara_terbuang_dalam_waktu.m4a",
          "youtubeId": "J40iXb6D_24"
        },
        {
          "id": "t4",
          "title": "Best Part",
          "artist": "Daniel Caesar ft. H.E.R.",
          "album": "Freudian",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "3:29",
          "liked": true,
          "cover": "images/covers/best_part.jpg",
          "audioUrl": "audio/daniel_caesar_best_part.m4a",
          "youtubeId": "hKgl5-lkT8U"
        },
        {
          "id": "t5",
          "title": "Mistikus Cinta",
          "artist": "Dewa 19",
          "album": "Cintailah Cinta",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "5:38",
          "liked": true,
          "cover": "images/covers/mistikus_cinta.jpg",
          "audioUrl": "audio/dewa19_mistikus_cinta.m4a",
          "youtubeId": "XQYm2t73Gv4"
        },
        {
          "id": "t-dua-sejoli",
          "title": "Dua Sejoli",
          "artist": "Dewa 19",
          "album": "Bintang Lima",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "5:26",
          "liked": true,
          "cover": "images/covers/dewa19_dua_sejoli.jpg",
          "audioUrl": "audio/dewa19_dua_sejoli.m4a",
          "youtubeId": "IU_v67PFnqk"
        }
      ]
    },
    {
      "id": "pl-1",
      "title": "✦ jakarta.",
      "desc": "after rain and lean with u <3 — lagu-lagu pengingat cerita kita berdua di Jakarta",
      "cover": "images/spotify_covers/jakarta.jpg",
      "tracks": [
        {
          "id": "t1",
          "title": "Those Eyes",
          "artist": "New West",
          "album": "Those Eyes - Single",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "3:41",
          "liked": true,
          "cover": "images/covers/those_eyes.jpg",
          "audioUrl": "audio/new_west_those_eyes.m4a",
          "youtubeId": "1-xGerv5FOk"
        },
        {
          "id": "t2",
          "title": "Atlantis",
          "artist": "Seafret",
          "album": "Tell Me It's Real",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "4:02",
          "liked": true,
          "cover": "images/covers/atlantis.jpg",
          "audioUrl": "audio/seafret_atlantis.m4a",
          "youtubeId": "gVAy3IZiL0s"
        },
        {
          "id": "t3",
          "title": "Terbuang Dalam Waktu",
          "artist": "Barasuara",
          "album": "Terbuang Dalam Waktu - Single",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "4:59",
          "liked": true,
          "cover": "images/covers/terbuang_dalam_waktu.jpg",
          "audioUrl": "audio/barasuara_terbuang_dalam_waktu.m4a",
          "youtubeId": "pS-WJ7h_5k0"
        },
        {
          "id": "t4",
          "title": "Best Part",
          "artist": "Daniel Caesar",
          "album": "Freudian",
          "memory": "",
          "dateAdded": "Mar 14, 2025",
          "duration": "3:30",
          "liked": false,
          "cover": "images/covers/best_part.jpg",
          "audioUrl": "audio/daniel_caesar_best_part.m4a",
          "youtubeId": "hKgl5-lkT8U"
        },
        {
          "id": "t5",
          "title": "Mistikus Cinta",
          "artist": "Dewa 19",
          "album": "Cintailah Cinta",
          "memory": "",
          "dateAdded": "Oct 19, 2026",
          "duration": "5:38",
          "liked": true,
          "cover": "images/covers/mistikus_cinta.jpg",
          "audioUrl": "audio/dewa19_mistikus_cinta.m4a",
          "youtubeId": "qZdYnlWJlPw"
        },
        {
          "id": "pl-1-dua-sejoli",
          "title": "Dua Sejoli",
          "artist": "Dewa 19",
          "album": "Bintang Lima",
          "memory": "",
          "dateAdded": "Feb 25, 2025",
          "duration": "5:26",
          "liked": true,
          "cover": "images/covers/dewa19_dua_sejoli.jpg",
          "audioUrl": "audio/dewa19_dua_sejoli.m4a",
          "youtubeId": "IU_v67PFnqk"
        },
        {
          "id": "pl-1-t3",
          "title": "K.",
          "artist": "Cigarettes After Sex",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:19",
          "liked": false,
          "cover": "images/covers/cigarettes_after_sex_k.jpg",
          "audioUrl": "audio/cigarettes_after_sex_k.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t4",
          "title": "What Was I Made For? [From The Motion Picture \"Barbie\"]",
          "artist": "Billie Eilish",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:42",
          "liked": true,
          "cover": "images/covers/billie_eilish_what_was_i_made_for.jpg",
          "audioUrl": "audio/billie_eilish_what_was_i_made_for.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t5",
          "title": "It Will Rain",
          "artist": "Bruno Mars",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:17",
          "liked": false,
          "cover": "images/covers/bruno_mars_it_will_rain.jpg",
          "audioUrl": "audio/bruno_mars_it_will_rain.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t6",
          "title": "When I Was Your Man",
          "artist": "Bruno Mars",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:33",
          "liked": false,
          "cover": "images/covers/bruno_mars_when_i_was_your_man.jpg",
          "audioUrl": "audio/bruno_mars_when_i_was_your_man.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t7",
          "title": "On Bended Knee",
          "artist": "Boyz II Men",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:29",
          "liked": true,
          "cover": "images/covers/boyz_ii_men_on_bended_knee.jpg",
          "audioUrl": "audio/boyz_ii_men_on_bended_knee.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t8",
          "title": "I Love You, I'm Sorry",
          "artist": "Gracie Abrams",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:37",
          "liked": false,
          "cover": "images/covers/gracie_abrams_i_love_you_im_sorry.jpg",
          "audioUrl": "audio/gracie_abrams_i_love_you_im_sorry.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t9",
          "title": "End of Beginning",
          "artist": "Djo",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:39",
          "liked": false,
          "cover": "images/covers/djo_end_of_beginning.jpg",
          "audioUrl": "audio/djo_end_of_beginning.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t10",
          "title": "Walking Back Home",
          "artist": "Vira Talisa",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:12",
          "liked": true,
          "cover": "images/covers/vira_talisa_walking_back_home.jpg",
          "audioUrl": "audio/vira_talisa_walking_back_home.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t11",
          "title": "seasons",
          "artist": "wave to earth",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:15",
          "liked": false,
          "cover": "images/covers/wave_to_earth_seasons.jpg",
          "audioUrl": "audio/wave_to_earth_seasons.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-1-t12",
          "title": "Summertime Sadness",
          "artist": "Lana Del Rey",
          "album": "✦ jakarta.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:25",
          "liked": false,
          "cover": "images/covers/lana_del_rey_summertime_sadness.jpg",
          "audioUrl": "audio/lana_del_rey_summertime_sadness.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-fallin-love",
      "title": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
      "desc": "the art of loving — saat hati kita saling jatuh cinta setiap detiknya ｡𖦹°‧.𖥔 ݁ ˖",
      "cover": "images/spotify_covers/fallin_in_love.jpg",
      "tracks": [
        {
          "id": "pl-fallin-love-t1",
          "title": "That's What I Like",
          "artist": "Bruno Mars",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:26",
          "liked": true,
          "cover": "images/covers/bruno_mars_thats_what_i_like.jpg",
          "audioUrl": "audio/bruno_mars_thats_what_i_like.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t2",
          "title": "Marry You",
          "artist": "Bruno Mars",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:50",
          "liked": false,
          "cover": "images/covers/bruno_mars_marry_you.jpg",
          "audioUrl": "audio/bruno_mars_marry_you.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t3",
          "title": "I Wanna Be Yours",
          "artist": "Arctic Monkeys",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:03",
          "liked": false,
          "cover": "images/covers/i_wanna_be_yours.jpg",
          "audioUrl": "audio/arctic_monkeys_i_wanna_be_yours.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t4",
          "title": "\"Slut!\" (Taylor's Version) (From The Vault)",
          "artist": "Taylor Swift",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:00",
          "liked": true,
          "cover": "images/covers/taylor_swift_slut.jpg",
          "audioUrl": "audio/taylor_swift_slut.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t5",
          "title": "lowkey",
          "artist": "NIKI",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:51",
          "liked": false,
          "cover": "images/covers/niki_lowkey.jpg",
          "audioUrl": "audio/niki_lowkey.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t6",
          "title": "Falling In Love",
          "artist": "Cigarettes After Sex",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:05",
          "liked": false,
          "cover": "images/covers/cigarettes_after_sex_falling_in_love.jpg",
          "audioUrl": "audio/cigarettes_after_sex_falling_in_love.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t7",
          "title": "The Way I Loved You (Taylor’s Version)",
          "artist": "Taylor Swift",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:03",
          "liked": true,
          "cover": "images/covers/taylor_swift_the_way_i_loved_you.jpg",
          "audioUrl": "audio/taylor_swift_the_way_i_loved_you.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t8",
          "title": "No. 1 Party Anthem",
          "artist": "Arctic Monkeys",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:03",
          "liked": false,
          "cover": "images/covers/arctic_monkeys_no_1_party_anthem.jpg",
          "audioUrl": "audio/arctic_monkeys_no_1_party_anthem.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t9",
          "title": "Fearless (Taylor’s Version)",
          "artist": "Taylor Swift",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:01",
          "liked": false,
          "cover": "images/covers/taylor_swift_fearless.jpg",
          "audioUrl": "audio/taylor_swift_fearless.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t10",
          "title": "i wanna be your girlfriend",
          "artist": "girl in red",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:24",
          "liked": true,
          "cover": "images/covers/girl_in_red_i_wanna_be_your_girlfriend.jpg",
          "audioUrl": "audio/girl_in_red_i_wanna_be_your_girlfriend.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t11",
          "title": "Alexandra",
          "artist": "Reality Club",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:58",
          "liked": false,
          "cover": "images/covers/alexandra.jpg",
          "audioUrl": "audio/reality_club_alexandra.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-fallin-love-t12",
          "title": "Sure Thing",
          "artist": "Miguel",
          "album": "y'll fallin' in love? ｡𖦹°‧.𖥔 ݁ ˖",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:15",
          "liked": false,
          "cover": "images/covers/miguel_sure_thing.jpg",
          "audioUrl": "audio/miguel_sure_thing.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-candlelight",
      "title": "candlelight🧘🏻‍♀️",
      "desc": "warm vibes, candlelights, & sweet melodies buat nemenin hari santai kita 🧘🏻‍♀️",
      "cover": "images/spotify_covers/candlelight.jpg",
      "tracks": [
        {
          "id": "pl-candlelight-t1",
          "title": "2002",
          "artist": "Anne-Marie",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:06",
          "liked": true,
          "cover": "images/covers/annemarie_2002.jpg",
          "audioUrl": "audio/annemarie_2002.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t2",
          "title": "Last Friday Night (T.G.I.F.)",
          "artist": "Katy Perry",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:50",
          "liked": false,
          "cover": "images/covers/katy_perry_last_friday_night.jpg",
          "audioUrl": "audio/katy_perry_last_friday_night.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t3",
          "title": "34+35",
          "artist": "Ariana Grande",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:53",
          "liked": false,
          "cover": "images/covers/ariana_grande_3435.jpg",
          "audioUrl": "audio/ariana_grande_3435.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t4",
          "title": "supernatural",
          "artist": "Ariana Grande",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:43",
          "liked": true,
          "cover": "images/covers/ariana_grande_supernatural.jpg",
          "audioUrl": "audio/ariana_grande_supernatural.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t5",
          "title": "All Of The Girls You Loved Before",
          "artist": "Taylor Swift",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:41",
          "liked": false,
          "cover": "images/covers/taylor_swift_all_of_the_girls_you_loved_before.jpg",
          "audioUrl": "audio/taylor_swift_all_of_the_girls_you_loved_before.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t6",
          "title": "California Gurls - feat. Snoop Dogg",
          "artist": "Katy Perry, Snoop Dogg",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:56",
          "liked": false,
          "cover": "images/covers/katy_perry_snoop_dogg_california_gurls_feat_snoop.jpg",
          "audioUrl": "audio/katy_perry_snoop_dogg_california_gurls_feat_snoop.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t7",
          "title": "Please Please Please",
          "artist": "Sabrina Carpenter",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:06",
          "liked": true,
          "cover": "images/covers/sabrina_carpenter_please_please_please.jpg",
          "audioUrl": "audio/sabrina_carpenter_please_please_please.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t8",
          "title": "obsessed",
          "artist": "zandros, Limi",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:00",
          "liked": false,
          "cover": "images/covers/obsessed.jpg",
          "audioUrl": "audio/zandros_limi_obsessed.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t9",
          "title": "Last Friday Night (T.G.I.F.)",
          "artist": "Katy Perry",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:50",
          "liked": false,
          "cover": "images/covers/katy_perry_last_friday_night.jpg",
          "audioUrl": "audio/katy_perry_last_friday_night.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t10",
          "title": "Dangerous Woman",
          "artist": "Ariana Grande",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:55",
          "liked": true,
          "cover": "images/covers/ariana_grande_dangerous_woman.jpg",
          "audioUrl": "audio/ariana_grande_dangerous_woman.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t11",
          "title": "If I Ain't Got You",
          "artist": "Alicia Keys",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:48",
          "liked": false,
          "cover": "images/covers/alicia_keys_if_i_aint_got_you.jpg",
          "audioUrl": "audio/alicia_keys_if_i_aint_got_you.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-candlelight-t12",
          "title": "Water",
          "artist": "Tyla",
          "album": "candlelight🧘🏻‍♀️",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:20",
          "liked": false,
          "cover": "images/covers/tyla_water.jpg",
          "audioUrl": "audio/tyla_water.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-cry-reboot",
      "title": "cry, breathe, & reboot.",
      "desc": "lagu-lagu pereda lelah, tenang, dan penyemangat saat butuh pelukan hangat 🤍",
      "cover": "images/spotify_covers/cry_reboot.jpg",
      "tracks": [
        {
          "id": "pl-cry-reboot-t1",
          "title": "Nina",
          "artist": ".Feast",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:37",
          "liked": true,
          "cover": "images/covers/feast_nina.jpg",
          "audioUrl": "audio/feast_nina.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t2",
          "title": "Evaluasi",
          "artist": "Hindia",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:14",
          "liked": false,
          "cover": "images/covers/hindia_evaluasi.jpg",
          "audioUrl": "audio/hindia_evaluasi.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t3",
          "title": "Bertaut",
          "artist": "Nadin Amizah",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:15",
          "liked": false,
          "cover": "images/covers/nadin_amizah_bertaut.jpg",
          "audioUrl": "audio/nadin_amizah_bertaut.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t4",
          "title": "Sorai",
          "artist": "Nadin Amizah",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:38",
          "liked": true,
          "cover": "images/covers/nadin_amizah_sorai.jpg",
          "audioUrl": "audio/nadin_amizah_sorai.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t5",
          "title": "Secukupnya",
          "artist": "Hindia",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:25",
          "liked": false,
          "cover": "images/covers/hindia_secukupnya.jpg",
          "audioUrl": "audio/hindia_secukupnya.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t6",
          "title": "Untungnya, Hidup Harus Tetap Berjalan",
          "artist": "Bernadya",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:02",
          "liked": false,
          "cover": "images/covers/untungnya.jpg",
          "audioUrl": "audio/bernadya_untungnya_hidup_harus_tetap_berjalan.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t7",
          "title": "Peradaban",
          "artist": ".Feast",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:39",
          "liked": true,
          "cover": "images/covers/peradaban.jpg",
          "audioUrl": "audio/feast_peradaban.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t8",
          "title": "You're On Your Own, Kid",
          "artist": "Taylor Swift",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:14",
          "liked": false,
          "cover": "images/covers/taylor_swift_youre_on_your_own_kid.jpg",
          "audioUrl": "audio/taylor_swift_youre_on_your_own_kid.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t9",
          "title": "Matilda",
          "artist": "Harry Styles",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:05",
          "liked": false,
          "cover": "images/covers/harry_styles_matilda.jpg",
          "audioUrl": "audio/harry_styles_matilda.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t10",
          "title": "Kata Mereka Ini Berlebihan",
          "artist": "Bernadya",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:11",
          "liked": true,
          "cover": "images/covers/bernadya_kata_mereka_ini_berlebihan.jpg",
          "audioUrl": "audio/bernadya_kata_mereka_ini_berlebihan.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t11",
          "title": "Sialan",
          "artist": "Adrian Khalif, Juicy Luicy",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:01",
          "liked": false,
          "cover": "images/covers/sialan.jpg",
          "audioUrl": "audio/adrian_khalif_juicy_luicy_sialan.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cry-reboot-t12",
          "title": "Untuk Perempuan Yang Sedang Di Pelukan",
          "artist": "Payung Teduh",
          "album": "cry, breathe, & reboot.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:42",
          "liked": false,
          "cover": "images/covers/payung_teduh_untuk_perempuan_yang_sedang_di_peluka.jpg",
          "audioUrl": "audio/payung_teduh_untuk_perempuan_yang_sedang_di_peluka.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-shes-a-racer",
      "title": "shes a racer.",
      "desc": "late night drive playlist, vibes keren & banger hits sambil keliling kota 🏎️",
      "cover": "images/spotify_covers/shes_a_racer.jpg",
      "tracks": [
        {
          "id": "pl-shes-a-racer-t1",
          "title": "Reminder",
          "artist": "The Weeknd",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:38",
          "liked": true,
          "cover": "images/covers/the_weeknd_reminder.jpg",
          "audioUrl": "audio/the_weeknd_reminder.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t2",
          "title": "Sure Thing",
          "artist": "Miguel",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:15",
          "liked": false,
          "cover": "images/covers/miguel_sure_thing.jpg",
          "audioUrl": "audio/miguel_sure_thing.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t3",
          "title": "Swim",
          "artist": "Chase Atlantic",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:48",
          "liked": false,
          "cover": "images/covers/chase_atlantic_swim.jpg",
          "audioUrl": "audio/chase_atlantic_swim.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t4",
          "title": "Kiss It Better",
          "artist": "Rihanna",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:13",
          "liked": true,
          "cover": "images/covers/rihanna_kiss_it_better.jpg",
          "audioUrl": "audio/rihanna_kiss_it_better.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t5",
          "title": "Collide (Sped Up Remix)",
          "artist": "Justine Skye, Tyga",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:41",
          "liked": false,
          "cover": "images/covers/justine_skye_tyga_collide.jpg",
          "audioUrl": "audio/justine_skye_tyga_collide.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t6",
          "title": "Die With A Smile",
          "artist": "Lady Gaga, Bruno Mars",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:11",
          "liked": false,
          "cover": "images/covers/lady_gaga_bruno_mars_die_with_a_smile.jpg",
          "audioUrl": "audio/lady_gaga_bruno_mars_die_with_a_smile.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t7",
          "title": "Aku Milikmu",
          "artist": "Dewa 19",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:32",
          "liked": true,
          "cover": "images/covers/dewa_19_aku_milikmu.jpg",
          "audioUrl": "audio/dewa_19_aku_milikmu.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t8",
          "title": "Cry",
          "artist": "Cigarettes After Sex",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:16",
          "liked": false,
          "cover": "images/covers/cigarettes_after_sex_cry.jpg",
          "audioUrl": "audio/cigarettes_after_sex_cry.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t9",
          "title": "Falling In Love",
          "artist": "Cigarettes After Sex",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:05",
          "liked": false,
          "cover": "images/covers/cigarettes_after_sex_falling_in_love.jpg",
          "audioUrl": "audio/cigarettes_after_sex_falling_in_love.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t10",
          "title": "Sunsetz",
          "artist": "Cigarettes After Sex",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:34",
          "liked": true,
          "cover": "images/covers/cigarettes_after_sex_sunsetz.jpg",
          "audioUrl": "audio/cigarettes_after_sex_sunsetz.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t11",
          "title": "welcome and goodbye",
          "artist": "Dream, Ivory",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "2:20",
          "liked": false,
          "cover": "images/covers/dream_ivory_welcome_and_goodbye.jpg",
          "audioUrl": "audio/dream_ivory_welcome_and_goodbye.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-shes-a-racer-t12",
          "title": "Tokyo Drift (Fast & Furious) - From \"The Fast And The Furious: Tokyo Drift\" Soundtrack",
          "artist": "Teriyaki Boyz",
          "album": "shes a racer.",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:15",
          "liked": false,
          "cover": "images/covers/teriyaki_boyz_tokyo_drift_from_the_fast_and_the_fu.jpg",
          "audioUrl": "audio/teriyaki_boyz_tokyo_drift_from_the_fast_and_the_fu.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-cocktails",
      "title": "🍸 cocktails",
      "desc": "moody R&B, smooth basslines, and chill evening talks 🍸",
      "cover": "images/spotify_covers/cocktails.jpg",
      "tracks": [
        {
          "id": "pl-cocktails-t1",
          "title": "B.E.D.",
          "artist": "Jacquees",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:56",
          "liked": true,
          "cover": "images/covers/jacquees_bed.jpg",
          "audioUrl": "audio/jacquees_bed.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t2",
          "title": "Long Way 2 Go",
          "artist": "Cassie",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:40",
          "liked": false,
          "cover": "images/covers/cassie_long_way_2_go.jpg",
          "audioUrl": "audio/cassie_long_way_2_go.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t3",
          "title": "2 On (feat. ScHoolboy Q)",
          "artist": "Tinashe, ScHoolboy Q",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:47",
          "liked": false,
          "cover": "images/covers/tinashe_schoolboy_q_2_on.jpg",
          "audioUrl": "audio/tinashe_schoolboy_q_2_on.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t4",
          "title": "Or Nah (feat. The Weeknd, Wiz Khalifa & DJ Mustard) - Remix",
          "artist": "Ty Dolla $ign, The Weeknd, Wiz Khalifa, Mustard",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:02",
          "liked": true,
          "cover": "images/covers/ty_dolla_ign_the_weeknd_wiz_khalifa_mustard_or_nah.jpg",
          "audioUrl": "audio/ty_dolla_ign_the_weeknd_wiz_khalifa_mustard_or_nah.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t5",
          "title": "Flashing Lights",
          "artist": "Kanye West, Dwele",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:57",
          "liked": false,
          "cover": "images/covers/kanye_west_dwele_flashing_lights.jpg",
          "audioUrl": "audio/kanye_west_dwele_flashing_lights.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t6",
          "title": "Fair Trade (with Travis Scott)",
          "artist": "Drake, Travis Scott",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:51",
          "liked": false,
          "cover": "images/covers/drake_travis_scott_fair_trade.jpg",
          "audioUrl": "audio/drake_travis_scott_fair_trade.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t7",
          "title": "No Role Modelz",
          "artist": "J. Cole",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:52",
          "liked": true,
          "cover": "images/covers/j_cole_no_role_modelz.jpg",
          "audioUrl": "audio/j_cole_no_role_modelz.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t8",
          "title": "Bitches Love Me",
          "artist": "Lil Wayne, Future, Drake",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:11",
          "liked": false,
          "cover": "images/covers/lil_wayne_future_drake_bitches_love_me.jpg",
          "audioUrl": "audio/lil_wayne_future_drake_bitches_love_me.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t9",
          "title": "P power (feat. Drake)",
          "artist": "Gunna, Drake",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:13",
          "liked": false,
          "cover": "images/covers/gunna_drake_p_power.jpg",
          "audioUrl": "audio/gunna_drake_p_power.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t10",
          "title": "God's Plan",
          "artist": "Drake",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:18",
          "liked": true,
          "cover": "images/covers/drake_gods_plan.jpg",
          "audioUrl": "audio/drake_gods_plan.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t11",
          "title": "Teenage Fever",
          "artist": "Drake",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:39",
          "liked": false,
          "cover": "images/covers/drake_teenage_fever.jpg",
          "audioUrl": "audio/drake_teenage_fever.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-cocktails-t12",
          "title": "Time Flies",
          "artist": "Drake",
          "album": "🍸 cocktails",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:12",
          "liked": false,
          "cover": "images/covers/drake_time_flies.jpg",
          "audioUrl": "audio/drake_time_flies.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-jj-remix",
      "title": "in 🇮🇩 we said jj remix",
      "desc": "jedag jedug vibes Indonesia yang seru & bikin ketawa bareng kamu 🇮🇩🔥",
      "cover": "images/spotify_covers/jj_remix.jpg",
      "tracks": [
        {
          "id": "pl-jj-remix-t1",
          "title": "Culik Aku Dong",
          "artist": "Kharis Sopan, DJ Likin Breat",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:18",
          "liked": true,
          "cover": "images/covers/kharis_sopan_dj_likin_breat_culik_aku_dong.jpg",
          "audioUrl": "audio/kharis_sopan_dj_likin_breat_culik_aku_dong.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t2",
          "title": "DITINGGAL BANG DIKA",
          "artist": "Dika",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:30",
          "liked": false,
          "cover": "images/covers/dika_ditinggal_bang_dika.jpg",
          "audioUrl": "audio/dika_ditinggal_bang_dika.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t3",
          "title": "DJ Hilang Harapan x Rutinitas Randong",
          "artist": "DJ BUDOTS",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:00",
          "liked": false,
          "cover": "images/covers/dj_budots_dj_hilang_harapan_extended.jpg",
          "audioUrl": "audio/dj_budots_dj_hilang_harapan_x_rutinitas_randong.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t4",
          "title": "Karena Kamu Cantik",
          "artist": "Komang Rimex",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:36",
          "liked": true,
          "cover": "images/covers/komang_rimex_karena_kamu_cantik.jpg",
          "audioUrl": "audio/komang_rimex_karena_kamu_cantik.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t5",
          "title": "SUNGGUH KETAMVANAN INI",
          "artist": "Maman Fvndy, DJ Donall, RPH Remix",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:40",
          "liked": false,
          "cover": "images/covers/maman_fvndy_seratus_persen_cintaku.jpg",
          "audioUrl": "audio/maman_fvndy_dj_donall_rph_remix_sungguh_ketamvanan.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t6",
          "title": "DJ MALAM MINGGU AKU TAK PUNYA PACAR",
          "artist": "DJ MANAY",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "5:55",
          "liked": false,
          "cover": "images/spotify_covers/jj_remix.jpg",
          "audioUrl": "audio/dj_manay_dj_malam_minggu_aku_tak_punya_pacar.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t7",
          "title": "Sakitnya Luar Dalam",
          "artist": "DJ Haning",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:22",
          "liked": true,
          "cover": "images/covers/dj_haning_sakitnya_luar_dalam.jpg",
          "audioUrl": "audio/dj_haning_sakitnya_luar_dalam.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t8",
          "title": "Seratus Persen Cintaku",
          "artist": "Maman Fvndy",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:49",
          "liked": false,
          "cover": "images/covers/maman_fvndy_seratus_persen_cintaku.jpg",
          "audioUrl": "audio/maman_fvndy_seratus_persen_cintaku.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t9",
          "title": "DJ JANGAN SALAH PASANGAN X BONFIRE",
          "artist": "DJ ManikCi",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:55",
          "liked": false,
          "cover": "images/spotify_covers/jj_remix.jpg",
          "audioUrl": "audio/dj_manikci_dj_jangan_salah_pasangan_x_bonfire.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t10",
          "title": "DJ HILANG HARAPAN EXTENDED",
          "artist": "DJ BUDOTS",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:43",
          "liked": true,
          "cover": "images/covers/dj_budots_dj_hilang_harapan_extended.jpg",
          "audioUrl": "audio/dj_budots_dj_hilang_harapan_extended.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t11",
          "title": "Laguku Dubstep",
          "artist": "DJ Cantika",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:58",
          "liked": false,
          "cover": "images/covers/dj_cantika_laguku_dubstep.jpg",
          "audioUrl": "audio/dj_cantika_laguku_dubstep.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-jj-remix-t12",
          "title": "DJ GOYANG DAYUNG Instrumental",
          "artist": "Maman Fvndy",
          "album": "in 🇮🇩 we said jj remix",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:51",
          "liked": false,
          "cover": "images/covers/maman_fvndy_dj_goyang_dayung_instrumental.jpg",
          "audioUrl": "audio/maman_fvndy_dj_goyang_dayung_instrumental.m4a",
          "youtubeId": ""
        }
      ]
    },
    {
      "id": "pl-midnight-cry",
      "title": "⋆˙⟡ midnight cry",
      "desc": "lagu-lagu mellow tengah malam, saat hening dan rindu menyapa ⋆˙⟡",
      "cover": "images/spotify_covers/midnight_cry.jpg",
      "tracks": [
        {
          "id": "pl-midnight-cry-t1",
          "title": "Fix You",
          "artist": "Coldplay",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:55",
          "liked": true,
          "cover": "images/covers/coldplay_fix_you.jpg",
          "audioUrl": "audio/coldplay_fix_you.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t2",
          "title": "Somewhere Only We Know",
          "artist": "Keane",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:57",
          "liked": false,
          "cover": "images/covers/keane_somewhere_only_we_know.jpg",
          "audioUrl": "audio/keane_somewhere_only_we_know.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t3",
          "title": "When I Was Your Man",
          "artist": "Bruno Mars",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:33",
          "liked": false,
          "cover": "images/covers/bruno_mars_when_i_was_your_man.jpg",
          "audioUrl": "audio/bruno_mars_when_i_was_your_man.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t4",
          "title": "'Cause You Have To",
          "artist": "LANY",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:10",
          "liked": true,
          "cover": "images/covers/lany_cause_you_have_to.jpg",
          "audioUrl": "audio/lany_cause_you_have_to.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t5",
          "title": "The Man Who Can't Be Moved",
          "artist": "The Script",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:01",
          "liked": false,
          "cover": "images/covers/the_script_the_man_who_cant_be_moved.jpg",
          "audioUrl": "audio/the_script_the_man_who_cant_be_moved.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t6",
          "title": "If Ever You're in My Arms Again",
          "artist": "Peabo Bryson",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:11",
          "liked": false,
          "cover": "images/covers/peabo_bryson_if_ever_youre_in_my_arms_again.jpg",
          "audioUrl": "audio/peabo_bryson_if_ever_youre_in_my_arms_again.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t7",
          "title": "It Will Rain",
          "artist": "Bruno Mars",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "4:17",
          "liked": true,
          "cover": "images/covers/bruno_mars_it_will_rain.jpg",
          "audioUrl": "audio/bruno_mars_it_will_rain.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t8",
          "title": "Thru These Tears",
          "artist": "LANY",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:24",
          "liked": false,
          "cover": "images/covers/lany_thru_these_tears.jpg",
          "audioUrl": "audio/lany_thru_these_tears.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t9",
          "title": "back to friends",
          "artist": "sombr",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:19",
          "liked": false,
          "cover": "images/covers/back_to_friends.jpg",
          "audioUrl": "audio/sombr_back_to_friends.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t10",
          "title": "Glimpse of Us",
          "artist": "Joji",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:53",
          "liked": true,
          "cover": "images/covers/joji_glimpse_of_us.jpg",
          "audioUrl": "audio/joji_glimpse_of_us.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t11",
          "title": "Slipping Through My Fingers",
          "artist": "ABBA",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:53",
          "liked": false,
          "cover": "images/covers/abba_slipping_through_my_fingers.jpg",
          "audioUrl": "audio/abba_slipping_through_my_fingers.m4a",
          "youtubeId": ""
        },
        {
          "id": "pl-midnight-cry-t12",
          "title": "Atlantis",
          "artist": "Seafret",
          "album": "⋆˙⟡ midnight cry",
          "memory": "",
          "dateAdded": "Oct 20, 2026",
          "duration": "3:49",
          "liked": false,
          "cover": "images/covers/atlantis.jpg",
          "audioUrl": "audio/seafret_atlantis.m4a",
          "youtubeId": "gVAy3IZiL0s"
        }
      ]
    }
  ],
  jamMessages: [
    { sender: 'partner', text: 'Sayang, lagunya sekarang pakai cover album official dan lagunya asli semua 🥺💕 Cantik banget!', time: '19:42' },
    { sender: 'you', text: 'Iyaa! Tampilannya jadi berasa kayak Spotify Premium asli ✨', time: '19:43' }
  ],
  polaroidMemories: []
};

let state = loadState();
let currentView = 'home';
let currentIndex = 0;
let currentPlayingPlaylistId = state.activePlaylistId || 'pl-ours';
let currentPlayingIndex = 0;
let currentPlayingTrack = null;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentFilter = 'all';
let vinylVisible = false;
let syncModeActive = true;

// Player Dual Engines
const audio = document.getElementById('audioPlayer');
let currentEngine = 'youtube'; // 'youtube' or 'html5'
let ytPlayer = null;
let isYtReady = false;
let ytScrubTimer = null;

// ================= YOUTUBE REAL AUDIO ENGINE =================
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '10',
    width: '10',
    videoId: '1-xGerv5FOk',
    playerVars: {
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
          playAudio();
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

// ================= STATE HELPERS & STORAGE =================
// Catatan preset lama yang dulu otomatis terisi. Dihapus agar Sweet Memory Note diisi sendiri.
const LEGACY_PRESET_MEMORIES = new Set([
  'Tatapan pertama yang bikin aku langsung jatuh hati sama kamu 👀✨',
  'Lagu yang selalu kita putar pas perjalanan malam di mobil 🌃',
  'Lagu yang nemenin kita waktu saling cerita mimpi dan masa depan 💭',
  "If life is a movie, oh you're the best part 🤍",
  'Ketika rasa itu magis dan tak bisa dijelaskan kata-kata 🌌',
  'Usaplah dahiku, genggamlah tanganku... Lagu cinta abadi kita berdua 💕',
  'Lagu favorit kita waktu kehujanan bareng sambil ketawa-tawa ☔🤍',
  'You are literally the best part of my every single day ☕🌸',
  'Suasana tenang dan damai tiap kali denger lagu ini bareng kamu ☕',
  'Setiap liriknya berasa kayak cerita kita berdua 🤍',
  'Ingat ga waktu lagu ini pertama kali kita putar di mobil? 🚗',
  'Senyummu langsung kebayang tiap intro lagu ini mulai 🌸',
  'Melodi manis yang selalu ngingetin aku sama kamu 💕',
  'Lagu favorit waktu kita ngobrol berjam-jam tanpa bosen ✨',
  'Lagu waktu kita jalan berdua habis hujan sambil cerita masa depan 💕',
  'Lagu spesial pilihan kita 💕'
]);

function isLegacyPresetMemory(text) {
  const t = (text || '').trim();
  if (!t) return false;
  return LEGACY_PRESET_MEMORIES.has(t) || /^Lagu spesial dari album ".*" ✦$/.test(t);
}

// Mengosongkan catatan preset lama. Return true jika ada perubahan.
function purgePresetMemories(playlists) {
  let changed = false;
  (playlists || []).forEach(pl => {
    (pl.tracks || []).forEach(t => {
      if (isLegacyPresetMemory(t.memory)) {
        t.memory = '';
        changed = true;
      }
    });
  });
  return changed;
}

function loadState() {
  try {
    let saved = localStorage.getItem(STORAGE_KEY);

    // If current key is not yet populated, automatically migrate from previous saved state in localStorage!
    if (!saved) {
      const candidateKeys = [
        'romantic_spotify_v14_all_studio_audio_synced',
        'romantic_spotify_v13_all_studio_audio_synced',
        'romantic_spotify_v12_official_spotify_synced',
        'romantic_spotify_v11_real_studio_audio',
        'romantic_spotify_v10_real_studio_audio',
        'romantic_spotify_v9_real_studio_audio',
        'romantic_spotify_v8_real_audio'
      ];
      for (const k of candidateKeys) {
        const val = localStorage.getItem(k);
        if (val) {
          saved = val;
          console.log('Migrated custom user data from key:', k);
          break;
        }
      }
      if (!saved) {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('romantic_spotify_') && !k.endsWith('_pin') && !k.endsWith('_memories')) {
            const val = localStorage.getItem(k);
            if (val) {
              saved = val;
              console.log('Restored user data from:', k);
              break;
            }
          }
        }
      }
    }

    // Retrieve dedicated user profile customizations
    let savedProfileConfig = null;
    const rawProfile = localStorage.getItem('romantic_music_profile_config');
    if (rawProfile) {
      try {
        savedProfileConfig = JSON.parse(rawProfile);
      } catch (e) { }
    }

    let parsed = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        parsed = null;
      }
    }
    if (!parsed) {
      parsed = JSON.parse(JSON.stringify(defaultState));
    }

    // Restore custom PIN if user changed it
    const savedPin = localStorage.getItem('romantic_music_custom_pin');
    if (savedPin) {
      parsed.pinCode = savedPin;
    }

    // Restore user profile customizations if present
    if (savedProfileConfig) {
      if (savedProfileConfig.yourName) parsed.yourName = savedProfileConfig.yourName;
      if (savedProfileConfig.partnerName) parsed.partnerName = savedProfileConfig.partnerName;
      if (savedProfileConfig.yourAvatar) parsed.yourAvatar = savedProfileConfig.yourAvatar;
      if (savedProfileConfig.partnerAvatar) parsed.partnerAvatar = savedProfileConfig.partnerAvatar;
      if (savedProfileConfig.loveNote) parsed.loveNote = savedProfileConfig.loveNote;
      if (savedProfileConfig.profileUpdatedAt) parsed.profileUpdatedAt = Number(savedProfileConfig.profileUpdatedAt);
    }
    const savedProfTime = localStorage.getItem('romantic_music_profile_updated_at');
    if (savedProfTime) parsed.profileUpdatedAt = Number(savedProfTime);

    const savedPlTime = localStorage.getItem('romantic_music_playlists_updated_at');
    if (savedPlTime) parsed.playlistsUpdatedAt = Number(savedPlTime);

    const savedPolTime = localStorage.getItem('romantic_music_polaroids_updated_at');
    if (savedPolTime) parsed.polaroidsUpdatedAt = Number(savedPolTime);

    // Restore playlist metadata customizations (title, desc, cover)
    const rawPlCustom = localStorage.getItem('romantic_music_playlist_customizations');
    if (rawPlCustom) {
      try {
        const plCustom = JSON.parse(rawPlCustom);
        if (Array.isArray(parsed.playlists)) {
          parsed.playlists.forEach(pl => {
            if (plCustom[pl.id]) {
              if (plCustom[pl.id].title) pl.title = plCustom[pl.id].title;
              if (plCustom[pl.id].desc !== undefined) pl.desc = plCustom[pl.id].desc;
              if (plCustom[pl.id].cover) pl.cover = plCustom[pl.id].cover;
            }
          });
        }
      } catch(e){}
    }

    // Restore dedicated polaroid memories if user added or deleted any
    const savedPolaroids = localStorage.getItem('romantic_music_polaroid_memories');
    if (savedPolaroids !== null) {
      try {
        parsed.polaroidMemories = JSON.parse(savedPolaroids);
      } catch (e) {
        parsed.polaroidMemories = [];
      }
    }
    // Automatically purge old dummy sample photos (pol-1 to pol-4 or unsplash) from local cache
    if (Array.isArray(parsed.polaroidMemories)) {
      parsed.polaroidMemories = parsed.polaroidMemories.filter(p => !['pol-1', 'pol-2', 'pol-3', 'pol-4'].includes(p?.id) && !(p?.imageUrl && p.imageUrl.includes('images.unsplash.com')));
    } else {
      parsed.polaroidMemories = [];
    }

    // Deduplicate playlist IDs & auto-repair any corrupted default playlists
    if (parsed.playlists) {
      const seenIds = new Set();
      parsed.playlists = parsed.playlists.filter(pl => {
        if (!pl.id || seenIds.has(pl.id)) return false;
        seenIds.add(pl.id);
        return true;
      });

      parsed.playlists.forEach(pl => {
        if (pl.id !== 'pl-ours') {
          const defaultPl = defaultState.playlists.find(dp => dp.id === pl.id);
          if (defaultPl && pl.title === 'ours') {
            console.log(`✦ Auto-healing corrupted playlist title ${pl.id} back to: ${defaultPl.title}`);
            pl.title = defaultPl.title;
            pl.desc = defaultPl.desc;
          }
        }
      });
      parsed.playlists.forEach(pl => {
        if (!pl.tracks) {
          const defaultPl = defaultState.playlists.find(dp => dp.id === pl.id);
          pl.tracks = defaultPl && defaultPl.tracks ? JSON.parse(JSON.stringify(defaultPl.tracks)) : [];
        }

        if (['pl-ours', 'pl-1'].includes(pl.id)) {
          const hasDua = pl.tracks.some(t => (t.title || '').toLowerCase().includes('dua sejoli') || t.id === 't-dua-sejoli');
          if (!hasDua) {
            pl.tracks.push({
              id: 't-dua-sejoli',
              title: 'Dua Sejoli',
              artist: 'Dewa 19',
              album: 'Bintang Lima',
              memory: '',
              dateAdded: 'Feb 25, 2025',
              duration: '5:26',
              liked: true,
              cover: 'images/covers/dua_sejoli.jpg',
              audioUrl: 'audio/dewa19_dua_sejoli.m4a',
              youtubeId: 'IU_v67PFnqk'
            });
          }
        }

        if (Array.isArray(pl.tracks)) {
          pl.tracks.forEach(t => {
            const lowTitle = (t.title || '').toLowerCase().trim();
            for (const [key, localPath] of Object.entries(realAudioTracks)) {
              if (lowTitle.includes(key)) {
                t.audioUrl = localPath;
              }
            }
            for (const [key, covPath] of Object.entries(officialCovers)) {
              if (lowTitle.includes(key)) {
                t.cover = covPath;
              }
            }
            if (lowTitle.includes('atlantis')) {
              t.youtubeId = 'gVAy3IZiL0s';
              t.audioUrl = 'audio/seafret_atlantis.m4a';
              t.duration = '4:18';
            }
            if (lowTitle.includes('pupus')) {
              t.youtubeId = '7v2AJiZXHjI';
              t.audioUrl = 'audio/dewa19_pupus.m4a';
              t.cover = 'images/covers/dewa19_pupus.jpg';
              t.duration = '5:05';
            }
            if (lowTitle.includes('separuh nafas')) {
              t.youtubeId = '0vuBZYWZPIc';
              t.audioUrl = 'audio/dewa19_separuh_nafas.m4a';
              t.cover = 'images/covers/dewa19_separuh_nafas.jpg';
              t.duration = '5:00';
            }
            if (lowTitle.includes('kangen')) {
              t.youtubeId = 'NSSBwftuG7A';
              t.audioUrl = 'audio/dewa19_kangen.m4a';
              t.cover = 'images/covers/dewa19_kangen.jpg';
              t.duration = '5:32';
            }
            if (lowTitle.includes('i think they call this love') || (t.artist || '').toLowerCase().includes('matthew ifield')) {
              t.title = 'I Think They Call This Love (Cover)';
              t.artist = 'Matthew Ifield';
              t.album = "I’ll Be Home For Christmas / I Think They Call This Love (Cover)";
              t.cover = 'images/covers/matthew_ifield_cover.jpg';
              t.audioUrl = 'audio/matthew_ifield_i_think_they_call_this_love.m4a';
              t.youtubeId = 'CnEqrgMlWLQ';
              t.duration = '3:16';
            }
          });
        }
      });
    }

    if (purgePresetMemories(parsed.playlists)) {
      console.log('✦ Preset Sweet Memory Notes dikosongkan agar bisa diisi sendiri');
      window.__pendingPresetPurgeSync = true;
    }

    const mergedState = { ...defaultState, ...parsed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
    return mergedState;
  } catch (e) {
    console.warn('Error loading state:', e);
  }
  const initState = JSON.parse(JSON.stringify(defaultState));
  const savedPin = localStorage.getItem('romantic_music_custom_pin');
  if (savedPin) initState.pinCode = savedPin;
  return initState;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Quota exceeded in saveState, cleaning older keys:', err);
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('romantic_spotify_v') && k !== STORAGE_KEY) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e2) {
      console.warn('Could not save full state to localStorage:', e2);
    }
  }

  try {
    const profileConfig = {
      yourName: state.yourName,
      partnerName: state.partnerName,
      yourAvatar: state.yourAvatar,
      partnerAvatar: state.partnerAvatar,
      loveNote: state.loveNote
    };
    localStorage.setItem('romantic_music_profile_config', JSON.stringify(profileConfig));
  } catch (err) {
    console.warn('Could not save profile config:', err);
  }

  // Automatically sync updated state via MusicDB (per-row cloud sync)
  if (window.MusicDB && typeof window.MusicDB.scheduleFlush === 'function') {
    window.MusicDB.scheduleFlush();
  }
}

function triggerSupabaseSync() {
  if (window.MusicDB && typeof window.MusicDB.scheduleFlush === 'function') {
    window.MusicDB.scheduleFlush();
  }
}

async function pushStateToSupabase() {
  if (window.MusicDB && typeof window.MusicDB.flushNow === 'function') {
    return await window.MusicDB.flushNow();
  }
}

function initSupabaseSync() {
  if (!window.MusicDB || typeof window.MusicDB.init !== 'function') {
    console.warn('✦ [MusicDB] Layer not loaded, continuing offline.');
    return;
  }
  window.MusicDB.init({
    getState: () => state,
    getDefaults: () => defaultState,
    applyCloudState: (cloudState) => {
      if (!cloudState) return;
      if (cloudState.pinCode !== undefined) state.pinCode = cloudState.pinCode;
      if (cloudState.yourName !== undefined) state.yourName = cloudState.yourName;
      if (cloudState.partnerName !== undefined) state.partnerName = cloudState.partnerName;
      if (cloudState.yourAvatar !== undefined) state.yourAvatar = cloudState.yourAvatar;
      if (cloudState.partnerAvatar !== undefined) state.partnerAvatar = cloudState.partnerAvatar;
      if (cloudState.loveNote !== undefined) state.loveNote = cloudState.loveNote;
      if (Array.isArray(cloudState.polaroidMemories)) state.polaroidMemories = cloudState.polaroidMemories;
      if (Array.isArray(cloudState.jamMessages)) state.jamMessages = cloudState.jamMessages;

      if (Array.isArray(cloudState.playlists) && cloudState.playlists.length > 0) {
        const special = (state.playlists || []).filter(p => p.isLikedSpecial || p.id === 'pl-liked');
        state.playlists = [...cloudState.playlists, ...special];
      }

      // Bersihkan catatan preset lama yang masih tersimpan di cloud, lalu sinkronkan balik
      if (purgePresetMemories(state.playlists) || window.__pendingPresetPurgeSync) {
        window.__pendingPresetPurgeSync = false;
        setTimeout(() => triggerSupabaseSync(), 0);
      }

      // Sync local cache
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('romantic_music_custom_pin', state.pinCode);
        localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
        localStorage.setItem('romantic_music_profile_config', JSON.stringify({
          yourName: state.yourName,
          partnerName: state.partnerName,
          yourAvatar: state.yourAvatar,
          partnerAvatar: state.partnerAvatar,
          loveNote: state.loveNote
        }));
      } catch (e) { }

      // Re-hydrate UI with authoritative cloud state
      if (typeof hydrateUI === 'function') hydrateUI();
      if (typeof populateProfileShowcaseView === 'function') populateProfileShowcaseView();
      if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
      if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
      else if (currentView === 'playlist' && typeof renderTracklist === 'function') renderTracklist();
      else if (currentView === 'jam' && typeof updateMainJamView === 'function') {
        updateMainJamView();
        if (typeof renderJamChat === 'function') renderJamChat();
      } else if (currentView === 'gallery' && typeof renderPolaroidGallery === 'function') {
        renderPolaroidGallery();
      }
    },
    onRemoteChange: (table) => {
      if (table === 'couple_profile') {
        if (typeof hydrateUI === 'function') hydrateUI();
        if (typeof populateProfileShowcaseView === 'function') populateProfileShowcaseView();
        if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
        else if (currentView === 'jam' && typeof updateMainJamView === 'function') updateMainJamView();
      } else if (table === 'polaroids') {
        if (typeof renderPolaroidGallery === 'function') renderPolaroidGallery();
        const statPol = document.getElementById('heroStatsPolaroidCount');
        if (statPol) statPol.textContent = (state.polaroidMemories || []).length;
      } else if (table === 'playlists' || table === 'tracks') {
        if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
        if (currentView === 'playlist' && typeof renderTracklist === 'function') renderTracklist();
        else if (currentView === 'home' && typeof renderHomeView === 'function') renderHomeView();
      } else if (table === 'jam_messages') {
        if (typeof renderJamChat === 'function') renderJamChat();
        if (typeof renderMainJamChat === 'function') renderMainJamChat();
      }
    },
    onPlaybackSync: (payload) => {
      if (typeof handleRemotePlaybackSync === 'function') {
        handleRemotePlaybackSync(payload);
      }
    },
    onPresenceSync: (presences) => {
      if (typeof handlePresenceSync === 'function') {
        handlePresenceSync(presences);
      }
    },
    onLocalMediaUploaded: () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('romantic_music_polaroid_memories', JSON.stringify(state.polaroidMemories));
      } catch (e) { }
    },
    onSynced: () => {
      console.log('✦ [MusicDB] Synchronized with cloud.');
    },
    onSyncError: (err) => {
      console.warn('✦ [MusicDB] Sync error:', err);
    }
  });
}


function getAllLikedTracks() {
  const allLiked = [];
  const seenIds = new Set();
  (state.playlists || []).forEach(pl => {
    (pl.tracks || []).forEach(t => {
      if (t.liked) {
        const uniqueKey = t.id || `${t.title}-${t.artist}`;
        if (!seenIds.has(uniqueKey)) {
          seenIds.add(uniqueKey);
          allLiked.push({ ...t, sourcePlaylistId: pl.id });
        }
      }
    });
  });
  return allLiked;
}

function getLikedSongsPlaylist() {
  const tracks = getAllLikedTracks();
  return {
    id: 'pl-liked',
    title: 'Liked Songs',
    desc: 'Kumpulan lagu favorit pilihan berdua',
    cover: 'images/spotify_covers/liked_cover.svg',
    isLikedSpecial: true,
    tracks: tracks
  };
}

function getActivePlaylist() {
  if (state.activePlaylistId === 'pl-liked') {
    return getLikedSongsPlaylist();
  }
  const pl = state.playlists.find(p => p.id === state.activePlaylistId);
  return pl || state.playlists[0] || defaultState.playlists[0];
}

function getActiveTracks() {
  const pl = getActivePlaylist();
  return pl && pl.tracks ? pl.tracks : [];
}

function getPlayingPlaylist() {
  if (currentPlayingPlaylistId === 'pl-liked') {
    return getLikedSongsPlaylist();
  }
  const pl = state.playlists.find(p => p.id === currentPlayingPlaylistId);
  return pl || getActivePlaylist();
}

function getPlayingTracks() {
  const pl = getPlayingPlaylist();
  return pl && pl.tracks ? pl.tracks : [];
}

function getPlayingTrack() {
  if (currentPlayingTrack) return currentPlayingTrack;
  const tracks = getPlayingTracks();
  return tracks[currentPlayingIndex] || getActiveTracks()[0] || null;
}

function openLikedSongs() {
  currentFilter = 'all';
  const label = document.getElementById('filterStatusLabel');
  if (label) label.textContent = 'Semua Lagu';
  navigateTo('playlist', 'pl-liked');
}

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  // Check persisted login / unlock session
  try {
    if (localStorage.getItem('romantic_music_unlocked') === 'true') {
      const lock = document.getElementById('lockScreen');
      if (lock) {
        lock.style.display = 'none';
        lock.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      }
    }
  } catch (e) { }

  hydrateUI();
  navigateTo('home');

  // Detect and restore last played song
  let restored = false;
  try {
    const rawLast = localStorage.getItem('romantic_music_last_played');
    if (rawLast) {
      const last = JSON.parse(rawLast);
      if (last && last.playlistId) {
        const pl = state.playlists.find(p => p.id === last.playlistId) || state.playlists[0];
        if (pl && pl.tracks && pl.tracks.length > 0) {
          let tIdx = -1;
          if (last.trackId) {
            tIdx = pl.tracks.findIndex(t => t.id === last.trackId);
          }
          if (tIdx === -1 && last.trackTitle) {
            tIdx = pl.tracks.findIndex(t => t.title && t.title.toLowerCase().trim() === last.trackTitle.toLowerCase().trim());
          }
          if (tIdx === -1 && typeof last.trackIndex === 'number' && pl.tracks[last.trackIndex]) {
            tIdx = last.trackIndex;
          }
          if (tIdx !== -1) {
            currentPlayingPlaylistId = pl.id;
            state.activePlaylistId = pl.id;
            loadTrack(tIdx, false, pl.id);
            restored = true;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error restoring last played track:', e);
  }

  if (!restored) {
    loadTrack(0, false);
  }

  renderJamChat();
  hydrateItunesCovers();
  checkUrlPlayParam();
  initSupabaseSync();
  initJamRoomSession();
});

// Fetch HD album covers without touching audio streams
async function hydrateItunesCovers() {
  const tracks = getActiveTracks();
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i];
    // If already has official local cover, preserve it
    if (t.cover && t.cover.startsWith('images/covers/')) continue;

    if (!t.cover || t.cover.includes('images.unsplash.com')) {
      try {
        const q = encodeURIComponent(`${t.title} ${t.artist}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const hit = data.results[0];
          t.cover = hit.artworkUrl100.replace('100x100bb', '1000x1000bb');
        }
      } catch (err) {
        // Fallback remains intact
      }
    }
  }
  saveState();
  if (currentView === 'playlist') renderTracklist();
  updateActiveTrackUI();
}

function hydrateUI() {
  const activePl = getActivePlaylist();
  document.getElementById('heroPlaylistTitle').textContent = activePl.title;
  document.getElementById('rightCanvasPlaylistName').textContent = activePl.title;
  document.getElementById('heroPlaylistDesc').textContent = activePl.desc;
  document.getElementById('heroPlaylistCover').src = activePl.cover;

  document.getElementById('heroCuratorName').textContent = state.yourName;
  document.getElementById('heroCuratorAvatar').src = state.yourAvatar;
  document.getElementById('navAvatarYou').src = state.yourAvatar;
  document.getElementById('navAvatarPartner').src = state.partnerAvatar;

  document.getElementById('miniJamAvatar1').src = state.yourAvatar;
  document.getElementById('miniJamAvatar2').src = state.partnerAvatar;

  document.getElementById('miniPartnerStatusName').textContent = state.partnerName;
  document.getElementById('loveNoteDisplay').textContent = state.loveNote;

  const trackCount = (activePl && activePl.tracks) ? activePl.tracks.length : 0;
  document.getElementById('heroStatsCount').textContent = `${trackCount} songs, about infinite love`;

  // Mobile Top Bar Avatars
  const mobYou = document.getElementById('mobileNavAvatarYou');
  if (mobYou) mobYou.src = state.yourAvatar;
  const mobPartner = document.getElementById('mobileNavAvatarPartner');
  if (mobPartner) mobPartner.src = state.partnerAvatar;

  // Toggle Edit/Delete buttons if on special virtual playlist
  const btnDelete = document.getElementById('btnDeletePlaylist');
  const btnEdit = document.querySelector('button[onclick="openEditPlaylistModal()"]');
  if (btnDelete) {
    btnDelete.style.display = activePl.isLikedSpecial ? 'none' : '';
  }
  if (btnEdit) {
    btnEdit.style.display = activePl.isLikedSpecial ? 'none' : '';
  }

  const coverOverlay = document.getElementById('heroCoverChangeOverlay');
  if (coverOverlay) {
    coverOverlay.style.display = activePl.isLikedSpecial ? 'none' : '';
  }

  renderSidebarPlaylists();
}

// ================= NAVIGATION: HOME <-> PLAYLIST <-> POLAROID =================
function navigateTo(view, playlistId = null) {
  currentView = view;
  if (playlistId) {
    state.activePlaylistId = playlistId;
    saveState();
  }

  const homeView = document.getElementById('homeView');
  const playlistView = document.getElementById('playlistView');
  const polaroidView = document.getElementById('polaroidView');
  const listeningTogetherView = document.getElementById('listeningTogetherView');

  // Sidebar buttons active state
  const btnHome = document.getElementById('sidebarBtnHome');
  const btnPolaroid = document.getElementById('sidebarBtnPolaroid');
  const btnJam = document.getElementById('sidebarBtnJam');

  if (btnHome) {
    if (view === 'home') {
      btnHome.className = 'w-11 h-11 rounded-xl bg-[#FFF0F3] text-[#FA8072] border border-[#FFD2DC] flex items-center justify-center shadow-xs transition';
    } else {
      btnHome.className = 'w-11 h-11 rounded-xl text-[#9A737C] hover:text-[#FA8072] hover:bg-[#FFF5F7] flex items-center justify-center transition';
    }
  }

  if (btnPolaroid) {
    if (view === 'polaroid') {
      btnPolaroid.className = 'w-11 h-11 rounded-xl bg-gradient-to-br from-[#FA8072] to-[#E85D75] text-white flex items-center justify-center shadow-md shadow-[#FA8072]/30 scale-105 transition';
    } else {
      btnPolaroid.className = 'w-11 h-11 rounded-xl bg-[#FFF0F3] border border-[#FFD2DC] flex items-center justify-center text-[#E85D75] hover:bg-[#FFE4E9] hover:scale-105 transition';
    }
  }

  if (btnJam) {
    if (view === 'jam') {
      btnJam.className = 'w-11 h-11 rounded-xl bg-gradient-to-br from-[#FA8072] to-[#E85D75] text-white flex items-center justify-center shadow-md shadow-[#FA8072]/30 scale-105 transition relative';
    } else {
      btnJam.className = 'w-11 h-11 rounded-xl bg-[#FFF0F3] border border-[#FFD2DC] flex items-center justify-center text-[#FA8072] hover:bg-[#FFE4E9] hover:scale-105 transition relative';
    }
  }

  const libBtnLiked = document.getElementById('libBtnLiked');
  if (libBtnLiked) {
    const isLikedActive = state.activePlaylistId === 'pl-liked' && view === 'playlist';
    if (isLikedActive) {
      libBtnLiked.classList.add('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.remove('border-[#FFD2DC]');
    } else {
      libBtnLiked.classList.remove('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.add('border-[#FFD2DC]');
    }
  }

  const allViews = [homeView, playlistView, polaroidView, listeningTogetherView].filter(Boolean);
  allViews.forEach(v => {
    v.classList.add('hidden');
    v.classList.remove('view-fade-enter');
  });

  let activeViewEl = null;
  if (view === 'home') {
    activeViewEl = homeView;
    renderHomeView();
  } else if (view === 'polaroid') {
    activeViewEl = polaroidView;
    renderPolaroidGallery();
  } else if (view === 'jam') {
    activeViewEl = listeningTogetherView;
    updateMainJamView();
  } else {
    activeViewEl = playlistView;
    hydrateUI();
    renderTracklist();
  }

  if (activeViewEl) {
    activeViewEl.classList.remove('hidden');
    activeViewEl.classList.add('view-fade-enter');
  }

  const centerMain = document.getElementById('centerMain');
  if (centerMain) centerMain.scrollTop = 0;

  renderSidebarPlaylists();
}

// ================= RENDER HOME VIEW =================
function renderHomeView() {
  const hr = new Date().getHours();
  let greet = 'Selamat Malam';
  if (hr >= 4 && hr < 11) greet = 'Selamat Pagi';
  else if (hr >= 11 && hr < 15) greet = 'Selamat Siang';
  else if (hr >= 15 && hr < 19) greet = 'Selamat Sore';

  const greetingEl = document.getElementById('homeGreetingTitle');
  if (greetingEl) {
    greetingEl.textContent = `${greet}, ${state.partnerName}`;
  }

  renderHomePlaylistsGrid();
  renderHomeFavoritesList();
}

function renderHomePlaylistsGrid() {
  const container = document.getElementById('homePlaylistsGrid');
  if (!container) return;

  const htmlCards = state.playlists.map(pl => {
    const isCurrent = pl.id === state.activePlaylistId;
    return `
      <div onclick="navigateTo('playlist', '${pl.id}')"
        class="playlist-card group bg-white border ${isCurrent ? 'border-[#FA8072] ring-2 ring-[#FA8072]/20' : 'border-[#FFD2DC]'} rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md cursor-pointer transition relative flex flex-col justify-between">
        
        <div>
          <!-- Thumbnail with hover play overlay -->
          <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2 sm:mb-3 bg-[#FFF5F7]">
            <img src="${pl.cover}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${pl.title}" />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FA8072] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                <i class="fa-solid fa-play ml-0.5 text-xs sm:text-base"></i>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="flex items-center justify-between gap-1 mb-1">
            <h3 class="font-extrabold text-[#3B2328] text-xs sm:text-sm md:text-base group-hover:text-[#FA8072] transition truncate">${pl.title}</h3>
            <span class="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#E85D75] shrink-0 border border-[#FFD2DC]">
              ${pl.tracks.length}
            </span>
          </div>
          <p class="text-[11px] sm:text-xs text-[#9A737C] line-clamp-2 leading-relaxed">${pl.desc || 'Playlist kenangan berdua'}</p>
        </div>

        <div class="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#FFF0F3] flex items-center justify-between text-xs">
          <span class="text-[10px] sm:text-[11px] font-semibold text-[#FA8072] flex items-center gap-1">
            <i class="fa-solid fa-headphones text-[10px]"></i> <span class="hidden sm:inline">Buka & </span>Putar
          </span>
          <i class="fa-solid fa-arrow-right text-[#9A737C] group-hover:translate-x-1 transition text-[10px]"></i>
        </div>
      </div>
    `;
  }).join('');

  // Dashed "+ Buat Playlist Baru" Card
  const createCard = `
    <div onclick="openCreatePlaylistModal()"
      class="group border-2 border-dashed border-[#FFD2DC] hover:border-[#FA8072] rounded-2xl p-3 sm:p-6 bg-[#FFF9FA] hover:bg-[#FFF0F3]/60 cursor-pointer transition flex flex-col items-center justify-center text-center min-h-[160px] sm:min-h-[220px]">
      <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#FFD2DC] text-[#FA8072] group-hover:bg-[#FA8072] group-hover:text-white flex items-center justify-center mb-2 sm:mb-3 shadow-xs group-hover:scale-110 transition">
        <i class="fa-solid fa-plus text-base sm:text-xl"></i>
      </div>
      <h4 class="font-extrabold text-[#3B2328] text-xs sm:text-sm group-hover:text-[#FA8072] transition">Buat Playlist Baru</h4>
      <p class="text-[10px] sm:text-xs text-[#9A737C] mt-0.5 sm:mt-1 max-w-[180px] line-clamp-2">Koleksi lagu baru kita</p>
    </div>
  `;

  container.innerHTML = htmlCards + createCard;
}

function renderHomeFavoritesList() {
  const container = document.getElementById('homeFavoritesList');
  if (!container) return;

  const allLiked = [];
  state.playlists.forEach(pl => {
    pl.tracks.forEach(t => {
      if (t.liked) allLiked.push({ ...t, playlistId: pl.id });
    });
  });

  if (allLiked.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-6 text-center rounded-2xl bg-[#FFF5F7] border border-[#FFD2DC] text-[#9A737C] text-xs">
        <i class="fa-solid fa-heart text-[#FA8072] text-xl mb-1.5"></i>
        <p class="font-bold">Belum ada lagu yang ditandai favorit</p>
        <p class="text-[11px] mt-0.5">Klik ikon hati pada lagu apa saja untuk menambahkannya ke sini!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = allLiked.slice(0, 6).map(track => `
    <div class="p-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FFD2DC] flex items-center justify-between gap-3 hover:bg-[#FFE4E9]/60 transition">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${track.cover}" class="w-11 h-11 rounded-xl object-cover border border-[#FFD2DC] shrink-0" alt="${track.title}" />
        <div class="min-w-0">
          <p class="text-xs font-bold text-[#3B2328] truncate">${track.title}</p>
          <p class="text-[11px] text-[#9A737C] truncate">${track.artist} • <span class="text-[#FA8072] font-semibold">${track.duration || 'Full'}</span></p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button onclick="downloadDirectSong('${track.title}', '${track.artist}', '${track.audioUrl || ''}')" class="w-7 h-7 rounded-full bg-white text-[#9A737C] hover:text-[#FA8072] flex items-center justify-center shadow-xs transition" title="Download MP3">
          <i class="fa-solid fa-download text-[11px]"></i>
        </button>
        <button onclick="playTrackByObject(${JSON.stringify(track).replace(/"/g, '&quot;')})" class="w-7 h-7 rounded-full bg-[#FA8072] text-white flex items-center justify-center shadow-xs hover:scale-105 transition" title="Putar">
          <i class="fa-solid fa-play text-[10px] ml-0.5"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Custom Sidebar Tooltip System (Pink-bordered Card with Dark Text)
function showSidebarTooltip(el) {
  // Never show popup tooltip on mobile touch devices
  if (window.innerWidth < 1024) return;
  const tooltip = document.getElementById('sidebarPlaylistTooltip');
  if (!tooltip || !el) return;
  const title = el.getAttribute('data-title') || '';
  const desc = el.getAttribute('data-desc') || '';
  if (!title) return;

  const titleEl = tooltip.querySelector('.tooltip-title');
  const descEl = tooltip.querySelector('.tooltip-desc');
  if (titleEl) titleEl.textContent = title;
  if (descEl) {
    if (desc) {
      descEl.textContent = desc;
      descEl.classList.remove('hidden');
    } else {
      descEl.classList.add('hidden');
    }
  }

  // Calculate position relative to sidebar icon
  const rect = el.getBoundingClientRect();
  tooltip.style.visibility = 'hidden';
  tooltip.classList.remove('hidden');
  const tooltipHeight = tooltip.offsetHeight || 32;
  const top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
  const left = rect.right + 12;

  tooltip.style.top = `${Math.max(10, top)}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.visibility = 'visible';

  requestAnimationFrame(() => {
    tooltip.classList.remove('opacity-0');
  });
}

function hideSidebarTooltip() {
  const tooltip = document.getElementById('sidebarPlaylistTooltip');
  if (!tooltip) return;
  tooltip.classList.add('opacity-0');
  setTimeout(() => {
    if (tooltip.classList.contains('opacity-0')) {
      tooltip.classList.add('hidden');
    }
  }, 150);
}

function renderSidebarPlaylists() {
  const container = document.getElementById('sidebarPlaylistsContainer');
  if (!container) return;

  container.innerHTML = state.playlists.map(pl => {
    const isCurrent = pl.id === state.activePlaylistId && currentView === 'playlist';
    const safeTitle = (pl.title || 'Playlist').replace(/"/g, '&quot;');
    const safeDesc = pl.desc ? pl.desc.replace(/"/g, '&quot;') : (pl.tracks ? pl.tracks.length + ' lagu' : '');
    return `
      <button onclick="navigateTo('playlist', '${pl.id}')"
        data-title="${safeTitle}"
        data-desc="${safeDesc}"
        onmouseenter="showSidebarTooltip(this)"
        onmouseleave="hideSidebarTooltip()"
        class="relative group w-11 h-11 rounded-xl overflow-hidden border-2 ${isCurrent ? 'border-[#FA8072] ring-2 ring-[#FA8072]/30 scale-105' : 'border-[#FFD2DC]'} shadow-xs transition transform hover:scale-105">
        <img src="${pl.cover}" class="w-full h-full object-cover" alt="${safeTitle}" />
      </button>
    `;
  }).join('');

  const libBtnLiked = document.getElementById('libBtnLiked');
  if (libBtnLiked) {
    const isLikedActive = state.activePlaylistId === 'pl-liked' && currentView === 'playlist';
    if (isLikedActive) {
      libBtnLiked.classList.add('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.remove('border-[#FFD2DC]');
    } else {
      libBtnLiked.classList.remove('border-[#FA8072]', 'ring-2', 'ring-[#FA8072]/30', 'scale-105');
      libBtnLiked.classList.add('border-[#FFD2DC]');
    }
  }
}

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

// ================= LOCK SCREEN (SIMPLE & CLEAN) =================
function unlockApp() {
  const input = document.getElementById('pinInput');
  const val = (input?.value || '').trim();
  const validPin = localStorage.getItem('romantic_music_custom_pin') || state.pinCode || '1806';

  if (val === validPin) {
    try {
      localStorage.setItem('romantic_music_unlocked', 'true');
    } catch (e) { }

    const lock = document.getElementById('lockScreen');
    if (lock) {
      lock.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        lock.classList.add('hidden');
        lock.style.display = 'none';
      }, 450);
    }
  } else {
    const err = document.getElementById('pinError');
    if (err) err.classList.remove('hidden');

    const wrapper = document.getElementById('pinInputWrapper');
    if (wrapper) {
      wrapper.classList.add('animate-shake');
      if (input) {
        input.classList.add('border-rose-400');
        input.classList.remove('border-[#FFD2DC]');
      }
      setTimeout(() => {
        wrapper.classList.remove('animate-shake');
        if (input) {
          input.classList.remove('border-rose-400');
          input.classList.add('border-[#FFD2DC]');
          input.value = '';
          input.focus();
        }
      }, 650);
    }
  }
}

function logOutApp() {
  try {
    localStorage.removeItem('romantic_music_unlocked');
  } catch (e) { }

  closeSettingsModal();
  if (isPlaying) {
    togglePlay();
  }
  const lock = document.getElementById('lockScreen');
  if (lock) {
    lock.style.display = '';
    lock.classList.remove('hidden');
    void lock.offsetWidth;
    lock.classList.remove('opacity-0', 'pointer-events-none');
  }
  const input = document.getElementById('pinInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 200);
  }
  const err = document.getElementById('pinError');
  if (err) err.classList.add('hidden');
  showToastNotification('Berhasil keluar. Masukkan PIN untuk masuk kembali 🔒', 'info');
}

// Auto-submit on 4 digits or Enter key
document.getElementById('pinInput')?.addEventListener('input', (e) => {
  const err = document.getElementById('pinError');
  if (err && !err.classList.contains('hidden')) {
    err.classList.add('hidden');
  }
  if (e.target.value.length === 4) {
    setTimeout(unlockApp, 150);
  }
});

document.getElementById('pinInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlockApp();
});

// ================= RENDER TRACKLIST =================
function renderTracklist() {
  const container = document.getElementById('tracklistContainer');
  const query = (document.getElementById('globalSearchInput')?.value || '').toLowerCase();
  const tracks = getActiveTracks();

  const filtered = tracks
    .map((track, idx) => ({ ...track, originalIndex: idx }))
    .filter(item => {
      if (currentFilter === 'liked' && !item.liked) return false;
      if (query && !item.title.toLowerCase().includes(query) && !item.artist.toLowerCase().includes(query) && !(item.memory || '').toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-[#9A737C]">
        <i class="fa-solid fa-music text-2xl mb-2 text-[#FA8072]"></i>
        <p class="text-sm font-bold">Belum ada lagu di playlist ini</p>
        <button onclick="openAddSongModal()" class="mt-3 px-4 py-2 rounded-full bg-[#FFE4E9] text-[#E85D75] text-xs font-bold hover:bg-[#FA8072] hover:text-white transition shadow-xs">
          + Tambah Lagu Baru
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((track, displayIdx) => {
    const currentPlaying = getPlayingTrack();
    const isPlayingThisPlaylist = currentPlayingPlaylistId === state.activePlaylistId;
    const isCurrent = isPlayingThisPlaylist && (
      (currentPlaying && (currentPlaying.id === track.id || currentPlaying.title.toLowerCase() === track.title.toLowerCase())) ||
      track.originalIndex === currentPlayingIndex
    );
    return `
      <div onclick="selectTrackFromList(${track.originalIndex})"
        class="track-row group grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-xl cursor-pointer transition ${isCurrent ? 'bg-[#FFE4E9]/70 text-[#E85D75]' : 'hover:bg-[#FFF5F7]'}">
        
        <!-- # Column / Equalizer -->
        <div class="col-span-1 text-center text-xs font-bold text-[#9A737C]">
          ${isCurrent && isPlaying ? `
            <div class="inline-flex items-end gap-0.5 h-3.5">
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
            </div>
          ` : `
            <span class="track-num-text ${isCurrent ? 'text-[#E85D75] font-extrabold' : ''}">${displayIdx + 1}</span>
            <span class="track-play-hover hidden items-center justify-center text-[#FA8072]">
              <i class="fa-solid fa-play text-xs"></i>
            </span>
          `}
        </div>

        <!-- Title + Thumbnail + Artist -->
        <div class="col-span-6 sm:col-span-4 flex items-center gap-3 min-w-0">
          <img src="${track.cover}" class="w-10 h-10 rounded-lg object-cover border border-[#FFD2DC] shrink-0" alt="${track.title}" />
          <div class="min-w-0">
            <p class="text-sm font-bold truncate ${isCurrent ? 'text-[#E85D75]' : 'text-[#3B2328]'}">${track.title}</p>
            <p class="text-xs text-[#9A737C] truncate">${track.artist} ${track.youtubeId ? '• <span class="text-[10px] text-[#FA8072] font-semibold">Official Audio</span>' : ''}</p>
          </div>
        </div>

        <!-- Sweet Memory Note Column -->
        <div class="hidden sm:block sm:col-span-5 md:col-span-3 min-w-0">
          <p class="text-xs text-[#9A737C] truncate italic" title="${track.memory || ''}">
            ${track.memory || track.album || 'Our special track 💕'}
          </p>
        </div>

        <!-- Date Added -->
        <div class="hidden md:block md:col-span-2 text-xs text-[#9A737C]">
          ${track.dateAdded || 'Recently'}
        </div>

        <!-- Duration + Add to Playlist + Share + Download + Like + Delete -->
        <div class="col-span-5 sm:col-span-2 flex items-center justify-end gap-1.5 text-xs text-[#9A737C]" onclick="event.stopPropagation()">
          <button onclick="openAddToPlaylistModal('${track.id || track.originalIndex}')" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-[#FA8072] hover:scale-110 transition p-1" title="Masukkan ke Playlist">
            <i class="fa-solid fa-folder-plus text-xs"></i>
          </button>
          <button onclick="openShareSongModal('${track.id || track.originalIndex}')" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-[#FA8072] hover:scale-110 transition p-1" title="Bagikan Lagu">
            <i class="fa-solid fa-share-nodes text-xs"></i>
          </button>
          <button onclick="downloadTrackByIdx(${track.originalIndex})" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-[#FA8072] hover:scale-110 transition p-1" title="Download Audio MP3">
            <i class="fa-solid fa-download text-xs"></i>
          </button>
          <button onclick="toggleLikeTrack(${track.originalIndex})" class="hover:scale-110 transition ${track.liked ? 'text-[#FA8072]' : 'opacity-0 group-hover:opacity-100 text-[#9A737C]'} p-1" title="Suka">
            <i class="${track.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <span class="w-8 text-right font-medium text-[11px]">${track.duration || 'Full'}</span>
          <button onclick="deleteTrack(${track.originalIndex})" class="opacity-0 group-hover:opacity-100 text-[#9A737C] hover:text-rose-500 transition p-1" title="Hapus lagu">
            <i class="fa-solid fa-trash-can text-[11px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
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
          if (currentPlayingTrack === track && !isPlaying) {
            currentEngine = 'youtube';
            if (isYtReady && ytPlayer && ytPlayer.loadVideoById) {
              ytPlayer.loadVideoById(track.youtubeId);
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
  document.getElementById('polaroidImg').src = track.cover;
  document.getElementById('polaroidTitle').textContent = `${track.title} — ${track.artist}`;
  document.getElementById('polaroidMemory').textContent = `"${track.memory || 'Every beat reminds me of you ✦'}"`;

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
}

function selectTrackFromList(index) {
  const isPlayingThisPlaylist = currentPlayingPlaylistId === state.activePlaylistId;
  if (isPlayingThisPlaylist && index === currentPlayingIndex) {
    togglePlay();
  } else {
    loadTrack(index, true, state.activePlaylistId);
    const tracks = getActiveTracks();
    if (syncModeActive && tracks[index]) {
      broadcastJamSystemNote(`🎧 Kamu memutar "${tracks[index].title}" untuk didengarkan berdua`);
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
      // Fallback to YouTube if available
      const track = getPlayingTrack();
      if (track && track.youtubeId && isYtReady && ytPlayer && ytPlayer.loadVideoById) {
        currentEngine = 'youtube';
        ytPlayer.loadVideoById(track.youtubeId);
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
    if (isRepeat) {
      audio.currentTime = 0;
      playAudio();
    } else {
      nextTrack();
    }
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

// ================= LIKE & DELETE ACTIONS =================
function toggleLikeTrack(idx) {
  const tracks = getActiveTracks();
  const track = tracks[idx];
  if (!track) return;

  const newLiked = !track.liked;
  track.liked = newLiked;

  // If in virtual Liked Songs playlist, update the original track across playlists
  if (state.activePlaylistId === 'pl-liked') {
    (state.playlists || []).forEach(pl => {
      (pl.tracks || []).forEach(t => {
        if ((t.id && t.id === track.id) || (t.title === track.title && t.artist === track.artist)) {
          t.liked = newLiked;
        }
      });
    });
  }

  saveState();
  if (currentView === 'playlist') {
    hydrateUI();
    renderTracklist();
  }
  if (idx === currentIndex) updateActiveTrackUI();
  renderHomeFavoritesList();
}

function toggleLikeCurrent() {
  const tracks = getActiveTracks();
  if (!tracks[currentIndex]) return;
  toggleLikeTrack(currentIndex);
  sendFloatingReaction('❤️', false);
}

function deleteTrack(idx) {
  const tracks = getActiveTracks();
  if (state.activePlaylistId === 'pl-liked') {
    // Un-like rather than destroy track when deleted from Liked Songs
    const track = tracks[idx];
    if (track) {
      toggleLikeTrack(idx);
      showToastNotification(`Lagu "${track.title}" dihapus dari Liked Songs`, 'info');
    }
    return;
  }

  if (tracks.length <= 1) {
    showToastNotification('Minimal harus ada 1 lagu di dalam playlist ya!', 'error');
    return;
  }
  const deleted = tracks.splice(idx, 1);
  if (currentIndex >= tracks.length) currentIndex = 0;
  saveState();
  hydrateUI();
  loadTrack(currentIndex, isPlaying);
  showToastNotification(`Lagu "${deleted[0]?.title}" dihapus`, 'info');
}

function switchPlaylistFilter(mode) {
  currentFilter = mode;
  const label = document.getElementById('filterStatusLabel');
  if (label) label.textContent = mode === 'liked' ? 'Lagu Favorit' : 'Semua Lagu';
  const libBtnLiked = document.getElementById('libBtnLiked');
  if (libBtnLiked) libBtnLiked.classList.toggle('border-[#3B2328]', mode === 'liked');
  if (currentView !== 'playlist') navigateTo('playlist');
  renderTracklist();
}

function openEditCurrentMemory() {
  const tracks = getActiveTracks();
  const current = tracks[currentIndex];
  if (!current) return;
  const modal = document.getElementById('memoryNoteModal');
  const input = document.getElementById('memoryNoteInput');
  const title = document.getElementById('memoryNoteTrackTitle');
  if (!modal || !input) return;
  if (title) title.textContent = `${current.title} — ${current.artist || ''}`;
  input.value = current.memory || '';
  updateMemoryNoteCounter();
  input.oninput = updateMemoryNoteCounter;
  input.onkeydown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveMemoryNote();
    if (e.key === 'Escape') closeMemoryNoteModal();
  };
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => input.focus(), 50);
}

function updateMemoryNoteCounter() {
  const input = document.getElementById('memoryNoteInput');
  const counter = document.getElementById('memoryNoteCounter');
  if (input && counter) counter.textContent = `${input.value.length}/${input.maxLength || 240}`;
}

function closeMemoryNoteModal() {
  const modal = document.getElementById('memoryNoteModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function saveMemoryNote() {
  const tracks = getActiveTracks();
  const current = tracks[currentIndex];
  const input = document.getElementById('memoryNoteInput');
  if (!current || !input) return closeMemoryNoteModal();
  const newMemory = input.value.trim();
  current.memory = newMemory;
  // Samakan catatan untuk lagu yang sama di playlist lain (mis. Liked Songs)
  (state.playlists || []).forEach(pl => (pl.tracks || []).forEach(t => {
    if (t !== current && t.id && t.id === current.id) t.memory = newMemory;
  }));
  saveState();
  updateActiveTrackUI();
  if (currentView === 'playlist') renderTracklist();
  closeMemoryNoteModal();
  showToastNotification(newMemory ? 'Sweet Memory Note tersimpan 💕' : 'Catatan dihapus', 'success');
}

// Render Sweet Memory Note (panel kanan + mobile) dengan empty state bila belum diisi
function renderMemoryNote(track) {
  const memory = (track && track.memory ? track.memory : '').trim();
  const textEl = document.getElementById('rightTrackMemory');
  const emptyEl = document.getElementById('rightTrackMemoryEmpty');
  if (textEl) {
    textEl.textContent = memory ? `"${memory}"` : '';
    textEl.classList.toggle('hidden', !memory);
  }
  if (emptyEl) emptyEl.classList.toggle('hidden', !!memory);

  const mobMemory = document.getElementById('mobileTrackMemory');
  if (mobMemory) {
    mobMemory.textContent = memory ? `"${memory}"` : '✍️ Ketuk untuk menulis kenangan lagu ini';
  }
}

// ================= RIGHT PANEL CONTROLS =================
// Panel kanan kini hanya "Now Playing". Listening Together dibuka lewat menu khusus.
function switchRightPanelTab(tab) {
  if (tab === 'jam') navigateTo('jam');
}

function toggleVinylMode() {
  vinylVisible = !vinylVisible;
  const overlay = document.getElementById('vinylOverlay');
  const canvasImg = document.getElementById('rightCanvasImage');
  const btn = document.getElementById('vinylToggleBtn');
  const icon = document.getElementById('vinylToggleIcon');
  const vinylDisc = document.getElementById('vinylDisc');
  const vinylTonearm = document.getElementById('vinylTonearm');

  if (vinylVisible) {
    if (overlay) {
      overlay.classList.remove('vinyl-slide-inactive');
      overlay.classList.add('vinyl-slide-active');
    }
    if (canvasImg) {
      canvasImg.classList.add('canvas-slide-dimmed');
    }
    if (icon) icon.className = 'fa-solid fa-image text-emerald-300 text-xs';
    if (btn) btn.title = 'Beralih ke Canvas View';
  } else {
    if (overlay) {
      overlay.classList.remove('vinyl-slide-active');
      overlay.classList.add('vinyl-slide-inactive');
    }
    if (canvasImg) {
      canvasImg.classList.remove('canvas-slide-dimmed');
    }
    if (icon) icon.className = 'fa-solid fa-record-vinyl text-[#FA8072] text-xs';
    if (btn) btn.title = 'Beralih ke Vinyl View';
  }

  if (vinylDisc) {
    if (isPlaying) {
      vinylDisc.classList.add('playing');
    } else {
      vinylDisc.classList.remove('playing');
    }
  }
  if (vinylTonearm) {
    if (isPlaying) {
      vinylTonearm.classList.add('playing');
    } else {
      vinylTonearm.classList.remove('playing');
    }
  }
}

// Track Extra Actions Drawer (Expandable 3-Dots Menu)
let isMoreActionsTrackOpen = false;

function toggleMoreActionsTrack(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const drawer = document.getElementById('moreActionsDrawer');
  const btn = document.getElementById('btnMoreActionsTrack');
  const icon = document.getElementById('iconMoreActionsTrack');
  if (!drawer) return;

  isMoreActionsTrackOpen = !isMoreActionsTrackOpen;

  if (isMoreActionsTrackOpen) {
    drawer.classList.remove('max-w-0', 'opacity-0', 'pointer-events-none');
    drawer.classList.add('max-w-[130px]', 'opacity-100', 'pointer-events-auto');
    if (btn) {
      btn.classList.add('bg-white/40', 'text-[#FA8072]');
      btn.title = 'Tutup Opsi';
    }
    if (icon) icon.className = 'fa-solid fa-xmark text-xs';
  } else {
    drawer.classList.remove('max-w-[130px]', 'opacity-100', 'pointer-events-auto');
    drawer.classList.add('max-w-0', 'opacity-0', 'pointer-events-none');
    if (btn) {
      btn.classList.remove('bg-white/40', 'text-[#FA8072]');
      btn.title = 'Opsi Lainnya';
    }
    if (icon) icon.className = 'fa-solid fa-ellipsis text-xs';
  }
}

// Auto-close more actions drawer when clicking outside
document.addEventListener('click', (e) => {
  if (!isMoreActionsTrackOpen) return;
  const drawer = document.getElementById('moreActionsDrawer');
  const btn = document.getElementById('btnMoreActionsTrack');
  if (drawer && btn && !drawer.contains(e.target) && !btn.contains(e.target)) {
    isMoreActionsTrackOpen = false;
    drawer.classList.remove('max-w-[130px]', 'opacity-100', 'pointer-events-auto');
    drawer.classList.add('max-w-0', 'opacity-0', 'pointer-events-none');
    btn.classList.remove('bg-white/40', 'text-[#FA8072]');
    btn.title = 'Opsi Lainnya';
    const icon = document.getElementById('iconMoreActionsTrack');
    if (icon) icon.className = 'fa-solid fa-ellipsis text-xs';
  }
});

// ================= LISTENING TOGETHER (SPOTIFY JAM REALTIME SYNC) =================
let isRemotePlaybackSync = false;
let remoteSyncUnlockTimer = null;
let seekDebounceTimer = null;
let currentJamRoomId = localStorage.getItem('romantic_jam_room_id') || 'LUV-2407';

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

  if (currentJamRoomId) {
    if (connectedBar) connectedBar.classList.remove('hidden');
    if (disconnectedBar) disconnectedBar.classList.add('hidden');
    if (activeCodeEl) activeCodeEl.textContent = currentJamRoomId;
    if (syncBadge) syncBadge.textContent = '100% Synced';
  } else {
    if (connectedBar) connectedBar.classList.add('hidden');
    if (disconnectedBar) disconnectedBar.classList.remove('hidden');
    if (syncBadge) syncBadge.textContent = 'Mode Pribadi';
  }
}

function joinJamRoom(roomId) {
  const clean = String(roomId || '').trim().toUpperCase();
  if (!clean) return;
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
}

function leaveCurrentJamRoom() {
  currentJamRoomId = '';
  localStorage.removeItem('romantic_jam_room_id');
  if (window.MusicDB && typeof window.MusicDB.leaveJamRoom === 'function') {
    window.MusicDB.leaveJamRoom();
  }
  renderJamRoomUI();
  showToastNotification('Mode pribadi aktif. Kamu telah keluar dari sesi bersama.', 'info');
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

  state.jamMessages.push({
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

// ================= FULL MP3 UPLOAD & ITUNES SEARCH =================
function handleFullMp3Upload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const badge = document.getElementById('fullAudioSelectedBadge');
  const badgeName = document.getElementById('fullAudioFileName');
  if (badge && badgeName) {
    badgeName.textContent = file.name;
    badge.classList.remove('hidden');
  }

  const rawName = file.name.replace(/\.[^/.]+$/, '');
  let detectedTitle = rawName;
  let detectedArtist = '';
  if (rawName.includes(' - ')) {
    const parts = rawName.split(' - ');
    detectedArtist = parts[0].trim();
    detectedTitle = parts[1].trim();
  }
  document.getElementById('inputSongTitle').value = detectedTitle;
  document.getElementById('inputSongArtist').value = detectedArtist;

  const reader = new FileReader();
  reader.onload = (e) => {
    const audioData = e.target.result;
    document.getElementById('inputSongAudio').value = audioData;

    const tempAudio = new Audio();
    tempAudio.src = audioData;
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        const durStr = formatTime(tempAudio.duration);
        showToastNotification(`File "${file.name}" siap diputar Full (${durStr})! 💕`, 'success');
      }
    });
  };
  reader.readAsDataURL(file);

  tryAutoFetchCover(detectedTitle, detectedArtist);
}

async function tryAutoFetchCover(title, artist) {
  if (!title) return;
  try {
    const q = encodeURIComponent(`${title} ${artist || ''}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const hit = data.results[0];
      const hdCover = hit.artworkUrl100.replace('100x100bb', '600x600bb');
      document.getElementById('inputSongCover').value = hdCover;
      if (!document.getElementById('inputSongArtist').value && hit.artistName) {
        document.getElementById('inputSongArtist').value = hit.artistName;
      }
    }
  } catch (e) {
    // optional
  }
}

function useDefaultFullAudioStream() {
  const randAudio = defaultFullAudioPool[Math.floor(Math.random() * defaultFullAudioPool.length)];
  document.getElementById('inputSongAudio').value = randAudio;
  showToastNotification('Sample audio full dipilih!', 'info');
}

let currentItunesSearchResults = [];
let itunesAudioPreviewObj = null;

function formatDurationMs(ms) {
  if (!ms || isNaN(ms)) return 'Full';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function toggleItunesPreview(url, btn) {
  if (!url) return;
  if (itunesAudioPreviewObj && itunesAudioPreviewObj.src === url && !itunesAudioPreviewObj.paused) {
    itunesAudioPreviewObj.pause();
    btn.innerHTML = '<i class="fa-solid fa-play text-xs ml-0.5"></i>';
    return;
  }
  if (itunesAudioPreviewObj) {
    itunesAudioPreviewObj.pause();
  }
  itunesAudioPreviewObj = new Audio(url);
  itunesAudioPreviewObj.play().catch(() => {});
  btn.innerHTML = '<i class="fa-solid fa-pause text-xs"></i>';
  itunesAudioPreviewObj.onended = () => {
    btn.innerHTML = '<i class="fa-solid fa-play text-xs ml-0.5"></i>';
  };
}

async function searchItunesSong() {
  const query = document.getElementById('itunesSearchQuery').value.trim();
  if (!query) return;

  const resultsBox = document.getElementById('itunesResultsList');
  resultsBox.innerHTML = '<div class="p-4 text-center text-xs text-[#9A737C]"><i class="fa-solid fa-spinner animate-spin text-[#FA8072] mr-1.5"></i> Mencari lagu & cover official...</div>';
  resultsBox.classList.remove('hidden');

  try {
    const q = encodeURIComponent(query);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=8`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultsBox.innerHTML = '<div class="p-4 text-center text-xs text-[#9A737C]">Lagu tidak ditemukan. Coba ketik judul / nama artis lain atau upload file MP3 Anda di bawah.</div>';
      return;
    }

    currentItunesSearchResults = data.results;

    resultsBox.innerHTML = data.results.map((item, idx) => {
      const hdCover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : 'images/spotify_covers/jakarta.jpg';
      const dur = formatDurationMs(item.trackTimeMillis);
      const safeTitle = (item.trackName || 'Track').replace(/"/g, '&quot;');
      const safeArtist = (item.artistName || 'Artist').replace(/"/g, '&quot;');
      const safeAlbum = (item.collectionName || 'Single').replace(/"/g, '&quot;');

      return `
        <div class="flex items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-white hover:bg-[#FFE4E9]/40 border border-[#FFD2DC] transition shadow-2xs">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <img src="${item.artworkUrl100}" class="w-12 h-12 rounded-xl object-cover border border-[#FFD2DC] shrink-0 shadow-xs" alt="${safeTitle}" />
            <div class="min-w-0 flex-1">
              <p class="text-xs font-extrabold text-[#3B2328] truncate">${safeTitle}</p>
              <p class="text-[11px] text-[#9A737C] truncate">${safeArtist} • <span class="text-[#FA8072] font-semibold">${safeAlbum}</span></p>
              <span class="text-[10px] text-[#9A737C] font-medium">${dur}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            ${item.previewUrl ? `
              <button type="button" onclick="toggleItunesPreview('${item.previewUrl}', this)" class="w-7 h-7 rounded-full bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#FA8072] flex items-center justify-center transition shadow-xs" title="Putar Cuplikan Studio">
                <i class="fa-solid fa-play text-[10px] ml-0.5"></i>
              </button>
            ` : ''}
            <button type="button" onclick="quickAddSongDirectly(${idx}, this)" class="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FA8072] to-[#E85D75] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer">
              <i class="fa-solid fa-plus text-xs"></i> Tambah
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    resultsBox.innerHTML = '<div class="p-3 text-center text-xs text-rose-500">Gagal mengambil data online. Pastikan koneksi internet aktif.</div>';
  }
}

async function quickAddSongDirectly(idx, btn) {
  try {
    if (itunesAudioPreviewObj) {
      itunesAudioPreviewObj.pause();
      itunesAudioPreviewObj = null;
    }
    const idxNum = parseInt(idx, 10);
    const item = (currentItunesSearchResults && currentItunesSearchResults[idxNum]) 
      ? currentItunesSearchResults[idxNum] 
      : null;

    if (!item) {
      showToastNotification('Data lagu tidak ditemukan dari hasil pencarian', 'error');
      return;
    }

    // Read target playlist from dropdown or active playlist
    const targetSelect = document.getElementById('targetPlaylistSelect');
    let targetPlId = (targetSelect && targetSelect.value) ? targetSelect.value : (state.activePlaylistId || 'pl-ours');
    if (targetPlId === 'pl-liked') {
      targetPlId = 'pl-ours';
    }

    let targetPl = (state.playlists || []).find(p => p.id === targetPlId);
    if (!targetPl) {
      targetPl = (state.playlists || []).find(p => p.id === 'pl-ours') || (state.playlists || [])[0];
    }
    if (!targetPl) {
      showToastNotification('Playlist tujuan tidak ditemukan', 'error');
      return;
    }
    if (!Array.isArray(targetPl.tracks)) {
      targetPl.tracks = [];
    }

    const songTitle = (item.trackName || 'Lagu Baru').trim();
    const artistName = (item.artistName || 'Artis').trim();

    // Check if song already exists in target playlist
    const alreadyExists = targetPl.tracks.some(t =>
      (t.title && t.title.toLowerCase().trim() === songTitle.toLowerCase()) &&
      (t.artist && t.artist.toLowerCase().trim() === artistName.toLowerCase())
    );

    const buttonEl = btn ? (btn.closest('button') || btn) : null;

    if (alreadyExists) {
      if (buttonEl) {
        buttonEl.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Sudah Ada';
        buttonEl.className = 'px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-default';
        buttonEl.disabled = true;
      }
      showToastNotification(`"${songTitle}" sudah ada di playlist "${targetPl.title}"! ✨`, 'info');
      return;
    }

    // Temporary loading indicator on button
    if (buttonEl) {
      buttonEl.innerHTML = '<i class="fa-solid fa-spinner animate-spin text-xs"></i> Memproses...';
    }

    const ultraHdCover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '1000x1000bb') : 'images/spotify_covers/jakarta.jpg';

    let matchedAudioUrl = '';
    let matchedYoutubeId = null;
    const lowTitle = songTitle.toLowerCase();
    const lowArtist = artistName.toLowerCase();
    const cleanSearch = `${lowTitle} ${lowArtist}`.replace(/[^a-z0-9]/g, ' ');

    // 1. Check local full audio files first
    if (typeof realAudioTracks !== 'undefined' && realAudioTracks) {
      for (const [key, localPath] of Object.entries(realAudioTracks)) {
        if (lowTitle.includes(key) || cleanSearch.includes(key)) {
          matchedAudioUrl = localPath;
          break;
        }
      }
    }

    // 2. Check local official covers
    let finalCover = ultraHdCover;
    if (typeof officialCovers !== 'undefined' && officialCovers) {
      for (const [key, covPath] of Object.entries(officialCovers)) {
        if (lowTitle.includes(key) || cleanSearch.includes(key)) {
          finalCover = covPath;
          break;
        }
      }
    }

    // 3. Check static YouTube catalog for full video streaming
    if (typeof realSongCatalog !== 'undefined' && realSongCatalog) {
      for (const [key, yId] of Object.entries(realSongCatalog)) {
        if (lowTitle.includes(key) || cleanSearch.includes(key)) {
          matchedYoutubeId = yId;
          break;
        }
      }
    }

    // 4. Dynamic YouTube resolution: Automatically resolve full song from YouTube API in real time!
    if (!matchedAudioUrl && !matchedYoutubeId) {
      try {
        const queryStr = `${artistName} ${songTitle}`;
        const ytRes = await fetch(`/api/search-youtube?q=${encodeURIComponent(queryStr)}`);
        if (ytRes.ok) {
          const ytData = await ytRes.json();
          if (ytData && ytData.youtubeId) {
            matchedYoutubeId = ytData.youtubeId;
          }
        }
      } catch (ytErr) {
        console.warn('Dynamic YouTube stream notice:', ytErr);
      }
    }

    // 5. CRITICAL FOR MOBILE: Always provide audioUrl fallback so mobile devices can play HTML5 audio immediately without being blocked by YouTube iframe restrictions!
    if (!matchedAudioUrl && item.previewUrl) {
      matchedAudioUrl = item.previewUrl;
    }

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const trackObj = {
      id: `t-online-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: songTitle,
      artist: artistName,
      album: item.collectionName || 'Single',
      cover: finalCover,
      audioUrl: matchedAudioUrl,
      youtubeId: matchedYoutubeId,
      duration: (typeof formatDurationMs === 'function' ? formatDurationMs(item.trackTimeMillis) : 'Full') || 'Full',
      memory: '',
      dateAdded: today,
      liked: false
    };

    targetPl.tracks.push(trackObj);
    saveState();
    triggerSupabaseSync();

    // Immediate UI reflection in the background
    if (currentView === 'playlist' && state.activePlaylistId === targetPl.id) {
      if (typeof renderTracklist === 'function') renderTracklist();
    }
    if (typeof hydrateUI === 'function') hydrateUI();
    if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
    if (typeof renderHomeFavoritesList === 'function') renderHomeFavoritesList();
    if (typeof renderHomePlaylistsGrid === 'function') renderHomePlaylistsGrid();

    // Button feedback state
    if (buttonEl) {
      buttonEl.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Ditambahkan';
      buttonEl.className = 'px-3 py-1.5 rounded-full bg-[#1DB954] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-default';
      buttonEl.disabled = true;
    }

    showToastNotification(`✓ "${songTitle}" berhasil ditambahkan ke "${targetPl.title}"! 🎵`, 'success');
  } catch (err) {
    console.error('Error adding song directly:', err);
    showToastNotification('Terjadi kendala: ' + err.message, 'error');
  }
}

window.quickAddSongDirectly = quickAddSongDirectly;
window.quickAddOnlineSongToPlaylist = quickAddSongDirectly;

function selectItunesResult(title, artist, cover) {
  document.getElementById('inputSongTitle').value = title;
  document.getElementById('inputSongArtist').value = artist;
  document.getElementById('inputSongCover').value = cover;

  // Check if known in our real catalog
  const lowTitle = title.toLowerCase();
  for (const [key, yId] of Object.entries(realSongCatalog)) {
    if (lowTitle.includes(key)) {
      document.getElementById('inputSongAudio').value = `https://www.youtube.com/watch?v=${yId}`;
      break;
    }
  }

  document.getElementById('itunesResultsList').classList.add('hidden');
  showToastNotification(`Data "${title}" terpilih!`, 'success');
}

function compressImageFile(file, maxDim, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => callback(e.target.result);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function compressDataUrlIfNeeded(dataUrl, maxDim = 700, quality = 0.8) {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return resolve(dataUrl);
    }
    if (dataUrl.length < 50000) {
      return resolve(dataUrl);
    }
    const timer = setTimeout(() => {
      resolve(dataUrl);
    }, 2000);
    const img = new Image();
    img.onload = () => {
      clearTimeout(timer);
      try {
        let width = img.width;
        let height = img.height;
        if (!width || !height) return resolve(dataUrl);
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

function handleFileUpload(event, targetInputId) {
  const file = event.target.files[0];
  if (!file) return;
  const isAvatar = targetInputId.includes('Avatar');
  const maxDim = isAvatar ? 300 : 700;
  const quality = isAvatar ? 0.8 : 0.8;

  if (file.type && file.type.startsWith('image/')) {
    compressImageFile(file, maxDim, quality, (compressedDataUrl) => {
      const input = document.getElementById(targetInputId);
      if (input) input.value = compressedDataUrl;
      if (targetInputId === 'editPlaylistCover') {
        const prev = document.getElementById('editPlaylistCoverPreview');
        if (prev) prev.src = compressedDataUrl;
      }
      showToastNotification(`Foto "${file.name}" siap disimpan! ✨`, 'success');
    });
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      const input = document.getElementById(targetInputId);
      if (input) input.value = e.target.result;
      if (targetInputId === 'editPlaylistCover') {
        const prev = document.getElementById('editPlaylistCoverPreview');
        if (prev) prev.src = e.target.result;
      }
      showToastNotification(`File "${file.name}" berhasil diunggah!`, 'success');
    };
    reader.readAsDataURL(file);
  }
}

function saveNewSong(e) {
  e.preventDefault();
  const title = document.getElementById('inputSongTitle').value.trim();
  const artist = document.getElementById('inputSongArtist').value.trim();
  const memory = document.getElementById('inputSongMemory').value.trim();
  const targetPlSelect = document.getElementById('targetPlaylistSelect');
  const targetPlId = (targetPlSelect && targetPlSelect.value) ? targetPlSelect.value : state.activePlaylistId;
  const activePl = (state.playlists || []).find(p => p.id === targetPlId) || getActivePlaylist();
  const cover = document.getElementById('inputSongCover').value.trim() || activePl.cover;
  let audioInput = document.getElementById('inputSongAudio').value.trim();

  // Extract YouTube ID if link was provided
  const ytId = extractYouTubeId(audioInput);
  let finalYoutubeId = ytId;

  // Check real catalog if not explicit
  if (!finalYoutubeId) {
    const low = title.toLowerCase();
    for (const [key, id] of Object.entries(realSongCatalog)) {
      if (low.includes(key)) {
        finalYoutubeId = id;
        break;
      }
    }
  }

  let finalAudioUrl = audioInput;
  if (!finalYoutubeId && (!finalAudioUrl || finalAudioUrl.includes('audio-ssl.itunes.apple.com'))) {
    finalAudioUrl = defaultFullAudioPool[Math.floor(Math.random() * defaultFullAudioPool.length)];
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newTrack = {
    id: 't_' + Date.now(),
    title,
    artist,
    album: 'Single',
    memory: memory || '',
    dateAdded: today,
    duration: finalYoutubeId ? 'Full Official' : 'Full',
    liked: true,
    cover,
    youtubeId: finalYoutubeId,
    audioUrl: finalAudioUrl
  };

  // If local audio file, read metadata duration
  if (finalAudioUrl && finalAudioUrl.startsWith('data:audio/')) {
    const tempAudio = new Audio();
    tempAudio.src = finalAudioUrl;
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        newTrack.duration = formatTime(tempAudio.duration);
        saveState();
        if (currentView === 'playlist') renderTracklist();
      }
    });
  }

  activePl.tracks.push(newTrack);
  saveState();
  hydrateUI();
  closeAddSongModal();

  if (currentView === 'playlist') renderTracklist();
  renderHomeFavoritesList();
  showToastNotification(`Lagu "${title}" berhasil ditambahkan ke playlist! ✨`, 'success');

  if (!isPlaying) {
    loadTrack(activePl.tracks.length - 1, true);
  }
}

// ================= MODALS CONTROLS =================
function openAddSongModal() {
  document.getElementById('inputSongTitle').value = '';
  document.getElementById('inputSongArtist').value = '';
  document.getElementById('inputSongMemory').value = '';
  document.getElementById('inputSongCover').value = '';
  document.getElementById('inputSongAudio').value = '';
  const badge = document.getElementById('fullAudioSelectedBadge');
  if (badge) badge.classList.add('hidden');

  // Populate target playlist dropdown with active playlist pre-selected
  const targetSelect = document.getElementById('targetPlaylistSelect');
  if (targetSelect && state.playlists) {
    const activeId = (state.activePlaylistId && state.activePlaylistId !== 'pl-liked')
      ? state.activePlaylistId
      : (state.playlists[0]?.id || 'pl-ours');

    targetSelect.innerHTML = state.playlists.map(p => {
      const isSel = (p.id === activeId) ? 'selected' : '';
      const safeTitle = (p.title || p.id).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<option value="${p.id}" ${isSel}>${safeTitle}</option>`;
    }).join('');
  }

  document.getElementById('addSongModal').classList.remove('hidden');
  document.getElementById('addSongModal').classList.add('flex');
}
function closeAddSongModal() {
  document.getElementById('addSongModal').classList.add('hidden');
  document.getElementById('addSongModal').classList.remove('flex');
}

let isShowcasePinRevealed = false;

function populateProfileShowcaseView() {
  const activePl = getActivePlaylist();

  const yourAv = document.getElementById('showcaseYourAvatar');
  if (yourAv) yourAv.src = state.yourAvatar;
  const partnerAv = document.getElementById('showcasePartnerAvatar');
  if (partnerAv) partnerAv.src = state.partnerAvatar;

  const yourName = document.getElementById('showcaseYourName');
  if (yourName) yourName.textContent = state.yourName;
  const partnerName = document.getElementById('showcasePartnerName');
  if (partnerName) partnerName.textContent = state.partnerName;

  const plCover = document.getElementById('showcasePlaylistCover');
  if (plCover) plCover.src = activePl.cover;
  const plTitle = document.getElementById('showcasePlaylistTitle');
  if (plTitle) plTitle.textContent = activePl.title;
  const plDesc = document.getElementById('showcasePlaylistDesc');
  if (plDesc) plDesc.textContent = activePl.desc || 'after rain and lean with u <3';

  const loveNote = document.getElementById('showcaseLoveNote');
  if (loveNote) {
    loveNote.textContent = state.loveNote ? `"${state.loveNote}"` : '"Belum ada surat cinta yang ditulis..."';
  }

  // Stats
  const statPl = document.getElementById('showcaseStatPlaylists');
  if (statPl) statPl.textContent = state.playlists.length;
  const statTracks = document.getElementById('showcaseStatTracks');
  if (statTracks) {
    const totalTracks = state.playlists.reduce((acc, p) => acc + (p.tracks ? p.tracks.length : 0), 0);
    statTracks.textContent = totalTracks;
  }
  const statPol = document.getElementById('showcaseStatPolaroids');
  if (statPol) statPol.textContent = (state.polaroidMemories || []).length;

  // Reset PIN display to masked
  isShowcasePinRevealed = false;
  const pinDisplay = document.getElementById('showcasePinDisplay');
  if (pinDisplay) pinDisplay.textContent = '•••• (Tersimpan Aman)';
  const pinText = document.getElementById('showcasePinActionText');
  if (pinText) pinText.textContent = 'Lihat';
  const pinIcon = document.getElementById('showcasePinIcon');
  if (pinIcon) pinIcon.className = 'fa-regular fa-eye';
}

function toggleShowcasePin() {
  const pinDisplay = document.getElementById('showcasePinDisplay');
  const pinText = document.getElementById('showcasePinActionText');
  const pinIcon = document.getElementById('showcasePinIcon');
  const activePin = localStorage.getItem('romantic_music_custom_pin') || state.pinCode || '1806';

  isShowcasePinRevealed = !isShowcasePinRevealed;
  if (isShowcasePinRevealed) {
    if (pinDisplay) pinDisplay.textContent = `${activePin} (PIN Aktif)`;
    if (pinText) pinText.textContent = 'Sembunyi';
    if (pinIcon) pinIcon.className = 'fa-regular fa-eye-slash';
  } else {
    if (pinDisplay) pinDisplay.textContent = '•••• (Tersimpan Aman)';
    if (pinText) pinText.textContent = 'Lihat';
    if (pinIcon) pinIcon.className = 'fa-regular fa-eye';
  }
}

function switchToProfileEditMode() {
  const showcaseView = document.getElementById('profileShowcaseView');
  const editView = document.getElementById('profileEditView');
  if (showcaseView) showcaseView.classList.add('hidden');
  if (editView) {
    editView.classList.remove('hidden');
    editView.classList.add('view-fade-enter');
  }
}

function switchToProfileShowcaseMode() {
  const showcaseView = document.getElementById('profileShowcaseView');
  const editView = document.getElementById('profileEditView');
  if (editView) editView.classList.add('hidden');
  if (showcaseView) {
    showcaseView.classList.remove('hidden');
    showcaseView.classList.add('view-fade-enter');
  }
}

function openProfileModal() {
  if (document.getElementById('setPinCode')) {
    document.getElementById('setPinCode').value = localStorage.getItem('romantic_music_custom_pin') || state.pinCode || '1806';
  }
  if (document.getElementById('setYourName')) document.getElementById('setYourName').value = state.yourName || '';
  if (document.getElementById('setPartnerName')) document.getElementById('setPartnerName').value = state.partnerName || '';
  if (document.getElementById('setYourAvatar')) document.getElementById('setYourAvatar').value = state.yourAvatar || '';
  if (document.getElementById('setPartnerAvatar')) document.getElementById('setPartnerAvatar').value = state.partnerAvatar || '';
  if (document.getElementById('setLoveNote')) document.getElementById('setLoveNote').value = state.loveNote || '';

  switchToProfileShowcaseMode();
  populateProfileShowcaseView();

  const modal = document.getElementById('profileModal') || document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal') || document.getElementById('settingsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Aliases for compatibility
function openSettingsModal() { openProfileModal(); }
function closeSettingsModal() { closeProfileModal(); }

function openEditPlaylistModal() {
  const activePl = getActivePlaylist();
  if (activePl.isLikedSpecial || state.activePlaylistId === 'pl-liked') {
    showToastNotification('Playlist Liked Songs tidak dapat diedit', 'info');
    return;
  }
  if (document.getElementById('editPlaylistTitle')) {
    document.getElementById('editPlaylistTitle').value = activePl.title || '';
  }
  if (document.getElementById('editPlaylistDesc')) {
    document.getElementById('editPlaylistDesc').value = activePl.desc || '';
  }
  if (document.getElementById('editPlaylistCover')) {
    document.getElementById('editPlaylistCover').value = activePl.cover || '';
  }
  if (document.getElementById('editPlaylistCoverPreview')) {
    document.getElementById('editPlaylistCoverPreview').src = activePl.cover || 'images/spotify_covers/jakarta.jpg';
  }

  const modal = document.getElementById('editPlaylistModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeEditPlaylistModal() {
  const modal = document.getElementById('editPlaylistModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function saveProfileOnlySettings(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  const saveBtn = document.getElementById('btnSaveProfileOnly') || document.getElementById('btnSaveSettings');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan... ⏳';
  }

  try {
    const newPin = (document.getElementById('setPinCode')?.value || '').trim() || '1806';
    state.pinCode = newPin;

    let rawYourAvatar = (document.getElementById('setYourAvatar')?.value || '').trim();
    let rawPartnerAvatar = (document.getElementById('setPartnerAvatar')?.value || '').trim();

    const [compressedYourAvatar, compressedPartnerAvatar] = await Promise.all([
      compressDataUrlIfNeeded(rawYourAvatar, 300, 0.8),
      compressDataUrlIfNeeded(rawPartnerAvatar, 300, 0.8)
    ]);

    if (compressedYourAvatar) state.yourAvatar = compressedYourAvatar;
    if (compressedPartnerAvatar) state.partnerAvatar = compressedPartnerAvatar;

    state.yourName = (document.getElementById('setYourName')?.value || '').trim() || 'Kamu';
    state.partnerName = (document.getElementById('setPartnerName')?.value || '').trim() || 'Sayang';
    state.loveNote = document.getElementById('setLoveNote')?.value || '';
    state.profileUpdatedAt = Date.now();

    // Immediately persist directly to dedicated keys
    try {
      localStorage.setItem('romantic_music_custom_pin', newPin);
      localStorage.setItem('romantic_music_profile_updated_at', state.profileUpdatedAt.toString());
      const profileConfig = {
        yourName: state.yourName,
        partnerName: state.partnerName,
        yourAvatar: state.yourAvatar,
        partnerAvatar: state.partnerAvatar,
        loveNote: state.loveNote,
        profileUpdatedAt: state.profileUpdatedAt
      };
      localStorage.setItem('romantic_music_profile_config', JSON.stringify(profileConfig));
    } catch (err) {
      console.warn('Dedicated profile localStorage warn:', err);
    }

    saveState();
    hydrateUI();
    if (currentView === 'home') renderHomeView();
    else if (currentView === 'jam') updateMainJamView();

    populateProfileShowcaseView();
    switchToProfileShowcaseMode();

    await pushStateToSupabase();
    showToastNotification('Profil & PIN berhasil disimpan! 💕', 'success');
  } catch (err) {
    console.error('Error saving profile settings:', err);
    showToastNotification('Gagal menyimpan profil: ' + err.message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Simpan Profil';
    }
  }
}

async function savePlaylistOnlySettings(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  const saveBtn = document.getElementById('btnSavePlaylistOnly');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan... ⏳';
  }

  try {
    const activePl = getActivePlaylist();
    if (activePl) {
      activePl.title = (document.getElementById('editPlaylistTitle')?.value || '').trim() || activePl.title || '✦ our melodies.';
      activePl.desc = (document.getElementById('editPlaylistDesc')?.value || '').trim();

      let rawCover = (document.getElementById('editPlaylistCover')?.value || '').trim();
      const compressedCover = await compressDataUrlIfNeeded(rawCover, 700, 0.8);
      if (compressedCover) {
        activePl.cover = compressedCover;
      }

      state.playlistsUpdatedAt = Date.now();
      try {
        localStorage.setItem('romantic_music_playlists_updated_at', state.playlistsUpdatedAt.toString());
        let plCustom = {};
        const rawPlCustom = localStorage.getItem('romantic_music_playlist_customizations');
        if (rawPlCustom) { try { plCustom = JSON.parse(rawPlCustom); } catch(e){} }
        plCustom[activePl.id] = {
          title: activePl.title,
          desc: activePl.desc,
          cover: activePl.cover,
          updatedAt: state.playlistsUpdatedAt
        };
        localStorage.setItem('romantic_music_playlist_customizations', JSON.stringify(plCustom));
      } catch(e){}
    }

    saveState();
    hydrateUI();
    if (currentView === 'playlist') renderTracklist();
    else if (currentView === 'home') renderHomeView();

    await pushStateToSupabase();
    closeEditPlaylistModal();
    showToastNotification('Detail playlist berhasil diperbarui! 🎵', 'success');
  } catch (err) {
    console.error('Error saving playlist details:', err);
    showToastNotification('Gagal menyimpan playlist: ' + err.message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Simpan Playlist';
    }
  }
}

// Wrapper for backward compatibility
async function savePlaylistSettings(e) {
  return saveProfileOnlySettings(e);
}

function resetDefaultData() {
  if (confirm('Reset seluruh playlist dan bersihkan data lama agar lagu berdurasi full?')) {
    localStorage.clear();
    location.reload();
  }
}

function openLoveNoteModal() {
  document.getElementById('loveNoteModal').classList.remove('hidden');
  document.getElementById('loveNoteModal').classList.add('flex');
}
function closeLoveNoteModal() {
  document.getElementById('loveNoteModal').classList.add('hidden');
  document.getElementById('loveNoteModal').classList.remove('flex');
}

function togglePolaroidModal() {
  const modal = document.getElementById('polaroidModal');
  modal.classList.toggle('hidden');
  modal.classList.toggle('flex');
}

// ================= TOAST NOTIFICATION SYSTEM =================
let toastTimeout = null;
function showToastNotification(message, type = 'info') {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = document.getElementById('toastIcon');
  if (!toast || !msgEl || !iconEl) return;

  clearTimeout(toastTimeout);

  msgEl.textContent = message;
  if (type === 'success') {
    iconEl.className = 'fa-solid fa-circle-check text-emerald-400';
  } else if (type === 'error') {
    iconEl.className = 'fa-solid fa-circle-exclamation text-rose-400';
  } else {
    iconEl.className = 'fa-solid fa-download text-[#FA8072]';
  }

  toast.classList.remove('opacity-0', 'translate-y-[-12px]', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  toastTimeout = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-[-12px]', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3200);
}

// ================= DIRECT MP3 DOWNLOAD ENGINE =================
async function downloadTrackByIdx(index) {
  const tracks = getActiveTracks();
  const track = tracks[index];
  if (!track) {
    showToastNotification('Data lagu tidak ditemukan!', 'error');
    return;
  }
  downloadDirectSong(track.title, track.artist, track.audioUrl, track.youtubeId);
}

async function downloadDirectSong(title, artist, audioUrl, youtubeId) {
  showToastNotification(`Mempersiapkan unduhan "${title}"...`, 'info');
  const safeFilename = `${title} - ${artist}`.replace(/[/\\?%*:|"<>]/g, '_') + '.mp3';

  if (audioUrl && (audioUrl.startsWith('blob:') || audioUrl.startsWith('data:') || audioUrl.startsWith('audio/'))) {
    triggerBrowserDownload(audioUrl, safeFilename);
    showToastNotification(`Berhasil mengunduh "${title}"! 💕`, 'success');
    return;
  }

  if (audioUrl && audioUrl.startsWith('http') && !audioUrl.includes('youtube.com')) {
    try {
      const response = await fetch(audioUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        triggerBrowserDownload(objectUrl, safeFilename);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 20000);
        showToastNotification(`Lagu "${title}" tersimpan! 💕`, 'success');
        return;
      }
    } catch (e) {
      // fallback
    }
  }

  if (youtubeId) {
    const ytUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(ytUrl, '_blank');
    showToastNotification(`Membuka video resmi "${title}" di YouTube!`, 'info');
  } else if (audioUrl) {
    triggerBrowserDownload(audioUrl, safeFilename, true);
  }
}

function triggerBrowserDownload(url, filename, isExternal = false) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  if (isExternal) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function downloadCurrentTrack() {
  downloadTrackByIdx(currentIndex);
}

// ================= DEDICATED POLAROID MEMORIES GALLERY ENGINE =================
let pendingDeletePolaroidId = null;
let currentDetailPolaroidId = null;

function renderPolaroidGallery() {
  const container = document.getElementById('polaroidGalleryGrid');
  if (!container) return;

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
    return `
      <div class="polaroid-card w-full ${tiltClass} group cursor-pointer transition-all duration-300" onclick="viewPolaroidDetail('${item.id}')">
        <!-- Washi Tape -->
        <div class="washi-tape"></div>

        <!-- Image Frame (Square 1:1, Never Cropped or Squished) -->
        <div class="w-full aspect-square bg-[#FFF5F7] rounded-sm overflow-hidden mb-2 sm:mb-2.5 relative border border-[#FFE4E9] flex items-center justify-center">
          <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Polaroid photo" loading="lazy" />
          
          <!-- Hover / Focus Overlay with Zoom, Edit & Delete Buttons -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2" onclick="event.stopPropagation()">
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
        </div>

        <!-- Handwritten Caption (Multi-line comfortable reading, no harsh cutoff) -->
        <p class="font-handwriting text-base sm:text-lg lg:text-xl text-[#3B2328] text-center leading-snug px-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
          ${item.caption || 'Kenangan manis berdua ✦'}
        </p>

        <!-- Date & Location Footer -->
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

  const messages = state.jamMessages || [];
  container.innerHTML = messages.map(msg => {
    if (msg.sender === 'system') {
      return `
        <div class="text-center py-1">
          <span class="text-[10px] bg-[#FFF0F3] text-[#E85D75] px-2.5 py-0.5 rounded-full border border-[#FFD2DC]">${msg.text}</span>
        </div>
      `;
    }
    const isYou = msg.sender === 'you';
    return `
      <div class="flex flex-col ${isYou ? 'items-end' : 'items-start'}">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="text-[10px] font-bold ${isYou ? 'text-[#FA8072]' : 'text-[#7A4E58]'}">${isYou ? state.yourName : state.partnerName}</span>
          <span class="text-[9px] text-[#9A737C]">${msg.time}</span>
        </div>
        <div class="px-3.5 py-2 rounded-2xl max-w-[85%] text-xs leading-relaxed ${isYou
        ? 'bg-gradient-to-r from-[#FA8072] to-[#E85D75] text-white rounded-tr-none shadow-xs'
        : 'bg-[#FFF0F3] border border-[#FFD2DC] text-[#3B2328] rounded-tl-none shadow-xs'
      }">
          ${msg.text}
        </div>
      </div>
    `;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

function sendMainJamChatMessage(event) {
  event.preventDefault();
  const input = document.getElementById('mainJamChatInput');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (!state.jamMessages) state.jamMessages = [];
  state.jamMessages.push({ sender: 'you', text, time: timeStr });
  saveState();
  triggerSupabaseSync();
  input.value = '';
  renderMainJamChat();
  renderJamChat();
  sendFloatingReaction('💌', true);
}

// ================= SHARE SONG FEATURE =================
let currentSharingTrack = null;

function findTrackByIdOrIdx(identifier) {
  const activeTracks = getActiveTracks();
  if (identifier === undefined || identifier === null) return activeTracks[currentIndex] || null;

  if (typeof identifier === 'number' || (!isNaN(identifier) && activeTracks[parseInt(identifier, 10)])) {
    const idx = parseInt(identifier, 10);
    if (activeTracks[idx]) return activeTracks[idx];
  }

  const strId = String(identifier).toLowerCase().trim();
  let found = activeTracks.find(t => (t.id && t.id.toLowerCase() === strId) || (t.title && t.title.toLowerCase().trim() === strId));
  if (found) return found;

  for (const pl of state.playlists) {
    found = pl.tracks.find(t => (t.id && t.id.toLowerCase() === strId) || (t.title && t.title.toLowerCase().trim() === strId));
    if (found) return found;
  }
  return activeTracks[currentIndex] || null;
}

function openShareSongModal(trackIdentifier) {
  const track = findTrackByIdOrIdx(trackIdentifier);
  if (!track) return;
  currentSharingTrack = track;

  const modal = document.getElementById('shareSongModal');
  const cover = document.getElementById('shareTrackCover');
  const title = document.getElementById('shareTrackTitle');
  const artist = document.getElementById('shareTrackArtist');
  const memory = document.getElementById('shareTrackMemory');
  const linkInput = document.getElementById('shareLinkInput');
  const waBtn = document.getElementById('shareWhatsAppBtn');

  if (cover) cover.src = track.cover;
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;
  if (memory) memory.textContent = `"${track.memory || 'Lagu spesial untuk kita berdua ✦'}"`;

  const baseUrl = window.location.origin + window.location.pathname;
  const shareParam = encodeURIComponent(track.id || track.title);
  const directLink = `${baseUrl}?play=${shareParam}`;
  if (linkInput) linkInput.value = directLink;

  const waText = encodeURIComponent(
    `Hai, dengerin lagu ini yuk di space musik kita:\n\n` +
    `🎵 *${track.title}* - ${track.artist}\n` +
    `✦ "${track.memory || 'Setiap nada mengingatkan momen manis bersama'}"\n\n` +
    `Buka & dengarkan langsung di sini:\n${directLink}`
  );
  if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function openShareSongModalCurrent() {
  const tracks = getActiveTracks();
  if (!tracks.length) return;
  openShareSongModal(tracks[currentIndex]?.id || currentIndex);
}

function closeShareSongModal() {
  const modal = document.getElementById('shareSongModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function copyShareLink() {
  const linkInput = document.getElementById('shareLinkInput');
  if (!linkInput) return;
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value).then(() => {
    showToastNotification('Link lagu disalin ke clipboard! ✦', 'success');
  }).catch(() => {
    document.execCommand('copy');
    showToastNotification('Link disalin ke clipboard! ✦', 'success');
  });
}

function copyRomanticQuote() {
  if (!currentSharingTrack) return;
  const track = currentSharingTrack;
  const baseUrl = window.location.origin + window.location.pathname;
  const shareParam = encodeURIComponent(track.id || track.title);
  const directLink = `${baseUrl}?play=${shareParam}`;

  const quoteText = `"${track.memory || 'Lagu indah untuk kita berdua ✦'}"\n— ${track.title} by ${track.artist}\n${directLink}`;
  navigator.clipboard.writeText(quoteText).then(() => {
    showToastNotification('Catatan & judul lagu disalin ke clipboard! ✦', 'success');
  }).catch(() => {
    showToastNotification('Teks berhasil disalin!', 'success');
  });
}

// ================= ADD SONG TO PLAYLIST FEATURE =================
let currentTrackForPlaylist = null;

function openAddToPlaylistModal(trackIdentifier) {
  let track = (typeof trackIdentifier === 'object' && trackIdentifier !== null)
    ? trackIdentifier
    : findTrackByIdOrIdx(trackIdentifier);

  if (!track && typeof getPlayingTrack === 'function') {
    track = getPlayingTrack();
  }
  if (!track) return;
  currentTrackForPlaylist = track;

  const modal = document.getElementById('addToPlaylistModal');
  const cover = document.getElementById('addToPlTrackCover');
  const title = document.getElementById('addToPlTrackTitle');
  const artist = document.getElementById('addToPlTrackArtist');

  if (cover) cover.src = track.cover || 'images/covers/those_eyes.jpg';
  if (title) title.textContent = track.title || 'Lagu';
  if (artist) artist.textContent = track.artist || '';

  renderAddToPlaylistItems();

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function openAddToPlaylistModalCurrent() {
  if (typeof getPlayingTrack === 'function') {
    const playing = getPlayingTrack();
    if (playing) {
      openAddToPlaylistModal(playing);
      return;
    }
  }
  const tracks = getActiveTracks();
  if (!tracks.length) return;
  openAddToPlaylistModal(tracks[currentIndex]?.id || currentIndex);
}

function closeAddToPlaylistModal() {
  const modal = document.getElementById('addToPlaylistModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderAddToPlaylistItems() {
  const container = document.getElementById('addToPlaylistItemsContainer');
  if (!container || !currentTrackForPlaylist) return;

  const track = currentTrackForPlaylist;
  const likedTracks = (typeof getAllLikedTracks === 'function') ? getAllLikedTracks() : [];
  const isAlreadyInLiked = likedTracks.some(t =>
    (t.id && track.id && t.id === track.id) ||
    (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
  );

  const regularHtml = state.playlists.map(pl => {
    const hasTrack = Array.isArray(pl.tracks) && pl.tracks.some(t =>
      (t.id && track.id && t.id === track.id) ||
      (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
    );

    return `
      <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9FA] hover:bg-[#FFE4E9]/40 border border-[#FFD2DC] transition">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${pl.cover || 'images/spotify_covers/jakarta.jpg'}" class="w-10 h-10 rounded-xl object-cover border border-[#FFD2DC] shrink-0 shadow-xs" alt="${pl.title}" />
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-[#3B2328] truncate">${pl.title}</h5>
            <p class="text-[11px] text-[#9A737C]">${(pl.tracks || []).length} lagu</p>
          </div>
        </div>
        <div>
          ${hasTrack ? `
            <span class="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-xs transition">
              <i class="fa-solid fa-check text-xs text-emerald-600"></i> Sudah Ada
            </span>
          ` : `
            <button type="button" onclick="event.stopPropagation(); addTrackToSelectedPlaylist('${pl.id}')" class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FA8072] to-[#E85D75] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95">
              <i class="fa-solid fa-plus text-xs"></i> Tambahkan
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  const likedCardHtml = `
    <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E9]/50 border border-[#FFB6C1] transition mb-2">
      <div class="flex items-center gap-3 min-w-0">
        <img src="images/spotify_covers/liked_cover.svg" class="w-10 h-10 rounded-xl object-cover border border-[#FFD2DC] shrink-0 shadow-xs" alt="Liked Songs" />
        <div class="min-w-0">
          <h5 class="text-xs font-bold text-[#3B2328] truncate">Liked Songs ❤️</h5>
          <p class="text-[11px] text-[#FA8072] font-semibold">${likedTracks.length} lagu favorit</p>
        </div>
      </div>
      <div>
        ${isAlreadyInLiked ? `
          <span class="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-xs transition">
            <i class="fa-solid fa-check text-xs text-emerald-600"></i> Favorit
          </span>
        ` : `
          <button type="button" onclick="event.stopPropagation(); addTrackToSelectedPlaylist('pl-liked')" class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FA8072] to-[#E85D75] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95">
            <i class="fa-solid fa-heart text-xs"></i> Tambahkan
          </button>
        `}
      </div>
    </div>
  `;

  container.innerHTML = likedCardHtml + regularHtml;
}

function addTrackToSelectedPlaylist(targetPlId) {
  if (!currentTrackForPlaylist) return;

  const track = currentTrackForPlaylist;

  // Handle adding to Liked Songs
  if (targetPlId === 'pl-liked') {
    const defaultPl = state.playlists.find(p => p.id === 'pl-ours') || state.playlists[0];
    if (defaultPl) {
      if (!Array.isArray(defaultPl.tracks)) defaultPl.tracks = [];
      const already = defaultPl.tracks.find(t =>
        (t.id && track.id && t.id === track.id) ||
        (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
      );
      if (already) {
        already.liked = true;
      } else {
        defaultPl.tracks.push({
          ...track,
          id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          liked: true,
          dateAdded: 'Baru saja'
        });
      }
      saveState();
      triggerSupabaseSync();
      if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
      if (typeof renderHomeFavoritesList === 'function') renderHomeFavoritesList();
      if (state.activePlaylistId === 'pl-liked' && typeof renderTracklist === 'function') renderTracklist();
      renderAddToPlaylistItems();
      showToastNotification(`Lagu '${track.title}' ditambahkan ke Liked Songs! ❤️`, 'success');
      return;
    }
  }

  const pl = state.playlists.find(p => p.id === targetPlId);
  if (!pl) return;

  if (!Array.isArray(pl.tracks)) {
    pl.tracks = [];
  }

  const alreadyIn = pl.tracks.some(t =>
    (t.id && track.id && t.id === track.id) ||
    (t.title && track.title && t.title.toLowerCase().trim() === track.title.toLowerCase().trim())
  );

  if (alreadyIn) {
    showToastNotification(`Lagu '${track.title}' sudah ada di playlist '${pl.title}'`, 'info');
    renderAddToPlaylistItems();
    return;
  }

  const newTrack = {
    ...track,
    id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    dateAdded: 'Baru saja'
  };
  pl.tracks.push(newTrack);
  saveState();
  triggerSupabaseSync();

  if (typeof renderHomePlaylistsGrid === 'function') renderHomePlaylistsGrid();
  if (typeof renderSidebarPlaylists === 'function') renderSidebarPlaylists();
  if (state.activePlaylistId === targetPlId) {
    if (typeof renderTracklist === 'function') renderTracklist();
    if (typeof updatePlaylistHeader === 'function') updatePlaylistHeader();
  }

  // Immediately re-render items so button changes to "Sudah Ada"
  renderAddToPlaylistItems();
  showToastNotification(`Lagu '${track.title}' berhasil ditambahkan ke '${pl.title}'! 🎵`, 'success');
}

function openCreatePlaylistFromAddModal() {
  closeAddToPlaylistModal();
  openCreatePlaylistModal();
}

function checkUrlPlayParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const playParam = urlParams.get('play');
  if (!playParam) return;

  const target = decodeURIComponent(playParam).toLowerCase().trim();
  let targetPl = null;
  let targetTrackIdx = -1;

  for (const pl of state.playlists) {
    const idx = pl.tracks.findIndex(t =>
      (t.id && t.id.toLowerCase() === target) ||
      (t.title && t.title.toLowerCase().trim() === target)
    );
    if (idx !== -1) {
      targetPl = pl;
      targetTrackIdx = idx;
      break;
    }
  }

  if (targetPl && targetTrackIdx !== -1) {
    selectPlaylist(targetPl.id);
    setTimeout(() => {
      loadTrack(targetTrackIdx, true);
      const track = targetPl.tracks[targetTrackIdx];
      showToastNotification(`Memutar lagu yang dibagikan: ${track.title} 💕`, 'success');
    }, 400);
  }
}

// ================= MOBILE FULLSCREEN TURNTABLE DETAIL MODAL =================
function openMobileDetailPlayer() {
  const modal = document.getElementById('mobileDetailPlayerModal');
  if (modal) {
    modal.classList.remove('translate-y-full');
    modal.classList.add('translate-y-0');
  }
}

function closeMobileDetailPlayer() {
  const modal = document.getElementById('mobileDetailPlayerModal');
  if (modal) {
    modal.classList.remove('translate-y-0');
    modal.classList.add('translate-y-full');
  }
}

// ================= MOBILE PLAYLIST DRAWER ENGINE =================
function openMobilePlaylistDrawer() {
  renderMobileDrawerPlaylists();
  renderMobileDrawerTracklist();
  const drawer = document.getElementById('mobilePlaylistDrawer');
  const backdrop = document.getElementById('mobilePlaylistDrawerBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    void backdrop.offsetWidth;
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-y-full');
  }
}

function closeMobilePlaylistDrawer() {
  const drawer = document.getElementById('mobilePlaylistDrawer');
  const backdrop = document.getElementById('mobilePlaylistDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-y-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }
}

function renderMobileDrawerPlaylists() {
  const bar = document.getElementById('mobileDrawerPlaylistsBar');
  if (!bar) return;

  bar.innerHTML = state.playlists.map(pl => {
    const isCurrent = pl.id === state.activePlaylistId;
    return `
      <button onclick="selectMobileDrawerPlaylist('${pl.id}')"
        class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${isCurrent ? 'bg-gradient-to-r from-[#FA8072] to-[#E85D75] text-white shadow-xs' : 'bg-[#FFF5F7] text-[#3B2328] border border-[#FFD2DC]'}">
        <i class="fa-solid fa-compact-disc text-[10px]"></i>
        <span>${pl.title}</span>
        <span class="text-[10px] opacity-80">(${pl.tracks ? pl.tracks.length : 0})</span>
      </button>
    `;
  }).join('');
}

function selectMobileDrawerPlaylist(plId) {
  state.activePlaylistId = plId;
  saveState();
  hydrateUI();
  if (currentView === 'playlist') renderTracklist();
  renderMobileDrawerPlaylists();
  renderMobileDrawerTracklist();
  const pl = getActivePlaylist();
  const sub = document.getElementById('mobileDrawerSubtitle');
  if (sub && pl) sub.textContent = pl.desc || `${pl.tracks.length} lagu romantis`;
}

function renderMobileDrawerTracklist() {
  const container = document.getElementById('mobileDrawerTracklist');
  if (!container) return;
  const query = (document.getElementById('mobileDrawerSearchInput')?.value || '').toLowerCase().trim();
  const tracks = getActiveTracks();

  const filtered = tracks
    .map((track, idx) => ({ ...track, originalIndex: idx }))
    .filter(item => {
      if (!query) return true;
      return item.title.toLowerCase().includes(query) ||
        item.artist.toLowerCase().includes(query) ||
        (item.memory || '').toLowerCase().includes(query);
    });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-[#9A737C]">
        <i class="fa-solid fa-music text-xl mb-1.5 text-[#FA8072]"></i>
        <p class="text-xs font-bold">Lagu tidak ditemukan</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((track, displayIdx) => {
    const currentPlaying = getPlayingTrack();
    const isPlayingThisPlaylist = currentPlayingPlaylistId === state.activePlaylistId;
    const isCurrent = isPlayingThisPlaylist && (
      (currentPlaying && (currentPlaying.id === track.id || currentPlaying.title.toLowerCase() === track.title.toLowerCase())) ||
      track.originalIndex === currentPlayingIndex
    );

    return `
      <div onclick="selectTrackFromList(${track.originalIndex})"
        class="flex items-center justify-between p-2 rounded-2xl cursor-pointer transition ${isCurrent ? 'bg-[#FFE4E9] text-[#E85D75] font-bold' : 'hover:bg-[#FFF5F7] text-[#3B2328]'}">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-6 text-center text-xs text-[#9A737C] shrink-0">
            ${isCurrent && isPlaying ? `
              <div class="inline-flex items-end gap-0.5 h-3">
                <span class="eq-bar"></span>
                <span class="eq-bar"></span>
                <span class="eq-bar"></span>
              </div>
            ` : `<span class="text-xs font-semibold">${displayIdx + 1}</span>`}
          </div>
          <img src="${track.cover}" class="w-10 h-10 rounded-xl object-cover border border-[#FFD2DC] shrink-0" alt="${track.title}" />
          <div class="min-w-0 flex-1 truncate">
            <h5 class="text-xs font-extrabold truncate ${isCurrent ? 'text-[#E85D75]' : 'text-[#3B2328]'}">${track.title}</h5>
            <p class="text-[10px] text-[#9A737C] truncate">${track.artist} ${track.memory ? '• <i>"' + track.memory.substring(0, 24) + '..."</i>' : ''}</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0 pl-2" onclick="event.stopPropagation()">
          <button onclick="toggleLikeTrack(${track.originalIndex}); renderMobileDrawerTracklist();"
            class="w-8 h-8 rounded-full flex items-center justify-center ${track.liked ? 'text-[#FA8072]' : 'text-[#9A737C]'}">
            <i class="${track.liked ? 'fa-solid' : 'fa-regular'} fa-heart text-xs"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}


