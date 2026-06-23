import React from 'react';
import { LayoutDashboard, History, PlusCircle, LogOut, BarChart3, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  return (
    <aside className="w-64 bg-darkCard border-r border-darkBorder flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand logo */}
        <div className="p-6 border-b border-darkBorder flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-neonBlue to-neonPurple flex items-center justify-center shadow-neon">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-lg text-white block tracking-wide">ORGANALYTICS</span>
            <span className="text-[10px] text-neonBlue font-mono font-bold tracking-widest uppercase">AI Engine</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('new-analysis')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === 'new-analysis'
                ? 'bg-gradient-to-r from-neonBlue/10 to-neonPurple/10 border-l-4 border-neonBlue text-white shadow-neon/5'
                : 'text-gray-400 hover:bg-darkBorder/30 hover:text-gray-200'
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === 'history' || activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-neonBlue/10 to-neonPurple/10 border-l-4 border-neonBlue text-white shadow-neon/5'
                : 'text-gray-400 hover:bg-darkBorder/30 hover:text-gray-200'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>My Dashboards</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-neonBlue/10 to-neonPurple/10 border-l-4 border-neonBlue text-white shadow-neon/5'
                : 'text-gray-400 hover:bg-darkBorder/30 hover:text-gray-200'
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            <span>How it Works</span>
          </button>
        </nav>
      </div>

      {/* User profile segment */}
      {user && (
        <div className="p-4 border-t border-darkBorder bg-darkBg/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center font-outfit font-bold text-white shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="font-semibold text-sm text-gray-200 block truncate leading-tight">{user.name}</span>
              <span className="text-xs text-gray-500 block truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-darkBorder hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-gray-400 text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
