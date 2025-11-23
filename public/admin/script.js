const API_URL = "http://localhost:3001/admin/login";

async function loginAdmin() {
  const username = document.getElementById("admin_username").value;
  const password = document.getElementById("admin_password").value;

  if (!username || !password) {
    alert("Username dan password wajib diisi!");
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!data.success) {
    alert("Login gagal: " + data.message);
    return;
  }

  alert("Login Berhasil!");

  // Simpan token admin
  localStorage.setItem("admin_token", data.token);

  // Pindah ke dashboard admin
  window.location.href = "dashboard.html";
}
