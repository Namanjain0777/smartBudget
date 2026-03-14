// =============================================
// SMARTBUDGET WEALTH PLANNER - ENHANCED EDITION
// Advanced Financial Planning with Groww-Style Charts
// =============================================

// Chart instances
let wealthChart;
let sipChart;
let goalChart;
let comparisonChart;
let amortizationChart;
let netWorthChart;

// =============================================
// INITIALIZATION
// =============================================

// Fallback for SmartBudgetAnimations - FIXED forms
if (typeof SmartBudgetAnimations === 'undefined') {
    window.SmartBudgetAnimations = {
        showToast: function(message, type) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            // No alert spam - silent fallback
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    initAllCharts();
    initEventListeners();
});

// Initialize all charts
function initAllCharts() {
    initWealthChart();
    initSIPChart();
    initGoalChart();
    initComparisonChart();
    initAmortizationChart();
    initNetWorthChart();
}

// Event listeners for calculator buttons
function initEventListeners() {
    // All calculator functions are called via onclick in HTML
    // Additional event listeners can be added here
}

// =============================================
// CHART 1: WEALTH PROJECTION (Main Chart)
// =============================================

function initWealthChart() {
    const ctx = document.getElementById("wealthChart");
    if (!ctx) return;
    
    wealthChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Invested Amount",
                    data: [],
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: "#3b82f6"
                },
                {
                    label: "Wealth Growth",
                    data: [],
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: "#10b981"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#f9fafb',
                    bodyColor: '#9ca3af',
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + parseFloat(context.raw).toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: "rgba(255, 255, 255, 0.05)"
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                y: {
                    grid: {
                        color: "rgba(255, 255, 255, 0.05)"
                    },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(1) + 'L';
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// CHART 2: SIP GROWTH CHART
// =============================================

function initSIPChart() {
    const ctx = document.getElementById("sipChart");
    if (!ctx) return;
    
    sipChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Your Investment",
                    data: [],
                    backgroundColor: "rgba(59, 130, 246, 0.7)",
                    borderColor: "#3b82f6",
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: "Returns Earned",
                    data: [],
                    backgroundColor: "rgba(16, 185, 129, 0.7)",
                    borderColor: "#10b981",
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + parseFloat(context.raw).toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    stacked: true,
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(1) + 'L';
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// CHART 3: GOAL PROGRESS DOUGHNUT
// =============================================

function initGoalChart() {
    const ctx = document.getElementById("goalChart");
    if (!ctx) return;
    
    goalChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Achieved", "Remaining"],
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    "rgba(16, 185, 129, 0.8)",
                    "rgba(59, 130, 246, 0.3)"
                ],
                borderWidth: 0,
                cutout: "70%"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ₹' + parseFloat(context.raw).toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// CHART 4: INVESTMENT COMPARISON
// =============================================

function initComparisonChart() {
    const ctx = document.getElementById("comparisonChart");
    if (!ctx) return;
    
    comparisonChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Option 1",
                    data: [],
                    backgroundColor: "rgba(59, 130, 246, 0.7)",
                    borderRadius: 6
                },
                {
                    label: "Option 2",
                    data: [],
                    backgroundColor: "rgba(139, 92, 246, 0.7)",
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(1) + 'L';
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// CHART 5: LOAN AMORTIZATION
// =============================================

function initAmortizationChart() {
    const ctx = document.getElementById("amortizationChart");
    if (!ctx) return;
    
    amortizationChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Principal",
                    data: [],
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.3)",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Interest",
                    data: [],
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.3)",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Balance",
                    data: [],
                    borderColor: "#10b981",
                    backgroundColor: "transparent",
                    borderDash: [5, 5],
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(1) + 'L';
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// CHART 6: NET WORTH TRACKER
// =============================================

function initNetWorthChart() {
    const ctx = document.getElementById("netWorthChart");
    if (!ctx) return;
    
    netWorthChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Assets",
                    data: [],
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Liabilities",
                    data: [],
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Net Worth",
                    data: [],
                    borderColor: "#3b82f6",
                    backgroundColor: "transparent",
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: "#3b82f6"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(1) + 'L';
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// CALCULATOR 1: SIP CALCULATOR
// =============================================

function calculateSIP() {
    const target = Number(document.getElementById("sipTarget").value);
    const years = Number(document.getElementById("sipYears").value);
    const rate = Number(document.getElementById("sipReturn").value) / 100;
    
    if (!target || !years || !rate) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    const r = rate / 12;
    const n = years * 12;
    
    // Calculate monthly SIP needed
    const sip = target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    
    document.getElementById("sipResult").innerText = formatCurrency(sip);
    
    // Dispatch to FinanceState
    window.dispatchEvent(new CustomEvent('calculationComplete', { 
      detail: { type: 'sip', monthlySIP: Math.round(sip), projected: target } 
    }));
    
    // Generate chart data
    updateSIPChart(sip, r, n, target);
    
    SmartBudgetAnimations.showToast("SIP Calculated!", "success");
}

function updateSIPChart(sip, rate, months, target) {
    let labels = [];
    let investedData = [];
    let returnsData = [];
    let totalInvested = 0;
    
    for (let i = 1; i <= months; i++) {
        totalInvested += sip;
        const totalValue = (sip * ((Math.pow(1 + rate, i) - 1) / rate) * (1 + rate));
        const returns = totalValue - totalInvested;
        
        if (i % 12 === 0 || i === months) {
            labels.push("Year " + Math.ceil(i / 12));
            investedData.push(totalInvested);
            returnsData.push(returns);
        }
    }
    
    sipChart.data.labels = labels;
    sipChart.data.datasets[0].data = investedData;
    sipChart.data.datasets[1].data = returnsData;
    sipChart.update();
    
    // Also update main wealth chart
    updateWealthChart(investedData, investedData.map((v, i) => v + returnsData[i]), labels);
}

// =============================================
// CALCULATOR 2: COMPOUND INTEREST
// =============================================

function calculateCompoundInterest() {
    const principal = Number(document.getElementById("ciPrincipal").value);
    const rate = Number(document.getElementById("ciRate").value) / 100;
    const years = Number(document.getElementById("ciYears").value);
    const compounding = Number(document.getElementById("ciCompounding").value) || 12;
    
    if (!principal || !rate || !years) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    // A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + rate / compounding, compounding * years);
    const interest = amount - principal;
    
    document.getElementById("ciResult").innerHTML = `
        <div>Total Value: <span>₹${amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Interest Earned: <span>₹${interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    // Update chart
    updateCompoundChart(principal, rate, years, compounding);
    
    SmartBudgetAnimations.showToast("Compound Interest Calculated!", "success");
}

function updateCompoundChart(principal, rate, years, compounding) {
    let labels = [];
    let principalData = [];
    let interestData = [];
    let totalData = [];
    
    for (let i = 1; i <= years; i++) {
        const amount = principal * Math.pow(1 + rate / compounding, compounding * i);
        const interest = amount - principal;
        
        labels.push("Year " + i);
        principalData.push(principal);
        interestData.push(interest);
        totalData.push(amount);
    }
    
    // Update comparison chart
    comparisonChart.data.labels = labels;
    comparisonChart.data.datasets[0].data = principalData;
    comparisonChart.data.datasets[0].label = "Principal";
    comparisonChart.data.datasets[1].data = totalData;
    comparisonChart.data.datasets[1].label = "Total Value";
    comparisonChart.update();
}

// =============================================
// CALCULATOR 3: RETIREMENT PLANNER
// =============================================

function calculateRetirement() {
    const currentAge = Number(document.getElementById("retirementAge").value);
    const retirementAge = Number(document.getElementById("retireAge").value);
    const currentSavings = Number(document.getElementById("currentSavingsRetire").value) || 0;
    const monthlyContribution = Number(document.getElementById("monthlyContribute").value) || 0;
    const expectedReturn = Number(document.getElementById("retireReturn").value) / 100;
    const inflationRate = Number(document.getElementById("inflationRetire").value) / 100;
    
    if (!currentAge || !retirementAge) {
        SmartBudgetAnimations.showToast("Please fill required fields", "warning");
        return;
    }
    
    const yearsToRetire = retirementAge - currentAge;
    const months = yearsToRetire * 12;
    const r = expectedReturn / 12;
    
    // Future value of current savings
    const fvCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetire);
    
    // Future value of monthly contributions
    const fvContributions = monthlyContribution * ((Math.pow(1 + r, months) - 1) / r);
    
    // Total corpus at retirement
    const totalCorpus = fvCurrentSavings + fvContributions;
    
    // Inflation adjusted (real value)
    const realCorpus = totalCorpus / Math.pow(1 + inflationRate, yearsToRetire);
    
    // Monthly pension (using 4% rule)
    const monthlyPension = (totalCorpus * 0.04) / 12;
    
    document.getElementById("retirementResult").innerHTML = `
        <div>Corpus at Retirement: <span>₹${totalCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Today's Value: <span>₹${realCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Monthly Pension: <span>₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    // Update wealth chart
    updateRetirementChart(currentSavings, monthlyContribution, expectedReturn, yearsToRetire);
    
    SmartBudgetAnimations.showToast("Retirement Plan Ready!", "success");
}

function updateRetirementChart(startAmount, monthly, rate, years) {
    let labels = [];
    let wealthData = [];
    let total = startAmount;
    
    for (let i = 1; i <= years; i++) {
        total = (total + monthly * 12) * (1 + rate);
        labels.push("Year " + i);
        wealthData.push(total);
    }
    
    wealthChart.data.labels = labels;
    wealthChart.data.datasets[0].data = labels.map(() => startAmount);
    wealthChart.data.datasets[0].label = "Invested";
    wealthChart.data.datasets[1].data = wealthData;
    wealthChart.data.datasets[1].label = "Wealth Growth";
    wealthChart.update();
}

// =============================================
// CALCULATOR 4: EMI CALCULATOR
// =============================================

function calculateEMI() {
    const P = Number(document.getElementById("loanAmount").value);
    const r = Number(document.getElementById("loanRate").value) / 100 / 12;
    const n = Number(document.getElementById("loanYears").value) * 12;
    
    if (!P || !r || !n) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    
    document.getElementById("emiResult").innerHTML = `
        <div>Monthly EMI: <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Total Interest: <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Total Payment: <span>₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    // Dispatch to FinanceState (EMI as liability affecting networth)
    window.dispatchEvent(new CustomEvent('calculationComplete', { 
      detail: { type: 'emi', loanAmount: P, emi: Math.round(emi), totalInterest } 
    }));
    
    // Generate amortization chart
    updateAmortizationChart(P, r, n, emi);
    
    // Generate table
    generateAmortizationTable(P, r, n, emi);
    
    SmartBudgetAnimations.showToast("EMI Calculated!", "success");
}

function updateAmortizationChart(principal, rate, months, emi) {
    let labels = [];
    let principalData = [];
    let interestData = [];
    let balanceData = [];
    let balance = principal;
    
    // Show yearly data points
    for (let i = 1; i <= months; i++) {
        const interest = balance * rate;
        const principalPaid = emi - interest;
        balance -= principalPaid;
        
        if (i % 12 === 0 || i === months) {
            labels.push("Year " + Math.ceil(i / 12));
            principalData.push(principalPaid * 12);
            interestData.push(interest * 12);
            balanceData.push(Math.max(0, balance));
        }
    }
    
    amortizationChart.data.labels = labels;
    amortizationChart.data.datasets[0].data = principalData;
    amortizationChart.data.datasets[1].data = interestData;
    amortizationChart.data.datasets[2].data = balanceData;
    amortizationChart.update();
}

function generateAmortizationTable(P, r, n, emi) {
    let balance = P;
    let table = `<table class="amortization-table">
        <thead>
            <tr>
                <th>Year</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>`;
    
    for (let year = 1; year <= Math.ceil(n / 12); year++) {
        let yearPrincipal = 0;
        let yearInterest = 0;
        
        for (let month = 1; month <= 12; month++) {
            const currentMonth = (year - 1) * 12 + month;
            if (currentMonth > n) break;
            
            const interest = balance * r;
            const principalPaid = emi - interest;
            balance -= principalPaid;
            
            yearPrincipal += principalPaid;
            yearInterest += interest;
        }
        
        table += `<tr>
            <td>Year ${year}</td>
            <td>₹${yearPrincipal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
            <td>₹${yearInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
            <td>₹${Math.max(0, balance).toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
        </tr>`;
    }
    
    table += `</tbody></table>`;
    document.getElementById("amortizationTable").innerHTML = table;
}

// =============================================
// CALCULATOR 5: TAX CALCULATOR
// =============================================

function calculateTax() {
    const income = Number(document.getElementById("taxableIncome").value);
    const age = Number(document.getElementById("taxAge").value) || 30;
    
    if (!income) {
        SmartBudgetAnimations.showToast("Please enter your income", "warning");
        return;
    }
    
    // Old tax regime (with deductions)
    const taxSlabs = getTaxSlabs(age);
    let oldTax = 0;
    let taxableIncome = income;
    
    // Standard deduction
    taxableIncome -= 50000;
    if (taxableIncome < 0) taxableIncome = 0;
    
    for (const slab of taxSlabs) {
        if (taxableIncome > slab.limit) {
            oldTax += slab.rate === 0.3 ? (taxableIncome - 750000) * slab.rate : 
                      slab.rate === 0.2 ? Math.min(taxableIncome, 600000) * slab.rate - 6000 :
                      taxableIncome * slab.rate;
            break;
        } else if (taxableIncome > slab.from) {
            oldTax += (taxableIncome - slab.from + 1) * slab.rate;
        }
    }
    
    // New tax regime (simplified)
    let newTax = 0;
    const newIncome = income - 50000; // Standard deduction
    if (newIncome > 0) {
        const newSlabs = [
            { from: 0, limit: 300000, rate: 0 },
            { from: 300001, limit: 600000, rate: 0.05 },
            { from: 600001, limit: 900000, rate: 0.10 },
            { from: 900001, limit: 1200000, rate: 0.15 },
            { from: 1200001, limit: 1500000, rate: 0.20 },
            { from: 1500001, limit: Infinity, rate: 0.30 }
        ];
        
        let tempIncome = newIncome;
        for (const slab of newSlabs) {
            if (tempIncome <= 0) break;
            const taxableInSlab = Math.min(tempIncome, slab.limit - slab.from + 1);
            newTax += taxableInSlab * slab.rate;
            tempIncome -= taxableInSlab;
        }
    }
    
    const savedTax = oldTax - newTax;
    const effectiveRate = (newTax / income) * 100;
    
    document.getElementById("taxResult").innerHTML = `
        <div>Old Regime Tax: <span>₹${Math.max(0, oldTax).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>New Regime Tax: <span>₹${Math.max(0, newTax).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Effective Rate: <span>${effectiveRate.toFixed(1)}%</span></div>
        ${savedTax > 0 ? `<div>You Save: <span>₹${savedTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>` : ''}
    `;
    
    SmartBudgetAnimations.showToast("Tax Calculated!", "success");
}

function getTaxSlabs(age) {
    if (age >= 80) {
        return [
            { from: 0, limit: 500000, rate: 0 },
            { from: 500001, limit: 1000000, rate: 0.20 },
            { from: 1000001, limit: Infinity, rate: 0.30 }
        ];
    } else if (age >= 60) {
        return [
            { from: 0, limit: 300000, rate: 0 },
            { from: 300001, limit: 500000, rate: 0.05 },
            { from: 500001, limit: 1000000, rate: 0.20 },
            { from: 1000001, limit: Infinity, rate: 0.30 }
        ];
    }
    return [
        { from: 0, limit: 250000, rate: 0 },
        { from: 250001, limit: 500000, rate: 0.05 },
        { from: 500001, limit: 750000, rate: 0.10 },
        { from: 750001, limit: 1000000, rate: 0.15 },
        { from: 1000001, limit: 1250000, rate: 0.20 },
        { from: 1250001, limit: 1500000, rate: 0.25 },
        { from: 1500001, limit: Infinity, rate: 0.30 }
    ];
}

// =============================================
// CALCULATOR 6: GOAL TRACKER
// =============================================

function trackGoal() {
    const goalName = document.getElementById("goalName").value || "Goal";
    const goalAmount = Number(document.getElementById("goalAmount").value);
    const currentSaved = Number(document.getElementById("currentSaved").value) || 0;
    const monthlyContribution = Number(document.getElementById("goalMonthly").value) || 0;
    const expectedReturn = Number(document.getElementById("goalReturn").value) / 100 || 0.07;
    const years = Number(document.getElementById("goalYears").value);
    
    if (!goalAmount || !years) {
        SmartBudgetAnimations.showToast("Please fill required fields", "warning");
        return;
    }
    
    const remaining = goalAmount - currentSaved;
    const months = years * 12;
    const r = expectedReturn / 12;
    
    // Calculate required monthly SIP
    const requiredSIP = remaining / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    
    // Calculate months to achieve goal
    const monthsToAchieve = currentSaved >= goalAmount ? 0 : 
        Math.log(1 + (remaining * r) / monthlyContribution) / Math.log(1 + r);
    
    const progressPercent = (currentSaved / goalAmount) * 100;
    const achievedAmount = Math.min(currentSaved, goalAmount);
    const remainingAmount = Math.max(0, goalAmount - currentSaved);
    
    document.getElementById("goalResult").innerHTML = `
        <div>Progress: <span>${progressPercent.toFixed(1)}%</span></div>
        <div>Saved: <span>₹${achievedAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Remaining: <span>₹${remainingAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Monthly Need: <span>₹${requiredSIP.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    // Update goal chart
    goalChart.data.datasets[0].data = [achievedAmount, remainingAmount];
    goalChart.update();
    
    // Update wealth projection
    updateGoalProjectionChart(currentSaved, monthlyContribution, expectedReturn, years, goalAmount);
    
    SmartBudgetAnimations.showToast("Goal Tracked!", "success");
}

function updateGoalProjectionChart(startAmount, monthly, rate, years, target) {
    let labels = [];
    let wealthData = [];
    let targetLine = [];
    let total = startAmount;
    
    for (let i = 1; i <= years; i++) {
        total = (total + monthly * 12) * (1 + rate);
        labels.push("Year " + i);
        wealthData.push(total);
        targetLine.push(target);
    }
    
    wealthChart.data.labels = labels;
    wealthChart.data.datasets[0].data = labels.map(() => startAmount);
    wealthChart.data.datasets[0].label = "Starting";
    wealthChart.data.datasets[1].data = wealthData;
    wealthChart.data.datasets[1].label = "Projected Growth";
    wealthChart.update();
}

// =============================================
// CALCULATOR 7: EMERGENCY FUND
// =============================================

function calculateEmergencyFund() {
    const monthlyExpense = Number(document.getElementById("monthlyExpense").value);
    const currentSavings = Number(document.getElementById("currentSavingsEmergency").value) || 0;
    const months = Number(document.getElementById("emergencyMonths").value) || 6;
    
    if (!monthlyExpense) {
        SmartBudgetAnimations.showToast("Please enter monthly expenses", "warning");
        return;
    }
    
    const target = monthlyExpense * months;
    const current = currentSavings;
    const gap = target - current;
    const progress = (current / target) * 100;
    
    let status = "";
    let statusClass = "";
    
    if (progress >= 100) {
        status = "✅ Fully Funded!";
        statusClass = "success";
    } else if (progress >= 50) {
        status = "⚠️ Good Progress";
        statusClass = "warning";
    } else {
        status = "🔴 Needs Attention";
        statusClass = "danger";
    }
    
    document.getElementById("emergencyResult").innerHTML = `
        <div>Target (${months} months): <span>₹${target.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Current: <span>₹${current.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Gap: <span>₹${Math.max(0, gap).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Status: <span class="${statusClass}">${status}</span></div>
    `;
    
    // Update goal chart as emergency fund progress
    goalChart.data.datasets[0].data = [Math.min(current, target), Math.max(0, gap)];
    goalChart.update();
    
    SmartBudgetAnimations.showToast("Emergency Fund Calculated!", "success");
}

// =============================================
// CALCULATOR 8: BUY VS INVEST
// =============================================

function compareBuyInvest() {
    const cost = Number(document.getElementById("buyCost").value);
    const years = Number(document.getElementById("buyYears").value);
    const returnRate = Number(document.getElementById("buyReturn").value) / 100;
    
    if (!cost || !years || !returnRate) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    // Future value if invested instead
    const investedValue = cost * Math.pow(1 + returnRate, years);
    const opportunityCost = investedValue - cost;
    
    document.getElementById("investInstead").innerHTML = `
        <div>If Invested: <span>₹${investedValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Opportunity Cost: <span>₹${opportunityCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div class="warning-text">💡 Consider investing ₹${cost.toLocaleString('en-IN')} instead!</div>
    `;
    
    // Update comparison chart
    comparisonChart.data.labels = ["Today", "Year " + years];
    comparisonChart.data.datasets[0].data = [cost, cost];
    comparisonChart.data.datasets[0].label = "If Spent (Depreciates)";
    comparisonChart.data.datasets[1].data = [0, investedValue];
    comparisonChart.data.datasets[1].label = "If Invested";
    comparisonChart.update();
    
    SmartBudgetAnimations.showToast("Comparison Ready!", "success");
}

// =============================================
// CALCULATOR 9: RENT VS BUY
// =============================================

function rentVsBuy() {
    const monthlyRent = Number(document.getElementById("monthlyRent").value);
    const housePrice = Number(document.getElementById("housePrice").value);
    const interestRate = Number(document.getElementById("mortgageRate").value) / 100 || 0.075;
    const years = Number(document.getElementById("loanTermYears").value) || 20;
    const rentIncrease = Number(document.getElementById("rentIncrease").value) / 100 || 0.05;
    const propertyAppreciation = Number(document.getElementById("propertyAppreciation").value) / 100 || 0.03;
    
    if (!monthlyRent || !housePrice) {
        SmartBudgetAnimations.showToast("Please fill required fields", "warning");
        return;
    }
    
    // Calculate EMI for house
    const downPayment = housePrice * 0.2;
    const loanAmount = housePrice - downPayment;
    const r = interestRate / 12;
    const n = years * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // Total rent over years
    let totalRent = 0;
    let currentRent = monthlyRent;
    for (let i = 0; i < years; i++) {
        totalRent += currentRent * 12;
        currentRent *= (1 + rentIncrease);
    }
    
    // Total EMI paid
    const totalEMI = emi * n;
    const totalInterest = totalEMI - loanAmount;
    
    // House value after appreciation
    const futureHouseValue = housePrice * Math.pow(1 + propertyAppreciation, years);
    const propertyGain = futureHouseValue - housePrice - totalInterest;
    
    // Net cost of buying
    const netBuyingCost = totalInterest + downPayment - propertyGain;
    
    const better = netBuyingCost < totalRent ? "Buying" : "Renting";
    
    document.getElementById("rentBuyResult").innerHTML = `
        <div>Total Rent (${years}yr): <span>₹${totalRent.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Net Cost to Buy: <span>₹${netBuyingCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Better Option: <span>${better}</span></div>
    `;
    
    // Update comparison chart
    comparisonChart.data.labels = Array.from({length: years}, (_, i) => "Year " + (i + 1));
    comparisonChart.data.datasets[0].data = Array.from({length: years}, (_, i) => monthlyRent * 12 * (i + 1));
    comparisonChart.data.datasets[0].label = "Total Rent Paid";
    comparisonChart.data.datasets[1].data = Array.from({length: years}, (_, i) => (emi * 12 * (i + 1)) + downPayment);
    comparisonChart.data.datasets[1].label = "Total Buying Cost";
    comparisonChart.update();
    
    SmartBudgetAnimations.showToast("Rent vs Buy Analysis Done!", "success");
}

// =============================================
// CALCULATOR 10: HOUSE AFFORDABILITY
// =============================================

function checkHouseAfford() {
    const annualIncome = Number(document.getElementById("annualIncome").value);
    const housePrice = Number(document.getElementById("desiredHouse").value);
    const downPaymentPercent = Number(document.getElementById("downPaymentPercent").value) || 20;
    const emiPercent = Number(document.getElementById("emiPercent").value) || 50;
    
    if (!annualIncome || !housePrice) {
        SmartBudgetAnimations.showToast("Please fill required fields", "warning");
        return;
    }
    
    const monthlyIncome = annualIncome / 12;
    const maxEMI = monthlyIncome * (emiPercent / 100);
    const downPayment = housePrice * (downPaymentPercent / 100);
    const loanAmount = housePrice - downPayment;
    
    // Calculate EMI for different rates
    const rates = [6.5, 7, 7.5, 8];
    let affordableRate = 0;
    let maxYears = 30;
    
    for (const rate of rates) {
        const r = rate / 100 / 12;
        const n = maxYears * 12;
        const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        if (emi <= maxEMI) {
            affordableRate = rate;
            break;
        }
    }
    
    const rule1 = housePrice <= annualIncome * 5;
    const rule2 = housePrice <= annualIncome * 4;
    
    let result = "";
    let resultClass = "";
    
    if (rule2) {
        result = "✅ Very Affordable";
        resultClass = "success";
    } else if (rule1) {
        result = "✅ Affordable";
        resultClass = "success";
    } else {
        result = "⚠️ Stretch";
        resultClass = "warning";
    }
    
    document.getElementById("houseAffordResult").innerHTML = `
        <div>Max Affordable EMI: <span>₹${maxEMI.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Down Payment: <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Assessment: <span class="${resultClass}">${result}</span></div>
    `;
    
    SmartBudgetAnimations.showToast("Affordability Checked!", "success");
}

// =============================================
// CALCULATOR 11: NET WORTH CALCULATOR
// =============================================

function calculateNetWorth() {
    // Assets
    const cash = Number(document.getIdInput("nwCash")) || 0;
    const investments = Number(document.getIdInput("nwInvestments")) || 0;
    const property = Number(document.getElementById("nwProperty").value) || 0;
    const gold = Number(document.getElementById("nwGold").value) || 0;
    const other = Number(document.getElementById("nwOther").value) || 0;
    
    // Liabilities
    const homeLoan = Number(document.getElementById("nwHomeLoan").value) || 0;
    const carLoan = Number(document.getElementById("nwCarLoan").value) || 0;
    const personalLoan = Number(document.getElementById("nwPersonalLoan").value) || 0;
    const creditCard = Number(document.getElementById("nwCreditCard").value) || 0;
    const otherDebt = Number(document.getElementById("nwOtherDebt").value) || 0;
    
    const totalAssets = cash + investments + property + gold + other;
    const totalLiabilities = homeLoan + carLoan + personalLoan + creditCard + otherDebt;
    const netWorth = totalAssets - totalLiabilities;
    
    document.getElementById("netWorthResult").innerHTML = `
        <div>Total Assets: <span>₹${totalAssets.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Total Liabilities: <span>₹${totalLiabilities.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Net Worth: <span>₹${netWorth.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    // Update net worth chart
    netWorthChart.data.datasets[0].data = [totalAssets];
    netWorthChart.data.datasets[1].data = [totalLiabilities];
    netWorthChart.data.datasets[2].data = [netWorth];
    netWorthChart.update();
    
    SmartBudgetAnimations.showToast("Net Worth Calculated!", "success");
}

function getIdInput(id) {
    return document.getElementById(id)?.value || 0;
}

// =============================================
// CALCULATOR 12: SALARY GROWTH
// =============================================

function simulateSalary() {
    const salary = Number(document.getElementById("currentSalary").value);
    const rate = Number(document.getElementById("growthRate").value) / 100;
    const years = Number(document.getElementById("growthYears").value);
    
    if (!salary || !rate || !years) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    const futureSalary = salary * Math.pow(1 + rate, years);
    const totalEarned = salary * years + (salary * rate * years * (years + 1) / 2);
    
    document.getElementById("futureSalary").innerText = formatCurrency(futureSalary);
    
    // Update chart
    comparisonChart.data.labels = Array.from({length: years}, (_, i) => "Year " + (i + 1));
    comparisonChart.data.datasets[0].data = Array.from({length: years}, (_, i) => salary * Math.pow(1 + rate, i));
    comparisonChart.data.datasets[0].label = "Projected Salary";
    comparisonChart.data.datasets[1].data = [];
    comparisonChart.update();
    
    SmartBudgetAnimations.showToast("Salary Projected!", "success");
}

// =============================================
// CALCULATOR 13: INFLATION CALCULATOR
// =============================================

function calculateBuyingPower() {
    const futureAmount = Number(document.getElementById("futureAmount").value);
    const inflationRate = Number(document.getElementById("inflationRate").value) / 100;
    const years = Number(document.getElementById("inflationYears").value);
    
    if (!futureAmount || !inflationRate || !years) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    const presentValue = futureAmount / Math.pow(1 + inflationRate, years);
    const lostValue = futureAmount - presentValue;
    
    document.getElementById("buyingPower").innerHTML = `
        <div>Today's Value: <span>₹${presentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Lost to Inflation: <span>₹${lostValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    SmartBudgetAnimations.showToast("Inflation Impact Calculated!", "success");
}

// =============================================
// CALCULATOR 14: FIRE CALCULATOR
// =============================================

function calculateFIRE() {
    const annualExpense = Number(document.getElementById("annualExpense").value);
    const withdrawalRate = Number(document.getElementById("withdrawalRate").value) || 4;
    const currentAge = Number(document.getElementById("fireAge").value) || 30;
    const retirementAge = Number(document.getElementById("fireRetireAge").value) || 50;
    const currentSavings = Number(document.getElementById("fireCurrentSavings").value) || 0;
    const annualContribution = Number(document.getElementById("fireAnnualContrib").value) || 0;
    const expectedReturn = Number(document.getElementById("fireReturn").value) / 100 || 0.07;
    
    if (!annualExpense) {
        SmartBudgetAnimations.showToast("Please enter annual expenses", "warning");
        return;
    }
    
    const fireNumber = annualExpense * (100 / withdrawalRate);
    const yearsToFire = retirementAge - currentAge;
    
    // Project savings growth
    let projectedSavings = currentSavings;
    for (let i = 0; i < yearsToFire; i++) {
        projectedSavings = (projectedSavings + annualContribution) * (1 + expectedReturn);
    }
    
    const gap = fireNumber - projectedSavings;
    const fireProgress = (projectedSavings / fireNumber) * 100;
    
    document.getElementById("fireNumber").innerHTML = `
        <div>FIRE Number: <span>₹${fireNumber.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Projected at ${retirementAge}: <span>₹${projectedSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Gap: <span>₹${Math.max(0, gap).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Progress: <span>${fireProgress.toFixed(1)}%</span></div>
    `;
    
    // Update goal chart
    goalChart.data.datasets[0].data = [Math.min(projectedSavings, fireNumber), Math.max(0, gap)];
    goalChart.update();
    
    SmartBudgetAnimations.showToast("FIRE Calculated!", "success");
}

// =============================================
// CALCULATOR 15: PASSIVE INCOME
// =============================================

function calculatePassive() {
    const dividend = Number(document.getElementById("dividendIncome").value) || 0;
    const rental = Number(document.getElementById("rentalIncome").value) || 0;
    const interest = Number(document.getElementById("interestIncome").value) || 0;
    const other = Number(document.getElementById("otherPassive").value) || 0;
    
    const total = dividend + rental + interest + other;
    const monthlyPassive = total / 12;
    
    document.getElementById("passiveTotal").innerHTML = `
        <div>Annual: <span>₹${total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Monthly: <span>₹${monthlyPassive.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    SmartBudgetAnimations.showToast("Passive Income Calculated!", "success");
}

// =============================================
// CALCULATOR 16: CAR VS UBER
// =============================================

function carVsUber() {
    const carCost = Number(document.getElementById("carMonthly").value);
    const uberCost = Number(document.getElementById("uberMonthly").value);
    const years = Number(document.getElementById("carYears").value) || 5;
    
    if (!carCost || !uberCost) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    const carTotal = carCost * 12 * years;
    const uberTotal = uberCost * 12 * years;
    const savings = Math.abs(carTotal - uberTotal);
    
    const better = carTotal < uberTotal ? "Car" : "Uber";
    
    document.getElementById("carUberResult").innerHTML = `
        <div>${years} Year Car Cost: <span>₹${carTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>${years} Year Uber Cost: <span>₹${uberTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
        <div>Better Option: <span>${better}</span></div>
        <div>Savings: <span>₹${savings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
    `;
    
    SmartBudgetAnimations.showToast("Car vs Uber Analysis Done!", "success");
}

// =============================================
// CALCULATOR 17: WEALTH TIMELINE
// =============================================

function calculateTimeline() {
    const investment = Number(document.getElementById("timelineInvestment").value);
    const rate = Number(document.getElementById("timelineReturn").value) / 100;
    const years = Number(document.getElementById("timelineYears").value);
    
    if (!investment || !rate || !years) {
        SmartBudgetAnimations.showToast("Please fill all fields", "warning");
        return;
    }
    
    const finalWealth = investment * Math.pow(1 + rate, years);
    const returns = finalWealth - investment;
    
    document.getElementById("timelineResult").innerText = formatCurrency(finalWealth);
    
    // Update wealth chart
    updateWealthChart(
        Array.from({length: years}, (_, i) => investment * (i + 1)),
        Array.from({length: years}, (_, i) => investment * Math.pow(1 + rate, i + 1)),
        Array.from({length: years}, (_, i) => "Year " + (i + 1))
    );
    
    SmartBudgetAnimations.showToast("Wealth Timeline Calculated!", "success");
}

// =============================================
// CHART UPDATE HELPERS
// =============================================

function updateWealthChart(invested, growth, labels) {
    wealthChart.data.labels = labels;
    wealthChart.data.datasets[0].data = invested;
    wealthChart.data.datasets[1].data = growth;
    wealthChart.update();
}

function updateComparisonChart(labels, data1, data2, label1, label2) {
    comparisonChart.data.labels = labels;
    comparisonChart.data.datasets[0].data = data1;
    comparisonChart.data.datasets[0].label = label1;
    comparisonChart.data.datasets[1].data = data2;
    comparisonChart.data.datasets[1].label = label2;
    comparisonChart.update();
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

// Logout function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}

