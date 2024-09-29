document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const statusDiv = document.getElementById("statusDiv");
  const toggleOffBtn = document.getElementById("toggleOffBtn");
  const toggleOnBtn = document.getElementById("toggleOnBtn");
  const passwordInput = document.getElementById("passwordInput");
  const passwordForm = document.getElementById("passwordForm");

  function updateUI(isEnabled) {
    console.log("Updating UI, isEnabled:", isEnabled);
    if (isEnabled) {
      statusDiv.textContent = "Активно";
      statusDiv.classList.remove("disabled");
      toggleOffBtn.style.display = "block";
      toggleOnBtn.style.display = "none";
      passwordForm.style.display = "none";
    } else {
      statusDiv.textContent = "Отключено";
      statusDiv.classList.add("disabled");
      toggleOffBtn.style.display = "none";
      toggleOnBtn.style.display = "block";
      passwordForm.style.display = "none";
    }
  }

  function toggleProtection(password = null) {
    console.log("Toggling protection, password provided:", !!password);
    chrome.runtime.sendMessage(
      { action: "toggleProtection", password: password },
      function (response) {
        console.log("Toggle response:", response);
        if (response && response.isEnabled !== undefined) {
          updateUI(response.isEnabled);
        } else {
          console.error("Invalid response from background script");
        }
      }
    );
  }

  chrome.storage.local.get(["isEnabled"], function (result) {
    console.log("Initial state:", result);
    updateUI(result.isEnabled);
  });

  toggleOffBtn.addEventListener("click", function () {
    console.log("Toggle off button clicked");
    passwordForm.style.display = "block";
    toggleOffBtn.style.display = "none";
  });

  toggleOnBtn.addEventListener("click", function () {
    console.log("Toggle on button clicked");
    toggleProtection();
  });

  passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Password form submitted");
    const password = passwordInput.value;
    toggleProtection(password);
    passwordInput.value = "";
  });
});
