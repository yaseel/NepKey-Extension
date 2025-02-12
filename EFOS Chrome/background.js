console.log("[Background] Background script loaded");

if (typeof browser === "undefined") {
  var browser = chrome;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openNeptunLogin") {
    console.log("[Background] Received openNeptunLogin message:", request);
    const creds = request.settings;
    if (request.site && request.site === "canvas") {
      // Canvas auto-login
      browser.tabs.create({ url: "https://canvas.elte.hu/belepes?fromExt=1" })
        .then((tab) => {
          console.log("[Background] New Canvas tab created. Tab ID:", tab.id);
          browser.tabs.update(tab.id, { active: true });
          browser.windows.update(tab.windowId, { focused: true });
        })
        .catch((err) => {
          console.error("[Background] Canvas tabs.create error:", err);
        });
    } else {
      // Neptun auto-login
      browser.tabs.create({ url: "https://neptun.elte.hu/Account/Login?fromExt=1" })
        .then((tab) => {
          console.log("[Background] New Neptun tab created. Tab ID:", tab.id);
          browser.tabs.update(tab.id, { active: true });
          browser.windows.update(tab.windowId, { focused: true });
          browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
            if (tabId === tab.id && changeInfo.status === "complete") {
              console.log("[Background] Neptun tab finished loading. URL:", updatedTab.url);
              browser.tabs.onUpdated.removeListener(listener);
              browser.tabs.sendMessage(tab.id, {
                action: "fillCredentials",
                code: creds.code,
                password: creds.password
              })
                .then((response) => {
                  console.log("[Background] Received response from content script:", response);
                })
                .catch((error) => {
                  console.error("[Background] sendMessage error:", error);
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
                    args: [creds.code, creds.password]
                  })
                    .then((injectionResults) => {
                      console.log("[Background] Direct injection results:", injectionResults);
                    })
                    .catch((injectError) => {
                      console.error("[Background] Direct injection error:", injectError);
                    });
                });
            }
          });
        })
        .catch((err) => {
          console.error("[Background] tabs.create error:", err);
        });
    }
  } else if (request.action === "openTMSLogin") {
    console.log("[Background] Received openTMSLogin message:", request);
    // TMS auto-login
    const creds = request.settings;
    browser.tabs.create({ url: "https://tms.inf.elte.hu/?fromExt=1" })
      .then((tab) => {
        console.log("[Background] New TMS tab created. Tab ID:", tab.id);
        browser.tabs.update(tab.id, { active: true });
        browser.windows.update(tab.windowId, { focused: true });
        browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
          if (tabId === tab.id && changeInfo.status === "complete") {
            console.log("[Background] TMS tab finished loading. URL:", updatedTab.url);
            browser.tabs.onUpdated.removeListener(listener);
            const passwordToUse = creds.tmspassword ? creds.tmspassword : creds.password;
            browser.tabs.sendMessage(tab.id, {
              action: "fillCredentials",
              code: creds.code,
              password: passwordToUse
            });
          }
        });
      })
      .catch((err) => {
        console.error("[Background] TMS tabs.create error:", err);
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
            document.querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-primary")
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
