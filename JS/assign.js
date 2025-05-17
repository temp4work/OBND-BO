// Fixed assign.js
const db = firebase.firestore();

async function loadAgents() {
  try {
    const agentSelect = document.getElementById("agentSelect");
    agentSelect.innerHTML = '<option value="">-- Select Agent --</option>';
    
    const snapshot = await db.collection("users")
      .where("role", "==", "agent")
      .orderBy("name")
      .get();
      
    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = data.name;
      option.textContent = data.name;
      agentSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load agents:", err);
  }
}

async function loadData() {
  try {
    // Load fresh data
    const freshSnapshot = await db.collection("leads")
      .where("assigned", "==", false)
      .orderBy("createdAt", "desc")
      .get();
      
    const freshTable = document.getElementById("freshTable");
    freshTable.innerHTML = "";
    
    freshSnapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ''}</td>
        <td>${data.number1 || ''}</td>
        <td>${data.number2 || ''}</td>
        <td>${data.number3 || ''}</td>
        <td>${data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : ''}</td>
      `;
      freshTable.appendChild(row);
    });
    
    // Load assigned data
    const assignedSnapshot = await db.collection("assignments")
      .orderBy("createdAt", "desc")
      .get();
      
    const assignedTable = document.getElementById("assignedTable");
    assignedTable.innerHTML = "";
    
    assignedSnapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ''}</td>
        <td>${data.number1 || ''}</td>
        <td>${data.number2 || ''}</td>
        <td>${data.number3 || ''}</td>
        <td>${data.agent || ''}</td>
        <td>${data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : ''}</td>
      `;
      assignedTable.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

async function assignToAgent() {
  const agent = document.getElementById("agentSelect").value;
  const count = parseInt(document.getElementById("assignCount").value);
  
  if (!agent) {
    alert("Please select an agent");
    return;
  }
  
  if (!count || count < 1) {
    alert("Please enter a valid number of entries to assign");
    return;
  }
  
  try {
    const snapshot = await db.collection("leads")
      .where("assigned", "==", false)
      .orderBy("createdAt")
      .limit(count)
      .get();
      
    if (snapshot.empty) {
      alert("No data available to assign");
      return;
    }
    
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Create assignment
      const assignmentRef = db.collection("assignments").doc();
      batch.set(assignmentRef, {
        ...data,
        agent: agent,
        assignedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Update lead as assigned
      batch.update(doc.ref, {
        assigned: true,
        assignedTo: agent,
        assignedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    alert(`Successfully assigned ${snapshot.size} entries to ${agent}`);
    loadData();
  } catch (err) {
    console.error("Assignment failed:", err);
    alert("Failed to assign data");
  }
}

function switchTab(tabName) {
  // Hide all tab content
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  
  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  // Show selected tab and mark its button as active
  document.getElementById(`tab-${tabName}`).style.display = "block";
  document.querySelector(`.tab-btn[onclick="switchTab('${tabName}')"]`).classList.add("active");
}

function importFromSheet() {
  alert("Google Sheets import functionality not yet implemented");
  // This would connect to Google Sheets API
}

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
  
  // Initialize tabs
  document.getElementById("tab-assigned").style.display = "none";
});