import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  trendText?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, description, icon, trend = 'neutral', trendText }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'negative':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 glass-panel-hover shadow-neon/5 relative overflow-hidden">
      {/* Light accent bar at the top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neonBlue/40 to-transparent"></div>

      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">{title}</span>
          <span className="text-3xl font-extrabold font-outfit text-white block mt-2 tracking-tight">
            {value}
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-darkBorder/40 border border-darkBorder flex items-center justify-center text-neonBlue">
          {icon}
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-darkBorder/50">
        {trendText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTrendColor()}`}>
            {trendText}
          </span>
        )}
        <span className="text-xs text-gray-500 truncate">{description}</span>
      </div>
    </div>
  );
};

export default KPICard;
