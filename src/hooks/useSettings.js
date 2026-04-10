import { useState, useEffect } from 'react';

export function useSettings() {
  const [keys, setKeys] = useState({
    vtKey: localStorage.getItem('VT_API_KEY') || '',
    groqKey: localStorage.getItem('GROQ_API_KEY') || '',
    nvdKey: localStorage.getItem('NVD_API_KEY') || '',
  });

  const [preferences, setPreferences] = useState({
    minSeverity: localStorage.getItem('MIN_SEVERITY') || 'LOW',
    theme: localStorage.getItem('THEME') || 'dark',
  });

  const updateKey = (service, value) => {
    localStorage.setItem(`${service.toUpperCase()}_API_KEY`, value);
    setKeys(prev => ({ ...prev, [`${service}Key`]: value }));
  };

  const updatePreference = (pref, value) => {
    localStorage.setItem(pref.toUpperCase(), value);
    setPreferences(prev => ({ ...prev, [pref]: value }));
    
    // Apply theme
    if (pref === 'theme') {
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return { keys, updateKey, preferences, updatePreference };
}
