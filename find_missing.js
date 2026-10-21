const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');

const startIdx = content.indexOf('const defaultState =');
const endIdx = content.indexOf('function loadState()');
const stateSection = content.substring(startIdx, endIdx);

const missing = [];
const trackRegex = /"title":\s*"([^"]+)",\s*"artist":\s*"([^"]+)"[\s\S]*?"cover":\s*"([^"]*)"[\s\S]*?"audioUrl":\s*"([^"]*)"/g;
let match;
while ((match = trackRegex.exec(stateSection)) !== null) {
  const t = {
    title: match[1],
    artist: match[2],
    cover: match[3],
    audioUrl: match[4]
  };
  const audioExists = Boolean(t.audioUrl && fs.existsSync(t.audioUrl));
  const coverExists = Boolean(t.cover && fs.existsSync(t.cover));
  if (!audioExists || !coverExists) {
    missing.push({ ...t, audioExists, coverExists });
  }
}

console.log('Total tracks missing audio or cover:', missing.length);
missing.forEach(m => {
  console.log(`- Title: "${m.title}", Artist: "${m.artist}"`);
  console.log(`    Missing Audio? ${!m.audioExists} (Path: ${m.audioUrl})`);
  console.log(`    Missing Cover? ${!m.coverExists} (Path: ${m.cover})`);
});
