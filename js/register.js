$(document).ready(function () {

  $("#registerForm").submit(function (e) {
    e.preventDefault(); // stop page reload

    let password = $("#password").val();
    let confirm = $("#confirm").val();

    // password match validation
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // collect form data
    let formData = $(this).serialize();

    $.ajax({
      url: "php/core/register.php", // path to your PHP file
      type: "POST",
      data: formData,
      dataType: "json",

      success: function (response) {

        if (response.success) {

          alert("Account created successfully!");

          // reset form
          $("#registerForm")[0].reset();

        } else {

          alert(response.message);

        }

      },

      error: function () {
        alert("Server error. Please try again.");
      }

    });

  });

});