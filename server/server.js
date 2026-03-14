require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5500",
  "http://localhost:3000",
  "https://smart-budget-khaki.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {

    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }

  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());

// JSON middleware
app.use(express.json({ limit: "10mb" }));

// Serve frontend (optional)
// Serve frontend static files
const clientPath = path.join(__dirname, "../client");

app.use(express.static(clientPath));

// Explicit static folders
app.use("/css", express.static(path.join(clientPath, "css")));
app.use("/js", express.static(path.join(clientPath, "js")));
app.use("/images", express.static(path.join(clientPath, "images")));


// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));

// Health route
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
