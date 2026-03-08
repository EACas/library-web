async function loadLibrarians() {

  const response = await fetch("../../php/data/get_users.php");
  const users = await response.json();

  const librarianTable = document.getElementById("librarianTableBody");

  librarianTable.innerHTML = "";

  users.forEach(user => {

    const name = `${user.f_name} ${user.l_name}`;

    const statusBadge =
      user.account_status === "1"
        ? '<span class="badge active">Active</span>'
        : '<span class="badge suspended">Suspended</span>';

    const date = new Date(user.date_added).toLocaleDateString(); 

    let row = "";

    /* LIBRARIANS */
    if (user.role === "librarian") {

      row = `
      <tr>
        <td>${name}</td>
        <td>${user.email}</td>
        <td>${date}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-dark">Edit</button>
            <button class="btn btn-red">Suspend</button>
          </div>
        </td>
      </tr>
      `;

      librarianTable.innerHTML += row;
    }

  });

}

loadLibrarians();