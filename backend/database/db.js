const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Keluarga123",
    database: "apikeylengkapcrud",
    port: 3309
});

db.connect((err) => {
    if (err) {
        console.error("MySQL Connection Error:", err);
        return;
    }
    console.log("MySQL Connected (inventory on port 3309)");
});

module.exports = db;