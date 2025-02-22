import PollingHelper from "./PollingHelper.js";

export default class TMSLogin {
    static async handleLogin(browserAPI) {
        console.log("[Content] TMS page detected. URL: " + window.location.href);
        if (sessionStorage.getItem("tmsAutoLoginAttempted")) {
            console.log("[Content] TMS auto-login already attempted. Not trying again.");
        } else {
            sessionStorage.setItem("tmsAutoLoginAttempted", "true");
            console.log("[Content] Detected TMS Login page. Attempting auto-fill for TMS.");
            try {
                const result = await browserAPI.storage.local.get("autoLoginSettings");
                if (
                    result &&
                    result.autoLoginSettings &&
                    result.autoLoginSettings.tms &&
                    result.autoLoginSettings.tms.enabled
                ) {
                    const settings = result.autoLoginSettings;
                    function fillTMS() {
                        if (window.tmsLoginAttempted) {
                            console.log("[Content] TMS auto-login already attempted (local flag). Skipping further attempts.");
                            return;
                        }
                        window.tmsLoginAttempted = true;
                        const usernameFields = document.querySelectorAll("input[name='username']");
                        const passwordFields = document.querySelectorAll("input[name='password']");
                        console.log("[Content] Found " + usernameFields.length + " username field(s) and " + passwordFields.length + " password field(s).");

                        const userInput = document.querySelector("input[name='username']");
                        const passInput = document.querySelector("input[name='password']");
                        if (userInput && passInput) {
                            console.log("[Content] TMS login fields found. Inserting credentials.");
                            userInput.value = settings.credentials.code;
                            passInput.value = settings.credentials.tmspassword ? settings.credentials.tmspassword : settings.credentials.password;
                            userInput.dispatchEvent(new Event("input", { bubbles: true }));
                            passInput.dispatchEvent(new Event("input", { bubbles: true }));
                            console.log("[Content] TMS credentials filled. Polling for login button...");
                            const polling = new PollingHelper();
                            polling.pollForElement(
                                'button[type="submit"].btn.btn-primary.btn-block',
                                300,
                                100,
                                (loginBtn) => {
                                    console.log("[Content] TMS login button found. Clicking it.");
                                    loginBtn.click();
                                },
                                () => {
                                    console.error("[Content] TMS login button not found after polling.");
                                }
                            );
                        } else {
                            console.error("[Content] TMS login fields not found via polling. Aborting TMS auto-login.");
                            // Use MutationObserver as fallback.
                            const observer = new MutationObserver((mutations, obs) => {
                                const username = document.querySelector("input[name='username']");
                                const password = document.querySelector("input[name='password']");
                                if (username && password) {
                                    obs.disconnect();
                                    console.log("[Content] TMS login fields found via MutationObserver. Re-attempting auto-login.");
                                    window.tmsLoginAttempted = false;
                                    fillTMS();
                                }
                            });
                            observer.observe(document.body, { childList: true, subtree: true });
                        }
                    }
                    fillTMS();
                } else {
                    console.log("[Content] TMS auto-login not enabled or settings not found.");
                }
            } catch (e) {
                console.error("[Content] Error in TMS auto-fill login:", e);
            }
        }
    }
}
