import { Layers, Settings, Bell, User, BookOpen, Terminal } from 'lucide-react';
import { WebFingerprint } from '../utils/fingerprint';

interface HeaderProps {
  readonly browserFingerprint: WebFingerprint | null;
}

export function Header({ browserFingerprint }: HeaderProps) {
  return (
    <header className="w-full border-b border-teal-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo and Primary Nav */}
        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center shadow-[0_0_24px_rgba(45,212,191,0.2)]">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              RAVEN-FS
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Docs
            </a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> API
            </a>
          </nav>
        </div>

        {/* Action Icons and Profile */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
          
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all rounded-full pl-2 pr-4 py-1.5">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Account</span>
          </button>
        </div>

      </div>
    </header>
  );
}
