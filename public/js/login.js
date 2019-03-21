$(document).ready(function() {
  // Getting references to our form and inputs
  var loginForm = $("form.login");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $("button[type='submit']").attr("disabled", true);
    $("button[type='submit']").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Logging In...`)
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function(data) {
        window.location.replace(data);
      })
      .catch(function(err) {
        $("#warning").fadeIn(500, function() {
          setTimeout(() => {
            $("button[type='submit'").attr("disabled", false);
            $("button[type='submit']").html("Log In");
          }, 250);
        });
        // If there's an error, log the error
        console.log(err);
      });
  }
});
