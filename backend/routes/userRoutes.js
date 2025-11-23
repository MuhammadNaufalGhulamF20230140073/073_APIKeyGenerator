const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");

// POST /api/user/register
router.post("/register", registerUser);

// POST /api/user/login
router.post("/login", loginUser);

module.exports = router;