const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");

// LOGIN ADMIN
router.post("/login", admin.adminLogin);

// CRUD USER
router.get("/users", admin.getAllUsers);
router.get("/user/:id", admin.getUserById);
router.post("/user", admin.createUser);
router.put("/user/:id", admin.updateUser);
router.delete("/user/:id", admin.deleteUser);

// RENEW API KEY
router.put("/api/renew/:id", admin.renewApiKey);

module.exports = router;
