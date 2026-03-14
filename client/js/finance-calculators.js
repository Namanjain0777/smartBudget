// SmartBudget Professional Wealth Planner - Finance Calculators Module
// Senior Fintech Engineer Implementation

class FinanceState {
  constructor() {
    this.state = {
      sipMonthly: 0,
      goals: [],
      netWorth: 0,
      projectedWealth: 0,
      activeCalculators: 0
    };
    this.init();
  }

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateStats();
  }

  loadFromStorage() {
    const saved = localStorage.getItem('financeState');
    if (saved) {
      this.state = { ...this.state, ...JSON.parse(saved) };
    }
  }

  saveToStorage() {
    localStorage.setItem('financeState', JSON.stringify(this.state));
  }

  bindEvents() {
    document.addEventListener('calculationComplete', (e) => {
      this.handleCalculation(e.detail);
    });
  }

  handleCalculation(data) {
    switch (data.type) {
      case 'sip':
        this.state.sipMonthly = data.monthlySIP;
        this.state.projectedWealth = data.projected;
        break;
      case 'goal':
        this.state.goals.push(data.goal);
        break;
      case 'networth':
        this.state.netWorth = data.netWorth;
        break;
    }
    this.state.activeCalculators = Object.keys(data).length;
    this.updateStats();
    this.saveToStorage();
    window.dispatchEvent(new CustomEvent('statsUpdate', { detail: this.state }));
  }

  updateStats() {
    this.animateCounter('totalProjected', this.state.projectedWealth);
    document.getElementById('activeGoals').textContent = this.state.goals.length;
    this.animateCounter('monthlyInvest', this.state.sipMonthly);
    this.animateCounter('netWorthDisplay', this.state.netWorth);
  }

  animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const start = parseFloat(el.textContent) || 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * ease;

      el.textContent = new Intl.NumberFormat('en-IN').format(Math.round(value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  reset() {
    this.state = {
      sipMonthly: 0,
      goals: [],
      netWorth: 0,
      projectedWealth: 0,
      activeCalculators: 0
    };
    this.updateStats();
    localStorage.removeItem('financeState');
  }

  export() {
    const report = {
      timestamp: new Date().toISOString(),
      ...this.state
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartbudget-report-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  }
}

// Global finance state
const finance = new FinanceState();

// Personal Finance Calculators
function calculateEmergencyFund() {
  const monthlyExpense = parseFloat(document.getElementById('emergencyMonthly').value) || 0;
  const monthsCoverage = parseInt(document.getElementById('emergencyMonths').value) || 6;
  const currentSavings = parseFloat(document.getElementById('emergencyCurrent').value) || 0;

  const target = monthlyExpense * monthsCoverage;
  const gap = Math.max(0, target - currentSavings);

  document.getElementById('emergencyResult').innerHTML = `
    <div class="calc-result-row">
      <span>Required Fund:</span>
      <span class="calc-result-value">₹${new Intl.NumberFormat('en-IN').format(target)}</span>
    </div>
    <div class="calc-result-row">
      <span>Current Savings:</span>
      <span>₹${new Intl.NumberFormat('en-IN').format(currentSavings)}</span>
    </div>
    <div class="calc-result-row">
      <span>Gap to Cover:</span>
      <span class="calc-result-value">₹${new Intl.NumberFormat('en-IN').format(gap)}</span>
    </div>
  `;

  // Dispatch update
  window.dispatchEvent(new CustomEvent('calculationComplete', { 
    detail: { type: 'emergency', target, gap } 
  }));
}

// SIP Calculator
function calculateSIP() {
  const target = parseFloat(document.getElementById('sipTarget').value) || 0;
  const years = parseInt(document.getElementById('sipYears').value) || 0;
  const rate = (parseFloat(document.getElementById('sipRate').value) || 12) / 100 / 12;
  const months = years * 12;

  if (!target || !years || !rate) return;

  const monthlySIP = target * rate / ((Math.pow(1 + rate, months) - 1) * (1 + rate));
  const totalInvestment = monthlySIP * months;
  const projected = target;

  document.getElementById('sipResult').innerHTML = `
    <div class="calc-result-row">
      <span>Monthly SIP:</span>
      <span class="calc-result-value">₹${new Intl.NumberFormat('en-IN').format(monthlySIP)}</span>
    </div>
    <div class="calc-result-row">
      <span>Total Investment:</span>
      <span>₹${new Intl.NumberFormat('en-IN').format(totalInvestment)}</span>
    </div>
    <div class="calc-result-row">
      <span>Projected Value:</span>
      <span class="calc-result-value">₹${new Intl.NumberFormat('en-IN').format(projected)}</span>
    </div>
  `;

  window.dispatchEvent(new CustomEvent('calculationComplete', { 
    detail: { 
      type: 'sip', 
      monthlySIP: Math.round(monthlySIP),
      projected 
    } 
  }));

  // Update SIP chart
  updateSIPChart(monthlySIP, rate, years);
}

// ... (all 35+ calculator functions with same pattern - modular, state-updating)

// Charts Module
function updateSIPChart(monthlySIP, rate, years) {
  const ctx = document.getElementById('sipGrowthChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: years}, (_, i) => `Year ${i+1}`),
      datasets: [{
        label: 'SIP Growth',
        data: calculateSIPGrowth(monthlySIP, rate, years),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Export functions globally
window.finance = finance;
window.calculateEmergencyFund = calculateEmergencyFund;
window.calculateSIP = calculateSIP;
// ... export all calculator functions
