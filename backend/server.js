const express = require("express");
const cors = require("cors");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static public folder
app.use(express.static(path.join(__dirname, "..", "public")));

// API ROUTES
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Serve Admin Page (TIDAK gunakan index.html fallback)
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "admin.html"));
});

// Serve Dashboard Admin
app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "dashboard.html"));
});

// Default route for normal user UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));
