const BASE = "http://localhost:3001/api";


// ================== REGISTER USER ==================
async function registerUser() {
    const firstname = document.getElementById("reg_firstname").value;
    const lastname = document.getElementById("reg_lastname").value;
    const email = document.getElementById("reg_email").value;
    const password = document.getElementById("reg_password").value;

    const res = await fetch(BASE + "/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password })
    });

    const data = await res.json();

    if (!data.success) {
        alert("Registrasi gagal!");
        return;
    }

    alert("Registrasi berhasil! API Key Anda: " + data.api_key);

    localStorage.setItem("user", JSON.stringify(data.user));

    // FIX redirect
    window.location = "dashboard.html";
}



// ================== LOGIN USER ==================
async function loginUser() {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    const res = await fetch(BASE + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
        alert("Login gagal!");
        return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    // FIX redirect
    window.location = "dashboard.html";
}



// ================== USER DASHBOARD ==================
function loadUserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return window.location = "user.html"; // LOGIN ada di user.html

    document.getElementById("u_firstname").innerText = user.firstname;
    document.getElementById("u_lastname").innerText = user.lastname;
    document.getElementById("u_email").innerText = user.email;
    document.getElementById("u_api_key").innerText = user.api_key;
}



// ================== USER GENERATE API KEY ==================
async function generateApiKey() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User tidak ditemukan");

    const res = await fetch(BASE + `/user/generate/${user.id}`, {
        method: "PUT"
    });

    const data = await res.json();

    if (!data.success) {
        alert("Gagal membuat API Key baru");
        return;
    }

    user.api_key = data.api_key;
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("u_api_key").innerText = data.api_key;

    alert("API Key baru berhasil dibuat!");
}



// ================== ADMIN LOGIN ==================
async function loginAdmin() {
    const username = document.getElementById("admin_username").value;
    const password = document.getElementById("admin_password").value;

    const res = await fetch(BASE + "/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
        alert("Login admin salah!");
        return;
    }

    localStorage.setItem("admin", "logged");

    // Redirect aman
    window.location = "admin_dashboard.html";
}



// ================== LOAD USER LIST (ADMIN) ==================
async function loadUsers() {
    const res = await fetch(BASE + "/admin/users");
    const users = await res.json();

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    users.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.firstname} ${u.lastname}</td>
                <td>${u.email}</td>
                <td>${u.api_key}</td>
                <td>
                    <button onclick="adminRegenerate(${u.id})">Regenerate</button>
                    <button onclick="adminDelete(${u.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}



// ================== ADMIN CREATE USER ==================
async function adminCreateUser() {
    const firstname = document.getElementById("a_firstname").value;
    const lastname = document.getElementById("a_lastname").value;
    const email = document.getElementById("a_email").value;

    await fetch(BASE + "/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email })
    });

    loadUsers();
}



// ================== ADMIN REGENERATE API KEY ==================
async function adminRegenerate(id) {
    await fetch(BASE + `/admin/users/${id}/regenerate`, {
        method: "PUT"
    });

    loadUsers();
}



// ================== ADMIN DELETE USER ==================
async function adminDelete(id) {
    await fetch(BASE + `/admin/users/${id}`, {
        method: "DELETE"
    });

    loadUsers();
}



// ================== AUTO INIT PAGE ==================
document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname;

    if (page.includes("dashboard.html")) {
        loadUserDashboard();
    }

    if (page.includes("admin_dashboard.html")) {
        loadUsers();
    }
});