// background.js (Manifest V3)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check that the tab has finished loading and that the URL contains the expected path
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes("neptun.elte.hu/Account/Login")) {
    console.log("[Background] Tab finished loading:", tab.url);

    // Retrieve settings (if you use localStorage in popup, consider migrating to chrome.storage)
    const settingsStr = localStorage.getItem("neptunAutoLoginSettings");
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      if (settings.enabled) {
        chrome.tabs.sendMessage(tabId, {
          action: "fillCredentials",
          code: settings.code,
          password: settings.password
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("[Background] sendMessage error:", chrome.runtime.lastError.message);
          } else {
            console.log("[Background] Received response:", response);
          }
        });
      }
    }
  }
});