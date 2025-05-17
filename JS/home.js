firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  const data = userDoc.data();
  const agentName = data.name || "Unknown";
  document.getElementById("agentEmail").textContent = "Logged in as: " + agentName;

  const select = document.getElementById("assignedNumbers");
  const snapshot = await db.collection("assignments")
    .where("agent", "==", agentName)
    .orderBy("createdAt", "desc")
    .get();

  snapshot.forEach(doc => {
    const d = doc.data();
    const opt = document.createElement("option");
    opt.value = d.number1;
    opt.textContent = d.number1 + (d.name ? ` (${d.name})` : "");
    select.appendChild(opt);
  });

  document.querySelector("input[name='agent']").value = agentName;
  loadDropdowns();
});

document.getElementById("callForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  data.timestamp = new Date();

  try {
    await db.collection("calls").add(data);
    alert("✅ Call log submitted!");
    this.reset();
    document.querySelector("input[name='agent']").value = document.getElementById("agentEmail").textContent.replace("Logged in as: ", "");
  } catch (err) {
    console.error("Submit error:", err);
    alert("❌ Failed to submit.");
  }
});

function logout() {
  firebase.auth().signOut().then(() => location.href = "login.html");
}
