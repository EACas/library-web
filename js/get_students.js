async function loadStudents() {
  const response = await fetch("../../php/data/get_users.php");
  const users = await response.json();

  const studentTable = document.getElementById("studentTableBody");

  studentTable.innerHTML = "";

  users.forEach((user) => {
    const name = `${user.f_name} ${user.l_name}`;

    const statusBadge =
      user.account_status === "1"
        ? '<span class="badge active">Active</span>'
        : '<span class="badge suspended">Suspended</span>';

    const date = new Date(user.date_added).toLocaleDateString();

    let row = "";

    /* STUDENTS */
    if (user.role === "student") {
      row = `
      <tr>
        <td>${name}</td>
        <td>${user.user_library_id}</td>
        <td>${user.email}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-dark">Edit</button>
            <button class="btn btn-red">Suspend</button>
            <button class="btn btn-red">Delete</button>
          </div>
        </td>
      </tr>
      `;

      studentTable.innerHTML += row;
    }
  });
}

loadStudents();
