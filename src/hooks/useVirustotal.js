import { useState } from 'react';
import axios from 'axios';

export function useVirustotal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const scan = async (query) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Determine type based on regex
      let type = 'ip';
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      const hashRegex = /^[a-f0-9]{32,64}$/i;
      
      if (hashRegex.test(query)) {
        type = 'hash';
      } else if (!ipRegex.test(query)) {
        type = 'domain';
      }

      // Read key from localStorage if setup
      const localKey = localStorage.getItem('VT_API_KEY');

      const response = await axios.get(`/api/virustotal?type=${type}&query=${encodeURIComponent(query)}&key=${encodeURIComponent(localKey || '')}`);
      
      setResult({ type, data: response.data.data });
      return { type, data: response.data.data };

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to analyze target.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading, error, result };
}
