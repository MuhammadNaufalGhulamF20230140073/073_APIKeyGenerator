const db = require("../database/db");
const crypto = require("crypto");

module.exports = {

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
    // GET DETAIL USER BY ID
    // ==============================================================
    getUserById: (req, res) => {
        const sql = `
            SELECT u.*, a.api_key, a.expired_at
            FROM users u
            LEFT JOIN api_keys a ON u.api_key_id = a.id
            WHERE u.id = ?
        `;
        db.query(sql, [req.params.id], (err, rows) => {
            if (rows.length === 0) return res.json({ success: false, message: "User tidak ditemukan" });

            res.json({ success: true, user: rows[0] });
        });
    },

    // ==============================================================
    // CREATE USER (ADMIN)
    // ==============================================================
    createUser: (req, res) => {
        const { firstname, lastname, email } = req.body;
        if (!firstname || !lastname || !email) {
            return res.json({ success: false, message: "Semua field wajib diisi!" });
        }

        // generate api key
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

            db.query(sqlUser, [firstname, lastname, email, apiRes.insertId], (err2, result) => {
                if (err2) return res.json({ success: false });

                res.json({
                    success: true,
                    message: "User berhasil dibuat!"
                });
            });
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
                api_key: apiKey
            });
        });
    }

};