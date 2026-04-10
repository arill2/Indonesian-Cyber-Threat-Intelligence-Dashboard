import { Activity, Database, LayoutDashboard, Settings, Shield, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    { name: 'Threat Feed', icon: <Activity className="w-5 h-5" />, path: '/feed' },
    { name: 'Scanner', icon: <Shield className="w-5 h-5" />, path: '/scanner' },
    { name: 'Database', icon: <Database className="w-5 h-5" />, path: '/database' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  const [apiHits, setApiHits] = useState(parseInt(localStorage.getItem('api_hits') || '0', 10));
  const API_LIMIT = 500; // Simulated safe threshold per session/day for free users

  useEffect(() => {
    const handleHit = () => {
      setApiHits(parseInt(localStorage.getItem('api_hits') || '0', 10));
    };
    window.addEventListener('apiHit', handleHit);
    return () => window.removeEventListener('apiHit', handleHit);
  }, []);

  const percentage = Math.min(100, Math.round((apiHits / API_LIMIT) * 100));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-panel border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-xl shadow-lg border border-gray-800" />
            <span className="font-bold text-xl tracking-wider text-white">ICT<span className="text-accent">ID</span></span>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-accent/10 text-accent font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </div>
            <span>{item.name}</span>
            {/* Show an active indicator bar on the left */}
            {window.location.pathname === item.path && (
               <div className="absolute left-0 w-1 h-8 bg-accent rounded-r-md"></div>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="bg-background rounded-lg p-4 border border-gray-800 text-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400">Total API Hits</p>
            <span className="text-xs text-accent font-mono">{apiHits} / {API_LIMIT}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mb-1 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-orange-500' : 'bg-accent'}`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-right mt-2">
             {percentage >= 100 ? "Limit Reached" : `${percentage}% Usage`}
          </p>
        </div>
      </div>
    </aside>
    </>
  );
}
