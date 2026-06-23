import React from 'react';
import { Calendar, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  user: { name: string } | null;
}

const Header: React.FC<HeaderProps> = ({ title, user }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-darkCard/40 backdrop-blur-md border-b border-darkBorder/60 py-4 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold font-outfit text-white tracking-wide">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">AI-Powered Organizational Diagnostic</p>
      </div>

      <div className="flex items-center space-x-6">
        {/* Date */}
        <div className="flex items-center space-x-2 text-gray-400 text-xs font-medium">
          <Calendar className="h-4 w-4 text-neonBlue" />
          <span>{currentDate}</span>
        </div>

        {/* User badge */}
        {user && (
          <div className="flex items-center space-x-2 border border-darkBorder bg-darkBg/50 py-1.5 px-3 rounded-full text-xs font-semibold text-gray-300">
            <User className="h-3.5 w-3.5 text-neonPurple" />
            <span>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
