async function loadLibrary() {
  await loadGenreFilter();
  await loadBooks();
}

async function loadGenreFilter() {
  const res = await fetch("../../php/data/get_genres.php");
  const genres = await res.json();
  const filter = document.getElementById("genreFilter");
  genres.forEach((g) => {
    const option = document.createElement("option");
    option.value = g.genre_id;
    option.textContent = g.genre;
    filter.appendChild(option);
  });
}

async function loadBooks() {
  const search = document.getElementById("bookSearch").value.trim();
  const genreId = document.getElementById("genreFilter").value;
  const params = new URLSearchParams();
  if (search) params.append("q", search);
  if (genreId) params.append("genre_id", genreId);

  const res = await fetch(
    `../../php/data/get_books_student.php?${params.toString()}`,
  );
  const data = await res.json();
  const grid = document.getElementById("bookGrid");

  if (!data.success || data.books.length === 0) {
    grid.innerHTML = `<p class="empty-msg">No books found.</p>`;
    return;
  }

  grid.innerHTML = "";
  data.books.forEach((b) => {
    const isAvailable = b.stock > 0;
    const badge = isAvailable
      ? `<span class="badge available">Available</span>`
      : `<span class="badge borrowed">Unavailable</span>`;

    const card = document.createElement("div");
    card.classList.add("book-card");
    card.innerHTML = `
      <h3>${b.book_title}</h3>
      <p class="author">${b.authors}</p>
      <p class="genres">${b.genres}</p>
      <div class="status-row">${badge}</div>`;

    card.style.cursor = "pointer";
    card.addEventListener("click", () => openBookModal(b));
    grid.appendChild(card);
  });
}

function openBookModal(book) {
  const isAvailable = book.stock > 0;

  // ADD THESE TWO LINES
  const borrowBtn = document.getElementById("modalBorrowBtn");
  const reserveBtn = document.getElementById("modalReserveBtn");

  document.getElementById("modalBookTitle").textContent = book.book_title;
  document.getElementById("modalBookAuthors").textContent = book.authors || "—";
  document.getElementById("modalBookGenres").textContent = book.genres || "—";
  document.getElementById("modalBookDesc").textContent =
    book.description || "No description available.";
  document.getElementById("modalBookStock").textContent =
    `${book.stock} copy(ies) available`;
  document.getElementById("modalBookPrice").textContent =
    `$${parseFloat(book.price).toFixed(2)}`;
  document.getElementById("modalBookDate").textContent =
    book.publish_date ?? "—";

  borrowBtn.style.display = "inline-block";
  reserveBtn.style.display = "inline-block";

  borrowBtn.onclick = () => borrowBook(book.book_id, book.book_title);
  reserveBtn.onclick = () => reserveBook(book.book_id, book.book_title);

  if (!isAvailable) {
    borrowBtn.disabled = true;
    borrowBtn.style.opacity = "0.4";
  } else {
    borrowBtn.disabled = false;
    borrowBtn.style.opacity = "1";
  }

  document.getElementById("bookModal").classList.add("open");
  document.getElementById("modalActionMessage").textContent = "";
}

function closeBookModal() {
  document.getElementById("bookModal").classList.remove("open");
}

async function borrowBook(bookId, bookTitle) {
  if (
    !confirm(`Borrow "${bookTitle}"? The librarian will assign your due date.`)
  )
    return;

  const formData = new FormData();
  formData.append("student_id", window.currentUser.id);
  formData.append("book_id", bookId);

  try {
    const res = await fetch("../../php/ac/student_borrow.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const data = await res.json();
    showModalMessage(data.message, data.success);
    if (data.success) {
      loadBooks();
    }
  } catch (err) {
    showModalMessage("Error connecting to server.", false);
  }
}

async function reserveBook(bookId, bookTitle) {
  if (!confirm(`Reserve "${bookTitle}"?`)) return;

  const formData = new FormData();
  formData.append("student_id", window.currentUser.id);
  formData.append("book_id", bookId);

  try {
    const res = await fetch("../../php/ac/reserve_book.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const data = await res.json();
    showModalMessage(data.message, data.success);
    if (data.success) loadBooks();
  } catch (err) {
    showModalMessage("Error connecting to server.", false);
  }
}

function showModalMessage(msg, success) {
  const el = document.getElementById("modalActionMessage");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
}

function showMessage(msg, success) {
  const el = document.getElementById("actionMessage");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 4000);
}

document.getElementById("bookSearch").addEventListener("input", loadBooks);
document.getElementById("genreFilter").addEventListener("change", loadBooks);
