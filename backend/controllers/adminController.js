const db = require("../database/db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // ==============================================================
  // ADMIN LOGIN
  // ==============================================================
  loginAdmin: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res.json({
        success: false,
        message: "Isi username dan password!",
      });

    const sql = `SELECT * FROM admin WHERE username = ?`;

    db.query(sql, [username], (err, rows) => {
      if (err) return res.json({ success: false, message: "Database error" });

      if (rows.length === 0)
        return res.json({ success: false, message: "Username salah" });

      const admin = rows[0];

      // Cek password terenkripsi
      bcrypt.compare(password, admin.password, (err2, match) => {
        if (err2)
          return res.json({
            success: false,
            message: "Error compare password",
          });
        if (!match)
          return res.json({ success: false, message: "Password salah" });

        // Buat token
        const token = jwt.sign(
          { id: admin.id, username: admin.username },
          "SECRETKEY",
          { expiresIn: "1h" }
        );

        res.json({ success: true, message: "Login berhasil!", token });
      });
    });
  },

  // ==============================================================
  // GET SEMUA USER
  // ==============================================================
  getAllUsers: (req, res) => {
    const sql = `
            SELECT u.*, a.api_key, a.expired_at 
            FROM users u
            LEFT JOIN api_keys a ON u.api_key_id = a.id
        `;

    db.query(sql, (err, result) => {
      if (err) return res.json({ success: false, message: "Query error!" });
      res.json({ success: true, users: result });
    });
  },

  // ==============================================================
  // GET USER BY ID
  // ==============================================================
  getUserById: (req, res) => {
    const sql = `
            SELECT u.*, a.api_key, a.expired_at
            FROM users u
            LEFT JOIN api_keys a ON u.api_key_id = a.id
            WHERE u.id = ?
        `;
    db.query(sql, [req.params.id], (err, rows) => {
      if (rows.length === 0)
        return res.json({ success: false, message: "User tidak ditemukan" });

      res.json({ success: true, user: rows[0] });
    });
  },

  // ==============================================================
  // CREATE USER
  // ==============================================================
  createUser: (req, res) => {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !lastname || !email) {
      return res.json({ success: false, message: "Semua field wajib diisi!" });
    }

    const apiKey = crypto.randomBytes(16).toString("hex");
    const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const sqlApi = `
            INSERT INTO api_keys (api_key, expired_at, created_at)
            VALUES (?, ?, NOW())
        `;

    db.query(sqlApi, [apiKey, expiredAt], (err, apiRes) => {
      if (err) return res.json({ success: false });

      const sqlUser = `
                INSERT INTO users (firstname, lastname, email, api_key_id)
                VALUES (?, ?, ?, ?)
            `;

      db.query(
        sqlUser,
        [firstname, lastname, email, apiRes.insertId],
        (err2) => {
          if (err2) return res.json({ success: false });

          res.json({
            success: true,
            message: "User berhasil dibuat!",
          });
        }
      );
    });
  },

  // ==============================================================
  // UPDATE USER
  // ==============================================================
  updateUser: (req, res) => {
    const { firstname, lastname, email } = req.body;

    const sql = `
            UPDATE users SET firstname=?, lastname=?, email=? WHERE id=?
        `;

    db.query(sql, [firstname, lastname, email, req.params.id], (err) => {
      if (err) return res.json({ success: false });

      res.json({ success: true, message: "User berhasil diupdate!" });
    });
  },

  // ==============================================================
  // DELETE USER
  // ==============================================================
  deleteUser: (req, res) => {
    const sql = `DELETE FROM users WHERE id=?`;

    db.query(sql, [req.params.id], (err) => {
      if (err) return res.json({ success: false });

      res.json({ success: true, message: "User dihapus!" });
    });
  },

  // ==============================================================
  // RENEW API KEY
  // ==============================================================
  renewApiKey: (req, res) => {
    const apiKey = crypto.randomBytes(16).toString("hex");
    const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const sql = `
            UPDATE api_keys SET api_key=?, expired_at=? WHERE id=?
        `;

    db.query(sql, [apiKey, expiredAt, req.params.id], (err) => {
      if (err) return res.json({ success: false });

      res.json({
        success: true,
        message: "API Key diperbarui!",
        api_key: apiKey,
      });
    });
  },
};
