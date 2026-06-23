import React from 'react';
import { ArrowRight, BarChart3, LineChart, ShieldAlert, Cpu, FileDown, Layers } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-darkBg text-gray-200 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative neon lights background */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-neonBlue/10 to-transparent rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-neonPurple/10 to-transparent rounded-full filter blur-[120px] -z-10"></div>
      
      {/* Navbar branding */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-darkBorder/40">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-neonBlue to-neonPurple flex items-center justify-center shadow-neon">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-lg text-white block tracking-wide">ORGANALYTICS</span>
            <span className="text-[9px] text-neonBlue font-mono font-bold tracking-widest uppercase block">AI Audit Engine</span>
          </div>
        </div>
        <button
          onClick={onStart}
          className="px-5 py-2 rounded-xl bg-darkCard border border-darkBorder hover:border-neonBlue/40 text-gray-200 text-sm font-semibold transition-all duration-200"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center space-x-2 bg-darkCard/80 border border-darkBorder px-3.5 py-1.5 rounded-full text-xs font-semibold text-neonBlue">
            <span className="h-2 w-2 rounded-full bg-neonBlue animate-ping"></span>
            <span>Next-Generation Corporate Diagnostics</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-extrabold font-outfit text-white leading-tight">
            Transform Raw Data into <span className="text-gradient">Strategic Growth</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0">
            Upload your financial spreadsheet and describe your organizational goals. 
            Our Gemini-powered engine instantly models forecasts, isolates operational anomalies, and drafts exportable strategic audits.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold flex items-center justify-center space-x-3 shadow-neon hover:opacity-95 transition-all duration-200"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-darkCard border border-darkBorder hover:bg-darkBorder/40 text-gray-300 font-semibold transition-all duration-200"
            >
              Explore Sample Dashboard
            </button>
          </div>
        </div>

        {/* Feature Grid illustration */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl mx-auto">
          <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 shadow-neon/5 hover:translate-y-[-4px] transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-neonBlue/10 flex items-center justify-center text-neonBlue mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="font-outfit font-bold text-white text-base">Gemini Engine</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Extracts target business objectives, structures custom KPIs, and pens deep strategy text blocks using Gemini 3.5.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 shadow-neon/5 hover:translate-y-[-4px] transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-neonPurple/10 flex items-center justify-center text-neonPurple mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="font-outfit font-bold text-white text-base">ARIMA Forecasting</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Calculates 6-month metric projections with standard seasonal deviations and custom confidence bounds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 shadow-neon/5 hover:translate-y-[-4px] transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="font-outfit font-bold text-white text-base">Anomaly Isolation</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Leverages scikit-learn Isolation Forest classifiers to identify abnormal spending surges or metric contractions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 shadow-neon/5 hover:translate-y-[-4px] transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <FileDown className="h-6 w-6" />
            </div>
            <h3 className="font-outfit font-bold text-white text-base">Puppeteer PDF Reports</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Stitches charts, recommendations, and executive summaries into print-ready, branded PDF reports on request.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-darkBorder/30 py-8 bg-darkCard/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-neonBlue" />
            <span>AI Organizational Analytics Dashboard. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-neonBlue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neonBlue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neonBlue transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
