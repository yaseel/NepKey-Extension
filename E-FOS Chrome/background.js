// background.js (Manifest V3; fallback to tabs.executeScript if needed)
console.log("[Background] Background script loaded");

// Helper: Safely execute a script function in the tab, with fallback.
function safeExecuteScript(tabId, details, callback) {
  if (chrome.scripting && chrome.scripting.executeScript) {
    chrome.scripting.executeScript(
      Object.assign({ target: { tabId } }, details),
      (results) => {
        if (chrome.runtime.lastError) {
          console.error("[Background] chrome.scripting.executeScript error:", chrome.runtime.lastError.message);
          callback(null);
        } else {
          callback(results);
        }
      }
    );
  } else if (chrome.tabs && chrome.tabs.executeScript) {
    // Fallback for older APIs (Manifest V2)
    chrome.tabs.executeScript(tabId, details, (results) => {
      if (chrome.runtime.lastError) {
        console.error("[Background] chrome.tabs.executeScript error:", chrome.runtime.lastError.message);
        callback(null);
      } else {
        callback(results);
      }
    });
  } else {
    console.error("[Background] No executeScript API available.");
    callback(null);
  }
}

// Check if login fields exist on the page.
function checkLoginFieldsExist(tabId, callback) {
  safeExecuteScript(
    tabId,
    {
      // Using a function to return a boolean.
      func: function() {
        return !!(document.getElementById("LoginName") && document.getElementById("Password"));
      }
    },
    (results) => {
      if (!results) {
        callback(false);
        return;
      }
      // results is an array; we check the first result.
      if (results[0] && results[0].result === true) {
        callback(true);
      } else if (typeof results[0] === "boolean" && results[0] === true) {
        // Fallback: if result is a plain boolean (from tabs.executeScript)
        callback(true);
      } else {
        callback(false);
      }
    }
  );
}

// Poll for fields with a given maximum number of attempts.
function pollForFields(tabId, maxAttempts, delayMs, onSuccess, onFailure) {
  let attempt = 0;
  function poll() {
    attempt++;
    console.log(`[Background] Polling for login fields, attempt ${attempt}`);
    checkLoginFieldsExist(tabId, (exists) => {
      if (exists) {
        console.log("[Background] Login fields detected.");
        onSuccess();
      } else if (attempt < maxAttempts) {
        setTimeout(poll, delayMs);
      } else {
        console.warn("[Background] Login fields not found after polling.");
        onFailure();
      }
    });
  }
  poll();
}

// Listen for tab updates on Neptun login pages.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("neptun.elte.hu/Account/Login")
  ) {
    console.log("[Background] Tab finished loading:", tab.url);
    // Instead of a fixed delay, poll for the login fields.
    pollForFields(
      tabId,
      10, // max attempts
      500, // delay in ms between attempts
      () => {
        // onSuccess: fields detected
        chrome.storage.local.get("neptunAutoLoginSettings", (result) => {
          if (chrome.runtime.lastError) {
            console.error("[Background] Error reading storage:", chrome.runtime.lastError);
            return;
          }
          if (result && result.neptunAutoLoginSettings) {
            const settings = result.neptunAutoLoginSettings;
            if (settings.enabled) {
              console.log("[Background] Settings found and enabled. Sending fillCredentials message.");
              chrome.tabs.sendMessage(tabId, {
                action: "fillCredentials",
                code: settings.code,
                password: settings.password
              }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error("[Background] sendMessage error:", chrome.runtime.lastError.message);
                  // Fallback: direct injection.
                  safeExecuteScript(
                    tabId,
                    {
                      func: function (code, password) {
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
                    },
                    (injectionResults) => {
                      console.log("[Background] Direct injection results:", injectionResults);
                    }
                  );
                } else {
                  console.log("[Background] Received response from content script:", response);
                }
              });
            } else {
              console.log("[Background] Auto-login is disabled in settings.");
            }
          } else {
            console.log("[Background] No auto-login settings found in storage.");
          }
        });
      },
      () => {
        // onFailure: fallback direct injection even if fields weren't detected by polling.
        console.warn("[Background] Falling back: Direct injection without detecting fields.");
        chrome.storage.local.get("neptunAutoLoginSettings", (result) => {
          if (chrome.runtime.lastError) {
            console.error("[Background] Error reading storage (fallback):", chrome.runtime.lastError);
            return;
          }
          if (result && result.neptunAutoLoginSettings) {
            const settings = result.neptunAutoLoginSettings;
            if (settings.enabled) {
              safeExecuteScript(
                tabId,
                {
                  func: function (code, password) {
                    const userInput = document.getElementById("LoginName");
                    const passInput = document.getElementById("Password");
                    if (userInput && passInput) {
                      userInput.value = code;
                      passInput.value = password;
                      userInput.dispatchEvent(new Event("input", { bubbles: true }));
                      passInput.dispatchEvent(new Event("input", { bubbles: true }));
                      console.log("Credentials inserted via fallback injection.");
                    } else {
                      console.log("Fallback injection: Login fields not found.");
                    }
                  },
                  args: [settings.code, settings.password]
                },
                (injectionResults) => {
                  console.log("[Background] Fallback injection results:", injectionResults);
                }
              );
            }
          }
        });
      }
    );
  }
});