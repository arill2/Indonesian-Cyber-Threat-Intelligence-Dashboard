import { Key, Moon, Sun, Bell, Shield, Info, Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Settings() {
  const { keys, updateKey, preferences, updatePreference } = useSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <SettingsIcon className="w-8 h-8 text-accent" />
        <h2 className="text-2xl font-bold text-white">App Configurations</h2>
      </div>

      {/* API Keys Section */}
      <div className="bg-card border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-white">API Keys (Local Storage)</h3>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Your keys are stored purely in your browser's local storage and are sent securely to Vercel functions as headers. Never share them.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">VirusTotal API Key</label>
            <input 
              type="password" 
              value={keys.vtKey}
              onChange={(e) => updateKey('vt', e.target.value)}
              placeholder="Enter your VirusTotal Key (Optional if server .env is set)"
              className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Groq API Key</label>
            <input 
              type="password" 
              value={keys.groqKey}
              onChange={(e) => updateKey('groq', e.target.value)}
              placeholder="Enter your Groq Key (For AI Analysis)"
              className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">NVD API Key</label>
            <input 
              type="password" 
              value={keys.nvdKey}
              onChange={(e) => updateKey('nvd', e.target.value)}
              placeholder="Enter your NVD Key (For higher rate limits)"
              className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Theme Preference</h3>
          </div>
          <div className="flex bg-background border border-gray-700 rounded-lg p-1">
            <button 
              onClick={() => updatePreference('theme', 'dark')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${preferences.theme === 'dark' ? 'bg-panel text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
            <button 
              onClick={() => updatePreference('theme', 'light')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${preferences.theme === 'light' ? 'bg-panel text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Sun className="w-4 h-4" /> Light (Coming Soon)
            </button>
          </div>
        </div>

        <div className="bg-card border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Severity Alert</label>
          <select 
            value={preferences.minSeverity}
            onChange={(e) => updatePreference('minSeverity', e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent"
          >
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High and Above</option>
            <option value="MEDIUM">Medium and Above</option>
            <option value="LOW">All Alerts (Low and Above)</option>
          </select>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-card border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">About Project</h3>
        </div>
        <div className="text-sm text-gray-400 space-y-2">
          <p><strong className="text-white">Indonesian Cyber Threat Intelligence Dashboard</strong> — A portfolio project for cyber threat mitigation and open source intel.</p>
          <p>Powered by Vite, React, Tailwind, Vercel Serverless, NIST NVD API, VirusTotal, and Groq Llama-3.1.</p>
        </div>
      </div>
    </div>
  );
}


