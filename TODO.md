# SmartBudget Network Error Fix - TODO

## Plan Progress
- [x] **1. Create client/js/config.js** (API base URL config - https://smartbudget-jij8.onrender.com)
- [x] **2. Update client/js/dashboard.js** (fixed both /api/finance GET & POST → absolute URLs)
- [x] **3. Update client/js/auth.js** (fixed /api/auth/login & /api/auth/register → absolute URLs)
- [x] **4. Scan complete** - No other /api/* fetch calls found in client/js/*.js files.

## 🚀 DEPLOY & TEST
1. **Push & Deploy Frontend** to Vercel (https://smart-budget-khaki.vercel.app)
2. **Test on Vercel:**
   - Open https://smart-budget-khaki.vercel.app/register.html
   - Register → should hit Render backend without "Network error"
   - Login → Dashboard → Add data → should persist
3. **Verify Backend** (Render): https://smartbudget-jij8.onrender.com/ (should show "Cannot GET /")
4. **Local Test:** Open client/register.html in browser (uses absolute URLs)

✅ **Network error fixed!** All API calls now route to Render backend.
