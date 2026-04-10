export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, query, key } = req.query;
  const userKey = key || req.headers['x-user-apikey'];
  const apiKey = userKey && userKey !== 'null' && userKey !== 'undefined' ? userKey : process.env.VT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: VirusTotal API Key is missing.' });
  }

  const endpoints = {
    ip: `https://www.virustotal.com/api/v3/ip_addresses/${query}`,
    domain: `https://www.virustotal.com/api/v3/domains/${query}`,
    hash: `https://www.virustotal.com/api/v3/files/${query}`,
  };

  if (!endpoints[type]) {
    return res.status(400).json({ error: 'Invalid query type. Use ip, domain, or hash.' });
  }

  try {
    const response = await fetch(endpoints[type], {
      headers: { 'x-apikey': apiKey }
    });
    
    if (!response.ok) {
        throw new Error(`VT API returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from VirusTotal', details: error.message });
  }
}
