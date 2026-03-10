document.getElementById("registerGenreForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch("../../php/ac/register_genre.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        const msg = document.getElementById("genreMessage");

        if (result.success) {
            msg.style.color = "green";
            msg.innerText = "Genre registered successfully!";
            this.reset();
            loadGenres(); // refresh genre table, checkboxes, and filter dropdown
        } else {
            msg.style.color = "red";
            msg.innerText = result.message || "Error registering genre.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("genreMessage").innerText = "Request failed.";
    }
});