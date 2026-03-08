document.addEventListener("DOMContentLoaded", async () => {
  const bookTableContainer = document.getElementById("bookTableContainer");

  // Function to load and display books table
  async function loadBooks() {
    const res = await fetch("../../php/data/get_book_data.php");
    const data = await res.json();

    if (data.success) {
      let html = `
        <h2>Books <em>Registered</em></h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Authors</th>
                        <th>Genres</th>
                        <th>Description</th>
                        <th>Publish Date</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>`;
      data.books.forEach((book) => {
        html += `<tr>
                    <td>${book.book_title}</td>
                    <td>${book.authors.join(", ")}</td>
                    <td>${book.genres.join(", ")}</td>
                    <td>${book.description}</td>
                    <td>${book.publish_date}</td>
                    <td>$${book.price}</td>
                    <td>${book.stock}</td>
                </tr>`;
      });
      html += `</tbody></table>`;
      bookTableContainer.innerHTML = html;
    } else {
      bookTableContainer.innerHTML = "Failed to load books.";
    }
  }

  // Initial load
  loadBooks();
});
