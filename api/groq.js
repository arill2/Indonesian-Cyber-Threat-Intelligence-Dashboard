export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, key } = req.body;
  const userKey = key || req.headers['x-user-apikey'];
  const apiKey = userKey && userKey !== 'null' && userKey !== 'undefined' ? userKey : process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: Groq API Key is missing.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah analis keamanan siber senior di Indonesia. Berikan penjelasan yang ringkas, teknis namun mudah dipahami, dan berikan actionable insights. Jawab dalam Bahasa Indonesia.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
      })
    });

    if (!response.ok) {
        throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Groq AI', details: error.message });
  }
}
