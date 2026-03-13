// ==============================================
// SMARTBUDGET AI ENGINE - ENHANCED EDITION
// Advanced AI Investment Advisory with Multiple Charts
// ==============================================

// Chart instances
let allocationChart;
let projectionChart;
let riskChart;
let sectorChart;

// ================================
// MAIN ENTRY
// ================================
function generateAdvice() {
    const input = collectInput();
    if (!validateInput(input)) return;

    // Run all AI engines
    const profile = analyzeProfile(input);
    const riskCheck = riskEngine(profile, input);
    const allocation = allocationEngine(profile, input, riskCheck);
    const simulation = simulationEngine(input, allocation);
    const insights = insightEngine(profile, allocation, simulation, riskCheck);
    const confidence = confidenceEngine(profile, allocation, riskCheck);
    const response = formatResponse(profile, allocation, insights, confidence);

    renderOutput(response, allocation, simulation, riskCheck);
    
    // Render additional charts
    renderProjectionChart(simulation);
    renderRiskChart(riskCheck);
    renderSectorChart(allocation);
}

// ================================
// INPUT COLLECTION
// ================================
function collectInput() {
    return {
        age: Number(document.getElementById("age").value),
        income: Number(document.getElementById("monthlyIncome").value),
        investment: Number(document.getElementById("investmentAmount").value),
        risk: document.getElementById("riskLevel").value,
        scenario: document.getElementById("marketScenario")?.value || "normal",
        // New inputs
        goals: document.getElementById("investmentGoals")?.value || "growth",
        experience: document.getElementById("experienceLevel")?.value || "intermediate",
        timeframe: document.getElementById("timeframe")?.value || "medium"
    };
}

// ================================
// VALIDATION
// ================================
function validateInput(data) {
    if (!data.age || !data.income || !data.investment || !data.risk) {
        document.getElementById("formWarning").innerText = "Please fill all required fields.";
        return false;
    }
    document.getElementById("formWarning").innerText = "";
    return true;
}

// ================================
// PROFILE ANALYZER - ENHANCED
// ================================
function analyzeProfile(data) {
    let horizon = "medium";
    if (data.age < 30) horizon = "long";
    else if (data.age > 50) horizon = "short";

    const investRatio = data.investment / data.income;
    let strengthScore = 50;
    if (investRatio > 0.3) strengthScore += 20;
    if (investRatio > 0.5) strengthScore += 10;

    // Experience multiplier
    let expMultiplier = 1;
    if (data.experience === "expert") expMultiplier = 1.2;
    else if (data.experience === "beginner") expMultiplier = 0.8;

    // Goal-based adjustments
    let goalMultiplier = 1;
    if (data.goals === "aggressive") goalMultiplier = 1.3;
    else if (data.goals === "preservation") goalMultiplier = 0.7;

    return {
        horizon,
        strengthScore,
        expMultiplier,
        goalMultiplier,
        investRatio
    };
}

// ================================
// RISK ENGINE - ENHANCED
// ================================
function riskEngine(profile, data) {
    let capacity = "medium";

    // Age-based capacity
    if (data.age < 30 && profile.strengthScore > 60) capacity = "high";
    if (data.age > 55) capacity = "low";
    if (data.age >= 30 && data.age <= 50) capacity = "medium";

    // Experience adjustment
    if (data.experience === "beginner" && capacity === "high") capacity = "medium";

    const mismatch = data.risk !== capacity;

    // Risk score (0-100)
    let riskScore = 50;
    if (capacity === "high") riskScore = 80;
    if (capacity === "low") riskScore = 30;
    if (data.scenario === "bear") riskScore -= 20;
    if (data.scenario === "bull") riskScore += 15;

    return {
        capacity,
        mismatch,
        riskScore,
        volatility: data.scenario === "bear" ? "high" : data.scenario === "bull" ? "moderate" : "normal"
    };
}

// ================================
// ALLOCATION ENGINE - ENHANCED
// ================================
function allocationEngine(profile, data, riskCheck) {
    let allocation;

    // Base allocation by risk
    if (data.risk === "low") {
        allocation = { equity: 25, debt: 55, gold: 10, cash: 10 };
    } else if (data.risk === "medium") {
        allocation = { equity: 50, debt: 30, gold: 10, cash: 10 };
    } else {
        allocation = { equity: 75, debt: 10, gold: 10, cash: 5 };
    }

    // Goal adjustments
    if (data.goals === "aggressive") {
        allocation.equity += 10;
        allocation.debt -= 10;
    } else if (data.goals === "preservation") {
        allocation.equity -= 15;
        allocation.debt += 15;
    }

    // Market scenario adjustments
    if (data.scenario === "bear") {
        allocation.equity = Math.max(15, allocation.equity - 15);
        allocation.debt += 10;
        allocation.cash += 5;
    } else if (data.scenario === "bull") {
        allocation.equity = Math.min(85, allocation.equity + 5);
    }

    // Ensure totals equal 100
    const total = allocation.equity + allocation.debt + allocation.gold + allocation.cash;
    if (total !== 100) {
        const diff = 100 - total;
        allocation.debt += diff;
    }

    // Add sector allocation
    allocation.sectors = {
        largeCap: 40,
        midCap: 30,
        smallCap: 20,
        international: 10
    };

    return allocation;
}

// ================================
// SIMULATION ENGINE - ENHANCED
// ================================
function simulationEngine(data, allocation) {
    // Expected return based on allocation and scenario
    let expectedReturn = 
        (allocation.equity * 0.12 + allocation.debt * 0.07 + allocation.gold * 0.08 + allocation.cash * 0.04) / 100;

    // Scenario adjustment
    if (data.scenario === "bear") expectedReturn = 0.05;
    if (data.scenario === "bull") expectedReturn = 0.14;
    if (data.scenario === "normal") expectedReturn = 0.10;

    // Timeframe
    const years = data.timeframe === "long" ? 20 : data.timeframe === "medium" ? 10 : 5;

    // Calculate future values
    const lumpsumFV = data.investment * Math.pow(1 + expectedReturn, years);
    
    // SIP calculation (assuming monthly investment = investment amount)
    const monthlyInvest = data.investment;
    const monthlyRate = expectedReturn / 12;
    const months = years * 12;
    const sipFV = monthlyInvest * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

    // Year-by-year data for chart
    const yearlyData = [];
    for (let i = 1; i <= years; i++) {
        yearlyData.push({
            year: i,
            lumpsum: data.investment * Math.pow(1 + expectedReturn, i),
            sip: monthlyInvest * ((Math.pow(1 + monthlyRate, i * 12) - 1) / monthlyRate) * (1 + monthlyRate)
        });
    }

    return {
        expectedReturn: expectedReturn * 100,
        lumpsumFV,
        sipFV,
        years,
        yearlyData,
        totalInvested: data.investment + (monthlyInvest * months)
    };
}

// ================================
// INSIGHT ENGINE - ENHANCED
// ================================
function insightEngine(profile, allocation, simulation, riskCheck) {
    let insights = [];

    // Horizon insights
    if (profile.horizon === "long") {
        insights.push("Your long investment horizon allows for higher equity exposure to maximize growth.");
    } else if (profile.horizon === "short") {
        insights.push("Short horizon suggests focusing on stable, liquid investments.");
    }

    // Risk insights
    if (riskCheck.mismatch) {
        insights.push("⚠️ Your selected risk level differs from your calculated risk capacity.");
    }

    if (riskCheck.volatility === "high") {
        insights.push("📉 Current market conditions suggest a defensive approach.");
    }

    // Allocation insights
    if (allocation.equity > 60) {
        insights.push("High equity allocation offers growth potential but carries higher risk.");
    }
    if (allocation.debt > 40) {
        insights.push("Strong debt allocation provides stability and predictable returns.");
    }
    if (allocation.gold > 10) {
        insights.push("Gold allocation acts as a hedge against inflation and market uncertainty.");
    }

    // Projections
    insights.push(`📈 Expected return: ${simulation.expectedReturn.toFixed(1)}% per year`);
    insights.push(`💰 Projected wealth (${simulation.years}yr): ₹${simulation.sipFV.toLocaleString('en-IN', {maximumFractionDigits: 0})}`);

    // Action items
    const actions = [];
    if (allocation.equity > 50) {
        actions.push("Consider starting with SIP to average out market volatility");
    }
    if (profile.strengthScore < 60) {
        actions.push("Build an emergency fund before making large investments");
    }
    if (riskCheck.mismatch) {
        actions.push("Review your risk tolerance with a financial advisor");
    }

    return { insights, actions };
}

// ================================
// CONFIDENCE ENGINE - ENHANCED
// ================================
function confidenceEngine(profile, allocation, riskCheck) {
    let score = 55;

    if (!riskCheck.mismatch) score += 15;
    if (profile.strengthScore > 60) score += 10;
    if (allocation.equity >= 40 && allocation.equity <= 60) score += 10;
    if (profile.horizon === "long") score += 10;

    // Experience bonus
    if (profile.expMultiplier > 1) score += 5;

    return Math.min(Math.max(score, 30), 95);
}

// ================================
// RESPONSE FORMATTER
// ================================
function formatResponse(profile, allocation, insights, confidence) {
    let personality = "Balanced Builder";

    if (allocation.equity >= 70) personality = "Aggressive Growth Investor";
    else if (allocation.equity >= 50) personality = "Moderate Growth Investor";
    else if (allocation.equity >= 30) personality = "Conservative Builder";
    else personality = "Capital Preservation Investor";

    // Risk category
    let riskCategory = "Moderate";
    if (allocation.equity >= 70) riskCategory = "Aggressive";
    else if (allocation.equity <= 30) riskCategory = "Conservative";

    return {
        personality,
        riskCategory,
        allocation,
        insights: insights.insights,
        actions: insights.actions,
        confidence
    };
}

// ================================
// RENDER OUTPUT
// ================================
function renderOutput(response, allocation, simulation, riskCheck) {
    // Personality badge
    const badge = document.getElementById("personalityBadge");
    badge.innerText = response.personality;
    badge.className = "badge badge-" + (response.riskCategory.toLowerCase());

    // Risk category badge
    let riskBadge = document.getElementById("riskCategoryBadge");
    if (!riskBadge) {
        riskBadge = document.createElement("div");
        riskBadge.id = "riskCategoryBadge";
        riskBadge.className = "badge";
        badge.parentNode.insertBefore(riskBadge, badge.nextSibling);
    }
    riskBadge.innerText = response.riskCategory + " Risk";

    // Insights
    const insightBox = document.getElementById("aiInsights");
    insightBox.innerHTML = response.insights.map(i => `<p>• ${i}</p>`).join('');

    // Actions
    const actionList = document.getElementById("aiActions");
    if (actionList) {
        actionList.innerHTML = response.actions.map(a => `<li>${a}</li>`).join('');
    }

    // Confidence
    document.getElementById("confidenceFill").style.width = response.confidence + "%";
    document.getElementById("confidenceScore").innerText = response.confidence + "% Confidence";

    // Investment summary
    const summaryBox = document.getElementById("investmentSummary");
    if (summaryBox) {
        summaryBox.innerHTML = `
            <p><strong>Expected Annual Return:</strong> ${simulation.expectedReturn.toFixed(1)}%</p>
            <p><strong>Total Investment:</strong> ₹${simulation.totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            <p><strong>Projected Value (${simulation.years}yr):</strong> ₹${simulation.sipFV.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            <p><strong>Potential Returns:</strong> ₹${(simulation.sipFV - simulation.totalInvested).toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
        `;
    }

    // Allocation Chart
    renderAllocationChart(allocation);
}

// ================================
// CHART: ALLOCATION (Doughnut)
// ================================
function renderAllocationChart(allocation) {
    const ctx = document.getElementById("allocationChart");
    if (!ctx) return;

    if (allocationChart) allocationChart.destroy();

    allocationChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Equity", "Debt", "Gold", "Cash"],
            datasets: [{
                data: [allocation.equity, allocation.debt, allocation.gold, allocation.cash],
                backgroundColor: [
                    "#3b82f6",
                    "#22c55e",
                    "#f59e0b",
                    "#8b5cf6"
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
                        boxWidth: 12,
                        padding: 15,
                        font: { size: 11 },
                        color: '#9ca3af'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// ================================
// CHART: PROJECTION (Line + Bar)
// ================================
function renderProjectionChart(simulation) {
    const ctx = document.getElementById("projectionChart");
    if (!ctx) return;

    if (projectionChart) projectionChart.destroy();

    projectionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: simulation.yearlyData.map(d => "Year " + d.year),
            datasets: [
                {
                    label: "SIP Value",
                    data: simulation.yearlyData.map(d => d.sip),
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: "Total Invested",
                    data: simulation.yearlyData.map((d, i) => d.sip > 0 ? simulation.totalInvested / simulation.years * (i + 1) : 0),
                    borderColor: "#3b82f6",
                    backgroundColor: "transparent",
                    borderDash: [5, 5],
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#9ca3af', usePointStyle: true }
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

// ================================
// CHART: RISK ANALYSIS (Radar)
// ================================
function renderRiskChart(riskCheck) {
    const ctx = document.getElementById("riskChart");
    if (!ctx) return;

    if (riskChart) riskChart.destroy();

    // Generate risk metrics
    const riskMetrics = {
        marketRisk: riskCheck.volatility === "high" ? 80 : riskCheck.volatility === "moderate" ? 50 : 30,
        liquidityRisk: 20,
        inflationRisk: 60,
        interestRisk: 40,
        concentrationRisk: 50
    };

    riskChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: ["Market Risk", "Liquidity Risk", "Inflation Risk", "Interest Risk", "Concentration"],
            datasets: [{
                label: "Your Risk Profile",
                data: [
                    riskMetrics.marketRisk,
                    riskMetrics.liquidityRisk,
                    riskMetrics.inflationRisk,
                    riskMetrics.interestRisk,
                    riskMetrics.concentrationRisk
                ],
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                pointBackgroundColor: "#ef4444",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#ef4444"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    angleLines: { color: "rgba(255, 255, 255, 0.1)" },
                    pointLabels: { color: '#9ca3af', font: { size: 10 } },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// ================================
// CHART: SECTOR ALLOCATION (Horizontal Bar)
// ================================
function renderSectorChart(allocation) {
    const ctx = document.getElementById("sectorChart");
    if (!ctx) return;

    if (sectorChart) sectorChart.destroy();

    const sectors = allocation.sectors || {
        largeCap: 40,
        midCap: 30,
        smallCap: 20,
        international: 10
    };

    sectorChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Large Cap", "Mid Cap", "Small Cap", "International"],
            datasets: [{
                label: "Sector Allocation",
                data: [sectors.largeCap, sectors.midCap, sectors.smallCap, sectors.international],
                backgroundColor: [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(139, 92, 246, 0.8)",
                    "rgba(236, 72, 153, 0.8)",
                    "rgba(16, 185, 129, 0.8)"
                ],
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: '#9ca3af', callback: v => v + '%' },
                    max: 50
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

// ================================
// UTILITY: Initialize all charts
// ================================
document.addEventListener("DOMContentLoaded", () => {
    // Charts will be initialized when user generates advice
});

