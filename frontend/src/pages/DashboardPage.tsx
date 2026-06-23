import React, { useState } from 'react';
import { 
  FileDown, TrendingUp, DollarSign, Activity, AlertTriangle, 
  HelpCircle, ChevronRight, CheckSquare, Award, ArrowUpRight, BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import KPICard from '../components/KPICard';
import { exportReportPDF } from '../services/api';

interface DashboardPageProps {
  report: {
    id: number;
    orgName: string;
    industry: string;
    size: string;
    created_at: string;
    report_json: {
      kpis: {
        revenue: string;
        growth: string;
        efficiency: string;
        risk: string;
      };
      charts: {
        trend: Array<{ date: string; revenue?: number; forecast?: number; ci_lower?: number; ci_upper?: number }>;
        department: Array<{ name: string; revenue: number; expenses: number }>;
        allocation: Array<{ name: string; value: number; percentage: number }>;
        anomaly: Array<{ metric: string; date: string; title: string; description: string }>;
        importance: Array<{ name: string; value: number }>;
      };
      anomalies: Array<{ metric: string; date: string; title: string; description: string }>;
      report_text: {
        executive_summary: string;
        performance_analysis: string;
        forecasting_analysis: string;
        anomaly_analysis: string;
        explainability_analysis: string;
        root_cause: string;
        risk_assessment: string;
        competitor_benchmarking: string;
      };
    };
    recommendations: Array<{
      title: string;
      description: string;
      priority_score: number;
      category: string;
    }>;
  };
}

const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

const DashboardPage: React.FC<DashboardPageProps> = ({ report }) => {
  const { orgName, industry, size, report_json, recommendations } = report;
  const kpis = report_json.kpis;
  const charts = report_json.charts;
  
  const [activeChartTab, setActiveChartTab] = useState<'trend' | 'dept' | 'alloc'>('trend');
  const [activeReportTab, setActiveReportTab] = useState<'exec' | 'perf' | 'root' | 'bench'>('exec');
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportReportPDF(report.id, orgName);
    } catch (err) {
      alert("Failed to export report to PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      {/* Header action panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-darkBorder/40 pb-6">
        <div>
          <span className="text-xs font-bold text-neonBlue uppercase tracking-wider font-mono">Analysis Report ID: #{report.id}</span>
          <h2 className="text-3xl font-extrabold font-outfit text-white tracking-tight mt-1">{orgName} Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Industry Context: <span className="text-gray-300 font-semibold">{industry}</span> • Size: <span className="text-gray-300 font-semibold">{size}</span>
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center space-x-2 py-3 px-6 bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-neon transition-opacity disabled:opacity-60"
        >
          {exporting ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Compiling PDF Report...</span>
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5" />
              <span>Download PDF Report</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Revenue (Analyzed Run)"
          value={kpis.revenue}
          description="Total aggregated annual income"
          icon={<DollarSign className="h-5 w-5" />}
          trend="positive"
        />
        <KPICard
          title="YoY Expansion"
          value={kpis.growth.replace(' YoY', '')}
          description="Rolling calendar growth rate"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={kpis.growth.includes('+') ? 'positive' : 'negative'}
          trendText={kpis.growth.split(' ')[0]}
        />
        <KPICard
          title="Efficiency Score"
          value={kpis.efficiency}
          description="Budget utility scale rating"
          icon={<Activity className="h-5 w-5" />}
          trend="positive"
        />
        <KPICard
          title="Risk Exposure Index"
          value={kpis.risk}
          description="Operational vulnerability metric"
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={kpis.risk.toLowerCase() === 'low' ? 'positive' : 'negative'}
        />
      </div>

      {/* Analytics Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Interactive Charts Tab panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-darkBorder/40 pb-4 mb-6 gap-3">
              <div>
                <h3 className="font-outfit font-bold text-white text-lg">Statistical Visualizations</h3>
                <p className="text-xs text-gray-500">Choose metric views of organizational records</p>
              </div>

              <div className="flex bg-darkBg/60 border border-darkBorder p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveChartTab('trend')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeChartTab === 'trend' ? 'bg-neonBlue/10 text-neonBlue border border-neonBlue/20' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Trend & Forecast
                </button>
                <button
                  onClick={() => setActiveChartTab('dept')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeChartTab === 'dept' ? 'bg-neonBlue/10 text-neonBlue border border-neonBlue/20' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Departments
                </button>
                <button
                  onClick={() => setActiveChartTab('alloc')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeChartTab === 'alloc' ? 'bg-neonBlue/10 text-neonBlue border border-neonBlue/20' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Allocation
                </button>
              </div>
            </div>

            {/* Chart Renders */}
            <div className="h-80 w-full">
              {activeChartTab === 'trend' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.trend} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4FACFE" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4FACFE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222F43" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151C2C', borderColor: '#222F43', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      name="Historical Revenue" 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4FACFE" 
                      strokeWidth={3} 
                      dot={{ r: 4, stroke: '#4FACFE', fill: '#0B0F19' }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      name="6-Month Projection" 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#00F2FE" 
                      strokeWidth={3} 
                      strokeDasharray="5 5" 
                      dot={{ r: 3, stroke: '#00F2FE', fill: '#0B0F19' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === 'dept' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.department} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222F43" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151C2C', borderColor: '#222F43', borderRadius: '12px' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar name="Revenue" dataKey="revenue" fill="#4FACFE" radius={[4, 4, 0, 0]} />
                    <Bar name="Expenses" dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === 'alloc' && (
                <div className="flex flex-col sm:flex-row items-center justify-around h-full">
                  <div className="h-60 w-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={charts.allocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {charts.allocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Custom legend detail */}
                  <div className="grid grid-cols-2 gap-3 text-xs w-full max-w-xs">
                    {charts.allocation.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5">
                        <span className="h-3 w-3 rounded-full block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        <div className="overflow-hidden">
                          <span className="text-gray-300 font-semibold block truncate">{item.name}</span>
                          <span className="text-gray-500 block">{item.percentage}% ({`$${(item.value / 1000).toFixed(0)}k`})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Anomaly list alerts */}
          <div className="glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-outfit font-bold text-white text-lg">Ingested Data Anomalies</h3>
              <p className="text-xs text-gray-500">Points of significant statistical variation from seasonal rolling medians</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {charts.anomaly.map((anom, idx) => (
                <div key={idx} className="border-l-4 border-rose-500 bg-rose-500/5 p-4 rounded-r-2xl border border-darkBorder flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">{anom.metric}</span>
                      <span className="text-xs text-gray-500">{anom.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-200 mt-2">{anom.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{anom.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Gemini Growth Report tabs */}
        <div>
          <div className="glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-xl flex flex-col h-[544px] justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-darkBorder/40 pb-4 mb-4">
                <div>
                  <h3 className="font-outfit font-bold text-white text-lg flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-neonBlue animate-pulse" />
                    <span>Gemini Strategic Report</span>
                  </h3>
                  <p className="text-xs text-gray-500">AI growth analysis context</p>
                </div>
              </div>

              {/* Navigation within report sections */}
              <div className="flex border-b border-darkBorder mb-4 text-xs font-semibold overflow-x-auto">
                <button
                  onClick={() => setActiveReportTab('exec')}
                  className={`pb-2 pr-3 transition-colors border-b-2 ${activeReportTab === 'exec' ? 'border-neonBlue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  Executive
                </button>
                <button
                  onClick={() => setActiveReportTab('perf')}
                  className={`pb-2 px-3 transition-colors border-b-2 ${activeReportTab === 'perf' ? 'border-neonBlue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  SWOT
                </button>
                <button
                  onClick={() => setActiveReportTab('root')}
                  className={`pb-2 px-3 transition-colors border-b-2 ${activeReportTab === 'root' ? 'border-neonBlue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  Root Cause
                </button>
                <button
                  onClick={() => setActiveReportTab('bench')}
                  className={`pb-2 pl-3 transition-colors border-b-2 ${activeReportTab === 'bench' ? 'border-neonBlue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  Benchmarks
                </button>
              </div>

              {/* Report content renderer */}
              <div className="text-xs text-gray-400 leading-relaxed overflow-y-auto h-80 pr-1 space-y-3 text-justify">
                {activeReportTab === 'exec' && (
                  <p>{report_json.report_text.executive_summary}</p>
                )}
                {activeReportTab === 'perf' && (
                  <>
                    <p>{report_json.report_text.performance_analysis}</p>
                    <div className="pt-2 border-t border-darkBorder/40">
                      <span className="font-bold text-gray-300 block mb-1">Risk Assessment:</span>
                      <p>{report_json.report_text.risk_assessment}</p>
                    </div>
                  </>
                )}
                {activeReportTab === 'root' && (
                  <>
                    <p>{report_json.report_text.root_cause}</p>
                    <div className="pt-2 border-t border-darkBorder/40">
                      <span className="font-bold text-gray-300 block mb-1">Anomaly Explanation:</span>
                      <p>{report_json.report_text.anomaly_analysis}</p>
                    </div>
                  </>
                )}
                {activeReportTab === 'bench' && (
                  <>
                    <p>{report_json.report_text.competitor_benchmarking}</p>
                    <div className="pt-2 border-t border-darkBorder/40">
                      <span className="font-bold text-gray-300 block mb-1">Forecast Metrics Context:</span>
                      <p>{report_json.report_text.forecasting_analysis}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer driver contributions summary */}
            <div className="border-t border-darkBorder/40 pt-4 text-[10px] text-gray-500">
              Generated dynamically via Gemini 3.5 Flash Model using ingested metrics.
            </div>
          </div>
        </div>

      </div>

      {/* Feature Importance & Actionable Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Explainability driver weights */}
        <div className="glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-xl">
          <div>
            <h3 className="font-outfit font-bold text-white text-lg">Statistical Explainability</h3>
            <p className="text-xs text-gray-500">Feature contributions to corporate output weights</p>
          </div>
          <div className="mt-6 space-y-4">
            {charts.importance.map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">{driver.name}</span>
                  <span className="text-neonBlue">{driver.value}%</span>
                </div>
                <div className="h-2 w-full bg-darkBg border border-darkBorder rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-neonBlue to-neonPurple rounded-full" 
                    style={{ width: `${driver.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Actionable Recommendations */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-outfit font-bold text-white text-lg flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-neonBlue" />
                <span>Actionable Recommendations</span>
              </h3>
              <p className="text-xs text-gray-500">Top prioritized growth tactics derived from analysis</p>
            </div>
            <span className="text-xs font-mono font-bold text-neonBlue bg-neonBlue/10 border border-neonBlue/20 px-3 py-1 rounded-lg">ROI Ordered</span>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start justify-between p-4 border border-darkBorder bg-darkBg/30 rounded-xl hover:border-darkBorder/80 transition-colors">
                <div className="flex items-start space-x-3.5 pr-4">
                  <div className="h-7 w-7 rounded-full bg-neonPurple/10 border border-neonPurple/20 text-neonPurple flex items-center justify-center font-bold text-xs font-outfit mt-0.5 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-gray-200">{rec.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400 bg-darkBorder/50 px-2 py-0.5 rounded-full uppercase tracking-wider">{rec.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed text-justify">{rec.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Priority</span>
                  <span className="text-sm font-bold text-neonBlue font-outfit mt-0.5 block">{rec.priority_score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
