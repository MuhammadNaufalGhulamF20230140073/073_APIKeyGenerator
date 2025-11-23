const express = require("express");
const cors = require("cors");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static file
app.use(express.static(path.join(__dirname, "..", "public")));

// API Routes
app.use("/api/user", require("./routes/userRoutes"));


app.use("/api/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});


// Fallback route
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));