const currentPage = window.location.pathname.split("/").pop();

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) return;

  let role = "agent";
  let name = "";

  try {
    const doc = await firebase.firestore().collection("users").doc(user.uid).get();
    if (doc.exists) {
      const data = doc.data();
      role = data.role || "agent";
      name = data.name || "";
    }
  } catch (err) {
    console.error("Navbar user fetch error:", err);
  }

  const isAdmin = role === "admin";
  const navContainer = document.getElementById("navbar");

  navContainer.innerHTML = `
    <nav class="navbar">
      <div class="navbar-title">📞 OBND Call Center</div>
      <div class="navbar-links">
        <button class="nav-btn ${currentPage === "home.html" ? "active" : ""}" onclick="location.href='home.html'">Form</button>
        <button class="nav-btn ${currentPage === "view.html" ? "active" : ""}" onclick="location.href='view.html'">Record</button>
        ${isAdmin ? `
          <button class="nav-btn ${currentPage === "dashboard.html" ? "active" : ""}" onclick="location.href='dashboard.html'">Dashboard</button>
          <button class="nav-btn ${currentPage === "assign.html" ? "active" : ""}" onclick="location.href='assign.html'">Assign</button>
        ` : ""}
        <button class="nav-btn danger" onclick="logout()">Logout</button>
      </div>
    </nav>
  `;
});

function logout() {
  firebase.auth().signOut().then(() => location.href = "login.html");
}
