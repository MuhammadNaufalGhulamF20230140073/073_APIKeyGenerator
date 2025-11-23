const db = require("../database/db");
const crypto = require("crypto");

module.exports = {
  // ================================
  // REGISTER USER
  // ================================
  registerUser: (req, res) => {
    const { firstname, lastname, email } = req.body;

    if (!firstname || !lastname || !email) {
      return res.json({ success: false, message: "Semua field harus diisi!" });
    }

    // Cek apakah email sudah ada
    const checkEmail = `SELECT id FROM users WHERE email = ? LIMIT 1`;
    db.query(checkEmail, [email], (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Kesalahan server!" });
      }

      if (rows.length > 0) {
        return res.json({
          success: false,
          message: "Email sudah digunakan, silakan pakai email lain!",
        });
      }

      // Generate API Key oleh backend (lebih aman)
      const api_key = crypto.randomBytes(16).toString("hex");
      const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Simpan API KEY
      const sqlApi = `
                INSERT INTO api_keys (api_key, expired_at, created_at)
                VALUES (?, ?, NOW())
            `;

      db.query(sqlApi, [api_key, expiredAt], (errApi, resultApi) => {
        if (errApi) {
          console.log(errApi);
          return res.json({
            success: false,
            message: "Gagal membuat API key!",
          });
        }

        const api_key_id = resultApi.insertId;

        // Simpan user
        const sqlUser = `
                    INSERT INTO users (firstname, lastname, email, api_key_id)
                    VALUES (?, ?, ?, ?)
                `;

        db.query(
          sqlUser,
          [firstname, lastname, email, api_key_id],
          (errUser, resultUser) => {
            if (errUser) {
              console.log(errUser);
              return res.json({
                success: false,
                message: "Gagal menyimpan user!",
              });
            }

            return res.json({
              success: true,
              message: "Register berhasil!",
              user: {
                id: resultUser.insertId,
                firstname,
                lastname,
                email,
                api_key,
                api_key_id,
              },
            });
          }
        );
      });
    });
  },

  // ================================
  // LOGIN USER
  // ================================
  loginUser: (req, res) => {
    const { firstname, email } = req.body;

    if (!firstname || !email) {
      return res.json({
        success: false,
        message: "Firstname & Email wajib diisi!",
      });
    }

    const sql = `
            SELECT u.id, u.firstname, u.lastname, u.email,
                   u.api_key_id, a.api_key
            FROM users u
            LEFT JOIN api_keys a ON u.api_key_id = a.id
            WHERE u.firstname = ? AND u.email = ?
        `;

    db.query(sql, [firstname, email], (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Terjadi kesalahan server!",
        });
      }

      if (rows.length === 0) {
        return res.json({
          success: false,
          message: "User tidak ditemukan!",
        });
      }

      return res.json({
        success: true,
        user: rows[0],
      });
    });
  },
};
