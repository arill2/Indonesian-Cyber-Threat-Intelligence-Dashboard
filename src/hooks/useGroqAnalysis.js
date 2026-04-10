import { useState } from 'react';
import axios from 'axios';

export function useGroqAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const analyze = async (prompt) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const localKey = localStorage.getItem('GROQ_API_KEY');

      const response = await axios.post('/api/groq', { 
        prompt,
        key: localKey || ''
      });
      
      const content = response.data.choices[0]?.message?.content;
      setAnalysis(content);
      return content;

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch AI analysis.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, analysis };
}
