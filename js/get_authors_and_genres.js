async function loadAuthors() {
  const res = await fetch("../../php/data/get_authors.php");
  const authors = await res.json();

  const select = document.getElementById("authorSelect");
  if (select) {
    select.innerHTML = `<option value="">Select Author</option>`;
    authors.forEach((a) => {
      const option = document.createElement("option");
      option.value = a.author_id;
      option.textContent = a.author_name;
      select.appendChild(option);
    });
  }

  const authorTable = document.getElementById("authorTableContainer");
  if (authorTable) {
    authorTable.innerHTML = `<table><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody></tbody></table>`;
    const tbody = authorTable.querySelector("tbody");
    if (authors.length === 0) {
      tbody.innerHTML = `<tr><td colspan="2">No authors found.</td></tr>`;
    } else {
      authors.forEach((a) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${a.author_id}</td><td>${a.author_name}</td>`;
        tbody.appendChild(tr);
      });
    }
  }
}

async function loadGenres() {
  const res = await fetch("../../php/data/get_genres.php");
  const genres = await res.json();

  const container = document.getElementById("genreCheckboxContainer");
  if (container) {
    container.innerHTML = "";
    genres.forEach((g) => {
      const div = document.createElement("div");
      div.classList.add("checkbox-wrapper");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "genre_ids[]";
      input.id = `genre_${g.genre_id}`;
      input.value = g.genre_id;
      const label = document.createElement("label");
      label.htmlFor = `genre_${g.genre_id}`;
      label.textContent = g.genre;
      div.appendChild(input);
      div.appendChild(label);
      container.appendChild(div);
    });
  }

  const genreTable = document.getElementById("genreTableContainer");
  if (genreTable) {
    genreTable.innerHTML = `<table><thead><tr><th>ID</th><th>Genre</th></tr></thead><tbody></tbody></table>`;
    const tbody = genreTable.querySelector("tbody");
    if (genres.length === 0) {
      tbody.innerHTML = `<tr><td colspan="2">No genres found.</td></tr>`;
    } else {
      genres.forEach((g) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${g.genre_id}</td><td>${g.genre}</td>`;
        tbody.appendChild(tr);
      });
    }
  }

  // Always runs — not inside the genreTable block
  const genreFilter = document.getElementById("genreFilter");
  if (genreFilter) {
    genreFilter.innerHTML = `<option value="">All Genres</option>`;
    genres.forEach((g) => {
      const option = document.createElement("option");
      option.value = g.genre;
      option.textContent = g.genre;
      genreFilter.appendChild(option);
    });
  }
}

async function loadBooks() {
  const res = await fetch("../../php/data/get_book_data.php");
  const data = await res.json();

  const container = document.getElementById("bookTableContainer");
  if (!container) return;

  if (!data.success) {
    container.innerHTML = "Failed to load books.";
    return;
  }

  container.innerHTML = `<table><thead><tr>
      <th>ID</th><th>Title</th><th>Authors</th><th>Genres</th>
      <th>Description</th><th>Publish Date</th><th>Price</th><th>Stock</th>
  </tr></thead><tbody id="bookTableBody"></tbody></table>`;

  window._allBooks = data.books;
  renderBooks(data.books);
}

function renderBooks(books) {
  const tbody = document.getElementById("bookTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (books.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">No books found.</td></tr>`;
    return;
  }

  books.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.book_id}</td>
      <td>${b.book_title}</td>
      <td>${b.authors.join(", ")}</td>
      <td>${b.genres.join(", ")}</td>
      <td>${b.description}</td>
      <td>${b.publish_date}</td>
      <td>$${parseFloat(b.price).toFixed(2)}</td>
      <td>${b.stock}</td>`;
    tbody.appendChild(tr);
  });
}

function applyFilters() {
  const search =
    document.getElementById("bookSearch")?.value.toLowerCase() ?? "";
  const genre =
    document.getElementById("genreFilter")?.value.toLowerCase() ?? "";
  const sort = document.getElementById("sortSelect")?.value ?? "title";

  let books = [...(window._allBooks || [])];

  if (search) {
    books = books.filter(
      (b) =>
        b.book_title.toLowerCase().includes(search) ||
        b.authors.join(", ").toLowerCase().includes(search),
    );
  }

  if (genre) {
    books = books.filter((b) =>
      b.genres.join(", ").toLowerCase().includes(genre),
    );
  }

  books.sort((a, b) => {
    if (sort === "title") return a.book_title.localeCompare(b.book_title);
    if (sort === "author")
      return (a.authors[0] ?? "").localeCompare(b.authors[0] ?? "");
    if (sort === "year")
      return new Date(a.publish_date) - new Date(b.publish_date);
    return 0;
  });

  renderBooks(books);
}

// Filter listeners
document.getElementById("bookSearch")?.addEventListener("input", applyFilters);
document
  .getElementById("genreFilter")
  ?.addEventListener("change", applyFilters);
document.getElementById("sortSelect")?.addEventListener("change", applyFilters);

// Author search
document.getElementById("authorSearch")?.addEventListener("input", function () {
  const search = this.value.toLowerCase();
  const rows = document.querySelectorAll("#authorTableContainer tbody tr");
  let anyVisible = false;

  rows.forEach((row) => {
    const matches = row.textContent.toLowerCase().includes(search);
    row.style.display = matches ? "" : "none";
    if (matches) anyVisible = true;
  });

  // Show/remove no-results row
  const tbody = document.querySelector("#authorTableContainer tbody");
  const existing = tbody?.querySelector(".no-results");
  if (!anyVisible && tbody) {
    if (!existing) {
      const tr = document.createElement("tr");
      tr.classList.add("no-results");
      tr.innerHTML = `<td colspan="2">No authors found.</td>`;
      tbody.appendChild(tr);
    }
  } else if (existing) {
    existing.remove();
  }
});

// Genre search
document.getElementById("genreSearch")?.addEventListener("input", function () {
  const search = this.value.toLowerCase();
  const rows = document.querySelectorAll("#genreTableContainer tbody tr");
  let anyVisible = false;

  rows.forEach((row) => {
    const matches = row.textContent.toLowerCase().includes(search);
    row.style.display = matches ? "" : "none";
    if (matches) anyVisible = true;
  });

  // Show/remove no-results row
  const tbody = document.querySelector("#genreTableContainer tbody");
  const existing = tbody?.querySelector(".no-results");
  if (!anyVisible && tbody) {
    if (!existing) {
      const tr = document.createElement("tr");
      tr.classList.add("no-results");
      tr.innerHTML = `<td colspan="2">No genres found.</td>`;
      tbody.appendChild(tr);
    }
  } else if (existing) {
    existing.remove();
  }
});

// Initial load
loadAuthors();
loadGenres();
loadBooks();
