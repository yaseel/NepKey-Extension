// content.js
console.log("Content script loaded on: " + window.location.href);

// Chrome listener for fillCredentials
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillCredentials") {
      console.log("Content script received 'fillCredentials' message via chrome API.");
      function fillCredentials() {
        console.log("Attempting to find login fields...");
        // Make sure these IDs match the actual login page elements!
        const userInput = document.getElementById("LoginName");
        const passInput = document.getElementById("Password");
        if (userInput && passInput) {
          console.log("Login fields found. Inserting credentials.");
          userInput.value = request.code;
          passInput.value = request.password;
          userInput.dispatchEvent(new Event("input", { bubbles: true }));
          passInput.dispatchEvent(new Event("input", { bubbles: true }));
          console.log("Credentials inserted.");
          sendResponse({ success: true });
        } else {
          console.log("Fields not found. Retrying in 100ms...");
          setTimeout(fillCredentials, 100);
        }
      }
      fillCredentials();
      return true; // keep the channel open for async response
    }
  });
}

// Safari listener for fillCredentials (if applicable)
if (typeof safari !== "undefined" && safari.self) {
  safari.self.addEventListener("message", (event) => {
    console.log("Content script (Safari): Received message:", event.name, event.message);
    if (event.name === "fillCredentials") {
      function fillCredentials() {
        console.log("Attempting to find login fields (Safari)...");
        const userInput = document.getElementById("LoginName");
        const passInput = document.getElementById("Password");
        if (userInput && passInput) {
          console.log("Login fields found (Safari). Inserting credentials.");
          userInput.value = event.message.code;
          passInput.value = event.message.password;
          userInput.dispatchEvent(new Event("input", { bubbles: true }));
          passInput.dispatchEvent(new Event("input", { bubbles: true }));
          console.log("Credentials inserted (Safari).");
        } else {
          console.log("Fields not found (Safari). Retrying in 100ms...");
          setTimeout(fillCredentials, 100);
        }
      }
      fillCredentials();
    }
  }, false);
}