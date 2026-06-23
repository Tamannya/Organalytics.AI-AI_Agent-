import React, { useState, useEffect } from 'react';
import { LayoutGrid, Calendar, Trash2, ArrowRight, FileDown, Activity, Sparkles, FolderOpen } from 'lucide-react';
import { getUserReportsList, deleteReportDetails, exportReportPDF } from '../services/api';

interface HistoryPageProps {
  userId: number;
  onSelectReport: (reportId: number) => void;
  onNewAnalysis: () => void;
}

interface ReportItem {
  id: number;
  org_name: string;
  industry: string;
  size: string;
  created_at: string;
  kpis: {
    revenue: string;
    growth: string;
    efficiency: string;
    risk: string;
  };
}

const HistoryPage: React.FC<HistoryPageProps> = ({ userId, onSelectReport, onNewAnalysis }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReportsList = async () => {
    try {
      const data = await getUserReportsList(userId);
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports list history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsList();
  }, [userId]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this organizational report?")) return;
    
    setDeletingId(id);
    try {
      await deleteReportDetails(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete report.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = async (id: number, orgName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await exportReportPDF(id, orgName);
    } catch (err) {
      alert("Failed to download PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <span className="h-8 w-8 border-4 border-darkBorder border-t-neonBlue rounded-full animate-spin"></span>
          <span className="text-sm text-gray-500 font-semibold">Retrieving history records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-darkBorder/40 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold font-outfit text-white tracking-tight">Audit History</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and reload previous organizational audits</p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="px-5 py-2.5 bg-darkCard border border-darkBorder hover:border-neonBlue/40 text-gray-200 text-sm font-semibold rounded-xl transition-all duration-200"
        >
          Run New Analysis
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-darkBorder/50 p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="h-14 w-14 rounded-full bg-darkBorder/40 border border-darkBorder flex items-center justify-center text-gray-400 mx-auto">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-outfit font-bold text-white text-lg">No Previous Audits Found</h3>
            <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
              Start by submitting your organization requirements and metrics sheet to compile your first analytics dashboard.
            </p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-6 py-3 bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold rounded-xl text-sm shadow-neon hover:opacity-95 transition-opacity"
          >
            Create New Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => {
            const dateStr = new Date(report.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report.id)}
                className="glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-xl hover:border-neonBlue/30 hover:shadow-neon/5 cursor-pointer group transition-all duration-200 flex flex-col justify-between h-64"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-neonPurple bg-neonPurple/10 px-2.5 py-0.5 rounded-full border border-neonPurple/20 uppercase tracking-wider">{report.industry}</span>
                      <h3 className="font-outfit font-bold text-white text-lg mt-2 group-hover:text-neonBlue transition-colors truncate">{report.org_name}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  {/* Micro KPIs list */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-darkBorder/40 text-xs">
                    <div>
                      <span className="text-gray-500 block">Revenue</span>
                      <span className="text-gray-300 font-semibold mt-0.5 block">{report.kpis?.revenue || '$0'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Growth</span>
                      <span className="text-gray-300 font-semibold mt-0.5 block">{report.kpis?.growth || '0%'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Efficiency</span>
                      <span className="text-gray-300 font-semibold mt-0.5 block">{report.kpis?.efficiency || '0/100'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-darkBorder/40 mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleDownloadPDF(report.id, report.org_name, e)}
                      className="p-2 bg-darkBorder/40 hover:bg-darkBorder/80 border border-darkBorder hover:border-neonBlue/40 text-gray-400 hover:text-white rounded-lg transition-all"
                      title="Download PDF Report"
                    >
                      <FileDown className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      disabled={deletingId === report.id}
                      className="p-2 bg-darkBorder/40 hover:bg-rose-500/10 border border-darkBorder hover:border-rose-500/30 text-gray-400 hover:text-rose-400 rounded-lg transition-all"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-bold text-neonBlue group-hover:translate-x-1 transition-transform">
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
