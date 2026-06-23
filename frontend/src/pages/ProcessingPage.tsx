import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Database, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

const ProcessingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Ingesting historical organizational records...", icon: <Database className="h-5 w-5 text-neonBlue" /> },
    { label: "Isolating seasonal trends and anomalies with IsolationForest...", icon: <BarChart3 className="h-5 w-5 text-neonPurple" /> },
    { label: "Compiling 6-month predictive ARIMA revenue forecasts...", icon: <TrendingUp className="h-5 w-5 text-emerald-400" /> },
    { label: "Generating strategic growth recommendations using Gemini...", icon: <Sparkles className="h-5 w-5 text-amber-400" /> }
  ];

  useEffect(() => {
    const intervals = [1500, 3000, 4800];
    const timers = intervals.map((time, idx) => 
      setTimeout(() => setActiveStep(idx + 1), time)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-darkBg flex flex-col justify-center items-center p-8 relative overflow-hidden">
      {/* Lights background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-neonBlue/10 to-neonPurple/10 rounded-full filter blur-[80px] -z-10"></div>

      {/* Main card panel */}
      <div className="glass-panel max-w-lg w-full rounded-2xl p-8 border border-darkBorder text-center shadow-2xl relative">
        {/* Animated glowing loader */}
        <div className="relative h-20 w-20 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-darkBorder"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-neonBlue border-r-neonPurple animate-spin shadow-neon"></div>
          <RefreshCw className="h-8 w-8 text-neonBlue animate-pulse" />
        </div>

        <h2 className="text-2xl font-extrabold font-outfit text-white tracking-wide">Executing Analytics Pipeline</h2>
        <p className="text-gray-400 text-xs mt-2 max-w-sm mx-auto">
          Our systems are crunching your numbers and communicating with the Gemini API to formulate strategic advice.
        </p>

        {/* Checkpoints list */}
        <div className="mt-8 space-y-4 text-left max-w-xs mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isActive = activeStep === idx;
            
            return (
              <div 
                key={idx} 
                className={`flex items-center space-x-3 transition-opacity duration-300 ${
                  isCompleted ? 'opacity-100' : isActive ? 'opacity-100 animate-pulse' : 'opacity-30'
                }`}
              >
                {isCompleted ? (
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-darkBorder flex items-center justify-center">
                    {step.icon}
                  </div>
                )}
                <span className={`text-xs font-semibold ${isActive ? 'text-white font-bold' : isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
