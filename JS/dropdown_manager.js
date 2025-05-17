const dropdownsContainer = document.getElementById("customDropdowns");

async function loadDropdowns() {
  try {
    const snapshot = await db.collection("dropdowns").orderBy("order").get();
    dropdownsContainer.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown-group";

      const label = document.createElement("label");
      label.textContent = data.label;
      label.htmlFor = `dropdown-${doc.id}`;

      const select = document.createElement("select");
      select.name = data.label;
      select.id = `dropdown-${doc.id}`;
      select.innerHTML = '<option value="">-- Select --</option>';
      (data.options || []).forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      dropdown.appendChild(label);
      dropdown.appendChild(select);

      // If it has sub-options
      if (data.subOptions) {
        const subDiv = document.createElement("div");
        subDiv.id = `options-${data.label}`;
        subDiv.className = "sub-options";
        dropdown.appendChild(subDiv);

        select.addEventListener("change", () => {
          subDiv.innerHTML = "";
          const selected = select.value;
          const subItems = data.subOptions[selected] || [];
          subItems.forEach(subLabel => {
            const subLabelElem = document.createElement("label");
            subLabelElem.textContent = subLabel;
            const subSelect = document.createElement("select");
            subSelect.name = subLabel;
            subSelect.innerHTML = '<option value="">-- Select --</option><option>Yes</option><option>No</option>';
            subDiv.appendChild(subLabelElem);
            subDiv.appendChild(subSelect);
          });
        });
      }

      dropdownsContainer.appendChild(dropdown);
    });
  } catch (err) {
    console.error("Dropdown loading error:", err);
  }
}
