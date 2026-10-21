const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');

const startIdx = content.indexOf('const defaultState =');
const endIdx = content.indexOf('function loadState()');
const stateSection = content.substring(startIdx, endIdx);

const genericCovers = [];
const trackRegex = /"title":\s*"([^"]+)",\s*"artist":\s*"([^"]+)"[\s\S]*?"cover":\s*"([^"]*)"[\s\S]*?"audioUrl":\s*"([^"]*)"/g;
let match;
while ((match = trackRegex.exec(stateSection)) !== null) {
  const t = {
    title: match[1],
    artist: match[2],
    cover: match[3],
    audioUrl: match[4]
  };
  if (t.cover.includes('spotify_covers')) {
    genericCovers.push(t);
  }
}

console.log('Tracks with spotify_covers instead of official cover:', genericCovers.length);
genericCovers.forEach(m => {
  console.log(`- Title: "${m.title}", Artist: "${m.artist}", Cover: "${m.cover}"`);
});
