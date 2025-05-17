const db = firebase.firestore();

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "home.html";
    return;
  }

  document.getElementById("adminEmail").textContent = "Logged in as: " + userDoc.data().name;

  const callsSnapshot = await db.collection("calls").get();
  document.getElementById("totalCalls").textContent = callsSnapshot.size;

  const agentsSnapshot = await db.collection("users").where("role", "==", "agent").get();
  document.getElementById("totalAgents").textContent = agentsSnapshot.size;

  const recentTable = document.getElementById("recentCalls");
  const recentCalls = await db.collection("calls").orderBy("callTime", "desc").limit(5).get();
  recentCalls.forEach((doc) => {
    const d = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${d.agent || ''}</td>
      <td>${d.phone1 || ''}</td>
      <td>${d.status || ''}</td>
      <td>${d.callTime || ''}</td>
    `;
    recentTable.appendChild(row);
  });
});

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Logout failed: " + error.message);
  });
}
