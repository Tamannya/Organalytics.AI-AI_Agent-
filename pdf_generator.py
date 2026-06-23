import os
import asyncio
from datetime import datetime
from pyppeteer import launch

def generate_pdf_html(data):
    """
    Generates a visually rich, clean, 5-page HTML template for professional style strategy reports.
    Applies the user's custom CSS theme variables.
    """
    org_name = data.get("orgName", "Organization")
    industry = data.get("industry", "General")
    size = data.get("size", "Medium")
    kpis = data.get("kpis", {})
    recommendations = data.get("recommendations", [])
    anomalies = data.get("anomalies", [])
    report_text = data.get("report_text", {})
    charts = data.get("charts", {})
    theme = data.get("theme", {})

    # Extract theme colors
    primary = theme.get("primary", "#7C6FFF")
    accent = theme.get("accent", "#8DA8FF")
    bg = theme.get("bg", "#0F0F1A")
    card_bg = theme.get("cardBg", "#16162A")
    text_primary = theme.get("textPrimary", "#FFFFFF")
    text_secondary = theme.get("textSecondary", "#9CA3AF")
    border = theme.get("border", "#2D2D44")

    # Split paragraphs by sentences for insights
    perf_text = report_text.get("performance_analysis", "")
    perf_bullets = [s.strip() + "." for s in perf_text.split('.') if len(s.strip()) > 10][:3]
    while len(perf_bullets) < 3:
        perf_bullets.append("Core operations maintain performance standard alignment.")

    explain_text = report_text.get("explainability_analysis", "") or report_text.get("root_cause", "")
    explain_bullets = [s.strip() + "." for s in explain_text.split('.') if len(s.strip()) > 10][:3]
    while len(explain_bullets) < 3:
        explain_bullets.append("Key features correlate strongly to primary organizational results.")

    # Parse SWOT lists
    def parse_swot(text):
        bullets = [s.replace('•', '').strip() for s in text.split('\n') if s.strip()]
        return bullets[:3]

    strengths = parse_swot(report_text.get("swot_strengths", "• Robust core revenue stream\n• Lean administrative overhead\n• Flexible operational capabilities"))
    weaknesses = parse_swot(report_text.get("swot_weaknesses", "• Customer acquisition cost margins\n• Technology skill silos\n• CRM conversion bottleneck"))
    opportunities = parse_swot(report_text.get("swot_opportunities", "• Reallocate low-performing budget\n• Introduce lead scoring automation\n• Contract vendor resource balance"))
    threats = parse_swot(report_text.get("swot_threats", "• Attrition of senior technical staff\n• Competitive sector customer churn\n• Rising supply line dependencies"))

    # Map Risk Level to meter percentage
    risk_level = kpis.get("risk", "Low").strip().lower()
    risk_pct = 20
    risk_color = "#10B981"
    if "mod" in risk_level:
        risk_pct = 50
        risk_color = "#F59E0B"
    elif "high" in risk_level or "crit" in risk_level:
        risk_pct = 80
        risk_color = "#EF4444"

    # Compile recommendations (limit to 5)
    rec_cards_html = ""
    category_colors = {
        "marketing": "#3B82F6",
        "sales": "#10B981",
        "operations": "#F59E0B",
        "hr": "#8B5CF6",
        "finance": "#EC4899",
        "general": "#6B7280"
    }

    for idx, rec in enumerate(recommendations[:5]):
        cat = rec.get("category", "General").lower()
        cat_color = category_colors.get(cat, category_colors["general"])
        score = int(rec.get("priority_score", 70))
        
        rec_cards_html += f"""
        <div class="rec-card" style="border-left: 5px solid {cat_color};">
            <div class="rec-header">
                <span class="rec-badge" style="background-color: {cat_color}20; color: {cat_color};">{idx+1}</span>
                <span class="rec-title">{rec.get('title', 'Strategic Action Item')}</span>
                <span class="rec-category-tag" style="border: 1px solid {cat_color}40; color: {cat_color};">{rec.get('category', 'GENERAL')}</span>
            </div>
            <p class="rec-desc">{rec.get('description', '')}</p>
            <div class="progress-container">
                <span class="progress-label">Priority Impact</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: {score}%; background-color: {cat_color};"></div>
                </div>
                <span class="progress-val">{score}/100</span>
            </div>
        </div>
        """

    # Parse anomalies list (limit to 4)
    anomalies_html = ""
    for idx, anom in enumerate(anomalies[:4]):
        # Negative anomalies get red, positive green
        val_str = str(anom.get("value", "0"))
        is_neg = "-" in val_str or "negative" in val_str.lower() or "alert" in val_str.lower()
        border_color = "#EF4444" if is_neg else "#10B981"
        bg_tint = "#EF44440a" if is_neg else "#10B9810a"
        
        anomalies_html += f"""
        <div class="anomaly-card" style="border-left: 4px solid {border_color}; background-color: {bg_tint};">
            <div class="anomaly-header">
                <span class="anomaly-metric" style="color: {border_color};">{anom.get('metric', 'Metric')}</span>
                <span class="anomaly-date">{anom.get('date', 'N/A')}</span>
            </div>
            <div class="anomaly-body">
                <h4 class="anomaly-title">{anom.get('title', 'Variance Alert')}</h4>
                <p class="anomaly-desc">{anom.get('description', '')}</p>
            </div>
        </div>
        """
    if not anomalies_html:
        anomalies_html = "<div class='no-anom'>No significant mathematical anomalies detected in this ledger run.</div>"

    current_date = datetime.now().strftime("%B %d, %Y")

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
            :root {{
                --primary: {primary};
                --accent: {accent};
                --bg: {bg};
                --card-bg: {card_bg};
                --text-primary: {text_primary};
                --text-secondary: {text_secondary};
                --border: {border};
            }}
            * {{
                box-sizing: border-box;
                -webkit-print-color-adjust: exact;
            }}
            body {{
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text-primary);
                margin: 0;
                padding: 0;
                font-size: 11px;
                line-height: 1.4;
            }}
            .page-break {{
                page-break-before: always;
                break-before: page;
                height: 0;
                margin: 0;
                border: 0;
            }}
            .page {{
                width: 100%;
                height: 257mm; /* Printable A4 minus margins */
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-bottom: 5mm;
            }}
            .header-bar {{
                height: 8mm;
                background-color: var(--primary);
                width: 100%;
                margin-bottom: 8mm;
            }}
            .footer-bar {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid var(--border);
                padding-top: 3mm;
                margin-top: auto;
                font-size: 9px;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            .logo-text {{
                font-family: 'Outfit', sans-serif;
                font-weight: 800;
                color: var(--primary);
                letter-spacing: 0.5px;
            }}
            
            /* Page 1 Styles */
            .cover-container {{
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-grow: 1;
                padding: 0 10mm;
            }}
            .cover-title {{
                font-family: 'Outfit', sans-serif;
                font-size: 32px;
                font-weight: 800;
                line-height: 1.1;
                color: var(--text-primary);
                margin-bottom: 2mm;
                letter-spacing: -0.5px;
            }}
            .cover-subtitle {{
                font-size: 14px;
                color: var(--text-secondary);
                margin-bottom: 12mm;
            }}
            .meta-grid {{
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 4mm;
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
                padding: 6mm 0;
                margin-bottom: 12mm;
            }}
            .meta-item span {{
                display: block;
            }}
            .meta-label {{
                font-size: 9px;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 1mm;
            }}
            .meta-val {{
                font-size: 13px;
                font-weight: 700;
                color: var(--text-primary);
            }}
            .kpis-grid-2x2 {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5mm;
                margin-bottom: 12mm;
            }}
            .kpi-box {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 5mm;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }}
            .kpi-title {{
                font-size: 10px;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 600;
            }}
            .kpi-val {{
                font-size: 22px;
                font-weight: 800;
                font-family: 'Outfit', sans-serif;
                margin-top: 1.5mm;
                color: var(--text-primary);
            }}
            .kpi-delta {{
                font-size: 10px;
                font-weight: 700;
                padding: 0.5mm 2mm;
                border-radius: 99px;
            }}
            .kpi-delta.pos {{
                background-color: rgba(16, 185, 129, 0.1);
                color: #10B981;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }}
            .kpi-delta.neg {{
                background-color: rgba(239, 68, 68, 0.1);
                color: #EF4444;
                border: 1px solid rgba(239, 68, 68, 0.2);
            }}
            .kpi-delta.info {{
                background-color: rgba(124, 111, 255, 0.1);
                color: var(--primary);
                border: 1px solid rgba(124, 111, 255, 0.2);
            }}
            .cover-summary-block {{
                border-left: 3px solid var(--primary);
                padding-left: 4mm;
                margin-bottom: auto;
            }}
            .cover-summary-block p {{
                font-size: 12px;
                color: var(--text-secondary);
                line-height: 1.5;
                margin: 0;
            }}

            /* General Page Layouts */
            .section-header {{
                border-bottom: 2px solid var(--primary);
                padding-bottom: 2mm;
                margin-bottom: 5mm;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }}
            .section-title {{
                font-family: 'Outfit', sans-serif;
                font-size: 16px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-primary);
                margin: 0;
            }}
            .section-subtitle {{
                font-size: 10px;
                color: var(--text-secondary);
                margin: 0;
            }}
            
            /* Page 2 Diagnostics */
            .main-chart-container {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 4mm;
                text-align: center;
                margin-bottom: 4mm;
            }}
            .main-chart-img {{
                width: 100%;
                height: 52mm;
                object-fit: contain;
            }}
            .bullets-container {{
                margin-bottom: 5mm;
            }}
            .bullets-title {{
                font-size: 11px;
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: 2mm;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            ul.report-bullets {{
                margin: 0;
                padding-left: 5mm;
            }}
            ul.report-bullets li {{
                color: var(--text-secondary);
                margin-bottom: 1.5mm;
                line-height: 1.4;
            }}
            .side-charts-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5mm;
            }}
            .side-chart-box {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 4mm;
                text-align: center;
            }}
            .side-chart-img {{
                width: 100%;
                height: 38mm;
                object-fit: contain;
            }}
            .chart-caption {{
                font-size: 9px;
                color: var(--text-secondary);
                margin-top: 2mm;
                display: block;
                font-style: italic;
            }}

            /* Page 3 Anomalies */
            .anomaly-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4mm;
                margin-bottom: 5mm;
            }}
            .anomaly-card {{
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 4mm;
            }}
            .anomaly-header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border);
                padding-bottom: 1.5mm;
                margin-bottom: 2mm;
            }}
            .anomaly-metric {{
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            .anomaly-date {{
                font-size: 9px;
                color: var(--text-secondary);
            }}
            .anomaly-title {{
                font-size: 11px;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0;
            }}
            .anomaly-desc {{
                font-size: 10px;
                color: var(--text-secondary);
                margin: 1mm 0 0 0;
                line-height: 1.3;
            }}
            .no-anom {{
                grid-column: span 2;
                text-align: center;
                color: var(--text-secondary);
                padding: 10mm;
                border: 1px dashed var(--border);
                border-radius: 8px;
            }}

            /* Page 4 SWOT & Risk */
            .swot-grid-2x2 {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                gap: 4mm;
                margin-bottom: 6mm;
            }}
            .swot-card {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 4mm;
            }}
            .swot-card-title {{
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 2mm;
                display: block;
            }}
            .swot-card ul {{
                margin: 0;
                padding-left: 4mm;
            }}
            .swot-card li {{
                margin-bottom: 1.5mm;
                line-height: 1.3;
                color: var(--text-secondary);
            }}
            .risk-meter-container {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 5mm;
            }}
            .risk-meter-title-row {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 3mm;
            }}
            .risk-title {{
                font-size: 11px;
                font-weight: 700;
                color: var(--text-primary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            .risk-level-badge {{
                font-size: 9px;
                font-weight: 700;
                padding: 0.5mm 2.5mm;
                border-radius: 4px;
                text-transform: uppercase;
                color: #FFF;
            }}
            .risk-gauge-bg {{
                height: 4mm;
                background: linear-gradient(to right, #10B981 0%, #10B981 33%, #F59E0B 33%, #F59E0B 66%, #EF4444 66%, #EF4444 100%);
                border-radius: 99px;
                position: relative;
                margin-bottom: 4mm;
            }}
            .risk-gauge-pin {{
                position: absolute;
                top: -1.5mm;
                width: 4px;
                height: 7mm;
                background-color: var(--text-primary);
                border-radius: 99px;
                box-shadow: 0 0 4px rgba(0,0,0,0.5);
            }}
            .risk-narrative {{
                font-size: 10px;
                color: var(--text-secondary);
                line-height: 1.4;
                margin: 0;
            }}

            /* Page 5 Recommendations */
            .rec-list {{
                display: flex;
                flex-direction: column;
                gap: 3mm;
                margin-bottom: 5mm;
            }}
            .rec-card {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 3.5mm;
            }}
            .rec-header {{
                display: flex;
                align-items: center;
                gap: 2.5mm;
                margin-bottom: 1.5mm;
            }}
            .rec-badge {{
                width: 5mm;
                height: 5mm;
                border-radius: 99px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
            }}
            .rec-title {{
                font-size: 11px;
                font-weight: 700;
                color: var(--text-primary);
                flex-grow: 1;
            }}
            .rec-category-tag {{
                font-size: 8px;
                font-weight: 700;
                padding: 0.2mm 1.5mm;
                border-radius: 99px;
                text-transform: uppercase;
            }}
            .rec-desc {{
                font-size: 10px;
                color: var(--text-secondary);
                margin: 0 0 2mm 0;
                line-height: 1.3;
            }}
            .progress-container {{
                display: flex;
                align-items: center;
                gap: 3mm;
                font-size: 9px;
            }}
            .progress-label {{
                color: var(--text-secondary);
                width: 20mm;
            }}
            .progress-bar-bg {{
                height: 1.5mm;
                background-color: rgba(255,255,255,0.06);
                border-radius: 99px;
                flex-grow: 1;
                overflow: hidden;
            }}
            .progress-bar-fill {{
                height: 100%;
                border-radius: 99px;
            }}
            .progress-val {{
                font-weight: 700;
                color: var(--text-primary);
                width: 10mm;
                text-align: right;
            }}
            .next-steps-container {{
                background-color: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 4mm;
            }}
            .next-steps-title {{
                font-size: 11px;
                font-weight: 700;
                color: var(--text-primary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 2.5mm;
            }}
            .next-steps-list {{
                display: flex;
                flex-direction: column;
                gap: 2mm;
            }}
            .next-step-item {{
                display: flex;
                gap: 3mm;
                font-size: 10px;
                line-height: 1.3;
            }}
            .next-step-num {{
                font-weight: 700;
                color: var(--primary);
            }}
            .next-step-text {{
                color: var(--text-secondary);
            }}
        </style>
    </head>
    <body>

        <!-- PAGE 1: COVER -->
        <div class="page" id="page-1">
            <div class="header-bar"></div>
            
            <div class="cover-container">
                <h1 class="cover-title">{org_name.upper()}</h1>
                <div class="cover-subtitle">Strategic Organizational Growth & Operational Audit Report</div>
                
                <div class="meta-grid">
                    <div class="meta-item">
                        <span class="meta-label">Industry Sector</span>
                        <span class="meta-val">{industry}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Headcount Scale</span>
                        <span class="meta-val">{size}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Audit Date</span>
                        <span class="meta-val">{current_date}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Generated By</span>
                        <span class="meta-val logo-text">Organalytics</span>
                    </div>
                </div>
                
                <div class="kpis-grid-2x2">
                    <div class="kpi-box">
                        <div>
                            <span class="kpi-title">Revenue Pool</span>
                            <div class="kpi-val">{kpis.get('revenue', '$0')}</div>
                        </div>
                        <span class="kpi-delta info">AUDITED</span>
                    </div>
                    <div class="kpi-box">
                        <div>
                            <span class="kpi-title">YoY Expansion</span>
                            <div class="kpi-val">{kpis.get('growth', '0%')}</div>
                        </div>
                        <span class="kpi-delta pos">+GROWTH</span>
                    </div>
                    <div class="kpi-box">
                        <div>
                            <span class="kpi-title">Efficiency Rating</span>
                            <div class="kpi-val">{kpis.get('efficiency', '0/100')}</div>
                        </div>
                        <span class="kpi-delta info">INDEX</span>
                    </div>
                    <div class="kpi-box">
                        <div>
                            <span class="kpi-title">Operational Risk</span>
                            <div class="kpi-val" style="text-transform: capitalize;">{kpis.get('risk', 'Low')}</div>
                        </div>
                        <span class="kpi-delta neg" style="background-color: {risk_color}1a; color: {risk_color}; border-color: {risk_color}2b;">{kpis.get('risk', 'Low').upper()}</span>
                    </div>
                </div>
                
                <div class="cover-summary-block">
                    <p>{report_text.get('executive_summary', 'AI-driven diagnostic calculations performed on target operations ledger.')}</p>
                </div>
            </div>

            <div class="footer-bar" style="padding-left: 10px; padding-right: 10px;">
                <span>Confidential</span>
                <span>AI-Generated Executive Summary Report</span>
                <span>Page 1 of 5</span>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 2: DIAGNOSTICS -->
        <div class="page" id="page-2">
            <div class="header-bar"></div>
            
            <div style="padding: 0 10mm; flex-grow: 1; display: flex; flex-direction: column;">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">01 / Performance Diagnostics</h2>
                        <span class="section-subtitle">Aggregate Revenue Trends & Departmental Cost Allocation</span>
                    </div>
                </div>
                
                <div class="main-chart-container">
                    <span class="bullets-title" style="margin-bottom: 1.5mm; display: block;">Ingested Revenue & 6-Month ARIMA Projection</span>
                    <img src="{charts.get('trend', '')}" class="main-chart-img" alt="Revenue Trend Chart" />
                </div>
                
                <div class="bullets-container">
                    <span class="bullets-title">Key Trend Analytics Takeaways</span>
                    <ul class="report-bullets">
                        <li>{perf_bullets[0]}</li>
                        <li>{perf_bullets[1]}</li>
                        <li>{perf_bullets[2]}</li>
                    </ul>
                </div>
                
                <div class="side-charts-grid">
                    <div class="side-chart-box">
                        <img src="{charts.get('dept', '')}" class="side-chart-img" alt="Dept Performance Chart" />
                        <span class="chart-caption">Fig 2.1: Departmental budget expenditures relative to generated revenue.</span>
                    </div>
                    <div class="side-chart-box">
                        <img src="{charts.get('alloc', '')}" class="side-chart-img" alt="Resource Allocation Chart" />
                        <span class="chart-caption">Fig 2.2: Overall resource allocation shares compiled across operations.</span>
                    </div>
                </div>
            </div>

            <div class="footer-bar" style="padding-left: 10px; padding-right: 10px;">
                <span>{org_name} Diagnostics</span>
                <span class="logo-text">Organalytics</span>
                <span>Page 2 of 5</span>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 3: ANOMALIES -->
        <div class="page" id="page-3">
            <div class="header-bar"></div>
            
            <div style="padding: 0 10mm; flex-grow: 1; display: flex; flex-direction: column;">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">02 / Mathematical Outliers & Explainability</h2>
                        <span class="section-subtitle">Mathematical Z-Score Outliers & Explainable SHAP Features</span>
                    </div>
                </div>
                
                <div class="bullets-title" style="margin-bottom: 2.5mm;">Detected Ledger Deviations & Variance Logs</div>
                <div class="anomaly-grid">
                    {anomalies_html}
                </div>
                
                <div class="main-chart-container" style="margin-top: 2mm;">
                    <span class="bullets-title" style="margin-bottom: 1.5mm; display: block;">Explainable AI: Feature Importance Correlations</span>
                    <img src="{charts.get('explain', '')}" class="main-chart-img" style="height: 48mm;" alt="Feature Importance Chart" />
                </div>
                
                <div class="bullets-container" style="margin-top: 2mm; margin-bottom: 0;">
                    <span class="bullets-title">Explainability & Correlation Takeaways</span>
                    <ul class="report-bullets">
                        <li>{explain_bullets[0]}</li>
                        <li>{explain_bullets[1]}</li>
                        <li>{explain_bullets[2]}</li>
                    </ul>
                </div>
            </div>

            <div class="footer-bar" style="padding-left: 10px; padding-right: 10px;">
                <span>{org_name} Anomalies</span>
                <span class="logo-text">Organalytics</span>
                <span>Page 3 of 5</span>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 4: SWOT & RISK -->
        <div class="page" id="page-4">
            <div class="header-bar"></div>
            
            <div style="padding: 0 10mm; flex-grow: 1; display: flex; flex-direction: column;">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">03 / SWOT Matrix & Risk Assessment</h2>
                        <span class="section-subtitle">Internal SWOT Quadrants & Overall Operational Leverage Meter</span>
                    </div>
                </div>
                
                <div class="swot-grid-2x2">
                    <div class="swot-card" style="border-top: 4px solid #10B981;">
                        <span class="swot-card-title" style="color: #10B981;">Strengths (Internal)</span>
                        <ul>
                            <li>{strengths[0] if len(strengths)>0 else "Robust revenue generation capacity"}</li>
                            <li>{strengths[1] if len(strengths)>1 else "High operational efficiency standards"}</li>
                            <li>{strengths[2] if len(strengths)>2 else "Strong brand presence in key sectors"}</li>
                        </ul>
                    </div>
                    <div class="swot-card" style="border-top: 4px solid #EF4444;">
                        <span class="swot-card-title" style="color: #EF4444;">Weaknesses (Internal)</span>
                        <ul>
                            <li>{weaknesses[0] if len(weaknesses)>0 else "Customer acquisition margin overhead"}</li>
                            <li>{weaknesses[1] if len(weaknesses)>1 else "Dependencies in single employee silos"}</li>
                            <li>{weaknesses[2] if len(weaknesses)>2 else "Operational bottlenecks in conversion"}</li>
                        </ul>
                    </div>
                    <div class="swot-card" style="border-top: 4px solid #3B82F6;">
                        <span class="swot-card-title" style="color: #3B82F6;">Opportunities (External)</span>
                        <ul>
                            <li>{opportunities[0] if len(opportunities)>0 else "Expand into adjacent industry sectors"}</li>
                            <li>{opportunities[1] if len(opportunities)>1 else "Automate repetitive processing workflows"}</li>
                            <li>{opportunities[2] if len(opportunities)>2 else "Reallocate budgets to high margin lines"}</li>
                        </ul>
                    </div>
                    <div class="swot-card" style="border-top: 4px solid #F59E0B;">
                        <span class="swot-card-title" style="color: #F59E0B;">Threats (External)</span>
                        <ul>
                            <li>{threats[0] if len(threats)>0 else "Increasing competition in core markets"}</li>
                            <li>{threats[1] if len(threats)>1 else "Rising supply chain logistics expenses"}</li>
                            <li>{threats[2] if len(threats)>2 else "Loss of critical technical talent assets"}</li>
                        </ul>
                    </div>
                </div>
                
                <div class="risk-meter-container">
                    <div class="risk-meter-title-row">
                        <span class="risk-title">Operational Risk Profile Meter</span>
                        <span class="risk-level-badge" style="background-color: {risk_color};">{kpis.get('risk', 'Low')} Risk</span>
                    </div>
                    
                    <div class="risk-gauge-bg">
                        <div class="risk-gauge-pin" style="left: calc({risk_pct}% - 2px);"></div>
                    </div>
                    
                    <p class="risk-narrative">
                        <strong>Narrative Assessment:</strong> {report_text.get('risk_assessment', 'Current organizational audit reflects minimal leveraged threats. Supply chain indicators remain stable, and capital efficiency exceeds baseline requirements. Periodic diagnostic runs are advised.')}
                    </p>
                </div>
            </div>

            <div class="footer-bar" style="padding-left: 10px; padding-right: 10px;">
                <span>{org_name} Risks</span>
                <span class="logo-text">Organalytics</span>
                <span>Page 4 of 5</span>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 5: RECOMMENDATIONS -->
        <div class="page" id="page-5">
            <div class="header-bar"></div>
            
            <div style="padding: 0 10mm; flex-grow: 1; display: flex; flex-direction: column;">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">04 / Strategic Growth Roadmap</h2>
                        <span class="section-subtitle">Recommended Actions & Next Steps (30-Day Checklist)</span>
                    </div>
                </div>
                
                <div class="rec-list">
                    {rec_cards_html}
                </div>
                
                <div class="next-steps-container" style="margin-top: auto;">
                    <div class="next-steps-title">Immediate Wins (Next 30 Days)</div>
                    <div class="next-steps-list">
                        <div class="next-step-item">
                            <span class="next-step-num">1.</span>
                            <span class="next-step-text">Initiate CRM pipeline conversion audits to address identified sales bottlenecks.</span>
                        </div>
                        <div class="next-step-item">
                            <span class="next-step-num">2.</span>
                            <span class="next-step-text">Reallocate 15% of underperforming marketing budget to high-conversion channels.</span>
                        </div>
                        <div class="next-step-item">
                            <span class="next-step-num">3.</span>
                            <span class="next-step-text">Establish cross-training sessions to mitigate single engineering resource dependencies.</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-bar" style="padding-left: 10px; padding-right: 10px;">
                <span>Roadmap Summary</span>
                <span class="logo-text">Organalytics</span>
                <span>Page 5 of 5</span>
            </div>
        </div>

    </body>
    </html>
    """
    return html_content

async def run_html_to_pdf(html_content, pdf_path):
    """
    Executes head-less Chrome via pyppeteer to print compiled A4 PDF.
    """
    browser = await launch(
        executablePath=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        headless=True,
        args=['--no-sandbox', '--disable-setuid-sandbox']
    )
    page = await browser.newPage()
    await page.setContent(html_content)
    
    # A4 Dimensions: 210mm x 297mm
    # Page size: A4, margins: 20mm top/bottom, 18mm left/right
    await page.pdf({
        'path': pdf_path,
        'format': 'A4',
        'margin': {
            'top': '20mm',
            'bottom': '20mm',
            'left': '18mm',
            'right': '18mm'
        },
        'printBackground': True
    })
    await browser.close()
