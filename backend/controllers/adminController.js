const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // LOGIN ADMIN
  adminLogin: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username & password wajib!",
      });
    }

    const sql = `SELECT * FROM admin WHERE username = ?`;
    db.query(sql, [username], (err, rows) => {
      if (err) return res.json({ success: false, message: "DB error" });
      if (rows.length === 0) {
        return res.json({ success: false, message: "Admin tidak ditemukan" });
      }

      const admin = rows[0];

      bcrypt.compare(password, admin.password, (err, match) => {
        if (!match) {
          return res.json({ success: false, message: "Password salah" });
        }

        // Buat token JWT
        const token = jwt.sign({ admin_id: admin.id }, "ADMIN_SECRET_KEY", {
          expiresIn: "1d",
        });

        res.json({
          success: true,
          message: "Login berhasil",
          token,
        });
      });
    });
  },

  // ... (fungsi CRUD user kamu tetap)
};
