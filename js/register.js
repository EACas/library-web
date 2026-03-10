function openAddModal(roleId, roleText) {
  document.getElementById("role").value = roleId;
  document.getElementById("modalRoleText").textContent = roleText;
  document.getElementById("addModal").classList.add("open");
  document.getElementById("addUserForm").reset();
  document.getElementById("addUserMessage").textContent = "";

  // Show salary field only for librarians
  document.getElementById("salaryGroup").style.display =
    roleId === 2 ? "block" : "none";
}
function closeModal() {
  document.getElementById("addModal").classList.remove("open");
}

document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = document.getElementById("addUserForm");
  const message = document.getElementById("addUserMessage");
  const formData = new FormData(form);

  try {
    const res = await fetch("../../php/ac/register_user.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.textContent = data.message;
      form.reset();
      loadUsers(); // refresh all three tables
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Failed to register user.";
    }
  } catch (err) {
    console.error(err);
    message.style.color = "red";
    message.textContent = "Error connecting to server.";
  }
});
