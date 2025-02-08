// content.js
console.log("Content script loaded on: " + window.location.href);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillCredentials") {
    console.log("Content script received 'fillCredentials' message.");
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
    return true;
  }
});
