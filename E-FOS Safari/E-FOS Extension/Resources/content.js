// Existing Chrome listener (for Chrome-based browsers)
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillCredentials") {
      console.log("Content script received 'fillCredentials' message via chrome API.");
      function fillCredentials() {
        console.log("Attempting to find login fields...");
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
      return true; // Keep the message channel open for asynchronous response.
    }
  });
}


if (typeof safari !== "undefined" && safari.self) {
  safari.self.addEventListener("message", (event) => {
    console.log("Content script: Safari message received:", event.name, event.message);
    if (event.name === "fillCredentials") {
      function fillCredentials() {
        console.log("Content script: Attempting to find login fields...");
        const userInput = document.getElementById("LoginName");
        const passInput = document.getElementById("Password");
        if (userInput && passInput) {
          console.log("Content script: Login fields found. Inserting credentials.");
          userInput.value = event.message.code;
          passInput.value = event.message.password;
          userInput.dispatchEvent(new Event("input", { bubbles: true }));
          passInput.dispatchEvent(new Event("input", { bubbles: true }));
          console.log("Content script: Credentials inserted.");
        } else {
          console.log("Content script: Fields not found. Retrying in 100ms...");
          setTimeout(fillCredentials, 100);
        }
      }
      fillCredentials();
    }
  }, false);
}
