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

        // Generate API Key
        const apiKey = crypto.randomBytes(16).toString("hex");
        const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Simpan API KEY
        const sqlApi = `
            INSERT INTO api_keys (api_key, expired_at, created_at)
            VALUES (?, ?, NOW())
        `;

        db.query(sqlApi, [apiKey, expiredAt], (err, resultApi) => {
            if (err) return res.json({ success: false, message: "Gagal membuat API Key!" });

            const api_key_id = resultApi.insertId;

            // Simpan user
            const sqlUser = `
                INSERT INTO users (firstname, lastname, email, api_key_id)
                VALUES (?, ?, ?, ?)
            `;

            db.query(sqlUser, [firstname, lastname, email, api_key_id], (err2, resultUser) => {
                if (err2) return res.json({ success: false, message: "Gagal menyimpan user!" });

                return res.json({
                    success: true,
                    message: "Register berhasil!",
                    user: {
                        id: resultUser.insertId,
                        firstname,
                        lastname,
                        email,
                        api_key, // dikirim balik supaya user lihat API key-nya
                        api_key_id
                    }
                });
            });
        });
    },


    // ================================
    // LOGIN USER
    // ================================
    loginUser: (req, res) => {
        const { firstname, email } = req.body;

        if (!firstname || !email) {
            return res.json({ success: false, message: "Firstname & Email wajib diisi!" });
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
                return res.json({ success: false, message: "Terjadi kesalahan server!" });
            }

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    message: "User tidak ditemukan!"
                });
            }

            return res.json({
                success: true,
                user: rows[0] // sudah berisi api_key
            });
        });
    }
};