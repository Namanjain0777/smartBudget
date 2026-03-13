require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: ['https://smart-budget-khaki.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({
  limit: '10mb'
}));

// Serve frontend from client folder
app.use(express.static(path.join(__dirname, "../client")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));

// Catch all route (important for SPA routing later)
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Use Render provided PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
