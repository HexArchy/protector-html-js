// Хэш пароля "test" с использованием SHA-256
const passwordHash =
  "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ isEnabled: true }, function () {
    console.log("Content Shield installed and enabled");
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received message:", request);
  if (request.action === "toggleProtection") {
    chrome.storage.local.get(["isEnabled"], function (result) {
      let newState = !result.isEnabled;
      if (result.isEnabled && request.password) {
        hashPassword(request.password).then((hash) => {
          if (hash === passwordHash) {
            chrome.storage.local.set({ isEnabled: newState }, function () {
              console.log("Protection toggled:", newState);
              sendResponse({ isEnabled: newState });
            });
          } else {
            console.log("Incorrect password");
            sendResponse({
              isEnabled: result.isEnabled,
              error: "Incorrect password",
            });
          }
        });
      } else {
        chrome.storage.local.set({ isEnabled: newState }, function () {
          console.log("Protection toggled:", newState);
          sendResponse({ isEnabled: newState });
        });
      }
    });
    return true; // Will respond asynchronously
  }
});
