const express = require("express");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve semua file static
app.use(express.static(path.join(__dirname, "..", "public")));

// API endpoints
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// === Admin Pages ===

// halaman login admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "admin.html"));
});

// dashboard admin
app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "dashboard.html"));
});

// === USER PAGE ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// fallback ONLY untuk file yang tidak ditemukan DI PUBLIC
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));
