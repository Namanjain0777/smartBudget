// SmartBudget API Configuration
// Update this URL with your Render backend URL after deployment

const API_BASE_URL = 'https://smartbudget-jij8.onrender.com';

function getApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

console.log('API Config loaded:', API_BASE_URL);

// Export for use in other modules (global scope for simplicity)
window.SmartBudgetAPI = { getApiUrl };
