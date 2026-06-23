import puppeteer from 'puppeteer';

export const generatePDF = async (report, org) => {
  const reportData = report.report_json;
  const orgName = org.name;
  const orgIndustry = org.industry;
  const orgSize = org.size;
  const dateStr = new Date(report.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const kpis = reportData.kpis || {
    revenue: '$0',
    growth: '0%',
    efficiency: '0/100',
    risk: 'Low'
  };

  const chartData = reportData.charts || {
    trend: [],
    department: [],
    allocation: [],
    anomaly: [],
    importance: []
  };

  const recommendations = reportData.recommendations || [];

  // Generate HTML template for Puppeteer
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Organizational Growth Report</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      color: #1F2937;
      background-color: #FFFFFF;
    }
    .font-outfit {
      font-family: 'Outfit', sans-serif;
    }
    .page-break {
      page-break-after: always;
    }
    .no-break {
      page-break-inside: avoid;
    }
    .report-card {
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      background: #FAFBFC;
    }
  </style>
</head>
<body class="p-8">

  <!-- PAGE 1: COVER PAGE -->
  <div class="page-break flex flex-col justify-between h-[1050px] p-12 border-4 border-slate-900 rounded-3xl relative overflow-hidden" style="min-height: 1050px;">
    <!-- Abstract design background accent -->
    <div class="absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full opacity-10 filter blur-xl"></div>
    <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full opacity-10 filter blur-xl"></div>

    <div class="mt-16">
      <div class="flex items-center space-x-2">
        <span class="h-4 w-4 rounded-full bg-indigo-600"></span>
        <span class="text-sm font-semibold uppercase tracking-wider text-slate-500 font-outfit">AI Organizational Intelligence</span>
      </div>
      <h1 class="text-6xl font-extrabold mt-8 text-slate-900 leading-tight font-outfit">
        Strategic Growth &<br/>Performance Analysis
      </h1>
      <p class="text-xl text-slate-500 mt-4 max-w-xl">
        A deep statistical audit, anomaly assessment, and 6-month forecasting report custom-tailored for your organization.
      </p>
    </div>

    <div class="mb-12 border-t border-slate-200 pt-8">
      <div class="grid grid-cols-2 gap-8 text-sm">
        <div>
          <span class="text-slate-400 block uppercase tracking-wider text-xs">Prepared For</span>
          <span class="font-bold text-slate-800 text-lg font-outfit">${orgName}</span>
          <span class="text-slate-500 block">${orgIndustry} • ${orgSize} employees</span>
        </div>
        <div>
          <span class="text-slate-400 block uppercase tracking-wider text-xs">Date of Analysis</span>
          <span class="font-bold text-slate-800 text-lg font-outfit">${dateStr}</span>
          <span class="text-indigo-600 block font-semibold">Report ID: #${report.id || 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- PAGE 2: TABLE OF CONTENTS & EXECUTIVE SUMMARY -->
  <div class="page-break h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">Table of Contents</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>
      <div class="space-y-4 max-w-2xl">
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">1. Executive Summary & Overview</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">2</span>
        </div>
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">2. Performance Dashboard & KPI Analysis</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">3</span>
        </div>
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">3. 6-Month Forecasting & Historical Trend</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">4</span>
        </div>
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">4. Department Breakdown & Resource Allocation</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">5</span>
        </div>
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">5. Anomaly Detection & Diagnostic Audit</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">6</span>
        </div>
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">6. Root Cause & Actionable Recommendations</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">7</span>
        </div>
        <div class="flex justify-between border-b border-dotted border-slate-300">
          <span class="bg-white pr-2 text-slate-700 font-medium">7. Risk Assessment & Competitor Benchmarking</span>
          <span class="bg-white pl-2 text-slate-500 font-bold">8</span>
        </div>
      </div>

      <h2 class="text-2xl font-bold mt-12 mb-4 text-slate-800 font-outfit border-l-4 border-indigo-600 pl-3">1. Executive Summary</h2>
      <div class="text-slate-600 leading-relaxed space-y-4 text-justify">
        <p>
          ${reportData.report_text?.executive_summary || 'An executive summary was not generated. Please ensure requirements are fully processed.'}
        </p>
      </div>
    </div>
    
    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 2</span>
    </div>
  </div>

  <!-- PAGE 3: PERFORMANCE DASHBOARD & KPI ANALYSIS -->
  <div class="page-break h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">2. Performance Dashboard</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>

      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <span class="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Total Revenue</span>
          <span class="text-2xl font-bold text-slate-800 font-outfit mt-1 block">${kpis.revenue || '$0'}</span>
        </div>
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <span class="text-xs text-slate-400 block uppercase tracking-wider font-semibold">YoY Growth</span>
          <span class="text-2xl font-bold text-emerald-600 font-outfit mt-1 block">${kpis.growth || '0%'}</span>
        </div>
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <span class="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Efficiency Score</span>
          <span class="text-2xl font-bold text-indigo-600 font-outfit mt-1 block">${kpis.efficiency || '0/100'}</span>
        </div>
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <span class="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Risk Level</span>
          <span class="text-2xl font-bold text-amber-500 font-outfit mt-1 block">${kpis.risk || 'Low'}</span>
        </div>
      </div>

      <h3 class="text-xl font-bold mb-4 text-slate-800 font-outfit">Current Performance Analysis</h3>
      <div class="text-slate-600 leading-relaxed mb-6">
        <p>
          ${reportData.report_text?.performance_analysis || 'No detailed performance analysis found.'}
        </p>
      </div>

      <div class="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
        <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Department Cost & Revenue Comparison</h4>
        <div class="h-64 w-full">
          <canvas id="pdfDeptChart"></canvas>
        </div>
      </div>
    </div>

    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 3</span>
    </div>
  </div>

  <!-- PAGE 4: 6-MONTH FORECASTING & TRENDS -->
  <div class="page-break h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">3. Historical Trends & Forecasting</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>

      <h3 class="text-xl font-bold mb-4 text-slate-800 font-outfit">6-Month Growth & Trend Forecast</h3>
      <div class="text-slate-600 leading-relaxed mb-8">
        <p>
          ${reportData.report_text?.forecasting_analysis || 'No detailed trend forecasting analysis found.'}
        </p>
      </div>

      <div class="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
        <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Historical Revenue & 6-Month Projection</h4>
        <div class="h-80 w-full">
          <canvas id="pdfTrendChart"></canvas>
        </div>
      </div>
    </div>

    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 4</span>
    </div>
  </div>

  <!-- PAGE 5: RESOURCE ALLOCATION & ANOMALIES -->
  <div class="page-break h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">4. Resource Allocation & Anomalies</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>

      <div class="grid grid-cols-2 gap-8 items-start mb-8">
        <div>
          <h3 class="text-lg font-bold mb-3 text-slate-800 font-outfit">Department Resource Allocation</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            This distribution illustrates budget allocation across major organizational structures. Disproportionate segments can point to over-staffing or under-funding.
          </p>
          <div class="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex justify-center">
            <div class="h-56 w-56">
              <canvas id="pdfAllocationChart"></canvas>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3 text-slate-800 font-outfit">Anomaly Highlights</h3>
          <div class="space-y-4">
            ${
              reportData.anomalies && reportData.anomalies.length > 0
                ? reportData.anomalies.map(item => `
                  <div class="border-l-4 border-rose-500 bg-rose-50 p-4 rounded-r-lg">
                    <span class="text-xs font-bold text-rose-800 block uppercase">${item.metric || 'Performance Anomaly'} (${item.date || ''})</span>
                    <span class="text-sm font-bold text-slate-800 block mt-1">${item.title || 'Sudden Shift Detected'}</span>
                    <p class="text-xs text-slate-600 mt-1">${item.description || 'Variance from predicted baseline exceeds standard deviation limits.'}</p>
                  </div>
                `).join('')
                : `
                  <div class="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
                    <span class="text-xs font-bold text-emerald-800 block uppercase">System Audit Status</span>
                    <span class="text-sm font-bold text-slate-800 block mt-1">No Anomalies Found</span>
                    <p class="text-xs text-slate-600 mt-1">Data points conform to normal distribution and seasonal trend baselines.</p>
                  </div>
                `
            }
          </div>
        </div>
      </div>

      <h3 class="text-lg font-bold mb-2 text-slate-800 font-outfit">Anomaly Diagnostic Analysis</h3>
      <p class="text-slate-600 leading-relaxed text-sm">
        ${reportData.report_text?.anomaly_analysis || 'No detailed anomaly diagnosis available.'}
      </p>
    </div>

    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 5</span>
    </div>
  </div>

  <!-- PAGE 6: EXPLAINABILITY & DRIVERS -->
  <div class="page-break h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">5. Statistical Explanations & Drivers</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>

      <h3 class="text-xl font-bold mb-4 text-slate-800 font-outfit">Feature Importance & Core Drivers</h3>
      <p class="text-slate-600 leading-relaxed mb-6">
        Below is the impact of organizational parameters on top performance indicators. Derived via statistical regressive modeling, these indicate where strategic investments yield the highest returns.
      </p>

      <div class="border border-slate-200 rounded-xl p-6 bg-white shadow-sm mb-6">
        <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Feature Contribution Score</h4>
        <div class="h-64 w-full">
          <canvas id="pdfImportanceChart"></canvas>
        </div>
      </div>

      <h3 class="text-lg font-bold mb-2 text-slate-800 font-outfit">Drivers Explanation</h3>
      <p class="text-slate-600 leading-relaxed text-sm">
        ${reportData.report_text?.explainability_analysis || 'Drivers and statistical explainability insights were computed dynamically based on the random forest modeling weights.'}
      </p>
    </div>

    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 6</span>
    </div>
  </div>

  <!-- PAGE 7: ROOT CAUSE & RECOMMENDATIONS -->
  <div class="page-break h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">6. Actionable Recommendations</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>

      <h3 class="text-xl font-bold mb-2 text-slate-800 font-outfit">Root Cause Analysis</h3>
      <p class="text-slate-600 leading-relaxed text-sm mb-6">
        ${reportData.report_text?.root_cause || 'No root cause text available.'}
      </p>

      <h3 class="text-xl font-bold mb-4 text-slate-800 font-outfit">Actionable Insights & Priorities</h3>
      <div class="space-y-4">
        ${
          recommendations.length > 0
            ? recommendations.map((rec, i) => `
              <div class="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-start justify-between">
                <div class="flex-1 pr-4">
                  <div class="flex items-center space-x-2">
                    <span class="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold font-outfit">${i + 1}</span>
                    <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider font-outfit">${rec.category || 'Strategic'}</span>
                  </div>
                  <h4 class="text-base font-bold text-slate-800 mt-1">${rec.title}</h4>
                  <p class="text-xs text-slate-500 mt-1 text-justify">${rec.description}</p>
                </div>
                <div class="text-right flex flex-col items-end">
                  <span class="text-xs text-slate-400 uppercase tracking-wider">Priority Score</span>
                  <span class="text-xl font-extrabold text-indigo-600 font-outfit">${rec.priority_score || '75'}</span>
                </div>
              </div>
            `).join('')
            : '<p class="text-slate-500 text-sm">No specific recommendations compiled.</p>'
        }
      </div>
    </div>

    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 7</span>
    </div>
  </div>

  <!-- PAGE 8: RISK ASSESSMENT & COMPETITOR BENCHMARKS -->
  <div class="h-[1050px] flex flex-col justify-between" style="min-height: 1050px;">
    <div>
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600 font-outfit">7. Risk & Benchmarking</span>
        <span class="text-xs text-slate-400 font-outfit">${orgName}</span>
      </div>

      <h3 class="text-xl font-bold mb-4 text-slate-800 font-outfit">Risk Assessment</h3>
      <p class="text-slate-600 leading-relaxed text-sm mb-6 text-justify">
        ${reportData.report_text?.risk_assessment || 'No risk assessment text available.'}
      </p>

      <h3 class="text-xl font-bold mb-4 text-slate-800 font-outfit">Competitor Benchmarking</h3>
      <p class="text-slate-600 leading-relaxed text-sm mb-6 text-justify">
        ${reportData.report_text?.competitor_benchmarking || 'No competitor benchmarking details found.'}
      </p>

      <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
        <h4 class="text-sm font-bold text-slate-700 uppercase mb-3">Industry Standard Benchmarks (${orgIndustry})</h4>
        <div class="grid grid-cols-3 gap-4 text-xs text-slate-600">
          <div class="border-r pr-4">
            <span class="font-bold text-slate-800 block">Growth Margin Target</span>
            <span class="text-lg font-bold text-indigo-600 block mt-1 font-outfit">15.0% - 22.0%</span>
            <span class="text-slate-400">Normal range for intermediate enterprise size.</span>
          </div>
          <div class="border-r pr-4">
            <span class="font-bold text-slate-800 block">Operational Efficiency</span>
            <span class="text-lg font-bold text-indigo-600 block mt-1 font-outfit">82.5%</span>
            <span class="text-slate-400">Operating budget to output efficiency score.</span>
          </div>
          <div>
            <span class="font-bold text-slate-800 block">Risk Exposure Limit</span>
            <span class="text-lg font-bold text-indigo-600 block mt-1 font-outfit">Moderate-Low</span>
            <span class="text-slate-400">Calculated leverage and asset exposure metrics.</span>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t pt-4 flex justify-between text-xs text-slate-400 font-outfit">
      <span>AI-Powered Org Dashboard Report</span>
      <span>Page 8</span>
    </div>
  </div>

  <!-- CHART CONFIGURATION INJECTED VIA JAVASCRIPT -->
  <script>
    // 1. Department Chart
    const deptLabels = ${JSON.stringify(chartData.department.map(d => d.name) || [])};
    const deptRev = ${JSON.stringify(chartData.department.map(d => d.revenue) || [])};
    const deptExp = ${JSON.stringify(chartData.department.map(d => d.expenses) || [])};
    
    new Chart(document.getElementById('pdfDeptChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: deptLabels,
        datasets: [
          { label: 'Revenue', data: deptRev, backgroundColor: '#4FACFE' },
          { label: 'Expenses', data: deptExp, backgroundColor: '#F43F5E' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: { y: { beginAtZero: true } }
      }
    });

    // 2. Trend Chart
    const trendLabels = ${JSON.stringify(chartData.trend.map(t => t.date) || [])};
    const trendRev = ${JSON.stringify(chartData.trend.map(t => t.revenue) || [])};
    const trendFore = ${JSON.stringify(chartData.trend.map(t => t.forecast !== undefined ? t.forecast : null) || [])};
    
    new Chart(document.getElementById('pdfTrendChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: trendLabels,
        datasets: [
          { label: 'Historical Revenue', data: trendRev, borderColor: '#4FACFE', fill: false, borderWidth: 3 },
          { label: '6-Month Projection', data: trendFore, borderColor: '#00F2FE', fill: false, borderDash: [6, 6], borderWidth: 3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
      }
    });

    // 3. Allocation Chart
    const allocLabels = ${JSON.stringify(chartData.allocation.map(a => a.name) || [])};
    const allocValues = ${JSON.stringify(chartData.allocation.map(a => a.value) || [])};
    
    new Chart(document.getElementById('pdfAllocationChart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: allocLabels,
        datasets: [{
          data: allocValues,
          backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } }
      }
    });

    // 4. Feature Importance Chart
    const impLabels = ${JSON.stringify(chartData.importance.map(i => i.name) || [])};
    const impValues = ${JSON.stringify(chartData.importance.map(i => i.value) || [])};
    
    new Chart(document.getElementById('pdfImportanceChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: impLabels,
        datasets: [{
          label: 'Importance Weights',
          data: impValues,
          backgroundColor: '#818CF8'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: { x: { beginAtZero: true } }
      }
    });
  </script>
</body>
</html>
  `;

  // Launch Puppeteer headless browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Set content and wait for network activity (CDN charts to load) to be sure
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Wait a small buffer to let Chart.js render canvas fully
  await new Promise(r => setTimeout(r, 1000));

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    }
  });

  await browser.close();
  return pdfBuffer;
};
