document
  .getElementById("registerAuthorForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
      const response = await fetch("../../php/ac/register_author.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        document.getElementById("authorMessage").style.color = "green";
        document.getElementById("authorMessage").innerText =
          "Author registered successfully!";
        this.reset();
        loadAuthors(); // refresh the select and the authors table
      } else {
        document.getElementById("authorMessage").innerText =
          result.message || "Error registering author.";
      }
    } catch (err) {
      console.error(err);
      document.getElementById("authorMessage").innerText = "Request failed.";
    }
  });
