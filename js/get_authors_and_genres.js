async function loadAuthors() {
    const res = await fetch("../../php/data/get_authors.php");
    const authors = await res.json();
    const select = document.getElementById("authorSelect");
    select.innerHTML = `<option value="">Select Author</option>`;
    authors.forEach(a => {
        const option = document.createElement("option");
        option.value = a.author_id;
        option.textContent = a.author_name;
        select.appendChild(option);
    });

    // Populate authors table
    const authorTable = document.getElementById("authorTableContainer");
    authorTable.innerHTML = `<table><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody></tbody></table>`;
    const tbody = authorTable.querySelector("tbody");
    authors.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${a.author_id}</td><td>${a.author_name}</td>`;
        tbody.appendChild(tr);
    });
}

async function loadGenres() {
    const res = await fetch("../../php/data/get_genres.php");
    const genres = await res.json();
    const container = document.getElementById("genreCheckboxContainer");
    container.innerHTML = "";

    // Populate checkboxes for form
    genres.forEach(g => {
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

    // Populate genres table
    const genreTable = document.getElementById("genreTableContainer");
    genreTable.innerHTML = `<table><thead><tr><th>ID</th><th>Genre</th></tr></thead><tbody></tbody></table>`;
    const tbody = genreTable.querySelector("tbody");
    genres.forEach(g => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${g.genre_id}</td><td>${g.genre}</td>`;
        tbody.appendChild(tr);
    });
}

async function loadBooks() {
    const res  = await fetch("../../php/data/get_book_data.php");
    const data = await res.json();

    const container = document.getElementById("bookTableContainer");

    if (!data.success) {
        container.innerHTML = "Failed to load books.";
        return;
    }

    container.innerHTML = `<table><thead><tr>
        <th>ID</th><th>Title</th><th>Authors</th><th>Genres</th>
        <th>Description</th><th>Publish Date</th><th>Price</th><th>Stock</th>
    </tr></thead><tbody></tbody></table>`;

    const tbody = container.querySelector("tbody");
    data.books.forEach(b => {
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

// Initial load
loadAuthors();
loadGenres();
loadBooks();