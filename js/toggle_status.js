async function toggleStatus(userId, newStatus) {
  const action = newStatus === 1 ? "reactivate" : "suspend";
  const confirm_msg = `Are you sure you want to ${action} this account?`;

  if (!confirm(confirm_msg)) return;

  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("status", newStatus);

    const res  = await fetch("../../php/ac/toggle_status.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin"
    });
    const data = await res.json();

    if (data.success) {
      loadUsers(); // refresh table
    } else {
      alert("Error: " + (data.message || "Could not update status."));
    }
  } catch (err) {
    console.error(err);
  }
}