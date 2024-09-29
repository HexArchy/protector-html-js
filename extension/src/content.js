(function () {
  let isProtectionEnabled = true;

  function applyProtection() {
    document.documentElement.setAttribute("data-extension-installed", "true");
    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    document.addEventListener("keydown", preventKeyboardActions);
    document.addEventListener("contextmenu", preventAction);
    disableSelection();
    showNotification("Content Shield активен");
  }

  function removeProtection() {
    document.documentElement.removeAttribute("data-extension-installed");
    document.removeEventListener("copy", preventAction);
    document.removeEventListener("cut", preventAction);
    document.removeEventListener("keydown", preventKeyboardActions);
    document.removeEventListener("contextmenu", preventAction);
    enableSelection();
    showNotification("Content Shield отключен");
  }

  function preventAction(e) {
    e.preventDefault();
    return false;
  }

  function preventKeyboardActions(e) {
    if (
      (e.ctrlKey && (e.key === "c" || e.key === "x" || e.key === "s")) ||
      e.key === "PrintScreen"
    ) {
      e.preventDefault();
      return false;
    }
  }

  function disableSelection() {
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.mozUserSelect = "none";
    document.body.style.msUserSelect = "none";
  }

  function enableSelection() {
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    document.body.style.mozUserSelect = "";
    document.body.style.msUserSelect = "";
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "rgba(52, 152, 219, 0.9)";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.fontFamily = "Arial, sans-serif";
    notification.style.zIndex = "9999";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  chrome.storage.local.get(["isEnabled"], function (result) {
    isProtectionEnabled = result.isEnabled;
    if (isProtectionEnabled) {
      applyProtection();
    }
  });

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.isEnabled) {
      isProtectionEnabled = changes.isEnabled.newValue;
      if (isProtectionEnabled) {
        applyProtection();
      } else {
        removeProtection();
      }
    }
  });
})();
