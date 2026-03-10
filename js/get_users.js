async function loadUsers() {
  const response = await fetch("../../php/data/get_users.php");
  const users    = await response.json();

  const adminTable     = document.getElementById("adminTableBody");
  const librarianTable = document.getElementById("librarianTableBody");
  const studentTable   = document.getElementById("studentTableBody");

  if (adminTable)     adminTable.innerHTML     = "";
  if (librarianTable) librarianTable.innerHTML = "";
  if (studentTable)   studentTable.innerHTML   = "";

  users.forEach(user => {
    const name = `${user.f_name} ${user.l_name}`;

    const statusBadge = user.account_status === "1"
      ? '<span class="badge active">Active</span>'
      : '<span class="badge suspended">Suspended</span>';

    const date = new Date(user.date_added).toLocaleDateString();

    const isSuspended = user.account_status !== "1";
    const toggleBtn   = isSuspended
      ? `<button class="btn btn-gold" onclick="toggleStatus(${user.user_id}, 1)">Reactivate</button>`
      : `<button class="btn btn-red"  onclick="toggleStatus(${user.user_id}, 2)">Suspend</button>`;

    if (user.role === "admin" && adminTable) {
      adminTable.innerHTML += `
        <tr>
          <td>${name}</td>
          <td>${user.email}</td>
          <td>${date}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="action-btns">
              ${toggleBtn}
            </div>
          </td>
        </tr>`;
    }

    if (user.role === "librarian" && librarianTable) {
      librarianTable.innerHTML += `
        <tr>
          <td>${name}</td>
          <td>${user.email}</td>
          <td>${date}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="action-btns">
              ${toggleBtn}
            </div>
          </td>
        </tr>`;
    }

    if (user.role === "student" && studentTable) {
      studentTable.innerHTML += `
        <tr>
          <td>${name}</td>
          <td>${user.user_library_id}</td>
          <td>${user.email}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="action-btns">
              ${toggleBtn}
            </div>
          </td>
        </tr>`;
    }
  });
}

function setupSearch(inputSelector, tableBodyId) {
  document.querySelector(inputSelector)?.addEventListener("input", function() {
    const search = this.value.toLowerCase();
    document.querySelectorAll(`#${tableBodyId} tr`).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(search) ? "" : "none";
    });
  });
}

setupSearch('input[placeholder="Search admins..."]',     "adminTableBody");
setupSearch('input[placeholder="Search librarians..."]', "librarianTableBody");
setupSearch('input[placeholder="Search students..."]',   "studentTableBody");

loadUsers();