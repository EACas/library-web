async function loadStudentData() {
  const userId = window.currentUser?.id;
  if (!userId) return;

  const res  = await fetch(`../../php/data/get_student_account.php?user_id=${userId}`);
  const data = await res.json();

  if (!data.success) {
    console.error("Failed to load student data:", data.message);
    return;
  }

  // --- PROFILE ---
  const p = data.profile;
  document.getElementById("profileName").value      = `${p.f_name} ${p.l_name}`;
  document.getElementById("profileLibraryId").value = p.user_library_id;
  document.getElementById("profileEmail").value     = p.email;
  document.getElementById("profilePhone").value     = p.phone_number;

  // --- FINES ---
  const finesBody = document.getElementById("finesTableBody");
  finesBody.innerHTML = "";
  const statusMap = { 1: "borrowed", 2: "returned", 3: "late" };

  if (data.fines.length === 0) {
    finesBody.innerHTML = `<tr><td colspan="4">No fines on record.</td></tr>`;
  } else {
    let totalUnpaid = 0;
    data.fines.forEach(f => {
      const isLate   = f.status == 3;
      const isPaid   = f.total_coast !== null && f.status == 2;
      const fine     = parseFloat(f.total_coast ?? f.net_cost ?? 0).toFixed(2);
      const badge    = isLate
        ? `<span class="badge unpaid">Unpaid</span>`
        : `<span class="badge paid">Paid</span>`;

      if (isLate) totalUnpaid += parseFloat(fine);

      finesBody.innerHTML += `
        <tr>
          <td>${f.book_title}</td>
          <td>${f.days_late ?? "—"}</td>
          <td>$${fine}</td>
          <td>${badge}</td>
        </tr>`;
    });

    if (totalUnpaid > 0) {
      document.getElementById("fineBox").style.display      = "flex";
      document.getElementById("totalFineAmount").textContent = `$${totalUnpaid.toFixed(2)}`;
    }
  }

  // --- CURRENTLY BORROWED ---
  const currentBody = document.getElementById("currentBorrowedBody");
  currentBody.innerHTML = "";
  if (data.current.length === 0) {
    currentBody.innerHTML = `<tr><td colspan="5">No books currently borrowed.</td></tr>`;
  } else {
    data.current.forEach(b => {
      const borrowedOn = new Date(b.borrowed_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const due        = new Date(b.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const isOverdue  = new Date(b.due_date) < new Date();
      const badge      = isOverdue
        ? `<span class="badge overdue">Overdue</span>`
        : `<span class="badge active">Active</span>`;

      currentBody.innerHTML += `
        <tr>
          <td>${b.book_title}</td>
          <td>${b.authors}</td>
          <td>${borrowedOn}</td>
          <td>${due}</td>
          <td>${badge}</td>
        </tr>`;
    });
  }

  // --- RESERVATIONS ---
  const resBody = document.getElementById("reservationsBody");
  resBody.innerHTML = "";
  const resStatusMap = {
    0: '<span class="badge pending">Pending</span>',
    1: '<span class="badge active">Approved</span>',
    2: '<span class="badge suspended">Denied</span>'
  };
  if (data.reservations.length === 0) {
    resBody.innerHTML = `<tr><td colspan="3">No reservations.</td></tr>`;
  } else {
    data.reservations.forEach(r => {
      const date = new Date(r.date_reserved).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      resBody.innerHTML += `
        <tr>
          <td>${r.book_title}</td>
          <td>${date}</td>
          <td>${resStatusMap[r.reservation_status] ?? "—"}</td>
        </tr>`;
    });
  }

  // --- BORROWING HISTORY ---
  const histBody = document.getElementById("historyTableBody");
  histBody.innerHTML = "";
  if (data.history.length === 0) {
    histBody.innerHTML = `<tr><td colspan="5">No borrowing history.</td></tr>`;
  } else {
    const statusLabels = {
      1: '<span class="badge active">Active</span>',
      2: '<span class="badge returned">Returned</span>',
      3: '<span class="badge overdue">Late</span>'
    };
    data.history.forEach(h => {
      const borrowed  = new Date(h.borrowed_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const returned  = h.returned_time
        ? new Date(h.returned_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—";
      histBody.innerHTML += `
        <tr>
          <td>${h.book_title}</td>
          <td>${h.authors}</td>
          <td>${borrowed}</td>
          <td>${returned}</td>
          <td>${statusLabels[h.status] ?? "—"}</td>
        </tr>`;
    });
  }
}

async function savePassword() {
  const msg      = document.getElementById("profileMessage");
  const password = document.getElementById("newPassword").value;
  const confirm  = document.getElementById("confirmPassword").value;

  if (!password) {
    msg.style.color = "red";
    msg.textContent = "Please enter a new password.";
    return;
  }

  if (password !== confirm) {
    msg.style.color = "red";
    msg.textContent = "Passwords do not match.";
    return;
  }

  const formData = new FormData();
  formData.append("user_id",  window.currentUser.id);
  formData.append("password", password);

  try {
    const res  = await fetch("../../php/ac/update_password.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin"
    });
    const data = await res.json();
    msg.style.color = data.success ? "green" : "red";
    msg.textContent = data.message;
    if (data.success) {
      document.getElementById("newPassword").value     = "";
      document.getElementById("confirmPassword").value = "";
    }
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Error connecting to server.";
  }
}