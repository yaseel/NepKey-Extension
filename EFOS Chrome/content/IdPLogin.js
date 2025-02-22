import PollingHelper from "./PollingHelper.js";

export default class IdPLogin {
    static async handleLogin(browserAPI) {
        try {
            const data = await browserAPI.storage.local.get("canvasAutoLoginInitiated");
            console.log("[Content] canvasAutoLoginInitiated flag:", data.canvasAutoLoginInitiated);
            if (!data.canvasAutoLoginInitiated) {
                console.log("[Content] IdP auto‑fill not triggered because the canvas auto‑login flag is missing.");
                return;
            }
            await browserAPI.storage.local.remove("canvasAutoLoginInitiated");
            console.log("[Content] Detected IdP login page from canvas auto‑login. Proceeding with auto‑fill.");
            (async function autoFillIdPLogin() {
                try {
                    const result = await browserAPI.storage.local.get("autoLoginSettings");
                    const settings = result && result.autoLoginSettings;
                    if (settings && settings.canvas && settings.canvas.enabled === true) {
                        if (window.idpLoginAttempted) {
                            console.log("[Content] IdP auto‑login already attempted. Skipping further attempts.");
                            return;
                        }
                        window.idpLoginAttempted = true;
                        function fillLogin() {
                            let userInput = document.getElementById("LoginName") ||
                                document.querySelector("input[name='username_neptun']") ||
                                document.querySelector("input[name='username']");
                            let passInput = document.getElementById("Password") ||
                                document.querySelector("input[name='password_neptun']") ||
                                document.querySelector("input[name='password']");
                            if (userInput && passInput) {
                                console.log("[Content] IdP login fields found. Inserting credentials.");
                                userInput.value = settings.credentials.code;
                                passInput.value = settings.credentials.password;
                                userInput.dispatchEvent(new Event("input", { bubbles: true }));
                                passInput.dispatchEvent(new Event("input", { bubbles: true }));
                                console.log("[Content] Credentials filled. Polling for login button...");
                                const polling = new PollingHelper();
                                polling.pollForElement('button[type="submit"], input[type="submit"]', 100, 20, (loginBtn) => {
                                    console.log("[Content] IdP login button found. Clicking it.");
                                    loginBtn.click();
                                }, () => {
                                    console.error("[Content] IdP login button not found after polling.");
                                });
                            } else {
                                console.log("[Content] IdP login fields not found. Retrying in 100ms...");
                                setTimeout(fillLogin, 100);
                            }
                        }
                        fillLogin();
                    } else {
                        console.log("[Content] Canvas auto‑login not enabled or settings not found.");
                    }
                } catch (e) {
                    console.error("[Content] Error in auto‑fill IdP login:", e);
                }
            })();
        } catch (e) {
            console.error("[Content] Error retrieving canvasAutoLoginInitiated flag:", e);
        }
    }
}
