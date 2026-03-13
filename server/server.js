require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5500",
  "https://smart-budget-khaki.vercel.app",
  "https://smartbudget-jij8.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204
}));

// Explicitly handle preflight for all routes
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

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
