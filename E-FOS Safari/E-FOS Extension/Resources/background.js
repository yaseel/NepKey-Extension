// In background.js

if (typeof safari !== "undefined" && safari.application) {
  safari.application.addEventListener("message", (event) => {
    if (event.name === "openNeptunLogin") {
      console.log("Background: received openNeptunLogin message", event.message);
      const settings = event.message.settings;
      const activeWindow = safari.application.activeBrowserWindow;
      let newTab = activeWindow.openTab();
      if (!newTab) {
        console.error("Background: Failed to open new tab in Safari.");
        return;
      }
      newTab.url = "https://neptun.elte.hu/Account/Login";
      console.log("Background: New tab opened with URL:", newTab.url);

      // Poll until newTab.page is available
      const interval = setInterval(() => {
        if (newTab.page) {
          clearInterval(interval);
          console.log("Background: newTab.page is now available. Dispatching fillCredentials message...");
          newTab.page.dispatchMessage("fillCredentials", {
            code: settings.code,
            password: settings.password
          });
        } else {
          console.log("Background: Waiting for newTab.page...");
        }
      }, 500);
    }
  }, false);
}
