const registerBookForm = document.getElementById("registerBookForm");
const bookMessage = document.getElementById("bookMessage");

registerBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registerBookForm);

  try {
    const response = await fetch("../../php/ac/register_book.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    const data = await response.json();

    if (data.success) {
      bookMessage.style.color = "green";
      bookMessage.textContent = "Book registered successfully!";
      registerBookForm.reset();
      // Refresh all three tables
      loadBooks();
      loadAuthors();
      loadGenres();
    } else {
      bookMessage.textContent = data.message || "Failed to register book";
      bookMessage.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    bookMessage.textContent = "Error registering book";
    bookMessage.style.color = "red";
  }
});
