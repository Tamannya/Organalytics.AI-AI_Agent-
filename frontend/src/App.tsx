import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import InputPage from './pages/InputPage';
import ProcessingPage from './pages/ProcessingPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import { getReportDetails, triggerAnalysis } from './services/api';
import { HelpCircle, RefreshCw, AlertCircle, PlayCircle, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  
  // Navigation states: landing, auth, new-analysis, processing, dashboard, history, about
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string>('');
  const [retryPayload, setRetryPayload] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Initialize user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setActiveTab('history');
    } else {
      setActiveTab('landing');
    }
  }, [token]);

  const handleAuthSuccess = (newToken: string, newUser: { id: number; name: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
    setActiveTab('history');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentReport(null);
    setActiveTab('landing');
  };

  // Run the full AI + statistics pipeline
  const handleTriggerAnalysis = async (payload: {
    orgName: string;
    industry: string;
    size: string;
    requirements: string;
    filePath?: string;
  }) => {
    setAnalysisError('');
    setRetryPayload(payload);
    setActiveTab('processing');

    try {
      const data = await triggerAnalysis(payload);
      setCurrentReport(data.report);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error("Analysis execution failed:", err);
      setAnalysisError(err.response?.data?.error || "Analytics engine encountered an unexpected error processing your parameters.");
      setActiveTab('error');
    }
  };

  // Fetch past report detail
  const handleSelectReport = async (reportId: number) => {
    setLoadingReport(true);
    setActiveTab('processing');
    try {
      const data = await getReportDetails(reportId);
      setCurrentReport(data);
      setActiveTab('dashboard');
    } catch (err) {
      alert("Failed to load report details. Please try again.");
      setActiveTab('history');
    } finally {
      setLoadingReport(false);
    }
  };

  // Render view helpers
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'new-analysis': return 'Audit Configuration';
      case 'dashboard': return 'Performance Insights';
      case 'history': return 'Saved Audits';
      case 'about': return 'Technical Architecture';
      default: return 'Organizational Insights';
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex font-sans">
      {/* 1. Unauthenticated screens */}
      {activeTab === 'landing' && (
        <div className="w-full">
          <LandingPage onStart={() => setToken(localStorage.getItem('token'))} />
        </div>
      )}

      {activeTab === 'landing' && !token && (
        <div className="w-full absolute inset-0 z-50">
          <LandingPage onStart={() => setActiveTab('auth')} />
        </div>
      )}

      {activeTab === 'auth' && (
        <div className="w-full">
          <AuthPage 
            onAuthSuccess={handleAuthSuccess} 
            onBack={() => setActiveTab('landing')} 
          />
        </div>
      )}

      {/* 2. Processing Screen (Fullscreen, no Sidebar) */}
      {activeTab === 'processing' && (
        <div className="w-full">
          <ProcessingPage />
        </div>
      )}

      {/* 3. Error Recovery Screen */}
      {activeTab === 'error' && (
        <div className="w-full min-h-screen flex flex-col justify-center items-center p-8 bg-darkBg">
          <div className="glass-panel max-w-md w-full rounded-2xl p-8 border border-darkBorder text-center space-y-6">
            <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-white text-lg">Analysis Pipeline Failed</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {analysisError}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('new-analysis')}
                className="flex-1 py-3 px-4 bg-darkCard border border-darkBorder hover:bg-darkBorder/40 text-gray-300 font-bold rounded-xl text-xs transition-colors"
              >
                Change Options
              </button>
              {retryPayload && (
                <button
                  onClick={() => handleTriggerAnalysis(retryPayload)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold rounded-xl text-xs shadow-neon transition-opacity"
                >
                  Retry Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Authenticated application layouts */}
      {token && ['new-analysis', 'dashboard', 'history', 'about'].includes(activeTab) && (
        <div className="flex w-full min-h-screen">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={user} 
            onLogout={handleLogout} 
          />
          
          <div className="flex-1 flex flex-col min-h-screen bg-darkBg">
            <Header title={getHeaderTitle()} user={user} />
            
            <main className="flex-grow">
              {activeTab === 'new-analysis' && (
                <InputPage 
                  onTriggerAnalysis={handleTriggerAnalysis} 
                  onBack={() => setActiveTab('history')} 
                />
              )}

              {activeTab === 'dashboard' && currentReport && (
                <DashboardPage report={currentReport} />
              )}

              {activeTab === 'history' && user && (
                <HistoryPage 
                  userId={user.id} 
                  onSelectReport={handleSelectReport} 
                  onNewAnalysis={() => setActiveTab('new-analysis')} 
                />
              )}

              {activeTab === 'about' && (
                <div className="max-w-4xl mx-auto p-8 space-y-8 animate-fade-in">
                  <div className="border-b border-darkBorder/40 pb-6">
                    <h2 className="text-3xl font-extrabold font-outfit text-white tracking-tight">How the Analytics Engine Works</h2>
                    <p className="text-sm text-gray-500 mt-1">Under the hood of the AI-powered diagnostics tool</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 space-y-4">
                      <div className="h-10 w-10 rounded-lg bg-neonBlue/10 flex items-center justify-center text-neonBlue">
                        <PlayCircle className="h-6 w-6" />
                      </div>
                      <h3 className="font-outfit font-bold text-white text-base">Ingestion & Standardisation</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-justify">
                        Upon CSV or Excel upload, the pandas layer scans column configurations, identifying synonyms for Dates, Revenues, Expenses, and Departments. If anomalies or missing metrics are detected, standard scaling distributions align the figures before passing data to the mathematical pipeline.
                      </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 space-y-4">
                      <div className="h-10 w-10 rounded-lg bg-neonPurple/10 flex items-center justify-center text-neonPurple">
                        <RefreshCw className="h-6 w-6" />
                      </div>
                      <h3 className="font-outfit font-bold text-white text-base">Anomaly Isolation Forest</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-justify">
                        Our scikit-learn anomaly sub-routine trains a multi-dimensional IsolationForest model on revenue vs. spending lines. Outliers with decision score coefficients deviating beyond typical seasonal ranges are flagged as system anomalies for root cause assessment.
                      </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 space-y-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <h3 className="font-outfit font-bold text-white text-base">ARIMA Forecasting</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-justify">
                        Using a statsmodels Holt-Winters Exponential Smoothing approach, our model decomposes historical trends, extracting linear increments and cyclical seasonality factors. It generates a 6-month predictive projection, overlaying 95% statistical confidence intervals.
                      </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-darkBorder/50 space-y-4">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <BarChart2 className="h-6 w-6" />
                      </div>
                      <h3 className="font-outfit font-bold text-white text-base">Gemini Report Synthesis</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-justify">
                        Calculated mathematical boundaries, drivers, and outlier metrics are serialized into structured JSON parameters. These are passed to Gemini 3.5 alongside the user's natural language requirements. Gemini structures the SWOT blocks, diagnostic reports, and compiles the prioritized recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
