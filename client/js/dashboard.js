/**
 * SmartBudget - Premium Dashboard JavaScript
 * Handles data persistence, animations, charts, and AI recommendations
 */

// =====================================================
// AUTHENTICATION CHECK
// =====================================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// =====================================================
// STATE MANAGEMENT
// =====================================================

const state = {
    income: 0,
    expense: 0,
    investments: {},
    liabilities: {},
    expenseCategories: {
        Need: 0,
        Want: 0,
        Necessary: 0
    },
    savingsHistory: [], // For savings trend chart
    isLoading: true
};

// Selection state
let selectedExpenseType = "Need";
let selectedInvestmentType = "Stocks";
let selectedLiabilityType = "Loan";

// Chart instances
let expenseChart;
let investmentChart;
let savingsTrendChart;
let healthChart;

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {
    showLoading(true);
    
    try {
        await initCharts();
        await fetchUserData();
        renderDashboard();
    } catch (error) {
        console.error("Initialization error:", error);
        SmartBudgetAnimations.showToast("Error loading dashboard", "error");
    } finally {
        showLoading(false);
    }
});

// =====================================================
// LOADING STATES
// =====================================================

function showLoading(show) {
    state.isLoading = show;
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
        overlay.style.display = show ? "flex" : "none";
    }
}

// =====================================================
// DATA FETCHING (Persistent User Data)
// =====================================================

async function fetchUserData() {
    const token = localStorage.getItem("token");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
        const response = await fetch("/api/finance", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (response.ok) {
            const data = await response.json();
            
            if (data) {
                // Populate state from database
                state.income = data.income || 0;
                state.expense = data.expense || 0;
                state.investments = data.investments || {};
                state.liabilities = data.liabilities || {};
                
                // Initialize savings history if not present
                if (!state.savingsHistory.length) {
                    state.savingsHistory = Array(6).fill(0);
                }
                
                console.log("Data loaded from server:", state);
                SmartBudgetAnimations.showToast("Welcome back! Your data is loaded.", "success");
            }
        } else if (response.status === 404) {
            // No data yet - this is fine for new users
            console.log("No existing data found");
        }
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("Dashboard data error:", error);
        let msg = 'Dashboard load failed. ';
        if (error.name === 'AbortError') {
            msg += 'Timeout. Check server.';
        } else if (error.message.includes('Failed to fetch')) {
            msg += 'Server down? Run "cd server && npm start". Works offline.';
        } else {
            msg += 'New user? Add data manually.';
        }
        if (SmartBudgetAnimations && SmartBudgetAnimations.showToast) {
            SmartBudgetAnimations.showToast(msg, "warning");
        }
        // Continue offline
    }
}

// =====================================================
// DATA SAVING (Auto-save)
// =====================================================

async function saveToServer() {
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch("/api/finance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                income: state.income,
                expense: state.expense,
                investments: state.investments,
                liabilities: state.liabilities
            })
        });

        if (response.ok) {
            console.log("Data saved successfully");
            SmartBudgetAnimations.showToast("Data saved!", "success");
        }
    } catch (error) {
        console.error("Error saving data:", error);
        SmartBudgetAnimations.showToast("Error saving data", "error");
    }
}

// Debounced save function
const debouncedSave = SmartBudgetAnimations.debounce(saveToServer, 1000);

// =====================================================
// CHART INITIALIZATION
// =====================================================

async function initCharts() {
    Chart.defaults.color = "#9ca3af";
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Expense Category Chart (Doughnut)
    const expenseCtx = document.getElementById("expenseChart");
    if (expenseCtx) {
        expenseChart = new Chart(expenseCtx, {
            type: "doughnut",
            data: {
                labels: ["Need", "Want", "Necessary"],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(245, 158, 11, 0.8)"
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Investment Portfolio Chart (Pie)
    const investmentCtx = document.getElementById("investmentChart");
    if (investmentCtx) {
        investmentChart = new Chart(investmentCtx, {
            type: "pie",
            data: {
                labels: ["Stocks", "Mutual Funds", "FD", "Gold", "Real Estate", "Crypto", "PPF", "Cash"],
                datasets: [{
                    data: Array(8).fill(0),
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                        "rgba(6, 182, 212, 0.8)",
                        "rgba(236, 72, 153, 0.8)",
                        "rgba(107, 114, 128, 0.8)",
                        "rgba(156, 163, 175, 0.8)"
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: { size: 11 }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });
    }

    // Savings Trend Chart (Line)
    const savingsTrendCtx = document.getElementById("savingsTrendChart");
    if (savingsTrendCtx) {
        savingsTrendChart = new Chart(savingsTrendCtx, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{
                    label: "Savings",
                    data: state.savingsHistory,
                    borderColor: "rgba(139, 92, 246, 1)",
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: "rgba(139, 92, 246, 1)"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)"
                        }
                    },
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)"
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Financial Health Chart (Radar)
    const healthCtx = document.getElementById("healthChart");
    if (healthCtx) {
        healthChart = new Chart(healthCtx, {
            type: "radar",
            data: {
                labels: ["Savings Rate", "Debt Level", "Emergency Fund", "Investments", "Diversification"],
                datasets: [{
                    label: "Your Score",
                    data: [0, 0, 0, 0, 0],
                    borderColor: "rgba(16, 185, 129, 1)",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    pointBackgroundColor: "rgba(16, 185, 129, 1)"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)"
                        },
                        angleLines: {
                            color: "rgba(255, 255, 255, 0.1)"
                        },
                        pointLabels: {
                            color: "#9ca3af"
                        }
                    }
                },
                animation: {
                    duration: 1500
                }
            }
        });
    }
}

// =====================================================
// TYPE SELECTION
// =====================================================

function selectExpenseType(btn, type) {
    selectedExpenseType = type;
    document.querySelectorAll(".expense-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function selectType(btn, type) {
    selectedInvestmentType = type;
    document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function selectLiabilityType(btn, type) {
    selectedLiabilityType = type;
    document.querySelectorAll(".liability-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// =====================================================
// ADD DATA FUNCTIONS
// =====================================================

function addIncome() {
    const input = document.getElementById("incomeInput");
    const val = Number(input.value);
    
    if (!val || val <= 0) {
        SmartBudgetAnimations.showToast("Please enter a valid amount", "warning");
        return;
    }
    
    state.income += val;
    input.value = "";
    
    // Animate the counter
    const totalIncomeEl = document.getElementById("totalIncome");
    SmartBudgetAnimations.animateCounter(totalIncomeEl, 0, state.income, 800, "₹", "");
    
    renderDashboard();
    debouncedSave();
    
    SmartBudgetAnimations.showToast("Income added successfully!", "success");
}

function addExpense() {
    const input = document.getElementById("expenseInput");
    const val = Number(input.value);
    
    if (!val || val <= 0) {
        SmartBudgetAnimations.showToast("Please enter a valid amount", "warning");
        return;
    }
    
    state.expense += val;
    state.expenseCategories[selectedExpenseType] += val;
    input.value = "";
    
    renderDashboard();
    debouncedSave();
    
    SmartBudgetAnimations.showToast("Expense added successfully!", "success");
}

function addInvestment() {
    const input = document.getElementById("investmentAmount");
    const val = Number(input.value);
    
    if (!val || val <= 0) {
        SmartBudgetAnimations.showToast("Please enter a valid amount", "warning");
        return;
    }
    
    state.investments[selectedInvestmentType] = 
        (state.investments[selectedInvestmentType] || 0) + val;
    input.value = "";
    
    renderDashboard();
    debouncedSave();
    
    SmartBudgetAnimations.showToast("Investment added successfully!", "success");
}

function addLiability() {
    const input = document.getElementById("liabilityAmount");
    const val = Number(input.value);
    
    if (!val || val <= 0) {
        SmartBudgetAnimations.showToast("Please enter a valid amount", "warning");
        return;
    }
    
    state.liabilities[selectedLiabilityType] = 
        (state.liabilities[selectedLiabilityType] || 0) + val;
    input.value = "";
    
    renderDashboard();
    debouncedSave();
    
    SmartBudgetAnimations.showToast("Liability added successfully!", "success");
}

// =====================================================
// CALCULATIONS
// =====================================================

function calculate() {
    const totalInvestment = Object.values(state.investments)
        .reduce((a, b) => a + b, 0);

    const totalLiability = Object.values(state.liabilities)
        .reduce((a, b) => a + b, 0);

    const savings = state.income - state.expense;
    const assets = totalInvestment + Math.max(0, savings);
    const netWorth = assets - totalLiability;

    const savingsRate = state.income > 0
        ? ((savings / state.income) * 100)
        : 0;

    const debtRatio = assets > 0
        ? ((totalLiability / assets) * 100)
        : 0;

    const monthlyBurn = state.expense;
    const runwayMonths = monthlyBurn > 0
        ? (assets / monthlyBurn)
        : 0;

    // Emergency fund calculation (6x monthly expenses)
    const requiredEmergencyFund = monthlyBurn * 6;
    const emergencyFundProgress = requiredEmergencyFund > 0
        ? Math.min((Math.max(0, savings) / requiredEmergencyFund) * 100, 100)
        : 0;

    // 50/30/20 rule
    const needs = state.income * 0.5;
    const wants = state.income * 0.3;
    const savingsTarget = state.income * 0.2;

    // Asset allocation percentages
    const equityTypes = ['Stocks', 'Mutual Funds'];
    const debtTypes = ['FD', 'Bonds', 'PPF'];
    const goldTypes = ['Gold'];
    const cashTypes = ['Cash'];
    
    let equity = 0, debt = 0, gold = 0, cash = 0;
    
    Object.entries(state.investments).forEach(([type, amount]) => {
        if (equityTypes.includes(type)) equity += amount;
        else if (debtTypes.includes(type)) debt += amount;
        else if (goldTypes.includes(type)) gold += amount;
        else if (cashTypes.includes(type)) cash += amount;
    });

    const equityPercent = totalInvestment > 0 ? (equity / totalInvestment) * 100 : 0;
    const debtPercent = totalInvestment > 0 ? (debt / totalInvestment) * 100 : 0;
    const goldPercent = totalInvestment > 0 ? (gold / totalInvestment) * 100 : 0;
    const cashPercent = totalInvestment > 0 ? (cash / totalInvestment) * 100 : 0;

    return {
        savings,
        assets,
        netWorth,
        totalInvestment,
        totalLiability,
        savingsRate,
        debtRatio,
        monthlyBurn,
        runwayMonths,
        requiredEmergencyFund,
        emergencyFundProgress,
        needs,
        wants,
        savingsTarget,
        equityPercent,
        debtPercent,
        goldPercent,
        cashPercent
    };
}

// =====================================================
// AI RECOMMENDATIONS
// =====================================================

function generateAIRecommendation(data) {
    const recommendations = [];
    
    // Savings rate analysis
    if (data.savingsRate < 10) {
        recommendations.push("⚠️ Your savings rate is critically low (<10%). Try to reduce discretionary expenses and increase income.");
    } else if (data.savingsRate < 20) {
        recommendations.push("💡 Your savings rate is below the recommended 20%. Consider cutting unnecessary expenses.");
    } else if (data.savingsRate >= 20 && data.savingsRate <= 30) {
        recommendations.push("✅ Great job! You're meeting the 20% savings target. Keep it up!");
    } else {
        recommendations.push("🎉 Excellent! Your savings rate is above 30%. You're on track for early retirement!");
    }

    // Debt analysis
    if (data.debtRatio > 50) {
        recommendations.push("⚠️ High debt ratio detected. Prioritize paying down high-interest debt like credit cards.");
    } else if (data.debtRatio < 30) {
        recommendations.push("✅ Your debt levels are healthy. Consider investing the difference.");
    }

    // Emergency fund
    if (data.emergencyFundProgress < 50 && state.income > 0) {
        recommendations.push("🛡️ Build your emergency fund to at least 6 months of expenses before investing.");
    }

    // Investment diversification
    if (data.totalInvestment > 0 && data.equityPercent > 70) {
        recommendations.push("⚖️ Your portfolio is heavily weighted in equity. Consider adding debt instruments for balance.");
    }

    // 50/30/20 rule
    const expenseBreakdown = state.expenseCategories;
    const totalExpense = state.expense;
    
    if (totalExpense > 0) {
        const needRatio = (expenseBreakdown.Need / totalExpense) * 100;
        const wantRatio = (expenseBreakdown.Want / totalExpense) * 100;
        
        if (needRatio > 60) {
            recommendations.push("💡 Your 'Needs' expenses are high. Look for ways to reduce housing or utility costs.");
        }
    }

    // If no data
    if (state.income === 0 && state.expense === 0) {
        recommendations.push("📊 Start by adding your income and expenses to get personalized recommendations.");
    }

    // Display first 2-3 recommendations
    const displayRecommendations = recommendations.slice(0, 3);
    
    const container = document.getElementById("aiRecommendation");
    container.innerHTML = displayRecommendations.map(rec => 
        `<p style="margin-bottom: 12px;">${rec}</p>`
    ).join('');
    
    container.style.borderLeft = "3px solid var(--accent-purple)";
    container.style.paddingLeft = "16px";
}

// =====================================================
// RENDER DASHBOARD
// =====================================================

function renderDashboard() {
    const data = calculate();

    // Animate KPI counters
    const kpiMappings = [
        { id: "totalIncome", value: state.income, prefix: "₹", suffix: "" },
        { id: "totalExpense", value: state.expense, prefix: "₹", suffix: "" },
        { id: "totalSavings", value: data.savings, prefix: "₹", suffix: "" },
        { id: "savingsRate", value: data.savingsRate, prefix: "", suffix: "%" },
        { id: "totalInvestments", value: data.totalInvestment, prefix: "₹", suffix: "" },
        { id: "totalLiabilities", value: data.totalLiability, prefix: "₹", suffix: "" }
    ];

    kpiMappings.forEach(kpi => {
        const el = document.getElementById(kpi.id);
        if (el) {
            const currentValue = parseFloat(el.dataset.current) || 0;
            SmartBudgetAnimations.animateCounter(el, currentValue, kpi.value, 600, kpi.prefix, kpi.suffix);
            el.dataset.current = kpi.value;
        }
    });

    // Net worth
    const netWorthEl = document.getElementById("netWorthValue");
    if (netWorthEl) {
        const currentNetWorth = parseFloat(netWorthEl.dataset.current) || 0;
        SmartBudgetAnimations.animateCounter(netWorthEl, currentNetWorth, data.netWorth, 600, "₹", "");
        netWorthEl.dataset.current = data.netWorth;
    }

    // Update text elements
    updateTextSafely("totalAssets", `₹${data.assets.toLocaleString('en-IN')}`);
    updateTextSafely("totalLiabilitiesDisplay", `₹${data.totalLiability.toLocaleString('en-IN')}`);
    updateTextSafely("requiredFund", `₹${data.requiredEmergencyFund.toLocaleString('en-IN')}`);
    updateTextSafely("currentSavingsDisplay", `₹${Math.max(0, data.savings).toLocaleString('en-IN')}`);

    // 50/30/20 Rule
    updateTextSafely("ruleNeeds", `₹${data.needs.toLocaleString('en-IN')}`);
    updateTextSafely("ruleWants", `₹${data.wants.toLocaleString('en-IN')}`);
    updateTextSafely("ruleSavings", `₹${data.savingsTarget.toLocaleString('en-IN')}`);

    // 50/30/20 Status
    const ruleStatusEl = document.getElementById("ruleStatus");
    if (ruleStatusEl) {
        const actualSavings = Math.max(0, data.savings);
        if (actualSavings >= data.savingsTarget) {
            ruleStatusEl.textContent = "✅ You're meeting your savings target!";
            ruleStatusEl.style.color = "var(--accent-green)";
        } else {
            const shortfall = data.savingsTarget - actualSavings;
            ruleStatusEl.textContent = `⚠️ You're short by ₹${shortfall.toLocaleString('en-IN')}`;
            ruleStatusEl.style.color = "var(--accent-yellow)";
        }
    }

    // Asset allocation
    updateTextSafely("equityPercent", `${data.equityPercent.toFixed(1)}%`);
    updateTextSafely("debtPercent", `${data.debtPercent.toFixed(1)}%`);
    updateTextSafely("goldPercent", `${data.goldPercent.toFixed(1)}%`);
    updateTextSafely("cashPercent", `${data.cashPercent.toFixed(1)}%`);

    // Progress bars
    const fundProgress = document.getElementById("fundProgress");
    if (fundProgress) {
        fundProgress.style.width = `${data.emergencyFundProgress}%`;
        
        // Change color based on progress
        if (data.emergencyFundProgress >= 100) {
            fundProgress.style.background = "var(--gradient-success)";
        } else if (data.emergencyFundProgress >= 50) {
            fundProgress.style.background = "var(--gradient-primary)";
        } else {
            fundProgress.style.background = "var(--gradient-warning)";
        }
    }

    // Fund suggestion
    const fundSuggestion = document.getElementById("fundSuggestion");
    if (fundSuggestion) {
        if (data.emergencyFundProgress >= 100) {
            fundSuggestion.textContent = "✅ Emergency fund fully funded!";
            fundSuggestion.style.color = "var(--accent-green)";
        } else {
            fundSuggestion.textContent = `📌 ${data.emergencyFundProgress.toFixed(0)}% funded. Need ₹${(data.requiredEmergencyFund - Math.max(0, data.savings)).toLocaleString('en-IN')} more.`;
            fundSuggestion.style.color = "var(--text-secondary)";
        }
    }

    // Update charts
    updateCharts(data);

    // Generate AI recommendations
    generateAIRecommendation(data);
}

// Helper function to safely update text
function updateTextSafely(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// =====================================================
// UPDATE CHARTS
// =====================================================

function updateCharts(data) {
    // Expense chart
    if (expenseChart) {
        expenseChart.data.datasets[0].data = [
            state.expenseCategories.Need,
            state.expenseCategories.Want,
            state.expenseCategories.Necessary
        ];
        expenseChart.update();
    }

    // Investment chart
    if (investmentChart) {
        const investmentTypes = ["Stocks", "Mutual Funds", "FD", "Gold", "Real Estate", "Crypto", "PPF", "Cash"];
        const investmentData = investmentTypes.map(type => state.investments[type] || 0);
        
        investmentChart.data.datasets[0].data = investmentData;
        investmentChart.update();
    }

    // Savings trend chart - add current savings to history
    if (savingsTrendChart && state.income > 0) {
        // Shift array and add current savings
        state.savingsHistory.shift();
        state.savingsHistory.push(data.savings);
        
        savingsTrendChart.data.datasets[0].data = state.savingsHistory;
        savingsTrendChart.update();
    }

    // Health chart
    if (healthChart) {
        const healthScores = [
            Math.min(100, Math.max(0, data.savingsRate * 5)), // Savings rate score
            Math.max(0, 100 - data.debtRatio), // Debt score
            data.emergencyFundProgress, // Emergency fund score
            data.totalInvestment > 0 ? Math.min(100, (data.totalInvestment / state.income) * 20) : 0, // Investment score
            data.equityPercent > 0 ? Math.min(100, 100 - Math.abs(60 - data.equityPercent)) : 50 // Diversification score
        ];

        healthChart.data.datasets[0].data = healthScores;
        healthChart.update();
    }
}

// =====================================================
// LOGOUT
// =====================================================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}

