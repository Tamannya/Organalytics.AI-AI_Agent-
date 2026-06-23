import React from 'react';

export const KPISkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-darkCard/60 border border-darkBorder/50 rounded-2xl p-6 h-36 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-3.5 bg-darkBorder rounded w-1/2"></div>
              <div className="h-7 bg-darkBorder rounded w-3/4"></div>
            </div>
            <div className="h-10 w-10 bg-darkBorder rounded-xl"></div>
          </div>
          <div className="h-4 bg-darkBorder rounded w-4/5 pt-4"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-darkCard/60 border border-darkBorder/50 rounded-2xl p-6 h-96 flex flex-col justify-between animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 w-1/3">
          <div className="h-4 bg-darkBorder rounded w-3/4"></div>
          <div className="h-3 bg-darkBorder rounded w-1/2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-16 bg-darkBorder rounded-lg"></div>
          <div className="h-8 w-16 bg-darkBorder rounded-lg"></div>
        </div>
      </div>
      <div className="flex-1 bg-darkBorder/30 rounded-xl flex items-end justify-between p-4 space-x-4">
        {[20, 45, 30, 80, 50, 90, 65, 40, 75, 60, 85, 95].map((h, i) => (
          <div key={i} className="bg-darkBorder/60 rounded-t w-full" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  );
};

export const ReportSkeleton: React.FC = () => {
  return (
    <div className="bg-darkCard/60 border border-darkBorder/50 rounded-2xl p-6 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 bg-darkBorder rounded w-1/4"></div>
        <div className="h-3.5 bg-darkBorder rounded w-1/3"></div>
      </div>
      <div className="space-y-3 pt-4 border-t border-darkBorder/40">
        <div className="h-4 bg-darkBorder rounded w-full"></div>
        <div className="h-4 bg-darkBorder rounded w-full"></div>
        <div className="h-4 bg-darkBorder rounded w-5/6"></div>
        <div className="h-4 bg-darkBorder rounded w-11/12"></div>
        <div className="h-4 bg-darkBorder rounded w-3/4"></div>
      </div>
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-darkBorder rounded w-full"></div>
        <div className="h-4 bg-darkBorder rounded w-full"></div>
        <div className="h-4 bg-darkBorder rounded w-4/5"></div>
      </div>
    </div>
  );
};

interface FullDashboardSkeletonProps {
  className?: string;
}

export const FullDashboardSkeleton: React.FC<FullDashboardSkeletonProps> = () => {
  return (
    <div className="space-y-6 p-8">
      <KPISkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <ReportSkeleton />
        </div>
      </div>
    </div>
  );
};
