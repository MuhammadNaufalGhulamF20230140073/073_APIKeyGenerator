const API_URL = "http://localhost:3001/api/user";

// ======================================
// GENERATE API KEY
// ======================================
function generateApiKey() {
  const key =
    "API-" +
    [...crypto.getRandomValues(new Uint8Array(12))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

  document.getElementById("api_key").value = key;
}

// Aktifkan tombol generate jika ada
document.addEventListener("DOMContentLoaded", () => {
  const btnGen = document.getElementById("btnGenerate");
  if (btnGen) {
    btnGen.addEventListener("click", generateApiKey);
  }
});

// ======================================
// REGISTER USER
// ======================================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const api_key = document.getElementById("api_key").value;

    if (!api_key) {
      alert("Silakan klik Generate API Key terlebih dahulu!");
      return;
    }

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, api_key }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Register gagal: " + data.message);
      return;
    }

    alert("Registrasi Berhasil!");
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "user.html";
  });
}

// ======================================
// LOGIN USER
// ======================================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstname = document.getElementById("login_firstname").value;
    const email = document.getElementById("login_email").value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, email }),
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

// ======================================
// USER DASHBOARD
// ======================================
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
