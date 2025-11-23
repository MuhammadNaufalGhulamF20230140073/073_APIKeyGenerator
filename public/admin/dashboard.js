const API = "http://localhost:3001/api/admin";

// Ambil token admin
function getToken() {
  return localStorage.getItem("admin_token");
}

// Logout admin
function logout() {
  localStorage.removeItem("admin_token");
  window.location.href = "admin.html";
}

// ======================= LOAD USER =========================
async function loadUsers() {
  const res = await fetch(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  const table = document.getElementById("userTable");

  table.innerHTML = "";

  data.users.forEach((u) => {
    table.innerHTML += `
      <tr>
          <td>${u.id}</td>

          <td><input class="form-control" value="${u.firstname}" id="fname-${
      u.id
    }"></td>
          <td><input class="form-control" value="${u.lastname}" id="lname-${
      u.id
    }"></td>
          <td><input class="form-control" value="${u.email}" id="email-${
      u.id
    }"></td>

          <td><span class="badge bg-primary">${u.api_key || "-"}</span></td>
          <td><span class="badge bg-secondary">${
            u.expired_at || "-"
          }</span></td>

          <td class="text-center">

              <button class="btn btn-warning btn-sm" onclick="updateUser(${
                u.id
              })">
                  Edit
              </button>

              <button class="btn btn-danger btn-sm" onclick="deleteUser(${
                u.id
              })">
                  Hapus
              </button>

              <button class="btn btn-info btn-sm text-white" onclick="renewKey(${
                u.api_key_id ?? null
              })">
                  Regen Key
              </button>

          </td>
      </tr>
    `;
  });
}

// ======================= CREATE USER =========================
async function createUser() {
  const firstname = document.getElementById("fname").value;
  const lastname = document.getElementById("lname").value;
  const email = document.getElementById("email").value;

  if (!firstname || !lastname || !email) {
    alert("Semua field wajib diisi!");
    return;
  }

  const res = await fetch(`${API}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ firstname, lastname, email }),
  });

  const data = await res.json();
  alert(data.message);
  loadUsers();
}

// ======================= UPDATE USER =========================
async function updateUser(id) {
  const firstname = document.getElementById(`fname-${id}`).value;
  const lastname = document.getElementById(`lname-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;

  const res = await fetch(`${API}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ firstname, lastname, email }),
  });

  const data = await res.json();
  alert(data.message);
  loadUsers();
}

// ======================= DELETE USER =========================
async function deleteUser(id) {
  if (!confirm("Hapus user ini?")) return;

  const res = await fetch(`${API}/user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  alert(data.message);
  loadUsers();
}

// ======================= RENEW API KEY =========================
async function renewKey(api_id) {
  if (!api_id) {
    alert("User ini belum memiliki API Key!");
    return;
  }

  const res = await fetch(`${API}/api/renew/${api_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  alert("API Key baru:\n" + data.api_key);
  loadUsers();
}

// Load data saat halaman dibuka
loadUsers();
