// background.js
console.log("[Background] Background script loaded");

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openNeptunLogin") {
    console.log("[Background] Received openNeptunLogin message:", request);
    const settings = request.settings;
    // Open a new tab with the Neptun login page.
    browser.tabs.create({ url: "https://neptun.elte.hu/Account/Login" }).then((tab) => {
      console.log("[Background] New tab created. Tab ID:", tab.id);
      // Listen for the tab to finish loading.
      browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
        if (tabId === tab.id && changeInfo.status === "complete") {
          console.log("[Background] Tab finished loading. URL:", updatedTab.url);
          browser.tabs.onUpdated.removeListener(listener);
          // Send message to content script.
          browser.tabs.sendMessage(tab.id, {
            action: "fillCredentials",
            code: settings.code,
            password: settings.password
          }).then((response) => {
            console.log("[Background] Received response from content script:", response);
          }).catch((error) => {
            console.error("[Background] sendMessage error:", error);
            // Fallback: direct injection via scripting.
            browser.scripting.executeScript({
              target: { tabId: tab.id },
              func: function(code, password) {
                const userInput = document.getElementById("LoginName");
                const passInput = document.getElementById("Password");
                if (userInput && passInput) {
                  userInput.value = code;
                  passInput.value = password;
                  userInput.dispatchEvent(new Event("input", { bubbles: true }));
                  passInput.dispatchEvent(new Event("input", { bubbles: true }));
                  console.log("Credentials inserted via direct injection.");
                } else {
                  console.log("Direct injection: Login fields not found.");
                }
              },
              args: [settings.code, settings.password]
            }).then((injectionResults) => {
              console.log("[Background] Direct injection results:", injectionResults);
            }).catch((injectError) => {
              console.error("[Background] Direct injection error:", injectError);
            });
          });
        }
      });
    }).catch((err) => {
      console.error("[Background] tabs.create error:", err);
    });
  } else if (request.action === "activateFocusMode") {
    console.log("[Background] Received activateFocusMode message.");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length > 0) {
        browser.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: function() {
            document.documentElement.style.width = "100vw";
            document.documentElement.style.overflowX = "hidden";
            document.body.style.width = "100vw";
            document.body.style.overflowX = "hidden";
            document.querySelectorAll(".row").forEach(el => el.style.display = "inline");
            document.querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-bottom")
              .forEach(el => el.remove());
            document.querySelectorAll(".col-xl-10, .col-md-9").forEach(el => el.style.maxWidth = "97%");
          }
        }).then(() => {
          alert("Focus Mode Activated");
        });
      }
    });
  }
});
