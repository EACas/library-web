document.getElementById("registerStudentForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const msg      = document.getElementById("studentMessage");
  const formData = new FormData(this);

  try {
    const res  = await fetch("../../php/ac/register_student.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin"
    });
    const data = await res.json();

    if (data.success) {
      msg.style.color = "green";
      msg.textContent = "Student registered successfully!";
      this.reset();
      loadUsers(); // refresh the student table
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Failed to register student.";
    }
  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.textContent = "Error connecting to server.";
  }
});