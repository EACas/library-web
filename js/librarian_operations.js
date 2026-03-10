// --- TRANSACTION TYPE TOGGLE ---
document.getElementById("transactionType").addEventListener("change", function () {
  document.getElementById("dueDateGroup").style.display =
    this.value === "borrow" ? "block" : "none";
});

// --- LIVE SEARCH: STUDENTS ---
let studentTimeout;
document.getElementById("studentSearch").addEventListener("input", function () {
  clearTimeout(studentTimeout);
  const query = this.value.trim();
  const dropdown = document.getElementById("studentDropdown");

  if (query.length < 2) { dropdown.innerHTML = ""; return; }

  studentTimeout = setTimeout(async () => {
    const res  = await fetch(`../../php/data/search_students.php?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    dropdown.innerHTML = "";

    if (data.length === 0) {
      dropdown.innerHTML = `<div class="dropdown-item disabled">No students found</div>`;
      return;
    }

    data.forEach((s) => {
      const item = document.createElement("div");
      item.classList.add("dropdown-item");
      item.textContent = `${s.f_name} ${s.l_name} (${s.user_library_id})`;
      item.addEventListener("click", () => {
        document.getElementById("selectedStudentId").value          = s.user_id;
        document.getElementById("selectedStudentLabel").textContent = item.textContent;
        document.getElementById("selectedStudentCard").style.display = "flex";
        document.getElementById("studentSearch").style.display      = "none";
        dropdown.innerHTML = "";
      });
      dropdown.appendChild(item);
    });
  }, 300);
});

// --- LIVE SEARCH: BOOKS ---
let bookTimeout;
document.getElementById("bookSearch").addEventListener("input", function () {
  clearTimeout(bookTimeout);
  const query = this.value.trim();
  const dropdown = document.getElementById("bookDropdown");

  if (query.length < 2) { dropdown.innerHTML = ""; return; }

  bookTimeout = setTimeout(async () => {
    const res  = await fetch(`../../php/data/search_books.php?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    dropdown.innerHTML = "";

    if (data.length === 0) {
      dropdown.innerHTML = `<div class="dropdown-item disabled">No books found</div>`;
      return;
    }

    data.forEach((b) => {
      const item = document.createElement("div");
      item.classList.add("dropdown-item");
      item.textContent = `${b.book_title} (Stock: ${b.stock})`;
      item.addEventListener("click", () => {
        document.getElementById("selectedBookId").value          = b.book_id;
        document.getElementById("selectedBookLabel").textContent = item.textContent;
        document.getElementById("selectedBookCard").style.display = "flex";
        document.getElementById("bookSearch").style.display      = "none";
        dropdown.innerHTML = "";
      });
      dropdown.appendChild(item);
    });
  }, 300);
});

// --- CLEAR SELECTIONS ---
function clearStudent() {
  document.getElementById("selectedStudentId").value           = "";
  document.getElementById("selectedStudentLabel").textContent  = "";
  document.getElementById("selectedStudentCard").style.display = "none";
  document.getElementById("studentSearch").style.display       = "";
  document.getElementById("studentSearch").value               = "";
  document.getElementById("studentDropdown").innerHTML         = "";
}

function clearBook() {
  document.getElementById("selectedBookId").value           = "";
  document.getElementById("selectedBookLabel").textContent  = "";
  document.getElementById("selectedBookCard").style.display = "none";
  document.getElementById("bookSearch").style.display       = "";
  document.getElementById("bookSearch").value               = "";
  document.getElementById("bookDropdown").innerHTML         = "";
}

// --- PROCESS TRANSACTION ---
async function processTransaction() {
  const msg       = document.getElementById("transactionMessage");
  const studentId = document.getElementById("selectedStudentId").value;
  const bookId    = document.getElementById("selectedBookId").value;
  const type      = document.getElementById("transactionType").value;
  const dueDate   = document.getElementById("dueDate").value;

  if (!studentId || !bookId) {
    msg.style.color = "red";
    msg.textContent = "Please select both a student and a book.";
    return;
  }

  if (type === "borrow" && !dueDate) {
    msg.style.color = "red";
    msg.textContent = "Please set a due date.";
    return;
  }

  const formData = new FormData();
  formData.append("student_id", studentId);
  formData.append("book_id",    bookId);
  formData.append("type",       type);
  formData.append("due_date",   dueDate);

  try {
    const res  = await fetch("../../php/ac/process_transaction.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const data = await res.json();

    msg.style.color = data.success ? "green" : "red";
    msg.textContent = data.message;

    if (data.success) {
      clearTransaction();
      loadFines();
      loadBorrowedBooks();
    }
  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.textContent = "Error connecting to server.";
  }
}

function clearTransaction() {
  clearStudent();
  clearBook();
  document.getElementById("dueDate").value              = "";
  document.getElementById("transactionMessage").textContent = "";
}

// --- RESERVATIONS ---
async function loadReservations() {
  const res   = await fetch("../../php/data/get_reservations.php");
  const data  = await res.json();
  const tbody = document.getElementById("reservationsTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No reservations found.</td></tr>`;
    return;
  }

  const statusMap = {
    0: '<span class="badge pending">Pending</span>',
    1: '<span class="badge approved">Approved</span>',
    2: '<span class="badge denied">Denied</span>',
  };

  data.forEach((r) => {
    const date   = new Date(r.date_reserved).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const status = statusMap[r.reservation_status] ?? '<span class="badge">Unknown</span>';
    const actions = r.reservation_status == 0
      ? `<button class="btn btn-green" onclick="updateReservation(${r.reservation_id}, 1)">Approve</button>
         <button class="btn btn-red"   onclick="updateReservation(${r.reservation_id}, 2)">Deny</button>`
      : `<button class="btn btn-dark" disabled>Done</button>`;

    tbody.innerHTML += `
      <tr>
        <td>${r.student_name}</td>
        <td>${r.book_title}</td>
        <td>${date}</td>
        <td>${status}</td>
        <td><div class="action-btns">${actions}</div></td>
      </tr>`;
  });
}

async function updateReservation(reservationId, status) {
  const formData = new FormData();
  formData.append("reservation_id", reservationId);
  formData.append("status",         status);

  try {
    const res  = await fetch("../../php/ac/update_reservation.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const data = await res.json();
    if (data.success) loadReservations();
    else alert("Error: " + data.message);
  } catch (err) {
    console.error(err);
    alert("Error connecting to server.");
  }
}

// --- FINES ---
async function loadFines() {
  const res   = await fetch("../../php/data/get_overdue_fines.php");
  const data  = await res.json();
  const tbody = document.getElementById("finesTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No overdue books.</td></tr>`;
    return;
  }

  data.forEach((f) => {
    const due = new Date(f.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    tbody.innerHTML += `
      <tr>
        <td>${f.student_name}</td>
        <td>${f.book_title}</td>
        <td>${due}</td>
        <td>${f.days_late}</td>
        <td>$${parseFloat(f.fine).toFixed(2)}</td>
        <td><button class="btn btn-gold" onclick="applyFine(${f.action_id})">Apply Fine</button></td>
      </tr>`;
  });
}

async function applyFine(actionId) {
  const formData = new FormData();
  formData.append("action_id", actionId);

  try {
    const res  = await fetch("../../php/ac/apply_fine.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const data = await res.json();
    if (data.success) loadFines();
    else alert("Error: " + data.message);
  } catch (err) {
    console.error(err);
    alert("Error connecting to server.");
  }
}

// --- BORROWED BOOKS ---
async function loadBorrowedBooks() {
  const res   = await fetch("../../php/data/get_borrowed_books.php");
  const data  = await res.json();
  const tbody = document.getElementById("borrowedTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No books currently borrowed.</td></tr>`;
    return;
  }

  window._allBorrowed = data;
  renderBorrowed(data);
}

function renderBorrowed(data) {
  const tbody = document.getElementById("borrowedTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No results found.</td></tr>`;
    return;
  }

  data.forEach((b) => {
    const borrowedOn = new Date(b.borrowed_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const due        = new Date(b.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const isOverdue  = new Date(b.due_date) < new Date();
    const badge      = isOverdue
      ? `<span class="badge overdue">Overdue</span>`
      : `<span class="badge active">On Time</span>`;

    tbody.innerHTML += `
      <tr>
        <td>${b.student_name}</td>
        <td>${b.user_library_id}</td>
        <td>${b.book_title}</td>
        <td>${borrowedOn}</td>
        <td>${due}</td>
        <td>${badge}</td>
      </tr>`;
  });
}

document.getElementById("borrowedSearch")?.addEventListener("input", function () {
  const search   = this.value.toLowerCase();
  const filtered = (window._allBorrowed || []).filter((b) =>
    b.student_name.toLowerCase().includes(search) ||
    b.book_title.toLowerCase().includes(search) ||
    b.user_library_id.toLowerCase().includes(search)
  );
  renderBorrowed(filtered);
});

// --- INIT ---
loadReservations();
loadBorrowedBooks();
loadFines();