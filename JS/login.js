document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error");

  if (!email || !password) {
    errorDiv.textContent = "Please enter both email and password.";
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "home.html")
    .catch(err => errorDiv.textContent = "Login failed: Invalid email or password");
});

document.getElementById("togglePassword").addEventListener("click", function() {
  const passwordInput = document.getElementById("password");
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  this.textContent = isPassword ? "🙈" : "🐵";
});
