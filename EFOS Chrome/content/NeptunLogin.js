import PollingHelper from "./PollingHelper.js";
import Utils from "./Utils.js";
import { generateTOTP } from "./TOTPGenerator.js";

export default class NeptunLogin {
    static async handleLogin(browserAPI) {
        const userInput = document.getElementById("LoginName");
        const passInput = document.getElementById("Password");
        if (!userInput || !passInput) {
            console.log("[Content] Login fields not found. Likely already logged in.");
            const settings = await browserAPI.storage.local.get("autoLoginSettings");
            if (
                settings &&
                settings.autoLoginSettings &&
                settings.autoLoginSettings.neptun &&
                settings.autoLoginSettings.neptun.studentWeb
            ) {
                console.log("[Content] Student Web toggle is ON. Triggering Student Web auto‑click.");
                Utils.triggerStudentWebAutoClick();
            } else {
                console.log("[Content] Student Web toggle is OFF. Not triggering auto‑click.");
            }
            return;
        }

        if (sessionStorage.getItem("neptunAutoLoginAttempted")) {
            console.log("[Content] Neptun auto‑login already attempted. Not trying again.");
        } else {
            sessionStorage.setItem("neptunAutoLoginAttempted", "true");
            console.log("[Content] Detected Neptun Login page. Attempting auto‑fill for Neptun.");
            try {
                const result = await browserAPI.storage.local.get("autoLoginSettings");
                if (
                    result &&
                    result.autoLoginSettings &&
                    result.autoLoginSettings.neptun &&
                    result.autoLoginSettings.neptun.enabled
                ) {
                    const settings = result.autoLoginSettings;
                    if (!window.neptunLoginAttempted) {
                        window.neptunLoginAttempted = true;
                        console.log("[Content] Neptun login fields found. Inserting credentials.");
                        userInput.value = settings.credentials.code;
                        passInput.value = settings.credentials.password;
                        userInput.dispatchEvent(new Event("input", { bubbles: true }));
                        passInput.dispatchEvent(new Event("input", { bubbles: true }));
                        console.log("[Content] Credentials filled. Polling for Neptun login button...");
                        const polling = new PollingHelper();
                        polling.pollForElement(
                            'button[type="submit"].btn.btn-primary, input[type="submit"].btn.btn-primary',
                            100,
                            20,
                            (loginBtn) => {
                                console.log("[Content] Neptun login button found. Clicking it.");
                                loginBtn.click();
                            },
                            () => {
                                console.error("[Content] Neptun login button not found after polling.");
                            }
                        );
                    } else {
                        console.log("[Content] Neptun auto‑login already attempted (local flag).");
                    }
                } else {
                    console.log("[Content] Neptun auto‑login not enabled or settings not found.");
                }
            } catch (e) {
                console.error("[Content] Error in Neptun auto‑fill login:", e);
            }
        }
    }

    static async handleOTP(browserAPI) {
        if (sessionStorage.getItem("totpAutoLoginAttempted")) {
            console.log("[Content] TOTP auto-login already attempted. Not trying again.");
            const polling = new PollingHelper();
            polling.stopPolling();
            return;
        } else {
            sessionStorage.setItem("totpAutoLoginAttempted", "true");
            const polling = new PollingHelper();
            polling.pollForElement(
                "#TOTPCode",
                100,
                50,
                (otpField) => {
                    if (!window.totpAttempted) {
                        window.totpAttempted = true;
                        console.log("[Content] OTP field found via polling. Calling fillMFA() once.");
                        NeptunLogin.fillMFA(browserAPI, polling);
                    }
                },
                () => {
                    console.error("[Content] OTP field (#TOTPCode) not found after polling. Stopping retries.");
                    polling.stopPolling();
                }
            );
        }
    }

    static async fillMFA(browserAPI, pollingHelper) {
        if (window.otpFilled || Utils.isAlreadyLoggedIn()) {
            console.log("[Content] Already logged in or OTP already handled. Stopping MFA process.");
            pollingHelper.stopPolling();
            return;
        }
        const otpField = document.getElementById("TOTPCode");
        if (!otpField) {
            console.error("[Content] OTP field (#TOTPCode) not found. Stopping retries.");
            pollingHelper.stopPolling();
            return;
        }
        console.log("[Content] Detected OTP field (id='TOTPCode').");
        try {
            const settingsResult = await browserAPI.storage.local.get("autoLoginSettings");
            const settings = settingsResult ? settingsResult.autoLoginSettings : null;
            if (!settings || !settings.credentials.otpSecret) {
                console.error("[Content] No OTP secret stored in settings.");
                pollingHelper.stopPolling();
                return;
            }
            console.log("[Content] Stored OTP secret (raw):", settings.credentials.otpSecret);
            const normalizedSecret = settings.credentials.otpSecret.trim();
            try {
                const otpCode = await generateTOTP(normalizedSecret);
                console.log("[Content] Generated TOTP code:", otpCode);
                otpField.value = otpCode;
                otpField.dispatchEvent(new Event("input", { bubbles: true }));
                window.otpFilled = true;
                pollingHelper.pollForElement(
                    'button[type="submit"].btn.btn-primary, input[type="submit"].btn.btn-primary',
                    100,
                    50,
                    (submitBtn) => {
                        if (window.otpSubmitted) {
                            console.log("[Content] OTP already submitted. Skipping button click.");
                            return;
                        }
                        console.log("[Content] MFA submit button found. Clicking it.");
                        submitBtn.click();
                        window.otpSubmitted = true;
                        pollingHelper.stopPolling();
                    },
                    () => {
                        console.error("[Content] MFA submit button not found after polling. Stopping retries.");
                        pollingHelper.stopPolling();
                    }
                );
            } catch (e) {
                console.error("[Content] Error generating TOTP:", e);
                pollingHelper.stopPolling();
            }
        } catch (err) {
            console.error("[Content] Error retrieving settings from storage:", err);
            pollingHelper.stopPolling();
        }
    }
}
