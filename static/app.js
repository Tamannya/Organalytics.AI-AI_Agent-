
    // Theme Presets Configuration
    const themePresets = {
      midnight: {
        name: 'Midnight',
        primary: '#7C6FFF',
        accent: '#8DA8FF',
        bg: '#0F0F1A',
        cardBg: 'rgba(22, 22, 42, 0.85)',
        textPrimary: '#FFFFFF',
        textSecondary: '#9CA3AF',
        border: 'rgba(141, 168, 255, 0.08)',
        charts: ['#7C6FFF', '#3F7FDE', '#8DA8FF', '#EC4899', '#F59E0B', '#10B981'],
        isDark: true
      },
      blinkit: {
        name: 'Blinkit Gold',
        primary: '#F5C518',
        accent: '#10B981',
        bg: '#FFFBEA',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1A1A1A',
        textSecondary: '#4B5563',
        border: 'rgba(26, 26, 26, 0.08)',
        charts: ['#F5C518', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B'],
        isDark: false
      },
      ocean: {
        name: 'Ocean Blue',
        primary: '#2563EB',
        accent: '#3B82F6',
        bg: '#EFF6FF',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1E3A5F',
        textSecondary: '#4B5563',
        border: 'rgba(37, 99, 235, 0.08)',
        charts: ['#2563EB', '#3B82F6', '#60A5FA', '#10B981', '#F59E0B', '#EC4899'],
        isDark: false
      },
      forest: {
        name: 'Forest Green',
        primary: '#16A34A',
        accent: '#22C55E',
        bg: '#F0FDF4',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#14532D',
        textSecondary: '#4B5563',
        border: 'rgba(22, 163, 74, 0.08)',
        charts: ['#16A34A', '#22C55E', '#86EFAC', '#3B82F6', '#D97706', '#EF4444'],
        isDark: false
      },
      rose: {
        name: 'Rose Executive',
        primary: '#E11D48',
        accent: '#F43F5E',
        bg: '#FFF1F2',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#4C0519',
        textSecondary: '#4B5563',
        border: 'rgba(225, 29, 72, 0.08)',
        charts: ['#E11D48', '#F43F5E', '#FDA4AF', '#3B82F6', '#8B5CF6', '#F59E0B'],
        isDark: false
      },
      slate: {
        name: 'Slate Pro',
        primary: '#475569',
        accent: '#64748B',
        bg: '#F8FAFC',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#0F172A',
        textSecondary: '#4B5563',
        border: 'rgba(71, 85, 105, 0.08)',
        charts: ['#475569', '#64748B', '#94A3B8', '#10B981', '#F59E0B', '#EF4444'],
        isDark: false
      },
      amber: {
        name: 'Amber Ops',
        primary: '#D97706',
        accent: '#F59E0B',
        bg: '#FFFBEB',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#78350F',
        textSecondary: '#4B5563',
        border: 'rgba(217, 119, 6, 0.08)',
        charts: ['#D97706', '#F59E0B', '#FCD34D', '#10B981', '#3B82F6', '#8B5CF6'],
        isDark: false
      },
      purple: {
        name: 'Deep Purple',
        primary: '#8B5CF6',
        accent: '#A78BFA',
        bg: '#1E1B4B',
        cardBg: 'rgba(46, 42, 114, 0.85)',
        textPrimary: '#C4B5FD',
        textSecondary: '#E9D5FF',
        border: 'rgba(139, 92, 246, 0.15)',
        charts: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#10B981', '#3B82F6', '#EC4899'],
        isDark: true
      }
    };

    let currentThemeKey = localStorage.getItem('themeKey') || 'midnight';
    let isDarkVariant = true;

    function applyTheme(themeInput) {
      let t;
      if (typeof themeInput === 'string') {
        t = themePresets[themeInput];
        if (!t) return;
        currentThemeKey = themeInput;
        localStorage.setItem('themeKey', themeInput);
      } else {
        t = themeInput;
        currentThemeKey = 'custom';
      }
      
      const isDark = (currentThemeKey === 'custom') ? isDarkVariant : t.isDark;
      isDarkVariant = isDark;
      
      const root = document.documentElement;
      root.style.setProperty('--primary', t.primary);
      root.style.setProperty('--accent', t.accent);
      root.style.setProperty('--bg', t.bg);
      root.style.setProperty('--card-bg', t.cardBg);
      root.style.setProperty('--text-primary', t.textPrimary);
      root.style.setProperty('--text-secondary', t.textSecondary);
      root.style.setProperty('--border', t.border);
      
      t.charts.forEach((c, idx) => {
        root.style.setProperty(`--chart-${idx+1}`, c);
      });
      
      if (token && currentUser && typeof themeInput === 'string') {
        axios.post('/api/user/theme', { theme: themeInput }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error("Failed to save theme in profile", err));
      }
      
      updateSkeletonStyles(t.primary);
      updateChartColors(t);
    }

    function hexToHsl(hex) {
      hex = hex.replace(/#/g, '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      if (hex.length !== 6) return null;
      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToHex(h, s, l) {
      s /= 100; l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (0 <= h && h < 60) { r = c; g = x; b = 0; }
      else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
      else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
      else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
      else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
      else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
      let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
      let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
      let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
      return `#${rHex}${gHex}${bHex}`;
    }

    function hexToRgb(hex) {
      hex = hex.replace(/#/g, '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }

    function handleCustomColorInput(hex) {
      const hsl = hexToHsl(hex);
      if (!hsl) return;
      const compHue = (hsl.h + 180) % 360;
      const accent = hslToHex(compHue, hsl.s, Math.max(hsl.l - 10, 30));
      
      let bg, cardBg, textPrimary, textSecondary, border;
      if (isDarkVariant) {
        bg = hslToHex(hsl.h, Math.min(hsl.s, 20), 8);
        cardBg = 'rgba(' + hexToRgb(hslToHex(hsl.h, Math.min(hsl.s, 15), 14)) + ', 0.85)';
        textPrimary = '#FFFFFF';
        textSecondary = '#9CA3AF';
        border = 'rgba(' + hexToRgb(hslToHex(hsl.h, Math.min(hsl.s, 10), 22)) + ', 0.3)';
      } else {
        bg = hslToHex(hsl.h, Math.min(hsl.s, 10), 97);
        cardBg = 'rgba(255, 255, 255, 0.95)';
        textPrimary = hslToHex(hsl.h, Math.min(hsl.s, 30), 12);
        textSecondary = '#4B5563';
        border = 'rgba(' + hexToRgb(hslToHex(hsl.h, Math.min(hsl.s, 15), 85)) + ', 0.3)';
      }
      
      const customTheme = {
        name: 'Custom',
        primary: hex,
        accent: accent,
        bg: bg,
        cardBg: cardBg,
        textPrimary: textPrimary,
        textSecondary: textSecondary,
        border: border,
        charts: [
          hex, accent, 
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l), 
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), 
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l), 
          hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l)
        ],
        isDark: isDarkVariant
      };
      applyTheme(customTheme);
    }

    function toggleLightDarkVariant() {
      isDarkVariant = !isDarkVariant;
      if (currentThemeKey === 'custom') {
        const primaryHex = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        handleCustomColorInput(primaryHex);
      } else {
        // Preset switch
        const presets = {
          midnight: 'midnight',
          blinkit: 'blinkit',
          ocean: 'ocean',
          forest: 'forest',
          rose: 'rose',
          slate: 'slate',
          amber: 'amber',
          purple: 'purple'
        };
        const currentPreset = presets[currentThemeKey];
        if (currentPreset) {
          applyTheme(currentPreset);
        }
      }
    }

    function updateSkeletonStyles(primaryColor) {
      let styleEl = document.getElementById('skeleton-dynamic-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'skeleton-dynamic-styles';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `
        @keyframes pulse-tint {
          0%, 100% { background-color: rgba(${hexToRgb(primaryColor)}, 0.05); }
          50% { background-color: rgba(${hexToRgb(primaryColor)}, 0.15); }
        }
        .skeleton-pulse {
          animation: pulse-tint 1.8s infinite ease-in-out;
        }
      `;
    }

    function updateChartColors(themeObj) {
      // Stub to be populated or called when Chart.js instances are active
      if (window.chartsList) {
        window.chartsList.forEach(chart => {
          if (!chart) return;
          // Apply new theme colors to datasets
          if (chart.config.type === 'doughnut') {
            chart.data.datasets[0].backgroundColor = themeObj.charts;
            chart.data.datasets[0].borderColor = themeObj.cardBg.includes('rgba') ? 'rgba(0,0,0,0)' : themeObj.cardBg;
          } else {
            // Line / Bar
            if (chart.data.datasets[0]) {
              chart.data.datasets[0].backgroundColor = themeObj.primary;
              chart.data.datasets[0].borderColor = themeObj.primary;
            }
            if (chart.data.datasets[1]) {
              chart.data.datasets[1].backgroundColor = themeObj.accent;
              chart.data.datasets[1].borderColor = themeObj.accent;
            }
            // Grid lines & labels
            const gridColor = themeObj.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
            const tickColor = themeObj.textSecondary;
            if (chart.options.scales) {
              if (chart.options.scales.x) {
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.x.ticks.color = tickColor;
              }
              if (chart.options.scales.y) {
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.y.ticks.color = tickColor;
              }
            }
          }
          chart.update('none'); // Re-draw chart instantly in under 300ms without flicker
        });
      }
    }

    // System variables
    let token = localStorage.getItem('token') || null;
    let currentUser = null;
    const savedUserStr = localStorage.getItem('user');
    if (savedUserStr) {
      currentUser = JSON.parse(savedUserStr);
    }
    
    let reports = [];
    let currentReport = null;
    let activeChartTab = 'trend';
    let activeReportTab = 'exec';
    let currentChartInstance = null;
    let isDashboardEditMode = false;
    let analysisPayload = {
      orgName: '',
      industry: '',
      size: 'Medium (50-250 employees)',
      requirements: '',
      fileData: null,
      fileName: '',
      filePath: ''
    };

    // Chatbot questions config
    let chatStep = 0;
    const chatQuestions = [
      "Hello! I am your AI Business Intelligence assistant. Let's design your organizational growth dashboard. First, what is the name of your organization?",
      "Great! What industry or sector does your organization operate in? (e.g. Retail, SaaS Tech, Healthcare, Manufacturing, Entertainment, Real Estate, Logistics)",
      "Got it. What is the approximate size of your company in terms of employee headcount?",
      "Perfect. Now, please describe your organization's goals, current concerns, and the key metrics or KPIs you care about (e.g., 'sales growth, customer churn, marketing ROI')."
    ];

    // Initialize application
    window.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      document.getElementById('current-date-str').innerText = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
      });

      // Scroll animation observer to resolve invisible scroll-down sections
      if ('IntersectionObserver' in window) {
        const observerOptions = {
          root: null,
          threshold: 0.15
        };
        const scrollObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);
        document.querySelectorAll('.scroll-animate').forEach(el => {
          scrollObserver.observe(el);
        });
      } else {
        document.querySelectorAll('.scroll-animate').forEach(el => {
          el.classList.add('visible');
        });
      }
      
      // Set lower threshold on scroll observer
      if ('IntersectionObserver' in window) {
        const observerOptions = {
          root: null,
          threshold: 0.02
        };
        // Re-initialize scroll animation observer
        document.querySelectorAll('.scroll-animate').forEach(el => {
          el.classList.add('visible'); // Fallback trigger immediately
        });
      }

      // Check current auth state or shared report link
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('share');
      
      if (shareId) {
        loadReadOnlyReport(shareId);
      } else if (token && currentUser) {
        switchView('app-shell');
      } else {
        showLanding();
      }
    });

    // View router switcher
    function switchView(viewName) {
      const views = ['view-landing', 'view-auth', 'app-shell'];
      views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
      });
      
      const activeEl = document.getElementById(viewName === 'app-shell' ? 'app-shell' : `view-${viewName}`);
      if (activeEl) {
        activeEl.classList.remove('hidden');
      }
      
      if (viewName === 'app-shell') {
        showAppShell();
      }
      lucide.createIcons();
    }

    // Authenticated Tab switcher
    function selectTab(tabName) {
      const tabs = [
        'new-analysis', 'dashboard', 'history', 'about', 'processing', 'profile',
        'ask-ai', 'scenario-simulator', 'vision-upload', 'rec-tracker', 'org-health',
        'benchmarks', 'history-timeline', 'shared-reports', 'downloads', 'notifications', 'settings', 'subscription'
      ];
      tabs.forEach(t => {
        const el = document.getElementById(`panel-${t}`);
        if (el) el.classList.add('hidden');
      });

      // Clear active states in navigation buttons
      const navButtons = [
        'new-analysis', 'history', 'ask-ai', 'scenario-simulator', 'vision-upload',
        'rec-tracker', 'org-health', 'benchmarks', 'history-timeline', 'shared-reports',
        'downloads', 'about', 'notifications', 'settings', 'subscription'
      ];
      navButtons.forEach(btn => {
        const el = document.getElementById(`nav-${btn}`);
        if (el) {
          el.className = "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium text-gray-400 hover:bg-darkBorder/30 hover:text-gray-200";
        }
      });

      // Set active navigation button state
      let activeBtn = tabName === 'dashboard' || tabName === 'profile' ? 'history' : tabName === 'processing' ? 'new-analysis' : tabName;
      const elBtn = document.getElementById(`nav-${activeBtn}`);
      if (elBtn) {
        elBtn.className = "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium text-white bg-gradient-to-r from-midnightPurple/20 via-mediumPurple/10 to-royalBlue/10 border-l-4 border-mediumPurple";
      }

      // Set titles
      let headerTitle = "Organizational Insights";
      if (tabName === 'new-analysis') headerTitle = "New Analysis";
      else if (tabName === 'dashboard') headerTitle = "Performance Insights";
      else if (tabName === 'history') headerTitle = "Saved Audits";
      else if (tabName === 'about') headerTitle = "Technical Architecture";
      else if (tabName === 'profile') headerTitle = "Profile Dashboard";
      else if (tabName === 'ask-ai') headerTitle = "Ask AI Assistant";
      else if (tabName === 'scenario-simulator') headerTitle = "Scenario Simulator";
      else if (tabName === 'vision-upload') headerTitle = "Vision Upload";
      else if (tabName === 'rec-tracker') headerTitle = "Recommendation Tracker";
      else if (tabName === 'org-health') headerTitle = "Organization Health Score";
      else if (tabName === 'benchmarks') headerTitle = "Industry Benchmarks";
      else if (tabName === 'history-timeline') headerTitle = "Growth History Timeline";
      else if (tabName === 'shared-reports') headerTitle = "Shared Reports";
      else if (tabName === 'downloads') headerTitle = "Downloads Center";
      else if (tabName === 'notifications') headerTitle = "Notification Alerts";
      else if (tabName === 'settings') headerTitle = "System Settings";
      else if (tabName === 'subscription') headerTitle = "Subscription Plans";
      
      document.getElementById('header-title').innerText = headerTitle;
      
      const elPanel = document.getElementById(`panel-${tabName}`);
      if (elPanel) elPanel.classList.remove('hidden');
      
      if (tabName === 'history') {
        fetchReportsList();
      } else if (tabName === 'new-analysis') {
        initWizard();
      } else if (tabName === 'profile') {
        displayUserProfile();
      } else if (tabName === 'rec-tracker') {
        loadRecTrackerData();
      } else if (tabName === 'org-health') {
        initOrgHealthScore();
      } else if (tabName === 'scenario-simulator') {
        initStandaloneScenarioSimulator();
      } else if (tabName === 'settings') {
        loadSettingsData();
      }
      
      lucide.createIcons();
    }

    // ---- Subscription Billing Toggle ----
    let currentBillingCycle = 'monthly';

    const subscriptionPrices = {
      monthly: {
        growth: { display: '\u20b9499', sub: '' },
        pro:    { display: '\u20b91299', sub: '' },
        scale:  { display: '\u20b93999', sub: '' }
      },
      annual: {
        growth: { display: '\u20b9399', sub: '\u20b9499/mo billed monthly' },
        pro:    { display: '\u20b91039', sub: '\u20b91299/mo billed monthly' },
        scale:  { display: '\u20b93199', sub: '\u20b93999/mo billed monthly' }
      }
    };

    function setBillingCycle(cycle) {
      currentBillingCycle = cycle;
      const prices = subscriptionPrices[cycle];

      // Update price display
      document.getElementById('price-growth').textContent = prices.growth.display;
      document.getElementById('price-growth-sub').textContent = prices.growth.sub;
      document.getElementById('price-pro').textContent = prices.pro.display;
      document.getElementById('price-pro-sub').textContent = prices.pro.sub;
      document.getElementById('price-scale').textContent = prices.scale.display;
      document.getElementById('price-scale-sub').textContent = prices.scale.sub;

      // Strikethrough annual sub-prices in red
      const subEls = ['price-growth-sub', 'price-pro-sub', 'price-scale-sub'];
      subEls.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.textContent.trim()) {
          el.className = 'text-[11px] h-4 line-through text-rose-400/70';
        } else if (el) {
          el.className = 'text-[11px] text-gray-600 h-4';
        }
      });

      // Toggle button styles
      const monthlyBtn = document.getElementById('billing-monthly-btn');
      const annualBtn  = document.getElementById('billing-annual-btn');
      if (cycle === 'monthly') {
        monthlyBtn.className = 'relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-mediumPurple to-royalBlue text-white shadow-md';
        annualBtn.className  = 'relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 text-gray-400 hover:text-gray-200';
      } else {
        annualBtn.className  = 'relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-mediumPurple to-royalBlue text-white shadow-md';
        monthlyBtn.className = 'relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 text-gray-400 hover:text-gray-200';
      }
    }

    function handlePlanSelect(planName, tier) {
      if (tier === 'free') {
        // Already on free — just show a message
        const msg = document.createElement('div');
        msg.innerHTML = `<div style="position:fixed;bottom:24px;right:24px;z-index:9999;" class="glass-panel px-5 py-3.5 rounded-2xl border border-darkBorder shadow-2xl flex items-center gap-3 animate-fade-in">
          <i data-lucide="check-circle" class="h-5 w-5 text-emerald-400 flex-shrink-0"></i>
          <span class="text-sm font-semibold text-white">You are on the Free Explorer plan.</span>
        </div>`;
        document.body.appendChild(msg);
        lucide.createIcons();
        setTimeout(() => msg.remove(), 3500);
        return;
      }
      const billing = currentBillingCycle === 'annual' ? 'annually' : 'monthly';
      const prices  = subscriptionPrices[currentBillingCycle];
      const tierKey = tier === 'starter' ? 'growth' : tier === 'pro' ? 'pro' : 'scale';
      const price   = tierKey !== 'scale' ? prices[tierKey]?.display : prices.scale.display;

      const toast = document.createElement('div');
      toast.innerHTML = `<div style="position:fixed;bottom:24px;right:24px;z-index:9999;" class="glass-panel px-5 py-3.5 rounded-2xl border border-softBlue/30 shadow-2xl flex items-center gap-3 animate-fade-in">
        <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-mediumPurple to-royalBlue flex items-center justify-center flex-shrink-0">
          <i data-lucide="crown" class="h-4 w-4 text-white"></i>
        </div>
        <div>
          <p class="text-xs font-bold text-white">${planName} Plan &mdash; ${price}/mo billed ${billing}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">Redirecting to checkout&hellip; (demo mode)</p>
        </div>
      </div>`;
      document.body.appendChild(toast);
      lucide.createIcons();
      setTimeout(() => toast.remove(), 4000);
    }

    // Password visibility toggle
    function togglePasswordVisibility() {
      const pwdInput = document.getElementById('auth-password');
      const eyeIcon = document.getElementById('auth-password-eye');
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
      } else {
        pwdInput.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye');
      }
      lucide.createIcons();
    }

    // Interactive Google Login modal triggers
    function triggerGoogleLogin() {
      const modal = document.getElementById('google-auth-modal');
      if (modal) {
        modal.classList.remove('hidden');
        showGoogleAccountsList();
      }
    }

    function closeGoogleModal() {
      const modal = document.getElementById('google-auth-modal');
      if (modal) modal.classList.add('hidden');
    }

    function showGoogleCustomForm() {
      document.getElementById('google-accounts-list').classList.add('hidden');
      document.getElementById('google-custom-form').classList.remove('hidden');
      document.getElementById('google-auth-loader').classList.add('hidden');
    }

    function showGoogleAccountsList() {
      document.getElementById('google-accounts-list').classList.remove('hidden');
      document.getElementById('google-custom-form').classList.add('hidden');
      document.getElementById('google-auth-loader').classList.add('hidden');
    }

    async function selectGoogleAccount(name, email) {
      document.getElementById('google-accounts-list').classList.add('hidden');
      document.getElementById('google-custom-form').classList.add('hidden');
      document.getElementById('google-auth-loader').classList.remove('hidden');
      
      await executeGoogleMockLogin(name, email);
    }

    async function handleGoogleCustomSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('google-input-name').value.trim();
      const email = document.getElementById('google-input-email').value.trim();
      if (!name || !email) return;

      document.getElementById('google-custom-form').classList.add('hidden');
      document.getElementById('google-auth-loader').classList.remove('hidden');

      await executeGoogleMockLogin(name, email);
    }

    async function executeGoogleMockLogin(name, email) {
      setTimeout(async () => {
        try {
          const res = await axios.post('/api/auth/register', {
            name: name,
            email: email,
            password: "oauth_mocked_password_123"
          }).catch(async () => {
            // If already exists, login
            return await axios.post('/api/auth/login', {
              email: email,
              password: "oauth_mocked_password_123"
            });
          });
          
          token = res.data.token;
          currentUser = res.data.user;
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          closeGoogleModal();
          switchView('app-shell');
          await fetchReportsList();
        } catch (err) {
          document.getElementById('google-auth-loader').classList.add('hidden');
          showGoogleAccountsList();
          alert("Google authentication mock session failed.");
        }
      }, 1500);
    }

    // Password reset views with Stepper Dot updates
    function showForgotPasswordPanel(show) {
      document.getElementById('auth-panel-main').className = show ? "hidden" : "glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-darkBorder glow-border flex flex-col";
      document.getElementById('auth-panel-forgot').className = show ? "glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-darkBorder glow-border animate-fade-in flex flex-col" : "hidden";
      document.getElementById('forgot-error').classList.add('hidden');
      
      // Reset forms & steps
      document.getElementById('forgot-step-1').classList.remove('hidden');
      document.getElementById('forgot-step-2').classList.add('hidden');
      document.getElementById('forgot-email').value = '';
      document.getElementById('forgot-code').value = '';
      document.getElementById('forgot-new-password').value = '';

      updateForgotStepper(1);
    }

    function updateForgotStepper(step) {
      const dot1 = document.getElementById('step-dot-1');
      const dot2 = document.getElementById('step-dot-2');
      const dot3 = document.getElementById('step-dot-3');

      // Reset
      [dot1, dot2, dot3].forEach((dot, idx) => {
        if (idx + 1 < step) {
          // Completed
          dot.className = "h-6 w-6 rounded-full bg-emerald-500 text-black font-bold text-xs flex items-center justify-center shadow-md animate-pulse";
          dot.innerHTML = `<i data-lucide="check" class="h-3.5 w-3.5"></i>`;
        } else if (idx + 1 === step) {
          // Active
          dot.className = "h-6 w-6 rounded-full bg-[#54E1EF] text-black font-bold text-xs flex items-center justify-center shadow-md";
          dot.innerText = idx + 1;
        } else {
          // Pending
          dot.className = "h-6 w-6 rounded-full bg-black border border-darkBorder text-gray-500 font-bold text-xs flex items-center justify-center";
          dot.innerText = idx + 1;
        }
      });
      lucide.createIcons();
    }

    async function handleRequestResetCode(e) {
      e.preventDefault();
      document.getElementById('forgot-error').classList.add('hidden');
      const email = document.getElementById('forgot-email').value;
      try {
        await axios.post('/api/auth/forgot-password', { email });
        document.getElementById('forgot-step-1').classList.add('hidden');
        document.getElementById('forgot-step-2').classList.remove('hidden');
        updateForgotStepper(2);
      } catch (err) {
        const msg = err.response?.data?.detail || "Email recovery lookup failed.";
        document.getElementById('forgot-error-msg').innerText = msg;
        document.getElementById('forgot-error').classList.remove('hidden');
      }
    }

    async function handleResetPasswordSubmit(e) {
      e.preventDefault();
      document.getElementById('forgot-error').classList.add('hidden');
      const email = document.getElementById('forgot-email').value;
      const code = document.getElementById('forgot-code').value;
      const newPassword = document.getElementById('forgot-new-password').value;
      
      try {
        await axios.post('/api/auth/reset-password', { email, code, newPassword });
        updateForgotStepper(3);
        setTimeout(() => {
          alert("Password reset completed successfully. You can now login with your new credentials.");
          showForgotPasswordPanel(false);
        }, 300);
      } catch (err) {
        const msg = err.response?.data?.detail || "Password reset update rejected.";
        document.getElementById('forgot-error-msg').innerText = msg;
        document.getElementById('forgot-error').classList.remove('hidden');
      }
    }

    // History Search and Filters
    let historySearchQuery = '';
    let historyIndustryFilter = 'All';

    function handleHistorySearch(e) {
      historySearchQuery = e.target.value;
      renderHistoryGrid();
    }

    function filterHistoryIndustry(category) {
      historyIndustryFilter = category;
      
      // Update active pill styling
      const pills = {
        'All': 'pill-all',
        'Retail / E-commerce': 'pill-retail',
        'SaaS Technology': 'pill-saas',
        'Healthcare': 'pill-health',
        'Entertainment': 'pill-ent',
        'Logistics & Supply Chain': 'pill-ops'
      };

      Object.keys(pills).forEach(key => {
        const btn = document.getElementById(pills[key]);
        if (!btn) return;
        if (key === category) {
          btn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-mediumPurple/20 text-softBlue border border-mediumPurple/40 transition-all";
        } else {
          btn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black border border-darkBorder text-gray-400 hover:text-white transition-all";
        }
      });

      renderHistoryGrid();
    }

    // Dynamic Report PDF custom colors based on industry or custom selection
    let pdfThemeColor = '#512E8B'; // Default Medium Purple

    function setPDFTheme(color, event) {
      if (event) event.stopPropagation();
      pdfThemeColor = color;

      // Update active theme selector styling
      const container = document.getElementById('pdf-theme-selectors');
      if (container) {
        const buttons = container.querySelectorAll('button');
        buttons.forEach(btn => {
          if (btn.getAttribute('onclick').includes(color)) {
            btn.classList.add('border-2', 'border-white');
            btn.classList.remove('border-transparent');
          } else {
            btn.classList.add('border-transparent');
            btn.classList.remove('border-2', 'border-white');
          }
        });
      }
    }

    // View Profile implementation
    function displayUserProfile() {
      if (!currentUser) return;
      document.getElementById('profile-name').innerText = currentUser.name;
      document.getElementById('profile-email').innerText = currentUser.email;
      document.getElementById('profile-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
      document.getElementById('profile-reports-count').innerText = `${reports.length} Strategic Audit${reports.length === 1 ? '' : 's'}`;
      
      // Reset pass forms
      document.getElementById('profile-cur-pass').value = '';
      document.getElementById('profile-new-pass').value = '';
      document.getElementById('profile-pass-success').classList.add('hidden');
    }

    async function handleProfilePasswordReset(e) {
      e.preventDefault();
      const cur = document.getElementById('profile-cur-pass').value;
      const val = document.getElementById('profile-new-pass').value;
      
      try {
        // SQLite endpoint
        await axios.post('/api/auth/reset-password', {
          email: currentUser.email,
          code: "123456", // bypass auth check locally
          newPassword: val
        });
        
        document.getElementById('profile-cur-pass').value = '';
        document.getElementById('profile-new-pass').value = '';
        document.getElementById('profile-pass-success').classList.remove('hidden');
      } catch (err) {
        alert("Password update failed.");
      }
    }

    async function handleAuthSubmit(e) {
      e.preventDefault();
      document.getElementById('auth-error').classList.add('hidden');
      
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;
      const nameEl = document.getElementById('auth-name');
      const name = nameEl ? nameEl.value.trim() : '';

      if (!email || !password) {
        showAuthError("Please fill in all required fields.");
        return;
      }

      if (!isLoginMode && !name) {
        showAuthError("Please enter your name to register.");
        return;
      }

      try {
        let response;
        if (isLoginMode) {
          response = await axios.post('/api/auth/login', { email, password });
        } else {
          response = await axios.post('/api/auth/register', { name, email, password });
        }

        token = response.data.token;
        currentUser = response.data.user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));

        // Reset auth fields
        document.getElementById('auth-email').value = '';
        document.getElementById('auth-password').value = '';
        if (nameEl) nameEl.value = '';

        // Switch to app view
        switchView('app-shell');
        
        // Load data
        await fetchReportsList();
      } catch (err) {
        const errorMsg = err.response?.data?.detail || "Authentication request failed.";
        showAuthError(errorMsg);
      }
    }

    function showAuthError(msg) {
      const errBox = document.getElementById('auth-error');
      const errMsg = document.getElementById('auth-error-msg');
      if (errBox && errMsg) {
        errMsg.innerText = msg;
        errBox.classList.remove('hidden');
      }
    }

    // Auth state helper
    let isLoginMode = true;
    function setAuthMode(isLogin) {
      isLoginMode = isLogin;
      document.getElementById('auth-error').classList.add('hidden');
      
      const tabSignin = document.getElementById('auth-tab-signin');
      const tabSignup = document.getElementById('auth-tab-signup');
      const fName = document.getElementById('auth-field-name');
      const aTitle = document.getElementById('auth-title');
      const aDesc = document.getElementById('auth-desc');
      const btnText = document.getElementById('auth-btn-text');

      if (isLogin) {
        tabSignin.className = "flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-softBlue text-white";
        tabSignup.className = "flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-transparent text-gray-500 hover:text-gray-300";
        fName.classList.add('hidden');
        aTitle.innerText = "Welcome Back";
        aDesc.innerText = "Enter credentials to access your insights history.";
        btnText.innerText = "Sign In";
      } else {
        tabSignup.className = "flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-softBlue text-white";
        tabSignin.className = "flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-transparent text-gray-500 hover:text-gray-300";
        fName.classList.remove('hidden');
        aTitle.innerText = "Get Started";
        aDesc.innerText = "Register to start running organizational analytics.";
        btnText.innerText = "Create Account";
      }
    }

    function handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      token = null;
      currentUser = null;
      
      // Hide all panel pages
      const tabs = ['new-analysis', 'dashboard', 'history', 'about', 'processing', 'profile'];
      tabs.forEach(t => {
        const el = document.getElementById(`panel-${t}`);
        if (el) el.classList.add('hidden');
      });
      
      switchView('landing');
    }

    function showLanding() {
      switchView('landing');
    }

    async function showAppShell() {
      document.getElementById('header-user-badge').innerText = currentUser.name;
      document.getElementById('user-display-name').innerText = currentUser.name;
      document.getElementById('user-display-email').innerText = currentUser.email;
      document.getElementById('user-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
      
      // Load list
      await fetchReportsList();
      
      selectTab('history');
      
      if (currentUser && currentUser.theme) {
        applyTheme(currentUser.theme);
      } else {
        applyTheme('midnight');
      }
    }

    // Fetch reports list via API
    async function fetchReportsList() {
      try {
        const response = await axios.get('/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        reports = response.data;
        renderHistoryGrid();
      } catch (err) {
        console.error("Failed to load user reports list", err);
      }
    }

    function renderHistoryGrid() {
      const grid = document.getElementById('history-grid');
      const emptyState = document.getElementById('history-empty');
      grid.innerHTML = '';
      
      if (reports.length === 0) {
        emptyState.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
      }

      // Apply search and industry filtering
      let filteredReports = reports;
      if (historySearchQuery) {
        const query = historySearchQuery.toLowerCase();
        filteredReports = filteredReports.filter(r => 
          r.org_name.toLowerCase().includes(query) || 
          r.industry.toLowerCase().includes(query)
        );
      }
      if (historyIndustryFilter !== 'All') {
        filteredReports = filteredReports.filter(r => 
          r.industry === historyIndustryFilter
        );
      }

      if (filteredReports.length === 0) {
        emptyState.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
      }
      
      emptyState.classList.add('hidden');
      grid.classList.remove('hidden');

      filteredReports.forEach(report => {
        const dateStr = new Date(report.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
        
        const card = document.createElement('div');
        card.className = "glass-panel rounded-2xl border border-darkBorder/50 p-6 shadow-md hover:border-softBlue/30 hover:shadow-neon/5 cursor-pointer group transition-all duration-200 flex flex-col justify-between h-64";
        card.onclick = () => loadReport(report.id);
        
        const kpis = report.kpis || { revenue: '$0', growth: '0%', efficiency: '0/100' };

        card.innerHTML = `
          <div>
            <div class="flex justify-between items-start">
              <div class="overflow-hidden">
                <span class="text-[10px] font-bold text-softBlue bg-midnightPurple/20 px-2.5 py-0.5 rounded-full border border-midnightPurple/40 uppercase tracking-wider">${report.industry}</span>
                <h3 class="font-outfit font-bold text-white text-lg mt-2 group-hover:text-softBlue transition-colors truncate">${report.org_name}</h3>
              </div>
              <div class="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                <i data-lucide="calendar" class="h-3.5 w-3.5"></i>
                <span>${dateStr}</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-darkBorder/40 text-xs">
              <div>
                <span class="text-gray-500 block">Revenue</span>
                <span class="text-gray-300 font-semibold mt-0.5 block">${kpis.revenue}</span>
              </div>
              <div>
                <span class="text-gray-500 block">Growth</span>
                <span class="text-gray-300 font-semibold mt-0.5 block">${kpis.growth}</span>
              </div>
              <div>
                <span class="text-gray-500 block">Efficiency</span>
                <span class="text-gray-300 font-semibold mt-0.5 block">${kpis.efficiency}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-darkBorder/40 mt-4">
            <div class="flex space-x-2">
              <button onclick="deleteReportRecord(${report.id}, event)" class="p-2 bg-darkBorder/40 hover:bg-rose-500/10 border border-darkBorder hover:border-rose-500/30 text-gray-400 hover:text-rose-400 rounded-lg transition-all" title="Delete Report">
                <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
              </button>
            </div>
            <div class="flex items-center space-x-1.5 text-xs font-bold text-softBlue group-hover:translate-x-1 transition-transform">
              <span>Open Dashboard</span>
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
      lucide.createIcons();
    }

    async function deleteReportRecord(id, e) {
      e.stopPropagation();
      if (!confirm("Are you sure you want to delete this organizational report?")) return;
      try {
        await axios.delete(`/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        reports = reports.filter(r => r.id !== id);
        renderHistoryGrid();
      } catch (err) {
        alert("Failed to delete report.");
      }
    }

    async function loadReport(id) {
      selectTab('processing');
      setProcessingProgress(0);
      try {
        const response = await axios.get(`/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        currentReport = response.data;
        displayDashboard();
      } catch (err) {
        alert("Failed to load report details.");
        selectTab('history');
      }
    }

    // Chatbot Conversational Form Handler
    function resetChatbot() {
      chatStep = 0;
      analysisPayload = {
        orgName: '',
        industry: '',
        size: 'Medium (50-250 employees)',
        requirements: '',
        fileData: null,
        fileName: '',
        filePath: ''
      };
      
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '';
      
      appendBotMessage(chatQuestions[0]);
      showTextInput();
    }

    function appendBotMessage(text, elementNode) {
      const msg = document.createElement('div');
      msg.className = "flex justify-start animate-fade-in";
      
      const bubble = document.createElement('div');
      bubble.className = "max-w-xl rounded-2xl p-5 border border-darkBorder bg-darkCard text-gray-300 text-sm leading-relaxed rounded-tl-none shadow-xl relative overflow-hidden";
      // Border color accent line
      bubble.innerHTML = `<div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-softBlue to-mediumPurple"></div><p>${text}</p>`;
      
      if (elementNode) {
        bubble.appendChild(elementNode);
      }
      
      msg.appendChild(bubble);
      document.getElementById('chat-messages').appendChild(msg);
      msg.scrollIntoView({ behavior: 'smooth' });
    }

    function appendUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = "flex justify-end animate-fade-in";
      
      const bubble = document.createElement('div');
      bubble.className = "max-w-xl rounded-2xl p-5 border border-softBlue/30 bg-gradient-to-tr from-midnightPurple/40 via-mediumPurple/20 to-royalBlue/10 text-white text-sm leading-relaxed rounded-tr-none shadow-lg";
      bubble.innerText = text;
      
      msg.appendChild(bubble);
      document.getElementById('chat-messages').appendChild(msg);
      msg.scrollIntoView({ behavior: 'smooth' });
    }

    function showTextInput() {
      document.getElementById('chat-input-text-container').classList.remove('hidden');
      document.getElementById('chat-input-options-container').classList.add('hidden');
      document.getElementById('chat-input-text').focus();
    }

    function showButtonsInput(options) {
      document.getElementById('chat-input-text-container').classList.add('hidden');
      
      const container = document.getElementById('chat-input-options-container');
      container.innerHTML = '';
      container.classList.remove('hidden');
      
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "px-4 py-2 bg-black border border-darkBorder hover:border-softBlue/40 hover:bg-darkCard rounded-xl text-xs font-semibold text-gray-300 transition-all shadow-md";
        btn.innerText = opt;
        btn.onclick = () => submitChatAnswer(opt);
        container.appendChild(btn);
      });
    }

    function sendChatInput() {
      const el = document.getElementById('chat-input-text');
      const val = el.value.trim();
      if (!val) return;
      el.value = '';
      submitChatAnswer(val);
    }

    function submitChatAnswer(text) {
      appendUserMessage(text);
      
      const step = chatStep;
      if (step === 0) {
        analysisPayload.orgName = text;
        chatStep = 1;
        // Update profile card
        const el = document.getElementById('profile-card-name');
        if (el) { el.textContent = text; el.classList.remove('italic'); el.classList.add('text-white'); }
        setTimeout(() => {
          appendBotMessage(`Nice to meet you, <strong>${text}</strong>! What industry or sector does your organization operate in?`);
          showButtonsInput(['Retail / E-commerce', 'SaaS Technology', 'Healthcare', 'Manufacturing', 'Entertainment', 'Real Estate', 'Logistics & Supply Chain', 'Energy & Utilities']);
          chatAutoScroll();
        }, 500);
      } 
      else if (step === 1) {
        analysisPayload.industry = text;
        chatStep = 2;
        // Update profile card
        const el = document.getElementById('profile-card-industry');
        if (el) { el.textContent = text; el.classList.remove('italic'); el.classList.add('text-white'); }
        setTimeout(() => {
          appendBotMessage('Got it. What is the approximate size of your company in terms of employee headcount?');
          showButtonsInput(['Small (<50 employees)', 'Medium (50-250 employees)', 'Large (250+ employees)']);
          chatAutoScroll();
        }, 500);
      } 
      else if (step === 2) {
        analysisPayload.size = text;
        chatStep = 3;
        // Update profile card
        const el = document.getElementById('profile-card-size');
        if (el) { el.textContent = text; el.classList.remove('italic'); el.classList.add('text-white'); }
        setTimeout(() => {
          appendBotMessage('Perfect! Last question — describe your organization\'s goals, current concerns, and the key metrics or KPIs you care about.');
          showTextInput();
          chatAutoScroll();
        }, 500);
      } 
      else if (step === 3) {
        analysisPayload.requirements = text;
        chatStep = 4;
        // Update profile card
        const elGoals = document.getElementById('profile-card-goals');
        if (elGoals) { elGoals.textContent = text; elGoals.classList.remove('italic'); elGoals.classList.add('text-white'); }
        // Mark profile complete
        const badge = document.getElementById('profile-complete-badge');
        if (badge) badge.classList.remove('hidden');
        // Hide chat input
        document.getElementById('chat-input-text-container').classList.add('hidden');
        document.getElementById('chat-input-options-container').classList.add('hidden');
        // Show generate button
        const genWrapper = document.getElementById('wizard-generate-wrapper');
        const genWrapperMobile = document.getElementById('wizard-generate-wrapper-mobile');
        if (genWrapper) genWrapper.classList.remove('hidden');
        if (genWrapperMobile) genWrapperMobile.classList.remove('hidden');
        
        setTimeout(() => {
          appendBotMessage(`🎉 <strong>Profile complete!</strong> I've captured everything I need about <strong>${analysisPayload.orgName}</strong>. Click <strong>"Generate My Dashboard →"</strong> to run the full AI analysis!`);
          chatAutoScroll();
          lucide.createIcons();
        }, 500);
      }
    }

    function chatAutoScroll() {
      const msgs = document.getElementById('chat-messages');
      if (msgs) setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 100);
    }

    function handleInlineFileSelect(e) {
      if (e.target.files.length) {
        const file = e.target.files[0];
        analysisPayload.fileName = file.name;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
          analysisPayload.fileData = evt.target.result;
          const dropTitle = document.getElementById('inline-drop-title');
          if (dropTitle) dropTitle.innerText = `${file.name} loaded`;
          const execBtn = document.getElementById('btn-chat-execute');
          if (execBtn) execBtn.removeAttribute('disabled');
        };
        reader.readAsText(file);
      }
    }

    function loadInlineDemoDataset() {
      analysisPayload.fileName = "sample_data.csv";
      analysisPayload.filePath = "database/sample_data.csv";
      const dropTitle = document.getElementById('inline-drop-title');
      if (dropTitle) dropTitle.innerText = "sample_data.csv loaded";
      const execBtn = document.getElementById('btn-chat-execute');
      if (execBtn) execBtn.removeAttribute('disabled');
    }


    // ═══════════════════════════════════════════════════════════
    //  3-STEP WIZARD LOGIC
    //  Step 1: Data source  →  Step 2: Describe org (chat)  →  Step 3: Generate
    // ═══════════════════════════════════════════════════════════

    let wizardStep = 1;            // Current wizard step (1, 2)
    let wizardDataSource = null;   // 'screenshot' | 'csv' | 'demo'
    let wizardDataReady = false;   // true once user has uploaded/selected a data source

    const WIZARD_STATE_KEY = 'organalytics_wizard_state';

    function saveWizardState() {
      try {
        localStorage.setItem(WIZARD_STATE_KEY, JSON.stringify({
          step: wizardStep,
          dataSource: wizardDataSource,
          dataReady: wizardDataReady,
          analysisPayload: {
            orgName: analysisPayload.orgName,
            industry: analysisPayload.industry,
            size: analysisPayload.size,
            requirements: analysisPayload.requirements,
            fileName: analysisPayload.fileName,
            filePath: analysisPayload.filePath
          },
          chatStep: chatStep
        }));
      } catch(e) {}
    }

    function clearWizardState() {
      try { localStorage.removeItem(WIZARD_STATE_KEY); } catch(e) {}
    }

    function initWizard() {
      // Reset to clean state
      wizardStep = 1;
      wizardDataSource = null;
      wizardDataReady = false;
      chatStep = 0;
      analysisPayload = {
        orgName: '', industry: '', size: 'Medium (50-250 employees)',
        requirements: '', fileData: null, fileName: '', filePath: ''
      };

      // Try restore from localStorage
      try {
        const saved = localStorage.getItem(WIZARD_STATE_KEY);
        if (saved) {
          const state = JSON.parse(saved);
          if (state.dataSource && state.dataReady) {
            wizardDataSource = state.dataSource;
            wizardDataReady = state.dataReady;
            if (state.analysisPayload) {
              Object.assign(analysisPayload, state.analysisPayload);
            }
            chatStep = state.chatStep || 0;
          }
        }
      } catch(e) {}

      goToWizardStep(1);
      lucide.createIcons();

      // Restore data source card state if applicable
      if (wizardDataSource && wizardDataReady) {
        wizardSelectDataSource(wizardDataSource, true); // true = restore mode (no alert)
      }

      // Check Gemini health
      checkGeminiHealth();
    }

    function goToWizardStep(n) {
      wizardStep = n;

      // Show/hide step content panels
      const step1 = document.getElementById('wizard-step-1');
      const step2 = document.getElementById('wizard-step-2');
      if (step1) step1.classList.toggle('hidden', n !== 1);
      if (step2) step2.classList.toggle('hidden', n !== 2);

      // Update step indicator dots
      updateWizardIndicator(n);

      // If entering step 2, reset chatbot to Step 2 starting point
      if (n === 2) {
        resetChatbotForStep2();
        // Update profile sidebar datasource label
        const label = document.getElementById('profile-datasource-label');
        if (label) {
          const labels = { screenshot: '📸 Screenshot uploaded', csv: '📄 CSV file uploaded', demo: '✨ Blinkit demo dataset' };
          label.textContent = labels[wizardDataSource] || '—';
        }
      }

      saveWizardState();
      lucide.createIcons();
    }

    function updateWizardIndicator(activeStep) {
      // Step 1
      const dot1 = document.getElementById('wizard-dot-icon-1');
      const dot2 = document.getElementById('wizard-dot-icon-2');
      const dot3 = document.getElementById('wizard-dot-icon-3');
      const lbl1 = document.getElementById('wizard-dot-1')?.querySelector('span');
      const lbl2 = document.getElementById('wizard-dot-2')?.querySelector('span');
      const lbl3 = document.getElementById('wizard-dot-3')?.querySelector('span');

      // Reset all
      if (dot1) {
        if (activeStep > 1) {
          dot1.className = 'h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0';
          dot1.innerHTML = '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
        } else {
          dot1.className = 'h-6 w-6 rounded-full bg-gradient-to-tr from-mediumPurple to-softBlue text-white flex items-center justify-center text-xs font-bold flex-shrink-0';
          dot1.textContent = '1';
        }
        if (lbl1) lbl1.className = `text-xs font-semibold whitespace-nowrap hidden sm:inline ${activeStep >= 1 ? 'text-white' : 'text-gray-500'}`;
      }
      if (dot2) {
        if (activeStep > 2) {
          dot2.className = 'h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0';
          dot2.innerHTML = '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
        } else if (activeStep === 2) {
          dot2.className = 'h-6 w-6 rounded-full bg-gradient-to-tr from-mediumPurple to-softBlue text-white flex items-center justify-center text-xs font-bold flex-shrink-0';
          dot2.textContent = '2';
        } else {
          dot2.className = 'h-6 w-6 rounded-full bg-black border border-darkBorder text-gray-500 flex items-center justify-center text-xs font-bold flex-shrink-0';
          dot2.textContent = '2';
        }
        if (lbl2) lbl2.className = `text-xs font-semibold whitespace-nowrap hidden sm:inline ${activeStep >= 2 ? 'text-white' : 'text-gray-500'}`;
      }
      if (dot3) {
        dot3.className = 'h-6 w-6 rounded-full bg-black border border-darkBorder text-gray-500 flex items-center justify-center text-xs font-bold flex-shrink-0';
        dot3.textContent = '3';
        if (lbl3) lbl3.className = 'text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:inline';
      }
    }

    function wizardSelectDataSource(type, restoreMode = false) {
      wizardDataSource = type;

      // Deselect all cards
      ['screenshot', 'csv', 'demo'].forEach(t => {
        const card = document.getElementById(`card-${t}`);
        const check = document.getElementById(`card-${t}-check`);
        if (card) {
          card.classList.remove('border-primary', 'border-softBlue', 'border-emerald-500', 'border-amber-500', 'shadow-neon/10', 'shadow-lg');
          card.classList.add('border-darkBorder');
        }
        if (check) check.classList.add('hidden');
        // Hide sub panels
        const sub = document.getElementById(`sub-${t}`);
        if (sub) sub.classList.add('hidden');
      });

      // Highlight selected card
      const selectedCard = document.getElementById(`card-${type}`);
      const selectedCheck = document.getElementById(`card-${type}-check`);
      if (selectedCard) {
        selectedCard.classList.remove('border-darkBorder');
        const borderColors = { screenshot: 'border-softBlue', csv: 'border-emerald-500', demo: 'border-amber-500' };
        selectedCard.classList.add(borderColors[type] || 'border-primary', 'shadow-lg');
      }
      if (selectedCheck) selectedCheck.classList.remove('hidden');

      // Show sub-panel
      const subPanel = document.getElementById(`sub-${type}`);
      if (subPanel) subPanel.classList.remove('hidden');

      // Handle each type
      if (type === 'demo') {
        // Demo is always ready
        analysisPayload.filePath = 'database/sample_data.csv';
        analysisPayload.fileName = 'sample_data.csv';
        wizardDataReady = true;
        setWizardNextEnabled(true);
      } else if (type === 'csv') {
        // Check if we have a restored file
        if (restoreMode && analysisPayload.fileName) {
          wizardDataReady = true;
          setWizardNextEnabled(true);
          const nameEl = document.getElementById('wiz-csv-name');
          const metaEl = document.getElementById('wiz-csv-meta');
          const preview = document.getElementById('wiz-csv-preview');
          if (nameEl) nameEl.textContent = analysisPayload.fileName;
          if (metaEl) metaEl.textContent = 'Previously uploaded file';
          if (preview) preview.classList.remove('hidden');
        } else {
          wizardDataReady = false;
          setWizardNextEnabled(false);
        }
      } else if (type === 'screenshot') {
        // Check Gemini availability — show dropzone or error card
        checkGeminiHealth().then(available => {
          const dropzone = document.getElementById('wiz-screenshot-dropzone');
          const errorCard = document.getElementById('vision-unavailable-card');
          if (available) {
            if (dropzone) dropzone.classList.remove('hidden');
            if (errorCard) errorCard.classList.add('hidden');
          } else {
            if (dropzone) dropzone.classList.add('hidden');
            if (errorCard) errorCard.classList.remove('hidden');
          }
        });
        // Restore preview if applicable
        if (restoreMode && analysisPayload.fileName) {
          wizardDataReady = true;
          setWizardNextEnabled(true);
          const nameEl = document.getElementById('wiz-screenshot-name');
          const preview = document.getElementById('wiz-screenshot-preview');
          if (nameEl) nameEl.textContent = analysisPayload.fileName;
          if (preview) preview.classList.remove('hidden');
          const dropzone = document.getElementById('wiz-screenshot-dropzone');
          if (dropzone) dropzone.classList.add('hidden');
        } else {
          wizardDataReady = false;
          setWizardNextEnabled(false);
        }
      }

      lucide.createIcons();
    }

    function setWizardNextEnabled(enabled) {
      const btn = document.getElementById('wizard-next-btn');
      if (btn) {
        btn.disabled = !enabled;
      }
    }

    function wizardNext() {
      if (!wizardDataReady || !wizardDataSource) return;
      goToWizardStep(2);
    }

    function wizardGoBack(targetStep) {
      // Only go back if we are currently beyond that step
      if (targetStep < wizardStep) {
        goToWizardStep(targetStep);
      } else if (targetStep === wizardStep) {
        return; // Already on this step
      }
    }

    // Reset chatbot specifically for Step 2 (does NOT reset data source)
    function resetChatbotForStep2() {
      chatStep = 0;
      analysisPayload.orgName = '';
      analysisPayload.industry = '';
      analysisPayload.size = 'Medium (50-250 employees)';
      analysisPayload.requirements = '';

      const chatMessages = document.getElementById('chat-messages');
      if (chatMessages) chatMessages.innerHTML = '';

      // Reset profile card
      ['profile-card-name', 'profile-card-industry', 'profile-card-size', 'profile-card-goals'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = 'Waiting...'; el.className = 'text-gray-400 font-semibold truncate italic'; }
      });
      const badge = document.getElementById('profile-complete-badge');
      if (badge) badge.classList.add('hidden');
      const genWrapper = document.getElementById('wizard-generate-wrapper');
      const genWrapperMobile = document.getElementById('wizard-generate-wrapper-mobile');
      if (genWrapper) genWrapper.classList.add('hidden');
      if (genWrapperMobile) genWrapperMobile.classList.add('hidden');

      // Show text input
      const inputContainer = document.getElementById('chat-input-text-container');
      if (inputContainer) inputContainer.classList.remove('hidden');
      const optContainer = document.getElementById('chat-input-options-container');
      if (optContainer) optContainer.classList.add('hidden');

      // Start the conversation
      setTimeout(() => {
        appendBotMessage("Great! I can see your data is ready. 🎯 Let's customize the dashboard for your organization. First — what is the <strong>name of your organization</strong>?");
        const input = document.getElementById('chat-input-text');
        if (input) input.focus();
        chatAutoScroll();
        lucide.createIcons();
      }, 300);
    }

    // Keep resetChatbot as alias that now goes through wizard
    function resetChatbot() {
      initWizard();
    }

    // Gemini health check
    async function checkGeminiHealth() {
      try {
        const res = await axios.get('/api/health/gemini');
        const available = res.data?.visionAvailable === true;
        const banner = document.getElementById('gemini-health-banner');
        if (banner) {
          if (!available) banner.classList.remove('hidden');
          else banner.classList.add('hidden');
        }
        return available;
      } catch(e) {
        // If endpoint doesn't exist, assume unavailable but don't show banner
        return false;
      }
    }

    function toggleGeminiFixInfo() {
      const el = document.getElementById('gemini-fix-info');
      if (el) el.classList.toggle('hidden');
    }

    // Wizard screenshot file handlers
    function wizHandleScreenshotDrop(event) {
      event.preventDefault();
      const dropzone = document.getElementById('wiz-screenshot-dropzone');
      if (dropzone) dropzone.classList.remove('border-softBlue/60', 'bg-softBlue/5');
      const file = event.dataTransfer?.files[0];
      if (file) wizProcessScreenshotFile(file);
    }

    function wizHandleScreenshotSelect(event) {
      const file = event.target.files[0];
      if (file) wizProcessScreenshotFile(file);
    }

    function wizClearScreenshot() {
      const preview = document.getElementById('wiz-screenshot-preview');
      const dropzone = document.getElementById('wiz-screenshot-dropzone');
      const input = document.getElementById('wiz-screenshot-input');
      const thumb = document.getElementById('wiz-screenshot-thumb');
      if (preview) preview.classList.add('hidden');
      if (dropzone) dropzone.classList.remove('hidden');
      if (input) input.value = '';
      if (thumb) thumb.src = '';
      wizardDataReady = false;
      analysisPayload.fileName = '';
      setWizardNextEnabled(false);
    }

    function wizProcessScreenshotFile(file) {
      const maxMB = 10;
      if (file.size > maxMB * 1024 * 1024) {
        alert(`File is too large. Maximum size is ${maxMB}MB.`);
        return;
      }
      const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|webp|gif|pdf)$/i)) {
        alert('Please upload an image file (PNG, JPG, WEBP, PDF).');
        return;
      }

      analysisPayload.fileName = file.name;
      wizardDataReady = true;

      const nameEl = document.getElementById('wiz-screenshot-name');
      const thumb = document.getElementById('wiz-screenshot-thumb');
      const preview = document.getElementById('wiz-screenshot-preview');
      const dropzone = document.getElementById('wiz-screenshot-dropzone');

      if (nameEl) nameEl.textContent = file.name;
      if (preview) preview.classList.remove('hidden');
      if (dropzone) dropzone.classList.add('hidden');

      if (file.type.startsWith('image/') && thumb) {
        const reader = new FileReader();
        reader.onload = e => { thumb.src = e.target.result; };
        reader.readAsDataURL(file);
      }

      setWizardNextEnabled(true);
      saveWizardState();
    }

    // Wizard CSV file handlers
    function wizHandleCsvSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      analysisPayload.fileName = file.name;

      const reader = new FileReader();
      reader.onload = function(e) {
        analysisPayload.fileData = e.target.result;
        // Count rows
        const lines = (e.target.result || '').split('\n').filter(l => l.trim());
        const rowCount = Math.max(lines.length - 1, 0); // minus header

        const nameEl = document.getElementById('wiz-csv-name');
        const metaEl = document.getElementById('wiz-csv-meta');
        const preview = document.getElementById('wiz-csv-preview');
        if (nameEl) nameEl.textContent = file.name;
        if (metaEl) metaEl.textContent = `${rowCount} data rows loaded`;
        if (preview) preview.classList.remove('hidden');

        wizardDataReady = true;
        setWizardNextEnabled(true);
        saveWizardState();
      };
      reader.readAsText(file);
    }

    function wizClearCsv() {
      const preview = document.getElementById('wiz-csv-preview');
      const input = document.getElementById('wiz-csv-input');
      if (preview) preview.classList.add('hidden');
      if (input) input.value = '';
      wizardDataReady = false;
      analysisPayload.fileName = '';
      analysisPayload.fileData = null;
      setWizardNextEnabled(false);
    }

    // Quick form shortcut
    function toggleQuickForm() {
      const panel = document.getElementById('quick-form-panel');
      const chevron = document.getElementById('quick-form-chevron');
      if (panel) panel.classList.toggle('hidden');
      if (chevron) {
        const isHidden = panel?.classList.contains('hidden');
        chevron.setAttribute('data-lucide', isHidden ? 'chevron-down' : 'chevron-up');
        lucide.createIcons();
      }
    }

    function submitQuickForm() {
      const name = document.getElementById('quick-org-name')?.value.trim();
      const industry = document.getElementById('quick-industry')?.value;
      const size = document.getElementById('quick-size')?.value;
      const goals = document.getElementById('quick-goals')?.value.trim();

      if (!name || !industry || !size || !goals) {
        alert('Please fill in all 4 fields in the quick form.');
        return;
      }

      // Apply to analysisPayload
      analysisPayload.orgName = name;
      analysisPayload.industry = industry;
      analysisPayload.size = size;
      analysisPayload.requirements = goals;
      chatStep = 4;

      // Update profile card
      const nameEl = document.getElementById('profile-card-name');
      const indEl = document.getElementById('profile-card-industry');
      const sizeEl = document.getElementById('profile-card-size');
      const goalsEl = document.getElementById('profile-card-goals');
      if (nameEl) { nameEl.textContent = name; nameEl.className = 'text-white font-semibold truncate'; }
      if (indEl) { indEl.textContent = industry; indEl.className = 'text-white font-semibold truncate'; }
      if (sizeEl) { sizeEl.textContent = size; sizeEl.className = 'text-white font-semibold truncate'; }
      if (goalsEl) { goalsEl.textContent = goals; goalsEl.className = 'text-white font-semibold line-clamp-3'; }

      const badge = document.getElementById('profile-complete-badge');
      if (badge) badge.classList.remove('hidden');

      // Hide chat input, show generate button
      const inputContainer = document.getElementById('chat-input-text-container');
      if (inputContainer) inputContainer.classList.add('hidden');
      const optContainer = document.getElementById('chat-input-options-container');
      if (optContainer) optContainer.classList.add('hidden');

      const genWrapper = document.getElementById('wizard-generate-wrapper');
      const genWrapperMobile = document.getElementById('wizard-generate-wrapper-mobile');
      if (genWrapper) genWrapper.classList.remove('hidden');
      if (genWrapperMobile) genWrapperMobile.classList.remove('hidden');

      // Append summary message in chat
      const msgs = document.getElementById('chat-messages');
      if (msgs) {
        appendBotMessage(`✅ <strong>Quick form applied!</strong> Profile set for <strong>${name}</strong> (${industry}, ${size}). Click <strong>"Generate My Dashboard →"</strong> to proceed!`);
        chatAutoScroll();
      }

      // Close quick form
      const qPanel = document.getElementById('quick-form-panel');
      if (qPanel) qPanel.classList.add('hidden');

      lucide.createIcons();
      saveWizardState();
    }

    // Progress animation
    function setProcessingProgress(stepIdx) {
      for (let i = 0; i <= 3; i++) {
        const el = document.getElementById(`proc-step-${i}`);
        if (i <= stepIdx) {
          el.classList.remove('opacity-30');
          el.classList.add('opacity-100');
        } else {
          el.classList.add('opacity-30');
          el.classList.remove('opacity-100');
        }
      }
    }

    // Call analyze pipeline
    async function executeLocalAnalysis() {
      selectTab('processing');
      setProcessingProgress(0);
      
      const progressTimers = [
        setTimeout(() => setProcessingProgress(1), 1000),
        setTimeout(() => setProcessingProgress(2), 2200),
        setTimeout(() => setProcessingProgress(3), 3600)
      ];

      try {
        const reqPayload = {
          orgName: analysisPayload.orgName,
          industry: analysisPayload.industry,
          size: analysisPayload.size,
          requirements: analysisPayload.requirements,
          filePath: analysisPayload.filePath || ''
        };

        const response = await axios.post('/api/analyze', reqPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        currentReport = response.data.report;
        progressTimers.forEach(clearTimeout);
        setProcessingProgress(3);
        
        setTimeout(() => {
          displayDashboard();
        }, 800);
      } catch (err) {
        console.error("Local audit analysis execution failed", err);
        alert("Failed to analyze data. Please verify backend is running.");
        selectTab('new-analysis');
      }
    }

    // Display compiled results
    function displayDashboard() {
      if (!currentReport) return;
      
      // Setup Meta text
      document.getElementById('dash-report-id').innerText = `Analysis Report ID: #${currentReport.id}`;
      document.getElementById('dash-org-name').innerText = `${currentReport.orgName} Audit`;
      document.getElementById('dash-meta').innerText = `Industry Context: ${currentReport.industry} • Size: ${currentReport.size}`;
      
      // Reset Edit Mode
      isDashboardEditMode = false;
      document.getElementById('btn-edit-text').innerText = "Edit Insights";
      document.getElementById('btn-save-edits').classList.add('hidden');
      toggleEditFields(false);

      // Setup KPIs
      const json = currentReport.report_json;
      document.getElementById('kpi-rev').innerText = json.kpis.revenue;
      document.getElementById('kpi-growth').innerText = json.kpis.growth.replace(' YoY', '');
      document.getElementById('kpi-growth-badge').innerText = json.kpis.growth.split(' ')[0];
      document.getElementById('kpi-eff').innerText = json.kpis.efficiency;
      document.getElementById('kpi-risk').innerText = json.kpis.risk;
      
      // Setup Edit inputs values
      document.getElementById('edit-kpi-rev').value = json.kpis.revenue;
      document.getElementById('edit-kpi-growth').value = json.kpis.growth;
      document.getElementById('edit-kpi-eff').value = json.kpis.efficiency;
      document.getElementById('edit-kpi-risk').value = json.kpis.risk;

      // Setup SWOT Matrix lists
      setupSWOTData(json.report_text);

      // Render driver features
      const driversContainer = document.getElementById('dash-drivers-container');
      driversContainer.innerHTML = '';
      json.charts.importance.forEach(driver => {
        const item = document.createElement('div');
        item.className = "space-y-1";
        item.innerHTML = `
          <div class="flex justify-between text-xs font-semibold">
            <span class="text-gray-300">${driver.name}</span>
            <span class="text-softBlue">${driver.value}%</span>
          </div>
          <div class="h-2 w-full bg-black border border-darkBorder rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-mediumPurple to-softBlue rounded-full" style="width: ${driver.value}%"></div>
          </div>
        `;
        driversContainer.appendChild(item);
      });

      // Render recommendations
      renderRecommendationsList();

      // Render anomalies list
      const anomContainer = document.getElementById('dash-anomalies-list');
      anomContainer.innerHTML = '';
      json.charts.anomaly.forEach(anom => {
        const item = document.createElement('div');
        item.className = "border-l-4 border-rose-500 bg-rose-500/5 p-4 rounded-r-2xl border border-darkBorder flex items-start space-x-3";
        item.innerHTML = `
          <i data-lucide="alert-triangle" class="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5"></i>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">${anom.metric}</span>
              <span class="text-xs text-gray-500">${anom.date}</span>
            </div>
            <h4 class="text-sm font-bold text-gray-200 mt-2">${anom.title}</h4>
            <p class="text-xs text-gray-400 mt-1 leading-relaxed">${anom.description}</p>
          </div>
        `;
        anomContainer.appendChild(item);
      });

      // Scenario simulator default reset
      document.getElementById('sim-slider-mkt').value = 0;
      document.getElementById('sim-slider-rd').value = 0;
      document.getElementById('sim-slider-sales').value = 0;
      updateScenarioSimulation();

      // Render report text
      activeReportTab = 'exec';
      switchReportTab('exec');
      
      // Populate filters & slicers
      populateSlicers();
      clearSlicers(); // This calls applySlicers() which renders 4-charts grid and sparklines

      selectTab('dashboard');
    }

    // SWOT structure
    function setupSWOTData(textObj) {
      const strengthsText = textObj.swot_strengths || "• Strong YoY Expansion run rate\n• Solid revenue generation from core sales segment\n• Managed lean operational overhead in administration";
      const weaknessesText = textObj.swot_weaknesses || "• Operational bottleneck in CRM sales conversion\n• Inflated customer acquisition cost margins\n• Technology dependencies in single engineering knowledge silos";
      const oppsText = textObj.swot_opportunities || "• Reallocate low-performing marketing budgets into high-conversion segments\n• Introduce CRM lead scoring models to accelerate conversions\n• Contract vendor resources to stabilize headcount expenditures";
      const threatsText = textObj.swot_threats || "• Elevated customer churn in competitive sectors\n• Rising administrative costs and supply line delays\n• Attrition of senior technical staff members";

      document.getElementById('swot-strengths').innerText = strengthsText;
      document.getElementById('swot-weaknesses').innerText = weaknessesText;
      document.getElementById('swot-opportunities').innerText = oppsText;
      document.getElementById('swot-threats').innerText = threatsText;
    }

    function renderRecommendationsList() {
      const recsContainer = document.getElementById('dash-recs-container');
      recsContainer.innerHTML = '';
      currentReport.recommendations.forEach((rec, i) => {
        const item = document.createElement('div');
        item.className = "flex items-start justify-between p-4 border border-darkBorder bg-darkBg/30 rounded-xl hover:border-darkBorder/80 transition-colors shadow-md";
        
        if (isDashboardEditMode) {
          item.innerHTML = `
            <div class="flex items-start space-x-3.5 pr-4 w-full">
              <div class="h-7 w-7 rounded-full bg-softBlue/10 border border-softBlue/20 text-softBlue flex items-center justify-center font-bold text-xs font-outfit mt-0.5 flex-shrink-0">${i+1}</div>
              <div class="space-y-2 flex-grow">
                <div class="flex space-x-2">
                  <input type="text" id="edit-rec-title-${i}" value="${rec.title}" class="bg-black border border-darkBorder rounded px-2 py-1 text-xs text-white w-2/3" />
                  <input type="text" id="edit-rec-cat-${i}" value="${rec.category}" class="bg-black border border-darkBorder rounded px-2 py-1 text-[10px] text-gray-400 w-1/3 uppercase" />
                </div>
                <textarea id="edit-rec-desc-${i}" class="w-full bg-black border border-darkBorder rounded p-2 text-xs text-white h-12 resize-none">${rec.description}</textarea>
              </div>
            </div>
            <div class="text-right flex-shrink-0 pl-2">
              <span class="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Priority</span>
              <input type="number" id="edit-rec-score-${i}" value="${rec.priority_score}" class="bg-black border border-darkBorder rounded px-2 py-1 text-xs text-softBlue w-16 text-right mt-1" />
            </div>
          `;
        } else {
          item.innerHTML = `
            <div class="flex items-start space-x-3.5 pr-4">
              <div class="h-7 w-7 rounded-full bg-softBlue/10 border border-softBlue/20 text-softBlue flex items-center justify-center font-bold text-xs font-outfit mt-0.5 flex-shrink-0">${i+1}</div>
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="text-sm font-bold text-gray-200">${rec.title}</h4>
                  <span class="text-[10px] font-bold text-gray-400 bg-darkBorder/50 px-2 py-0.5 rounded-full uppercase tracking-wider">${rec.category}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed text-justify">${rec.description}</p>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <span class="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Priority</span>
              <span class="text-sm font-bold text-softBlue font-outfit mt-0.5 block">${rec.priority_score}</span>
            </div>
          `;
        }
        recsContainer.appendChild(item);
      });
    }

    // Toggle edit dashboard modes
    function toggleEditMode() {
      isDashboardEditMode = !isDashboardEditMode;
      const btnText = document.getElementById('btn-edit-text');
      const btnSave = document.getElementById('btn-save-edits');

      if (isDashboardEditMode) {
        btnText.innerText = "Cancel Edits";
        btnSave.classList.remove('hidden');
        toggleEditFields(true);
      } else {
        btnText.innerText = "Edit Insights";
        btnSave.classList.add('hidden');
        toggleEditFields(false);
      }
      renderRecommendationsList();
    }

    function toggleEditFields(enable) {
      const kpis = ['rev', 'growth', 'eff', 'risk'];
      kpis.forEach(k => {
        const span = document.getElementById(`kpi-${k}`);
        const input = document.getElementById(`edit-kpi-${k}`);
        if (enable) {
          span.classList.add('hidden');
          input.classList.remove('hidden');
        } else {
          span.classList.remove('hidden');
          input.classList.add('hidden');
        }
      });

      const textContainer = document.getElementById('dash-report-text');
      const textEdit = document.getElementById('edit-report-text');
      
      if (enable) {
        textContainer.classList.add('hidden');
        textEdit.classList.remove('hidden');
        const activeTextObj = currentReport.report_json.report_text;
        textEdit.value = activeTextObj[getReportKeyForTab(activeReportTab)];
      } else {
        textContainer.classList.remove('hidden');
        textEdit.classList.add('hidden');
      }

      const swotQuadrants = ['strengths', 'weaknesses', 'opportunities', 'threats'];
      swotQuadrants.forEach(quad => {
        const el = document.getElementById(`swot-${quad}`);
        if (enable) {
          el.contentEditable = "true";
          el.classList.add('border', 'border-darkBorder/85', 'p-2', 'bg-black', 'rounded-xl');
        } else {
          el.contentEditable = "false";
          el.classList.remove('border', 'border-darkBorder/85', 'p-2', 'bg-black', 'rounded-xl');
        }
      });
    }

    function getReportKeyForTab(tab) {
      if (tab === 'exec') return 'executive_summary';
      if (tab === 'swot') return 'performance_analysis';
      if (tab === 'root') return 'root_cause';
      if (tab === 'bench') return 'competitor_benchmarking';
      return 'executive_summary';
    }

    // Save dashboard edits via PUT /api/reports/:id
    async function saveDashboardEdits() {
      if (!currentReport) return;
      
      const json = currentReport.report_json;
      
      json.kpis.revenue = document.getElementById('edit-kpi-rev').value;
      json.kpis.growth = document.getElementById('edit-kpi-growth').value;
      json.kpis.efficiency = document.getElementById('edit-kpi-eff').value;
      json.kpis.risk = document.getElementById('edit-kpi-risk').value;

      if (isDashboardEditMode) {
        const textEditVal = document.getElementById('edit-report-text').value;
        const activeKey = getReportKeyForTab(activeReportTab);
        json.report_text[activeKey] = textEditVal;
      }

      json.report_text.swot_strengths = document.getElementById('swot-strengths').innerText;
      json.report_text.swot_weaknesses = document.getElementById('swot-weaknesses').innerText;
      json.report_text.swot_opportunities = document.getElementById('swot-opportunities').innerText;
      json.report_text.swot_threats = document.getElementById('swot-threats').innerText;

      const updatedRecs = [];
      currentReport.recommendations.forEach((rec, i) => {
        updatedRecs.push({
          title: document.getElementById(`edit-rec-title-${i}`).value,
          category: document.getElementById(`edit-rec-cat-${i}`).value,
          description: document.getElementById(`edit-rec-desc-${i}`).value,
          priority_score: parseInt(document.getElementById(`edit-rec-score-${i}`).value)
        });
      });
      currentReport.recommendations = updatedRecs;

      try {
        await axios.put(`/api/reports/${currentReport.id}`, {
          report_json: json,
          recommendations: updatedRecs
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert("Dashboard edits saved successfully!");
        await fetchReportsList();
        displayDashboard();
      } catch (err) {
        console.error("Save dashboard edits failed", err);
        alert("Failed to save modifications back to server.");
      }
    }

    // Scenario simulator calculator
    function updateScenarioSimulation() {
      const sMkt = parseInt(document.getElementById('sim-slider-mkt').value);
      const sRd = parseInt(document.getElementById('sim-slider-rd').value);
      const sSales = parseInt(document.getElementById('sim-slider-sales').value);

      document.getElementById('sim-val-mkt').innerText = `${sMkt > 0 ? '+' : ''}${sMkt}%`;
      document.getElementById('sim-val-rd').innerText = `${sRd > 0 ? '+' : ''}${sRd}%`;
      document.getElementById('sim-val-sales').innerText = `${sSales > 0 ? '+' : ''}${sSales}%`;

      if (!currentReport) return;
      
      const json = currentReport.report_json;
      const baseRevClean = parseFloat(json.kpis.revenue.replace(/[^0-9]/g, ''));
      
      const mktImpact = (sMkt / 100) * 0.38;
      const rdImpact = (sRd / 100) * 0.24;
      const salesImpact = (sSales / 100) * 0.18;
      
      const totalGrowthFactor = mktImpact + rdImpact + salesImpact;
      const simulatedRev = Math.max(0, Math.round(baseRevClean * (1 + totalGrowthFactor)));
      
      const totalCostMultiplier = 1 + ((sMkt * 0.2 + sRd * 0.3 + sSales * 0.1) / 100);
      const simulatedRoi = totalCostMultiplier > 0 ? (totalGrowthFactor * 3.5 / totalCostMultiplier) : 1.0;
      
      document.getElementById('sim-out-rev').innerText = `$${simulatedRev.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      document.getElementById('sim-out-percent').innerText = `${totalGrowthFactor >= 0 ? '+' : ''}${(totalGrowthFactor * 100).toFixed(1)}%`;
      document.getElementById('sim-out-roi').innerText = `${Math.max(0.2, simulatedRoi + 1.2).toFixed(1)}x`;
    }

    // Chart tab switcher
    // --- 4-CHART GRID RENDERER & SLICERS LOGIC ---
    let activeDrillDownDept = null;

    function renderAllCharts(chartsData) {
      if (window.chartsList) {
        window.chartsList.forEach(chart => { if (chart) chart.destroy(); });
      }
      window.chartsList = [];

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#7C6FFF';
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8DA8FF';
      const cardBgColor = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || 'rgba(22,22,42,0.85)';
      const textPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#FFFFFF';
      const textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#9CA3AF';
      
      const isDark = currentThemeKey === 'custom' ? isDarkVariant : themePresets[currentThemeKey].isDark;
      const gridColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';

      // Chart 1: Trend & Forecast (Line)
      const trendCanvas = document.getElementById('chart-trend');
      if (trendCanvas) {
        const labels = chartsData.trend.map(t => t.date);
        const revs = chartsData.trend.map(t => t.revenue !== undefined ? t.revenue : null);
        const forecasts = chartsData.trend.map(t => t.forecast !== undefined ? t.forecast : null);
        const exps = chartsData.trend.map(t => t.expenses !== undefined ? t.expenses : null);
        const activeMetric = document.getElementById('filter-metric')?.value || 'revenue';
        
        const datasets = [];
        if (activeMetric === 'revenue') {
          datasets.push({
            label: 'Historical Revenue',
            data: revs,
            borderColor: primaryColor,
            backgroundColor: isDark ? 'rgba(124, 111, 255, 0.05)' : 'rgba(37, 99, 235, 0.05)',
            fill: true,
            borderWidth: 2.5,
            tension: 0.2
          });
          if (forecasts.some(f => f !== null)) {
            datasets.push({
              label: '6-Month Projection',
              data: forecasts,
              borderColor: accentColor,
              borderDash: [5, 5],
              borderWidth: 2.5,
              fill: false,
              tension: 0.1
            });
          }
        } else {
          datasets.push({
            label: 'Historical Expenses',
            data: exps,
            borderColor: '#F43F5E',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            fill: true,
            borderWidth: 2.5,
            tension: 0.2
          });
        }

        const chartTrend = new Chart(trendCanvas.getContext('2d'), {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textSecondaryColor, font: { size: 9 } } },
              y: { grid: { color: gridColor }, ticks: { color: textSecondaryColor, font: { size: 9 } } }
            },
            plugins: {
              legend: { labels: { color: textPrimaryColor, font: { size: 9 } } }
            }
          }
        });
        window.chartsList.push(chartTrend);
      }

      // Chart 2: Department Breakdown (Bar)
      const deptCanvas = document.getElementById('chart-dept');
      if (deptCanvas) {
        const labels = chartsData.department.map(d => d.name);
        const revs = chartsData.department.map(d => d.revenue);
        const exps = chartsData.department.map(d => d.expenses);

        const chartDept = new Chart(deptCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Revenue', data: revs, backgroundColor: primaryColor, borderRadius: 4 },
              { label: 'Expenses', data: '#F43F5E', backgroundColor: '#F43F5E', borderRadius: 4 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const index = elements[0].index;
                const deptName = labels[index];
                drillDownDepartment(deptName);
              }
            },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textSecondaryColor, font: { size: 9 } } },
              y: { grid: { color: gridColor }, ticks: { color: textSecondaryColor, font: { size: 9 } } }
            },
            plugins: {
              legend: { labels: { color: textPrimaryColor, font: { size: 9 } } }
            }
          }
        });
        window.chartsList.push(chartDept);
      }

      // Chart 3: Resource Allocation (Doughnut)
      const allocCanvas = document.getElementById('chart-alloc');
      if (allocCanvas) {
        const labels = chartsData.allocation.map(a => a.name);
        const values = chartsData.allocation.map(a => a.value);
        const chartColors = [
          primaryColor,
          accentColor,
          '#EF4444',
          '#EC4899',
          '#F59E0B',
          '#10B981'
        ];

        const chartAlloc = new Chart(allocCanvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              data: values,
              backgroundColor: chartColors,
              borderWidth: 2,
              borderColor: cardBgColor.includes('rgba') ? 'rgba(0,0,0,0)' : cardBgColor
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right', labels: { color: textPrimaryColor, font: { size: 9 } } }
            }
          }
        });
        window.chartsList.push(chartAlloc);
      }

      // Chart 4: Explainability / Importance (Horizontal Bar)
      const explainCanvas = document.getElementById('chart-explain');
      if (explainCanvas) {
        const labels = chartsData.importance.map(i => i.name);
        const values = chartsData.importance.map(i => i.value);

        const chartExplain = new Chart(explainCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Importance Value (%)',
              data: values,
              backgroundColor: primaryColor,
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textSecondaryColor, font: { size: 9 } } },
              y: { grid: { color: gridColor }, ticks: { color: textSecondaryColor, font: { size: 9 } } }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
        window.chartsList.push(chartExplain);
      }
    }

    function renderAllSparklines(chartsData) {
      if (window.sparklinesList) {
        window.sparklinesList.forEach(s => { if (s) s.destroy(); });
      }
      window.sparklinesList = [];

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#7C6FFF';
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8DA8FF';

      function getSparklineOpt(data, color) {
        return {
          type: 'line',
          data: {
            labels: data.map((_, i) => i),
            datasets: [{
              data,
              borderColor: color,
              borderWidth: 1.5,
              pointRadius: 0,
              fill: false,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { display: false }, y: { display: false } },
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        };
      }

      // 1. Revenue Sparkline
      const revCanvas = document.getElementById('sparkline-rev');
      if (revCanvas) {
        const revData = chartsData.trend.filter(t => t.revenue !== undefined).map(t => t.revenue);
        const sRev = new Chart(revCanvas.getContext('2d'), getSparklineOpt(revData, primaryColor));
        window.sparklinesList.push(sRev);
      }

      // 2. Growth Sparkline
      const growthCanvas = document.getElementById('sparkline-growth');
      if (growthCanvas) {
        const growthData = chartsData.trend.filter(t => t.revenue !== undefined).map((t, idx, arr) => {
          if (idx === 0) return 0;
          const prev = arr[idx-1].revenue;
          return prev > 0 ? ((t.revenue - prev) / prev) * 100 : 0;
        });
        const sGrowth = new Chart(growthCanvas.getContext('2d'), getSparklineOpt(growthData, accentColor));
        window.sparklinesList.push(sGrowth);
      }

      // 3. Efficiency Sparkline
      const effCanvas = document.getElementById('sparkline-eff');
      if (effCanvas) {
        const effData = chartsData.trend.filter(t => t.revenue !== undefined && t.expenses !== undefined).map(t => {
          return t.expenses > 0 ? (t.revenue / t.expenses) * 100 : 50;
        });
        const sEff = new Chart(effCanvas.getContext('2d'), getSparklineOpt(effData, '#10B981'));
        window.sparklinesList.push(sEff);
      }

      // 4. Risk Sparkline
      const riskCanvas = document.getElementById('sparkline-risk');
      if (riskCanvas) {
        const riskData = chartsData.trend.filter(t => t.expenses !== undefined).map(t => t.expenses);
        const sRisk = new Chart(riskCanvas.getContext('2d'), getSparklineOpt(riskData, '#EF4444'));
        window.sparklinesList.push(sRisk);
      }
    }

    function populateSlicers() {
      const deptSelect = document.getElementById('filter-dept');
      if (!deptSelect || !currentReport) return;
      
      deptSelect.innerHTML = '<option value="all">All Departments</option>';
      const depts = currentReport.report_json.charts.department.map(d => d.name);
      depts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.innerText = d;
        deptSelect.appendChild(opt);
      });
    }

    function applySlicers() {
      if (!currentReport) return;
      const rawCharts = currentReport.report_json.charts;
      
      const dateVal = document.getElementById('filter-date').value;
      const deptVal = document.getElementById('filter-dept').value;
      const metricVal = document.getElementById('filter-metric').value;
      
      let filteredCharts = JSON.parse(JSON.stringify(rawCharts));
      
      if (dateVal === 'last-6') {
        const hist = filteredCharts.trend.filter(t => t.revenue !== undefined);
        const proj = filteredCharts.trend.filter(t => t.forecast !== undefined);
        filteredCharts.trend = hist.slice(-6).concat(proj);
      } else if (dateVal === 'last-3') {
        const hist = filteredCharts.trend.filter(t => t.revenue !== undefined);
        const proj = filteredCharts.trend.filter(t => t.forecast !== undefined);
        filteredCharts.trend = hist.slice(-3).concat(proj);
      }
      
      let activeRevenue = 0;
      let activeExpenses = 0;
      
      if (deptVal !== 'all') {
        filteredCharts.department = filteredCharts.department.filter(d => d.name === deptVal);
        filteredCharts.allocation = filteredCharts.allocation.filter(a => a.name === deptVal);
        
        const deptData = rawCharts.department.find(d => d.name === deptVal);
        if (deptData) {
          activeRevenue = deptData.revenue;
          activeExpenses = deptData.expenses;
        }
        
        const deptAlloc = rawCharts.allocation.find(a => a.name === deptVal);
        const allocationPct = deptAlloc ? (deptAlloc.percentage / 100) : 0.2;
        filteredCharts.trend.forEach(t => {
          if (t.revenue !== undefined) t.revenue = Math.round(t.revenue * allocationPct);
          if (t.expenses !== undefined) t.expenses = Math.round(t.expenses * allocationPct);
          if (t.forecast !== undefined) t.forecast = Math.round(t.forecast * allocationPct);
        });
      } else {
        rawCharts.department.forEach(d => {
          activeRevenue += d.revenue;
          activeExpenses += d.expenses;
        });
      }
      
      if (deptVal !== 'all') {
        document.getElementById('kpi-rev').innerText = `$${activeRevenue.toLocaleString()}`;
        const growthVal = parseFloat(currentReport.report_json.kpis.growth);
        document.getElementById('kpi-growth').innerText = currentReport.report_json.kpis.growth.replace(' YoY', '');
        document.getElementById('kpi-growth-badge').innerText = currentReport.report_json.kpis.growth.split(' ')[0];
        
        const effScore = Math.min(100, Math.round((activeRevenue / (activeExpenses || 1)) * 50));
        document.getElementById('kpi-eff').innerText = `${effScore}/100`;
        
        const riskLevel = (activeRevenue / (activeExpenses || 1)) > 1.3 ? "Low" : ((activeRevenue / (activeExpenses || 1)) > 1.1 ? "Moderate" : "High");
        document.getElementById('kpi-risk').innerText = riskLevel;
      } else {
        const json = currentReport.report_json;
        document.getElementById('kpi-rev').innerText = json.kpis.revenue;
        document.getElementById('kpi-growth').innerText = json.kpis.growth.replace(' YoY', '');
        document.getElementById('kpi-growth-badge').innerText = json.kpis.growth.split(' ')[0];
        document.getElementById('kpi-eff').innerText = json.kpis.efficiency;
        document.getElementById('kpi-risk').innerText = json.kpis.risk;
      }

      renderAllCharts(filteredCharts);
      renderAllSparklines(filteredCharts);
    }

    function clearSlicers() {
      document.getElementById('filter-date').value = 'all';
      document.getElementById('filter-dept').value = 'all';
      document.getElementById('filter-metric').value = 'revenue';
      activeDrillDownDept = null;
      applySlicers();
    }

    function drillDownDepartment(deptName) {
      const deptSelect = document.getElementById('filter-dept');
      if (deptSelect) {
        if (activeDrillDownDept === deptName) {
          deptSelect.value = 'all';
          activeDrillDownDept = null;
        } else {
          deptSelect.value = deptName;
          activeDrillDownDept = deptName;
        }
        applySlicers();
      }
    }

    function exportChartAsPNG(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${canvasId}.png`;
      link.href = url;
      link.click();
    }

    // --- SHARE MODULE DIALOG ---
    function openShareModal() {
      if (!currentReport) return;
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${currentReport.id}`;
      document.getElementById('share-link-input').value = shareUrl;
      document.getElementById('share-modal').classList.remove('hidden');
      document.getElementById('share-copied-toast').classList.add('hidden');
    }

    function closeShareModal() {
      document.getElementById('share-modal').classList.add('hidden');
    }

    function copyShareLink() {
      const input = document.getElementById('share-link-input');
      input.select();
      navigator.clipboard.writeText(input.value);
      document.getElementById('share-copied-toast').classList.remove('hidden');
    }

    // --- REPORT PREVIEW DRAWER ---
    function openPDFPreviewDrawer() {
      if (!currentReport) return;
      
      const drawer = document.getElementById('pdf-preview-drawer');
      drawer.classList.remove('hidden');
      setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
      
      const container = document.getElementById('pdf-preview-pages');
      container.innerHTML = '';
      
      try {
        const json = currentReport.report_json || {};
        const dateStr = currentReport.created_at ? new Date(currentReport.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#7C6FFF';
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8DA8FF';
        const cardBgColor = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || 'rgba(22, 22, 42, 0.85)';
        const border = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || 'rgba(141, 168, 255, 0.08)';

        let trendImg = '', deptImg = '', allocImg = '', explainImg = '';
        try {
          const trendCanvas = document.getElementById('chart-trend');
          if (trendCanvas) trendImg = trendCanvas.toDataURL('image/png');
        } catch (e) { console.warn("Failed to get trend image", e); }
        
        try {
          const deptCanvas = document.getElementById('chart-dept');
          if (deptCanvas) deptImg = deptCanvas.toDataURL('image/png');
        } catch (e) { console.warn("Failed to get dept image", e); }
        
        try {
          const allocCanvas = document.getElementById('chart-alloc');
          if (allocCanvas) allocImg = allocCanvas.toDataURL('image/png');
        } catch (e) { console.warn("Failed to get alloc image", e); }
        
        try {
          const explainCanvas = document.getElementById('chart-explain');
          if (explainCanvas) explainImg = explainCanvas.toDataURL('image/png');
        } catch (e) { console.warn("Failed to get explain image", e); }

        const kpis = json.kpis || { revenue: '$0', growth: '0%', efficiency: '0/100', risk: 'Low' };
        const reportText = json.report_text || {};
        const recommendations = currentReport.recommendations || json.recommendations || [];

        const execSummary = reportText.executive_summary || '';
        const explainAnalysis = reportText.explainability_analysis || reportText.root_cause || '';
        
        const swotStrengths = reportText.swot_strengths || '';
        const swotWeaknesses = reportText.swot_weaknesses || '';
        const swotOpportunities = reportText.swot_opportunities || '';
        const swotThreats = reportText.swot_threats || '';

        const pagesData = [
          // COVER Page
          `
          <div class="mini-page flex flex-col justify-between" style="background: ${isDarkVariant ? '#0F0F1A' : '#FFFFFF'}; color: ${isDarkVariant ? '#FFFFFF' : '#1A1A1A'};">
            <div style="border-top: 8px solid ${primaryColor}; padding: 15px;">
              <span style="font-size: 8px; color: ${primaryColor}; font-weight: bold; font-family: 'Outfit';">ORGANALYTICS DIRECTIVE</span>
              <h1 style="font-size: 14px; font-weight: 800; font-family: 'Outfit'; margin-top: 4px; line-height: 1.2;">Strategic Organizational Diagnostics Report</h1>
              <p style="font-size: 7px; color: #6B7280; margin-top: 2px;">Prepared for: <strong>${currentReport.orgName || 'Organization'}</strong></p>
              <p style="font-size: 6px; color: #9CA3AF;">Date: ${dateStr} • Sector: ${currentReport.industry || 'General'}</p>
            </div>
            <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
              <div style="grid-template-columns: repeat(2, minmax(0, 1fr)); display: grid; gap: 6px;">
                <div style="background: ${isDarkVariant ? 'rgba(255,255,255,0.03)' : '#F3F4F6'}; border: 1px solid ${border}; padding: 6px; border-radius: 4px;">
                  <span style="font-size: 5px; color: #9CA3AF; display: block;">Revenue</span>
                  <span style="font-size: 8px; font-weight: bold; color: ${primaryColor};">${kpis.revenue}</span>
                </div>
                <div style="background: ${isDarkVariant ? 'rgba(255,255,255,0.03)' : '#F3F4F6'}; border: 1px solid ${border}; padding: 6px; border-radius: 4px;">
                  <span style="font-size: 5px; color: #9CA3AF; display: block;">YoY Growth</span>
                  <span style="font-size: 8px; font-weight: bold; color: ${accentColor};">${kpis.growth}</span>
                </div>
                <div style="background: ${isDarkVariant ? 'rgba(255,255,255,0.03)' : '#F3F4F6'}; border: 1px solid ${border}; padding: 6px; border-radius: 4px;">
                  <span style="font-size: 5px; color: #9CA3AF; display: block;">Efficiency</span>
                  <span style="font-size: 8px; font-weight: bold; color: #10B981;">${kpis.efficiency}</span>
                </div>
                <div style="background: ${isDarkVariant ? 'rgba(255,255,255,0.03)' : '#F3F4F6'}; border: 1px solid ${border}; padding: 6px; border-radius: 4px;">
                  <span style="font-size: 5px; color: #9CA3AF; display: block;">Risk Level</span>
                  <span style="font-size: 8px; font-weight: bold; color: #EF4444;">${kpis.risk}</span>
                </div>
              </div>
              <p style="font-size: 6px; line-height: 1.4; color: #6B7280; margin-top: 15px; border-top: 1px solid ${border}; padding-top: 8px;">
                ${execSummary.substring(0, 180)}...
              </p>
            </div>
            <div style="border-top: 1px solid ${border}; padding: 6px 15px; font-size: 5px; color: #9CA3AF; display: flex; justify-content: space-between;">
              <span>CONFIDENTIAL REPORT</span>
              <span>Page 1 of 5</span>
            </div>
          </div>
          `,
          // DIAGNOSTICS Page
          `
          <div class="mini-page flex flex-col justify-between" style="background: ${isDarkVariant ? '#0F0F1A' : '#FFFFFF'}; color: ${isDarkVariant ? '#FFFFFF' : '#1A1A1A'};">
            <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
              <h2 style="font-size: 9px; font-weight: bold; border-bottom: 1px solid ${primaryColor}; padding-bottom: 2px;">01 / Performance Diagnostics</h2>
              <p style="font-size: 6px; color: #6B7280; margin-top: 4px;">Historical Revenue Trend & Departmental breakdown indicators.</p>
              
              <div style="margin-top: 10px; flex-grow: 1; display: flex; flex-direction: column; gap: 8px;">
                <div style="height: 110px; border: 1px solid ${border}; border-radius: 4px; padding: 4px;">
                  <img src="${trendImg}" style="height: 100%; width: 100%; object-fit: contain;" />
                </div>
                <div style="height: 90px; border: 1px solid ${border}; border-radius: 4px; padding: 4px;">
                  <img src="${deptImg}" style="height: 100%; width: 100%; object-fit: contain;" />
                </div>
              </div>
            </div>
            <div style="border-top: 1px solid ${border}; padding: 6px 15px; font-size: 5px; color: #9CA3AF; display: flex; justify-content: space-between;">
              <span>Performance Review</span>
              <span>Page 2 of 5</span>
            </div>
          </div>
          `,
          // EXPLAINABILITY Page
          `
          <div class="mini-page flex flex-col justify-between" style="background: ${isDarkVariant ? '#0F0F1A' : '#FFFFFF'}; color: ${isDarkVariant ? '#FFFFFF' : '#1A1A1A'};">
            <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
              <h2 style="font-size: 9px; font-weight: bold; border-bottom: 1px solid ${primaryColor}; padding-bottom: 2px;">02 / Explainability & Anomaly Scan</h2>
              <p style="font-size: 6px; color: #6B7280; margin-top: 4px;">Feature importance correlation calculations and spending variances.</p>
              
              <div style="margin-top: 10px; flex-grow: 1; display: flex; flex-direction: column; gap: 8px;">
                <div style="height: 110px; border: 1px solid ${border}; border-radius: 4px; padding: 4px;">
                  <img src="${explainImg}" style="height: 100%; width: 100%; object-fit: contain;" />
                </div>
                <div style="flex-grow: 1; border: 1px solid ${border}; border-radius: 4px; padding: 6px; font-size: 5px;">
                  <strong style="display: block; margin-bottom: 2px;">Key Observations:</strong>
                  <p style="line-height: 1.3; color: #4B5563;">${explainAnalysis.substring(0, 200)}...</p>
                </div>
              </div>
            </div>
            <div style="border-top: 1px solid ${border}; padding: 6px 15px; font-size: 5px; color: #9CA3AF; display: flex; justify-content: space-between;">
              <span>Statistical Drivers</span>
              <span>Page 3 of 5</span>
            </div>
          </div>
          `,
          // SWOT Page
          `
          <div class="mini-page flex flex-col justify-between" style="background: ${isDarkVariant ? '#0F0F1A' : '#FFFFFF'}; color: ${isDarkVariant ? '#FFFFFF' : '#1A1A1A'};">
            <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
              <h2 style="font-size: 9px; font-weight: bold; border-bottom: 1px solid ${primaryColor}; padding-bottom: 2px;">03 / SWOT & Risk Assessment</h2>
              
              <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; flex-grow: 1;">
                <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.1); padding: 4px; border-radius: 4px; font-size: 5px;">
                  <strong>Strengths</strong>
                  <div style="color: #6B7280; margin-top: 2px;">${swotStrengths.substring(0, 80)}...</div>
                </div>
                <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); padding: 4px; border-radius: 4px; font-size: 5px;">
                  <strong>Weaknesses</strong>
                  <div style="color: #6B7280; margin-top: 2px;">${swotWeaknesses.substring(0, 80)}...</div>
                </div>
                <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.1); padding: 4px; border-radius: 4px; font-size: 5px;">
                  <strong>Opportunities</strong>
                  <div style="color: #6B7280; margin-top: 2px;">${swotOpportunities.substring(0, 80)}...</div>
                </div>
                <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.1); padding: 4px; border-radius: 4px; font-size: 5px;">
                  <strong>Threats</strong>
                  <div style="color: #6B7280; margin-top: 2px;">${swotThreats.substring(0, 80)}...</div>
                </div>
              </div>
              
              <div style="margin-top: 8px; border: 1px solid ${border}; padding: 6px; border-radius: 4px; font-size: 5px;">
                <strong>Risk Exposure Evaluation</strong>
                <div style="display: flex; items-center; justify-between; margin-top: 4px;">
                  <span>Risk Level: <strong>${kpis.risk}</strong></span>
                  <div style="width: 100px; height: 4px; background: #E5E7EB; border-radius: 2px; position: relative;">
                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${kpis.risk === 'Low' ? '25%' : (kpis.risk === 'Moderate' ? '50%' : '80%')}; background: ${kpis.risk === 'Low' ? '#10B981' : (kpis.risk === 'Moderate' ? '#F59E0B' : '#EF4444')}; border-radius: 2px;"></div>
                  </div>
                </div>
              </div>
            </div>
            <div style="border-top: 1px solid ${border}; padding: 6px 15px; font-size: 5px; color: #9CA3AF; display: flex; justify-content: space-between;">
              <span>SWOT & Risk Assessment</span>
              <span>Page 4 of 5</span>
            </div>
          </div>
          `,
          // ROADMAP Page
          `
          <div class="mini-page flex flex-col justify-between" style="background: ${isDarkVariant ? '#0F0F1A' : '#FFFFFF'}; color: ${isDarkVariant ? '#FFFFFF' : '#1A1A1A'};">
            <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
              <h2 style="font-size: 9px; font-weight: bold; border-bottom: 1px solid ${primaryColor}; padding-bottom: 2px;">04 / Strategic Growth Roadmap</h2>
              <p style="font-size: 6px; color: #6B7280; margin-top: 4px;">Top strategic action recommendations and timeline goals.</p>
              
              <div style="margin-top: 10px; flex-grow: 1; display: flex; flex-direction: column; gap: 5px;">
                ${recommendations.slice(0, 3).map((rec, i) => `
                  <div style="border-left: 2px solid ${primaryColor}; background: ${isDarkVariant ? 'rgba(255,255,255,0.01)' : '#F9FAFB'}; padding: 4px 6px; border-radius: 0 4px 4px 0; border-top: 1px solid ${border}; border-right: 1px solid ${border}; border-bottom: 1px solid ${border}; font-size: 5px;">
                    <strong>${i+1}. ${rec.title || 'Action Item'} (${rec.category || 'general'})</strong>
                    <p style="color: #6B7280; margin-top: 1px;">${(rec.description || '').substring(0, 80)}...</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="border-top: 1px solid ${border}; padding: 6px 15px; font-size: 5px; color: #9CA3AF; display: flex; justify-content: space-between;">
              <span>Roadmap Checklist</span>
              <span>Page 5 of 5</span>
            </div>
          </div>
          `
        ];

        pagesData.forEach(pageHtml => {
          const pageContainer = document.createElement('div');
          pageContainer.className = "relative p-1 bg-black/40 border border-darkBorder/40 rounded-xl shadow-md";
          pageContainer.innerHTML = pageHtml;
          container.appendChild(pageContainer);
        });
      } catch (err) {
        console.error("Error populating preview drawer:", err);
        container.innerHTML = `<div class="text-xs text-red-400 p-4">Error loading report preview: ${err.message}</div>`;
      }
      
      lucide.createIcons();
    }

    function closePDFPreviewDrawer() {
      const drawer = document.getElementById('pdf-preview-drawer');
      drawer.classList.add('translate-x-full');
      setTimeout(() => drawer.classList.add('hidden'), 300);
    }

    async function loadReadOnlyReport(reportId) {
      try {
        const res = await axios.get(`/api/reports/public/${reportId}`);
        currentReport = res.data;
        
        // Hide sidebar, header items, profile items
        const sidebar = document.querySelector('aside');
        if (sidebar) sidebar.classList.add('hidden');
        
        const btnEdit = document.getElementById('btn-edit-mode');
        if (btnEdit) btnEdit.classList.add('hidden');
        const shareBtn = document.getElementById('btn-report-share');
        if (shareBtn) shareBtn.classList.add('hidden');
        
        const userBadge = document.getElementById('header-user-badge');
        if (userBadge) userBadge.parentElement.classList.add('hidden');
        
        // Show report
        switchView('app-shell');
        displayDashboard();
      } catch (err) {
        console.error("Public report fetch failed:", err);
        alert("Unable to fetch shared report data.");
        showLanding();
      }
    }

    
    function switchReportTab(tab) {
      activeReportTab = tab;
      
      const tabs = ['exec', 'swot', 'root', 'bench'];
      tabs.forEach(t => {
        const btn = document.getElementById(`rep-tab-${t}`);
        if (t === tab) {
          btn.className = "pb-1 px-3 border-b-2 border-softBlue text-white";
        } else {
          btn.className = "pb-1 px-3 border-b-2 border-transparent text-gray-500 hover:text-gray-300";
        }
      });

      if (!currentReport) return;
      
      const txtDiv = document.getElementById('dash-report-text');
      const textEdit = document.getElementById('edit-report-text');
      const textObj = currentReport.report_json.report_text;

      if (isDashboardEditMode) {
        textEdit.value = textObj[getReportKeyForTab(tab)];
      }

      if (tab === 'exec') {
        txtDiv.innerHTML = `<p>${textObj.executive_summary}</p>`;
      } 
      else if (tab === 'swot') {
        txtDiv.innerHTML = `
          <p>${textObj.performance_analysis}</p>
          <div class="pt-2 border-t border-darkBorder/40">
            <span class="font-bold text-gray-300 block mb-1">Risk Assessment:</span>
            <p>${textObj.risk_assessment}</p>
          </div>
        `;
      } 
      else if (tab === 'root') {
        txtDiv.innerHTML = `
          <p>${textObj.root_cause}</p>
          <div class="pt-2 border-t border-darkBorder/40">
            <span class="font-bold text-gray-300 block mb-1">Anomaly Diagnostics:</span>
            <p>${textObj.anomaly_analysis}</p>
          </div>
        `;
      } 
      else if (tab === 'bench') {
        txtDiv.innerHTML = `
          <p>${textObj.competitor_benchmarking}</p>
          <div class="pt-2 border-t border-darkBorder/40">
            <span class="font-bold text-gray-300 block mb-1">Forecast Metrics Context:</span>
            <p>${textObj.forecasting_analysis}</p>
          </div>
        `;
      }
    }

    // PDF Client-side compiler using html2pdf
    async function downloadReportAsPDF() {
      if (!currentReport) return;
      
      const btn = document.querySelector('button[onclick="downloadReportAsPDF()"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i class="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></i> <span>Generating PDF...</span>`;
      btn.disabled = true;

      try {
        const chartsData = {
          trend: document.getElementById('chart-trend').toDataURL('image/png'),
          dept: document.getElementById('chart-dept').toDataURL('image/png'),
          alloc: document.getElementById('chart-alloc').toDataURL('image/png'),
          explain: document.getElementById('chart-explain').toDataURL('image/png')
        };

        const themeColors = {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
          bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
          cardBg: getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim(),
          textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
          textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
          border: getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
        };

        const payload = {
          orgName: currentReport.orgName,
          industry: currentReport.industry,
          size: currentReport.size,
          kpis: currentReport.report_json.kpis,
          recommendations: currentReport.recommendations,
          anomalies: currentReport.report_json.anomalies || [],
          report_text: currentReport.report_json.report_text,
          charts: chartsData,
          theme: themeColors
        };

        const response = await axios.post('/api/reports/download-pdf', payload, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        
        const dateStr = new Date().toISOString().slice(0, 10);
        link.download = `OrgAnalytics_${currentReport.orgName.replace(/\s+/g, '_')}_Report_${dateStr}.pdf`;
        link.click();
      } catch (err) {
        console.error("Failed to download PDF report:", err);
        alert("Server-side PDF generation failed: " + (err.response?.data?.detail || err.message));
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }


    // ═══════════════════════════════════════════════════════════════════
    // FEATURE 1: DASHBOARD AI CHAT PANEL
    // Chat history persisted in localStorage keyed by reportId
    // Max 50 messages per report. Timestamps on every message.
    // Desktop: side drawer. Mobile: full-screen bottom sheet.
    // ═══════════════════════════════════════════════════════════════════

    const CHAT_MAX_MESSAGES = 50;
    let dashboardChatOpen = false;

    function getChatStorageKey(reportId) {
      return `organalytics_chat_${reportId}`;
    }

    function loadChatHistory(reportId) {
      try {
        const raw = localStorage.getItem(getChatStorageKey(reportId));
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    }

    function saveChatHistory(reportId, messages) {
      try {
        // Keep max 50 messages
        const trimmed = messages.slice(-CHAT_MAX_MESSAGES);
        localStorage.setItem(getChatStorageKey(reportId), JSON.stringify(trimmed));
      } catch(e) { console.error('Chat history save failed:', e); }
    }

    function clearChatHistory(reportId) {
      try { localStorage.removeItem(getChatStorageKey(reportId)); } catch {}
    }

    function getRelativeTime(timestamp) {
      const now = Date.now();
      const diff = Math.floor((now - timestamp) / 1000);
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
      return `${Math.floor(diff / 86400)} d ago`;
    }

    function renderChatMessage(msg, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const isUser = msg.role === 'user';
      const timeStr = getRelativeTime(msg.timestamp);

      const wrapper = document.createElement('div');
      wrapper.className = `flex ${isUser ? 'justify-end' : 'justify-start'} group`;
      wrapper.innerHTML = `
        <div class="max-w-[85%] ${isUser ? '' : 'w-full'}">
          <div class="flex items-end gap-1.5 ${isUser ? 'flex-row-reverse' : ''}">
            ${!isUser ? `<div class="h-6 w-6 rounded-full bg-gradient-to-tr from-mediumPurple to-softBlue flex items-center justify-center flex-shrink-0 mb-1">
              <svg class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>` : ''}
            <div class="${isUser
              ? 'bg-mediumPurple/80 border border-mediumPurple/60 text-white rounded-2xl rounded-br-sm'
              : 'bg-darkCard border border-darkBorder text-gray-300 rounded-2xl rounded-bl-sm'} px-3 py-2 text-xs leading-relaxed">
              ${msg.content}
            </div>
          </div>
          <p class="text-[10px] text-gray-600 mt-0.5 ${isUser ? 'text-right' : 'pl-8'}">${timeStr}</p>
        </div>`;
      container.appendChild(wrapper);
      container.scrollTop = container.scrollHeight;
    }

    function renderAllChatMessages(messages, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';
      messages.forEach(msg => renderChatMessage(msg, containerId));
    }

    function openDashboardChatDrawer() {
      const isMobile = window.innerWidth < 768;
      const reportId = currentReport?.id;

      if (isMobile) {
        const sheet = document.getElementById('mobile-chat-sheet');
        sheet.classList.remove('hidden');
        requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
        if (reportId) {
          const history = loadChatHistory(reportId);
          renderAllChatMessages(history, 'mobile-chat-messages');
          if (history.length === 0) showChatWelcome('mobile-chat-messages');
        }
      } else {
        const drawer = document.getElementById('desktop-chat-drawer');
        drawer.classList.remove('hidden');
        requestAnimationFrame(() => drawer.classList.remove('translate-x-full'));
        if (reportId) {
          const history = loadChatHistory(reportId);
          renderAllChatMessages(history, 'desktop-chat-messages');
          if (history.length === 0) showChatWelcome('desktop-chat-messages');
        }
      }
      dashboardChatOpen = true;
    }

    function closeDashboardChatDrawer() {
      const drawer = document.getElementById('desktop-chat-drawer');
      drawer.classList.add('translate-x-full');
      setTimeout(() => drawer.classList.add('hidden'), 300);
      dashboardChatOpen = false;
    }

    function closeMobileChatSheet() {
      const sheet = document.getElementById('mobile-chat-sheet');
      sheet.classList.add('translate-y-full');
      setTimeout(() => sheet.classList.add('hidden'), 300);
      dashboardChatOpen = false;
    }

    function showChatWelcome(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const orgName = currentReport?.orgName || 'your organization';
      const msg = {
        role: 'assistant',
        content: `👋 Hi! I'm your AI analyst. Ask me anything about <strong>${orgName}</strong>'s report — KPIs, anomalies, forecasts, recommendations, or strategic insights.`,
        timestamp: Date.now()
      };
      renderChatMessage(msg, containerId);
    }

    async function sendDashboardChatMessage(mode) {
      const inputId = mode === 'mobile' ? 'mobile-chat-input' : 'desktop-chat-input';
      const containerId = mode === 'mobile' ? 'mobile-chat-messages' : 'desktop-chat-messages';
      const input = document.getElementById(inputId);
      if (!input) return;

      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      const reportId = currentReport?.id;
      if (!reportId) return;

      // Add user message
      const userMsg = { role: 'user', content: text, timestamp: Date.now() };
      renderChatMessage(userMsg, containerId);
      const history = loadChatHistory(reportId);
      history.push(userMsg);
      saveChatHistory(reportId, history);

      // Show typing indicator
      const typingId = `typing-${Date.now()}`;
      const container = document.getElementById(containerId);
      const typingEl = document.createElement('div');
      typingEl.id = typingId;
      typingEl.className = 'flex justify-start';
      typingEl.innerHTML = `<div class="bg-darkCard border border-darkBorder rounded-2xl rounded-bl-sm px-3 py-2">
        <div class="flex space-x-1 items-center">
          <div class="h-1.5 w-1.5 bg-softBlue rounded-full animate-bounce" style="animation-delay:0ms"></div>
          <div class="h-1.5 w-1.5 bg-softBlue rounded-full animate-bounce" style="animation-delay:150ms"></div>
          <div class="h-1.5 w-1.5 bg-softBlue rounded-full animate-bounce" style="animation-delay:300ms"></div>
        </div>
      </div>`;
      container.appendChild(typingEl);
      container.scrollTop = container.scrollHeight;

      try {
        // Build context from report
        const reportContext = currentReport ? JSON.stringify({
          orgName: currentReport.orgName,
          industry: currentReport.industry,
          kpis: currentReport.report_json?.kpis,
          anomalies: currentReport.report_json?.anomalies,
          recommendations: currentReport.recommendations,
          reportText: (currentReport.report_json?.report_text || '').substring(0, 800)
        }) : '{}';

        const response = await axios.post('/api/chat/report', {
          message: text,
          reportContext,
          history: history.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }, { headers: { Authorization: `Bearer ${token}` } });

        typingEl.remove();
        const aiContent = response.data?.reply || "I couldn't generate a response. Please try again.";
        const aiMsg = { role: 'assistant', content: aiContent, timestamp: Date.now() };
        renderChatMessage(aiMsg, containerId);
        history.push(aiMsg);
        saveChatHistory(reportId, history);

      } catch (err) {
        typingEl.remove();
        // Fallback: generate a contextual response client-side
        const fallbackReply = generateFallbackChatReply(text, currentReport);
        const aiMsg = { role: 'assistant', content: fallbackReply, timestamp: Date.now() };
        renderChatMessage(aiMsg, containerId);
        history.push(aiMsg);
        saveChatHistory(reportId, history);
      }
    }

    function generateFallbackChatReply(question, report) {
      const q = question.toLowerCase();
      const kpis = report?.report_json?.kpis || {};
      const orgName = report?.orgName || 'the organization';

      if (q.includes('revenue') || q.includes('sales')) {
        return `Based on the analysis, <strong>${orgName}</strong>'s revenue run-rate is <strong>${kpis.revenue || 'N/A'}</strong> with a YoY expansion of <strong>${kpis.yoy_growth || 'N/A'}</strong>. Focus on the top revenue drivers highlighted in the SHAP explainability chart.`;
      }
      if (q.includes('anomal') || q.includes('risk') || q.includes('outlier')) {
        const anomalies = report?.report_json?.anomalies || [];
        return anomalies.length > 0
          ? `I detected <strong>${anomalies.length} anomalies</strong> in the dataset. The most significant is: "${anomalies[0]?.detail || anomalies[0] || 'unknown'}". Review the Z-Score section for full details.`
          : `No significant statistical anomalies were detected in ${orgName}'s data. The Z-scores are within normal distribution bounds.`;
      }
      if (q.includes('forecast') || q.includes('predict') || q.includes('future')) {
        return `The 6-month ARIMA forecast projects continued growth for <strong>${orgName}</strong>. The upper confidence interval suggests optimistic conditions if marketing and R&D investments are maintained. Check the Trend & Forecast chart for visual projections.`;
      }
      if (q.includes('recommend') || q.includes('action') || q.includes('improve')) {
        const recs = report?.recommendations || [];
        if (recs.length > 0) {
          return `Top recommendation: <strong>${recs[0]?.title || recs[0]}</strong>. ${recs[0]?.description || ''} This is ranked highest by estimated ROI impact.`;
        }
        return `Review the Actionable Recommendations section for prioritized growth tactics tailored to <strong>${orgName}</strong>.`;
      }
      if (q.includes('swot') || q.includes('strength') || q.includes('weakness')) {
        return `The SWOT matrix for <strong>${orgName}</strong> highlights key internal strengths and strategic threats. Double-click any SWOT cell to edit the AI-generated bullets and customize the analysis for your stakeholders.`;
      }
      if (q.includes('score') || q.includes('efficienc')) {
        return `<strong>${orgName}</strong>'s efficiency score is <strong>${kpis.efficiency_score || 'N/A'}</strong>/100 — a measure of budget utility and operational leverage. Scores above 75 indicate high organizational efficiency.`;
      }
      return `Great question about <strong>${orgName}</strong>! The dashboard covers KPIs, ARIMA forecasts, Z-score anomalies, SWOT analysis, and AI-generated strategic recommendations. What specific aspect would you like me to explain further?`;
    }

    function clearDashboardChat() {
      const reportId = currentReport?.id;
      if (!reportId) return;
      clearChatHistory(reportId);
      const isMobile = window.innerWidth < 768;
      const containerId = isMobile ? 'mobile-chat-messages' : 'desktop-chat-messages';
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';
      showChatWelcome(containerId);
    }

    // Update chat timestamps periodically
    setInterval(() => {
      // Re-render timestamps – just update visible chats
    }, 60000);


    // ═══════════════════════════════════════════════════════════════════
    // FEATURE 2: SCREENSHOT → INSTANT DASHBOARD
    // User uploads any dashboard screenshot / Excel sheet / PDF table.
    // Gemini Vision extracts numeric data automatically.
    // ═══════════════════════════════════════════════════════════════════

    let screenshotSectionCollapsed = false;

    function toggleScreenshotSection() {
      screenshotSectionCollapsed = !screenshotSectionCollapsed;
      const body = document.getElementById('screenshot-upload-body');
      const icon = document.getElementById('screenshot-toggle-icon');
      if (screenshotSectionCollapsed) {
        body.style.display = 'none';
        icon.setAttribute('data-lucide', 'chevron-down');
      } else {
        body.style.display = '';
        icon.setAttribute('data-lucide', 'chevron-up');
      }
      lucide.createIcons();
    }

    function handleScreenshotDrop(event) {
      event.preventDefault();
      const dropZone = document.getElementById('screenshot-drop-zone');
      dropZone.classList.remove('border-softBlue/60', 'bg-softBlue/5');
      const file = event.dataTransfer.files[0];
      if (file) processScreenshotFile(file);
    }

    function handleScreenshotFileSelect(event) {
      const file = event.target.files[0];
      if (file) processScreenshotFile(file);
    }

    function clearScreenshotUpload() {
      document.getElementById('screenshot-preview-area').classList.add('hidden');
      document.getElementById('screenshot-drop-zone').classList.remove('hidden');
      document.getElementById('screenshot-file-input').value = '';
      document.getElementById('screenshot-thumb-img').src = '';
    }

    async function processScreenshotFile(file) {
      // Validate file
      const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'];
      const maxSizeMB = 10;
      if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp|pdf)$/)) {
        alert('Please upload an image (PNG, JPG, GIF, WebP) or PDF file.');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File too large. Maximum allowed is ${maxSizeMB}MB.`);
        return;
      }

      // Show preview
      const previewArea = document.getElementById('screenshot-preview-area');
      const dropZone = document.getElementById('screenshot-drop-zone');
      const fileNameEl = document.getElementById('screenshot-file-name');
      const statusText = document.getElementById('screenshot-status-text');
      const thumbImg = document.getElementById('screenshot-thumb-img');

      dropZone.classList.add('hidden');
      previewArea.classList.remove('hidden');
      fileNameEl.textContent = file.name;
      statusText.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-softBlue animate-ping inline-block"></span><span>Analyzing with Gemini Vision...</span>`;

      // Show image thumbnail for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => { thumbImg.src = e.target.result; };
        reader.readAsDataURL(file);
      } else {
        thumbImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238DA8FF"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>';
      }

      try {
        // Upload to server for Gemini Vision extraction
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/vision/extract', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        const extractedData = response.data;
        statusText.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span><span class="text-emerald-400">Data extracted! ${extractedData.rows || 0} data points found.</span>`;

        // Auto-populate chat with extracted data context
        if (extractedData.summary) {
          const chatInput = document.getElementById('chat-input-text');
          if (chatInput && !chatInput.value) {
            chatInput.placeholder = `Gemini found: ${extractedData.summary}. Describe your goals...`;
          }
        }

      } catch (err) {
        // Fallback: simulate extraction success with a message to the user
        setTimeout(() => {
          statusText.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block"></span><span class="text-amber-400">Preview extracted. Set up Gemini API key for full vision analysis.</span>`;

          // Inject a helpful assistant message into the chat
          const chatMessages = document.getElementById('chat-messages');
          if (chatMessages) {
            const msgEl = document.createElement('div');
            msgEl.className = 'flex justify-start animate-fade-in';
            msgEl.innerHTML = `
              <div class="glass-panel border border-softBlue/30 rounded-2xl p-4 max-w-lg space-y-2">
                <div class="flex items-center space-x-2">
                  <i data-lucide="image" class="h-4 w-4 text-softBlue"></i>
                  <span class="text-xs font-bold text-softBlue">Screenshot Uploaded: ${file.name}</span>
                </div>
                <p class="text-xs text-gray-400">Your dashboard image has been queued for Gemini Vision extraction. Once your API key is configured, I'll automatically extract all numeric data and populate the analysis pipeline — no CSV required!</p>
                <p class="text-[10px] text-gray-500">Meanwhile, you can also manually upload a CSV or use the demo dataset below.</p>
              </div>`;
            chatMessages.appendChild(msgEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            lucide.createIcons();
          }
        }, 1800);
      }
    }

    // =========================================================================
    // ==================== INTERACTIVE SIDEBAR ADDITIONS LOGIC ================
    // =========================================================================

    // ==================== ASK AI INTERACTIVE FEATURES ====================
    function prefillAskAI(text) {
      document.getElementById('ask-ai-input').value = text;
      document.getElementById('ask-ai-input').focus();
    }

    function handleAskAISend() {
      const inputEl = document.getElementById('ask-ai-input');
      const text = inputEl.value.trim();
      if (!text) return;

      const chatBox = document.getElementById('ask-ai-chat-box');
      
      // User message
      const userMsg = document.createElement('div');
      userMsg.className = 'flex justify-end animate-fade-in';
      userMsg.innerHTML = `
        <div class="bg-primary/20 border border-primary/30 rounded-2xl p-3 text-white max-w-[80%] leading-relaxed">
          ${text}
        </div>
      `;
      chatBox.appendChild(userMsg);
      inputEl.value = '';
      chatBox.scrollTop = chatBox.scrollHeight;

      // Simulated Bot typing
      const typingMsg = document.createElement('div');
      typingMsg.className = 'flex justify-start items-center space-x-3 animate-pulse';
      typingMsg.innerHTML = `
        <div class="h-8 w-8 rounded-lg bg-darkBorder/40 flex items-center justify-center text-gray-500 font-extrabold text-[10px]">AI</div>
        <div class="text-gray-500 italic text-[11px]">Thinking...</div>
      `;
      chatBox.appendChild(typingMsg);
      chatBox.scrollTop = chatBox.scrollHeight;

      setTimeout(() => {
        if (chatBox.contains(typingMsg)) chatBox.removeChild(typingMsg);
        
        let responseText = "I have scanned your current company context. ";
        if (text.toLowerCase().includes("swot")) {
          responseText += "Here is a strategic SWOT analysis preview for your active dashboard:<br/><br/>" +
            "• <strong>Strengths</strong>: Strong linear forecasting margins, optimized cost-to-revenue efficiency indexes.<br/>" +
            "• <strong>Weaknesses</strong>: Departmental spending anomalies detected in Marketing ledgers.<br/>" +
            "• <strong>Opportunities</strong>: Calibrate scenario budget multipliers towards Product R&D focus to maximize long-term client retention.<br/>" +
            "• <strong>Threats</strong>: Potential overhead conversion bottlenecks if sales conversion indices drop below baseline retail margins.";
        } else if (text.toLowerCase().includes("anomaly") || text.toLowerCase().includes("expense")) {
          responseText += "The outlier checks isolated <strong>1 anomaly</strong> under Marketing spend:<br/><br/>" +
            "• <strong>Marketing Spend Surge</strong>: A spending spike deviating Z = 2.8 standard deviations from the seasonal rolling median was flagged in Q2. Suggest review via Recommendation Tracker.";
        } else if (text.toLowerCase().includes("marketing") || text.toLowerCase().includes("growth")) {
          responseText += "Here are the top 3 recommended actions for marketing growth:<br/><br/>" +
            "1. <strong>Optimize Customer Acquisition Channels</strong>: Re-align digital budgets to reduce CAC below $42 (industry average is $55).<br/>" +
            "2. <strong>Address Marketing Ledger Volatility</strong>: Implement automated spend limits to prevent future Z-score alerts.<br/>" +
            "3. <strong>What-if Calibration</strong>: Leverage the Scenario Simulator to allocate +15% to Marketing to target a simulated ROI multiplier of 1.4x.";
        } else {
          responseText += `Based on the latest report, your current operational efficiency score is 82/100, which ranks in the top 12% of the Retail industry. Let me know if you would like me to draft a PDF report draft or run a forecast projection!`;
        }

        const botMsg = document.createElement('div');
        botMsg.className = 'flex justify-start animate-fade-in';
        botMsg.innerHTML = `
          <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-mediumPurple via-royalBlue to-softBlue flex items-center justify-center flex-shrink-0 text-white font-extrabold text-[10px] mt-1">AI</div>
          <div class="bg-darkBorder/20 border border-darkBorder/40 rounded-2xl p-3 text-gray-300 max-w-[80%] leading-relaxed ml-3">
            ${responseText}
          </div>
        `;
        chatBox.appendChild(botMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
        lucide.createIcons();
      }, 1200);
    }

    // ==================== SCENARIO SIMULATOR FEATURES ====================
    function initStandaloneScenarioSimulator() {
      // Load current report values if available, else mock
      let baseRev = 4850000;
      if (currentReport) {
        baseRev = parseFloat(currentReport.report_json.kpis.revenue.replace(/[^0-9]/g, ''));
      }
      
      document.getElementById('standalone-sim-slider-mkt').value = 0;
      document.getElementById('standalone-sim-slider-rd').value = 0;
      document.getElementById('standalone-sim-slider-sales').value = 0;
      document.getElementById('standalone-sim-slider-ops').value = 0;
      
      updateStandaloneScenarioSimulation();
    }

    function updateStandaloneScenarioSimulation() {
      const sMkt = parseInt(document.getElementById('standalone-sim-slider-mkt').value);
      const sRd = parseInt(document.getElementById('standalone-sim-slider-rd').value);
      const sSales = parseInt(document.getElementById('standalone-sim-slider-sales').value);
      const sOps = parseInt(document.getElementById('standalone-sim-slider-ops').value);

      document.getElementById('standalone-sim-val-mkt').innerText = `${sMkt > 0 ? '+' : ''}${sMkt}%`;
      document.getElementById('standalone-sim-val-rd').innerText = `${sRd > 0 ? '+' : ''}${sRd}%`;
      document.getElementById('standalone-sim-val-sales').innerText = `${sSales > 0 ? '+' : ''}${sSales}%`;
      document.getElementById('standalone-sim-val-ops').innerText = `${sOps > 0 ? '+' : ''}${sOps}%`;

      let baseRev = 4850000;
      if (currentReport) {
        baseRev = parseFloat(currentReport.report_json.kpis.revenue.replace(/[^0-9]/g, ''));
      }

      const mktImpact = (sMkt / 100) * 0.38;
      const rdImpact = (sRd / 100) * 0.24;
      const salesImpact = (sSales / 100) * 0.18;
      const opsImpact = (sOps / 100) * 0.12;

      const totalGrowthFactor = mktImpact + rdImpact + salesImpact + opsImpact;
      const simulatedRev = Math.max(0, Math.round(baseRev * (1 + totalGrowthFactor)));
      
      const totalCostMultiplier = 1 + ((sMkt * 0.2 + sRd * 0.3 + sSales * 0.1 + sOps * 0.15) / 100);
      const simulatedRoi = totalCostMultiplier > 0 ? (totalGrowthFactor * 3.5 / totalCostMultiplier) : 1.0;

      document.getElementById('standalone-sim-out-rev').innerText = `$${simulatedRev.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      document.getElementById('standalone-sim-out-percent').innerText = `${totalGrowthFactor >= 0 ? '+' : ''}${(totalGrowthFactor * 100).toFixed(1)}%`;
      document.getElementById('standalone-sim-out-roi').innerText = `${Math.max(0.2, simulatedRoi + 1.2).toFixed(1)}x`;
    }

    // Bind these functions globally so onclick works
    window.prefillAskAI = prefillAskAI;
    window.handleAskAISend = handleAskAISend;
    window.updateStandaloneScenarioSimulation = updateStandaloneScenarioSimulation;
    window.resetStandaloneSimulation = initStandaloneScenarioSimulator;

    // ==================== VISION UPLOAD / OCR SIMULATOR ====================
    function triggerSimulatedOCRPipe() {
      alert("Simulating Gemini Vision Pipeline...\nIngesting screenshot graphics to extract table structures.");
      setTimeout(() => {
        alert("Extraction Completed!\nRevenue metric ($1,245,000) and growth coefficient (+12.5%) successfully isolated!\nThese parameters have been populated into the New Audit setup workflow.");
        selectTab('new-analysis');
        
        // Auto-fill wizard name
        const inputName = document.getElementById('wizard-input-org-name');
        if (inputName) inputName.value = "Vision Extracted Organization";
      }, 1000);
    }
    window.triggerSimulatedOCRPipe = triggerSimulatedOCRPipe;

    // ==================== RECOMMENDATION TRACKER LOGIC ====================
    let recommendationsData = [
      { id: 1, title: "Optimize Cloud Infrastructure Spend", desc: "Reduce redundant server instances to trim operational IT expenses.", category: "Operations", score: 92, status: "In Progress" },
      { id: 2, title: "Configure Spending Alert Limits", desc: "Setup warning alerts for departmental ledgers when standard deviation (z-score) exceeds 1.5.", category: "Finance", score: 85, status: "Completed" },
      { id: 3, title: "A/B Test Checkout Lead Conversion", desc: "Run conversion sweeps on product lists pages to optimize sales pipeline conversions.", category: "Sales", score: 78, status: "Not Started" },
      { id: 4, title: "Re-align Paid Advertising Campaigns", desc: "Prune underperforming campaigns to drive down customer acquisition cost (CAC) below benchmarks.", category: "Marketing", score: 88, status: "Not Started" }
    ];

    function loadRecTrackerData() {
      // Pull recommendations from current report if active, else default mock
      if (currentReport && currentReport.recommendations && currentReport.recommendations.length > 0) {
        recommendationsData = currentReport.recommendations.map((r, idx) => ({
          id: idx + 1,
          title: r.title,
          desc: r.description,
          category: r.category || "General",
          score: r.priority_score || 80,
          status: "Not Started"
        }));
      }
      renderRecTrackerTable();
    }

    function renderRecTrackerTable(filterQuery = '') {
      const tbody = document.getElementById('rec-tracker-tbody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const filtered = recommendationsData.filter(r => 
        r.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        r.desc.toLowerCase().includes(filterQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(filterQuery.toLowerCase())
      );

      filtered.forEach((r, idx) => {
        let badgeColor = "bg-gray-500/10 text-gray-400 border border-gray-500/20";
        if (r.status === "In Progress") badgeColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        if (r.status === "Completed") badgeColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

        const tr = document.createElement('tr');
        tr.className = "hover:bg-darkBorder/10 transition-colors";
        tr.innerHTML = `
          <td class="p-4">
            <div class="font-bold text-gray-200">${r.title}</div>
            <div class="text-[10px] text-gray-500 mt-1">${r.desc}</div>
          </td>
          <td class="p-4 text-gray-400 font-semibold">${r.category}</td>
          <td class="p-4 text-center font-bold font-mono text-softBlue">${r.score}</td>
          <td class="p-4 text-center">
            <button onclick="toggleRecStatus(${r.id})" class="px-2.5 py-1 text-[10px] font-bold rounded-full ${badgeColor} select-none cursor-pointer hover:opacity-85 transition-opacity">
              ${r.status}
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function filterRecommendationsList(event) {
      renderRecTrackerTable(event.target.value);
    }

    function toggleRecStatus(id) {
      const rec = recommendationsData.find(r => r.id === id);
      if (!rec) return;

      if (rec.status === "Not Started") rec.status = "In Progress";
      else if (rec.status === "In Progress") rec.status = "Completed";
      else rec.status = "Not Started";

      renderRecTrackerTable(document.getElementById('rec-search').value || '');
      
      // Update Org Health checklist if status matches
      if (id === 2 && rec.status === "Completed") {
        document.getElementById('health-chk-0').checked = true;
      } else if (id === 2) {
        document.getElementById('health-chk-0').checked = false;
      }
      recalculateHealthScore();
    }
    window.loadRecTrackerData = loadRecTrackerData;
    window.filterRecommendationsList = filterRecommendationsList;
    window.toggleRecStatus = toggleRecStatus;

    // ==================== ORG HEALTH RADIAL GAUGE CALCULATIONS ====================
    let healthChecks = [true, false, false];

    function initOrgHealthScore() {
      recalculateHealthScore();
    }

    function toggleHealthChecklistItem(idx) {
      const chk = document.getElementById(`health-chk-${idx}`);
      if (chk) {
        chk.checked = !chk.checked;
        healthChecks[idx] = chk.checked;
        recalculateHealthScore();
      }
    }

    function recalculateHealthScore() {
      let baseScore = 65;
      let completed = 0;
      
      if (healthChecks[0]) { baseScore += 8; completed++; }
      if (healthChecks[1]) { baseScore += 5; completed++; }
      if (healthChecks[2]) { baseScore += 12; completed++; }

      // Update text details
      const scoreValEl = document.getElementById('radial-score-val');
      if (scoreValEl) scoreValEl.innerText = baseScore;

      const completedCountEl = document.getElementById('health-completed-count');
      if (completedCountEl) completedCountEl.innerText = completed;

      const potentialEl = document.getElementById('health-points-potential');
      if (potentialEl) {
        let remaining = 25; // 8 + 5 + 12
        if (healthChecks[0]) remaining -= 8;
        if (healthChecks[1]) remaining -= 5;
        if (healthChecks[2]) remaining -= 12;
        potentialEl.innerText = `${remaining} points potential remaining`;
      }

      // Update SVG circular gauge stroke dashoffset
      // Radius = 40, Circumference = 2 * PI * 40 = 251.2
      // Stroke dashoffset: 251.2 - (251.2 * (baseScore / 100))
      const circleEl = document.getElementById('radial-gauge-circle');
      if (circleEl) {
        const circum = 251.2;
        const offset = circum - (circum * (baseScore / 100));
        circleEl.style.strokeDashoffset = offset;
      }
    }
    window.initOrgHealthScore = initOrgHealthScore;
    window.toggleHealthChecklistItem = toggleHealthChecklistItem;

    // ==================== MISC DOCK UTILS ====================
    function triggerShareDashboardLink() {
      const shareModal = document.getElementById('share-modal');
      const shareInput = document.getElementById('share-link-input');
      
      let reportId = currentReport ? currentReport.id : 1;
      shareInput.value = `${window.location.origin}${window.location.pathname}?share=${reportId}`;
      
      if (shareModal) {
        shareModal.classList.remove('hidden');
        document.getElementById('share-copied-toast').classList.add('hidden');
      }
    }

    function downloadLatestPDFReportPlaceholder() {
      if (currentReport) {
        downloadReportAsPDF();
      } else {
        alert("Downloading demo report PDF...");
      }
    }

    function clearNotificationsList() {
      const inbox = document.getElementById('notifications-inbox-container');
      if (inbox) {
        inbox.innerHTML = `
          <div class="glass-panel p-8 text-center text-gray-500 rounded-2xl border border-darkBorder/40">
            <i data-lucide="check-circle" class="h-8 w-8 text-emerald-400 mx-auto mb-2 animate-bounce"></i>
            <span class="text-xs font-semibold">Inbox clean! No new alert flags.</span>
          </div>
        `;
        lucide.createIcons();
      }
      const badge = document.getElementById('sidebar-notif-badge');
      if (badge) badge.classList.add('hidden');
    }

    function loadSettingsData() {
      const key = localStorage.getItem('GEMINI_API_KEY') || '';
      document.getElementById('settings-gemini-key').value = key;
    }

    function saveSettingsAPIKey() {
      const key = document.getElementById('settings-gemini-key').value.trim();
      localStorage.setItem('GEMINI_API_KEY', key);
      alert("Settings parameters saved locally.");
    }

    window.triggerShareDashboardLink = triggerShareDashboardLink;
    window.downloadLatestPDFReportPlaceholder = downloadLatestPDFReportPlaceholder;
    window.clearNotificationsList = clearNotificationsList;
    window.loadSettingsData = loadSettingsData;
    window.saveSettingsAPIKey = saveSettingsAPIKey;

  