import { Bell, Search, ShieldAlert, User, Menu } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-panel border-b border-gray-800">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg md:text-xl font-semibold text-white tracking-wide hidden sm:block">
          Indonesian <span className="text-accent">Cyber Threat Intel</span>
        </h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-mono text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="hidden sm:inline">SYSTEM ONLINE</span>
          <span className="sm:hidden">ONLINE</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <input 
            type="text" 
            placeholder="Search CVE, IP, Hash..." 
            className="w-64 bg-background border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-blue-400 flex items-center justify-center p-0.5 cursor-pointer">
            <div className="bg-panel w-full h-full rounded-full flex items-center justify-center text-accent">
               <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
