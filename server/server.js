require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Allowed origins (frontend + local)
const allowedOrigins = [
  "http://localhost:5500",
  "http://localhost:3000",
  "https://smart-budget-khaki.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());

// JSON middleware
app.use(express.json({ limit: "10mb" }));

// Serve frontend if needed
app.use(express.static(path.join(__dirname, "../client")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.send("SmartBudget API running 🚀");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Use Render provided PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
