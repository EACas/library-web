// Open modal and set role
function openAddModal(roleId, roleName) {
    document.getElementById("addModal").classList.add("open");
    document.getElementById("role").value = roleId;
    document.getElementById("modalRoleText").innerText = roleName;
}

// Close modal
function closeModal() {
    document.getElementById("addModal").classList.remove("open");
}

// Submit form
document.getElementById("addUserForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch("../../php/core/register.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if(result.success){
            closeModal();
            loadUsers();
        } else {
            alert(result.message || "Error creating user");
        }

    } catch(err) {
        console.error(err);
        alert("Request failed");
    }
});