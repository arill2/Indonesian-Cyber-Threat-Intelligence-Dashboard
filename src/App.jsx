import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import ThreatFeed from './pages/ThreatFeed';
import LookupPage from './pages/LookupPage';
import Database from './pages/Database';
import Settings from './pages/Settings';
import CVEDetail from './pages/CVEDetail';

// Global Axios Interceptor to track API usage
axios.interceptors.request.use((config) => {
  if (config.url.includes('nvd.nist.gov') || config.url.includes('/api/')) {
    let hits = parseInt(localStorage.getItem('api_hits') || '0', 10);
    hits++;
    localStorage.setItem('api_hits', hits.toString());
    window.dispatchEvent(new Event('apiHit'));
  }
  return config;
});

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden w-full relative z-0">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6 flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/feed" element={<ThreatFeed />} />
                <Route path="/scanner" element={<LookupPage />} />
                <Route path="/database" element={<Database />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cve/:id" element={<CVEDetail />} />
              </Routes>
            </div>
            
            <footer className="mt-8 pt-6 pb-2 border-t border-gray-800/50 text-center text-sm text-gray-500">
               Developed by <span className="text-accent font-semibold tracking-wide">Muh Syahrir Hamdani</span> &copy; {new Date().getFullYear()}
            </footer>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
