require("dotenv").config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");

/*
⚠️ MongoDB connection already handled in connectDB()
Keeping this code commented to avoid multiple connections
*/

// mongoose.connect("mongodb+srv://namanjainp01_db_user:SdLnFaeJyTDekc2c@cluster0.top4rcs.mongodb.net/?appName=Cluster0")
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
