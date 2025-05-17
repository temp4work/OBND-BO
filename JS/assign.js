const db = firebase.firestore();

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) return (window.location.href = "login.html");

  const userDoc = await db.collection("users").doc(user.uid).get();
  const data = userDoc.data();
  if (!data || data.role !== "admin") {
    alert("Access denied. Admins only.");
    return (window.location.href = "home.html");
  }

  loadData();
  loadAgents();
});
