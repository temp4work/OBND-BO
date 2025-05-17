// Create a shared auth.js file
const checkAuth = async (requiredRole = null) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  
  try {
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      console.error("User document not found");
      firebase.auth().signOut();
      window.location.href = "login.html";
      return null;
    }
    
    const userData = userDoc.data();
    
    if (requiredRole && userData.role !== requiredRole) {
      alert(`Access denied. ${requiredRole} only.`);
      window.location.href = "home.html";
      return null;
    }
    
    return {user, userData};
  } catch (err) {
    console.error("Auth check failed:", err);
    return null;
  }
};