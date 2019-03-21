$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var passwordConfirmInput = $("input#password-confirm-input");
  var displayNameInput = $("input#username-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      name: displayNameInput.val().trim()
    };

    if (userData.password !== passwordConfirmInput.val().trim()) {
      $("#warning").text("Passwords do not match!");
    }

    if (!userData.email || !userData.password || !userData.name) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.name);
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, username) {
    $("button[type='submit']").attr("disabled", true);
    $("button[type='submit']").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Registering...`)
    $.post("/api/signup", {
      email: email,
      password: password,
      username: username
    })
      .then(function(data) {
        window.location.replace(data);
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    // alert(err.responseJSON);
    $("#warning").text("Username/Email is already in use!");
    $("#warning").fadeIn(500, function() {
      setTimeout(() => {
        $("button[type='submit'").attr("disabled", false);
        $("button[type='submit']").html("Sign Up");
      }, 250);
    });
  }
});
