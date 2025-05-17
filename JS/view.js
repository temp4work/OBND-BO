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

  document.getElementById("agentEmail").textContent = "Logged in as: " + userDoc.data().name;
  const snapshot = await db.collection("calls").orderBy("timestamp", "desc").get();
  const tbody = document.getElementById("callLogs");
  snapshot.forEach(doc => {
    const data = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.agent || ''}</td>
      <td>${data.phone1 || ''}</td>
      <td>${data.callTime || ''}</td>
      <td>${data.status || ''}</td>
      <td>${data.followUp || ''}</td>
      <td>${data.remarks || ''}</td>
    `;
    tbody.appendChild(row);
  });
});

function logout() {
  firebase.auth().signOut().then(() => location.href = "login.html");
}
