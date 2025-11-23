const API = "http://localhost:3001/api/admin";

function logout() {
  localStorage.removeItem("admin_token");
  window.location.href = "admin.html";
}

async function loadUsers() {
  const res = await fetch(`${API}/users`);
  const data = await res.json();

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  data.users.forEach((u) => {
    table.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td><input value="${u.firstname}" id="fname-${u.id}"></td>
            <td><input value="${u.lastname}" id="lname-${u.id}"></td>
            <td><input value="${u.email}" id="email-${u.id}"></td>
            <td>${u.api_key}</td>
            <td>${u.expired_at || "-"}</td>

            <td>
                <button onclick="updateUser(${u.id})">Update</button>
                <button onclick="deleteUser(${u.id})">Delete</button>
                <button onclick="renewKey(${u.api_key_id})">Renew Key</button>
            </td>
        </tr>`;
  });
}

async function createUser() {
  const firstname = document.getElementById("fname").value;
  const lastname = document.getElementById("lname").value;
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, email }),
  });

  const data = await res.json();
  alert(data.message);
  loadUsers();
}

async function updateUser(id) {
  const firstname = document.getElementById(`fname-${id}`).value;
  const lastname = document.getElementById(`lname-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;

  const res = await fetch(`${API}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, email }),
  });

  const data = await res.json();
  alert(data.message);
}

async function deleteUser(id) {
  if (!confirm("Hapus user ini?")) return;

  const res = await fetch(`${API}/user/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  alert(data.message);
  loadUsers();
}

async function renewKey(api_id) {
  const res = await fetch(`${API}/api/renew/${api_id}`, {
    method: "PUT",
  });

  const data = await res.json();
  alert("API Key baru: " + data.api_key);
  loadUsers();
}

// Load data saat halaman dibuka
loadUsers();
