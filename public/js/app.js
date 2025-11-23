const API_URL = "http://localhost:3001/api/user";


// =============================
// REGISTER
// =============================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const email = document.getElementById("email").value;

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, lastname, email })
        });

        const data = await res.json();

        if (!data.success) {
            alert("Register gagal: " + data.message);
            return;
        }

        alert("Register Berhasil!");

        // Simpan user + API key
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "user.html";
    });
}


// =============================
// LOGIN
// =============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const firstname = document.getElementById("login_firstname").value;
        const email = document.getElementById("login_email").value;

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, email })
        });

        const data = await res.json();

        if (!data.success) {
            alert("Login gagal: " + data.message);
            return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "dashboard.html";
    });
}


// =============================
// DASHBOARD
// =============================
function loadUserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Anda belum login!");
        window.location.href = "user.html";
        return;
    }

    document.getElementById("u_firstname").innerText = user.firstname;
    document.getElementById("u_lastname").innerText = user.lastname;
    document.getElementById("u_email").innerText = user.email;
    document.getElementById("u_api_key").innerText = user.api_key;
}

if (window.location.pathname.includes("dashboard.html")) {
    loadUserDashboard();
}