console.log("Content script loaded on: " + window.location.href);

// Chrome listener for fillCredentials
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillCredentials") {
      console.log("Content script received 'fillCredentials' message via chrome API.");
      function fillCredentials() {
        console.log("Attempting to find login fields...");
        // Check that these IDs match the actual login page!
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