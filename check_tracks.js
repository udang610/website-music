const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');

// Match defaultState
const startIdx = content.indexOf('const defaultState =');
const endIdx = content.indexOf('function loadState()');
const stateSection = content.substring(startIdx, endIdx);

// Extract all tracks
const tracks = [];
const trackRegex = /"title":\s*"([^"]+)",\s*"artist":\s*"([^"]+)"[\s\S]*?"cover":\s*"([^"]*)"[\s\S]*?"audioUrl":\s*"([^"]*)"/g;
let match;
while ((match = trackRegex.exec(stateSection)) !== null) {
  tracks.push({
    title: match[1],
    artist: match[2],
    cover: match[3],
    audioUrl: match[4]
  });
}

console.log('Total tracks found in defaultState:', tracks.length);
tracks.forEach((t, i) => {
  const audioExists = t.audioUrl && fs.existsSync(t.audioUrl);
  const coverExists = t.cover && fs.existsSync(t.cover);
  console.log(`[${i+1}] ${t.title} - ${t.artist}`);
  console.log(`     Audio: ${t.audioUrl} (Exists: ${audioExists})`);
  console.log(`     Cover: ${t.cover} (Exists: ${coverExists})`);
});
