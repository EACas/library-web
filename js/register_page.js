document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirm  = document.getElementById("confirm").value;

  if (password !== confirm) {
    showMessage("Passwords do not match.", false);
    return;
  }

  const formData = new FormData(this);

  try {
    const res  = await fetch("php/ac/register_user.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin"
    });
    const data = await res.json();

    if (data.success) {
      showMessage(data.message, true);
      this.reset();
    } else {
      showMessage(data.message || "Registration failed.", false);
    }
  } catch (err) {
    console.error(err);
    showMessage("Error connecting to server.", false);
  }
});

function showMessage(msg, success) {
  let el = document.getElementById("registerMessage");
  if (!el) {
    el = document.createElement("p");
    el.id = "registerMessage";
    el.style.cssText = "margin-top: 14px; font-size: 0.95rem;";
    document.getElementById("registerForm").appendChild(el);
  }
  el.style.color = success ? "#70c070" : "#e07070";
  el.textContent = msg;
}