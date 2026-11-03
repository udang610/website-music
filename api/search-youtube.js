// Vercel Serverless Function to resolve YouTube Video ID for full playback
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query.q || req.query.search;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }

  const cleanQuery = query.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  // Try multiple search variants to guarantee finding the YouTube ID
  const searchQueries = [
    `${cleanQuery} official audio`,
    `${cleanQuery} topic`,
    cleanQuery
  ];

  for (const q of searchQueries) {
    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cookie': 'CONSENT=YES+cb.20230531-04-p0.en+FX+999; SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg'
        }
      });

      if (!response.ok) continue;

      const html = await response.text();

      // Pattern 1: standard videoId JSON
      const match1 = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match1 && match1[1] && match1[1] !== 'undefined') {
        return res.status(200).json({
          success: true,
          youtubeId: match1[1],
          query: query
        });
      }

      // Pattern 2: watch?v= format
      const match2 = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
      if (match2 && match2[1] && match2[1] !== 'undefined') {
        return res.status(200).json({
          success: true,
          youtubeId: match2[1],
          query: query
        });
      }
    } catch (err) {
      console.warn(`Query attempt failed for [${q}]:`, err.message);
    }
  }

  return res.status(404).json({ success: false, error: 'No video found' });
};
