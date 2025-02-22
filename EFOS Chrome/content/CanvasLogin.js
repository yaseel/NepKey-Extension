import PollingHelper from "./PollingHelper.js";

export default class CanvasLogin {
    static async handleLogin(browserAPI) {
        console.log("[Canvas] Canvas page detected with fromExt flag.");
        try {
            const result = await browserAPI.storage.local.get("autoLoginSettings");
            const settings = result && result.autoLoginSettings;
            if (settings && settings.canvas && settings.canvas.enabled === true) {
                if (window.canvasLoginAttempted) {
                    console.log("[Canvas] Canvas auto‑login already attempted. Skipping.");
                    return;
                }
                window.canvasLoginAttempted = true;
                console.log("[Canvas] Canvas auto-login enabled. Starting auto-login process for Canvas.");
                const polling = new PollingHelper();
                polling.pollForElement("a.myButton", 100, 30, () => {
                    const allButtons = document.querySelectorAll("a.myButton");
                    const targetButton = Array.from(allButtons).find(btn => {
                        const text = btn.textContent.trim().toLowerCase();
                        return text.includes("neptun hozzáféréssel");
                    });
                    if (targetButton) {
                        console.log("[Canvas] Found Canvas login button. Clicking it.");
                        browserAPI.storage.local.set({ canvasAutoLoginInitiated: true });
                        targetButton.click();
                        polling.pollForElement("#username_neptun", 100, 30, (usernameField) => {
                            usernameField.value = settings.credentials.code || "";
                            usernameField.dispatchEvent(new Event("input", { bubbles: true }));
                            console.log("[Canvas] Username field filled.");
                            polling.pollForElement("#password_neptun", 100, 30, (passwordField) => {
                                passwordField.value = settings.credentials.password || "";
                                passwordField.dispatchEvent(new Event("input", { bubbles: true }));
                                console.log("[Canvas] Password field filled.");
                                polling.pollForElement("input[type='submit'].submit-button", 100, 30, (submitBtn) => {
                                    console.log("[Canvas] Found Canvas submit button. Clicking it.");
                                    submitBtn.click();
                                }, () => {
                                    console.error("[Canvas] Submit button not found after polling.");
                                });
                            }, () => {
                                console.error("[Canvas] Password field (#password_neptun) not found.");
                            });
                        }, () => {
                            console.error("[Canvas] Username field (#username_neptun) not found.");
                        });
                    } else {
                        console.error("[Canvas] Correct Canvas login button not found among a.myButton elements.");
                    }
                }, () => {
                    console.error("[Canvas] No a.myButton element found.");
                });
            } else {
                console.log("[Canvas] Canvas auto‑login disabled. Not triggering auto-login.");
            }
        } catch (err) {
            console.error("[Canvas] Error retrieving settings:", err);
        }
    }
}
