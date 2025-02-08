console.log("Content script loaded on: " + window.location.href);

// ---------------------------------------------------------------------
// Global flags & helper variables
// ---------------------------------------------------------------------
let otpFilled = false;
let otpSubmitted = false;
let pollingActive = true; // Controls whether further polling occurs

// ---------------------------------------------------------------------
// POLLING FUNCTION
// ---------------------------------------------------------------------
function pollForElement(selector, delayMs, maxAttempts, onFound, onFailure) {
  let attempts = 0;
  function poll() {
    if (!pollingActive) return;
    attempts++;
    const el = document.querySelector(selector);
    if (el) {
      console.log(`Element "${selector}" found on attempt ${attempts}`);
      onFound(el);
    } else if (attempts < maxAttempts) {
      setTimeout(poll, delayMs);
    } else {
      console.error(`Element "${selector}" not found after ${attempts} attempts`);
      if (onFailure) onFailure();
    }
  }
  poll();
}
function stopPolling() {
  console.log("Stopping all further polling.");
  pollingActive = false;
}

// ---------------------------------------------------------------------
// HELPER: Check if already logged in (by URL/path)
// ---------------------------------------------------------------------
function isAlreadyLoggedIn() {
  // For example, if the URL is exactly the homepage ("/") or contains "mainpage"
  return window.location.pathname === "/" || window.location.href.includes("mainpage");
}

// ---------------------------------------------------------------------
// Stage A: Auto-fill on Neptun Login Page
// ---------------------------------------------------------------------
if (window.location.href.includes("Account/Login")) {
  console.log("[Content] Detected Login page. Attempting auto-fill.");
  (async function autoFillLogin() {
    try {
      const result = await browser.storage.local.get("neptunAutoLoginSettings");
      if (result && result.neptunAutoLoginSettings && result.neptunAutoLoginSettings.enabled) {
        const settings = result.neptunAutoLoginSettings;
        function fillLogin() {
          const userInput = document.getElementById("LoginName");
          const passInput = document.getElementById("Password");
          if (userInput && passInput) {
            console.log("[Content] Login fields found. Inserting credentials.");
            userInput.value = settings.code;
            passInput.value = settings.password;
            userInput.dispatchEvent(new Event("input", { bubbles: true }));
            passInput.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("[Content] Credentials filled. Polling for login button...");
            pollForElement(
              'button[type="submit"].btn.btn-primary, input[type="submit"].btn.btn-primary',
              100,
              20,
              (loginBtn) => {
                console.log("[Content] Login button found. Clicking it.");
                loginBtn.click();
              },
              () => {
                console.error("[Content] Login button not found after polling.");
              }
            );
          } else {
            console.log("[Content] Login fields not found. Retrying in 100ms...");
            setTimeout(fillLogin, 100);
          }
        }
        fillLogin();
      } else {
        console.log("[Content] Auto‑login not enabled or settings not found.");
      }
    } catch (e) {
      console.error("[Content] Error in auto‑fill login:", e);
    }
  })();
}

// ---------------------------------------------------------------------
// Stage B: MFA/TOTP Handling on Login2FA Page
// ---------------------------------------------------------------------
if (window.location.href.includes("Account/Login2FA")) {
  // Only run MFA handling if not already logged in.
  if (!isAlreadyLoggedIn()) {
    pollForElement("#TOTPCode", 100, 50, (otpField) => {
      if (!pollingActive) return;
      console.log("[Content] OTP field found via polling.");
      fillMFA();
    }, () => {
      if (!pollingActive) return;
      console.error("[Content] OTP field (#TOTPCode) not found after polling. Stopping retries.");
      stopPolling();
    });
  } else {
    console.log("[Content] Already logged in. Skipping OTP polling.");
    stopPolling();
  }
}

async function fillMFA() {
  if (otpFilled || isAlreadyLoggedIn()) {
    console.log("[Content] Already logged in or OTP already handled. Stopping MFA process.");
    stopPolling();
    return;
  }

  const otpField = document.getElementById("TOTPCode");
  if (!otpField) {
    console.error("[Content] OTP field (#TOTPCode) not found. Stopping retries.");
    stopPolling();
    return;
  }

  console.log("[Content] Detected OTP field (id='TOTPCode').");

  try {
    const settingsResult = await browser.storage.local.get("neptunAutoLoginSettings");
    const settings = settingsResult ? settingsResult.neptunAutoLoginSettings : null;
    if (!settings || !settings.otpSecret) {
      console.error("[Content] No OTP secret stored in settings.");
      stopPolling();
      return;
    }
    console.log("[Content] Stored OTP secret (raw):", settings.otpSecret);
    const normalizedSecret = settings.otpSecret.trim();
    try {
      const otpCode = await generateTOTP(normalizedSecret);
      console.log("[Content] Generated TOTP code:", otpCode);
      otpField.value = otpCode;
      otpField.dispatchEvent(new Event("input", { bubbles: true }));
      otpFilled = true; // Mark that OTP has been filled

      // Poll for MFA submit button (only click once)
      pollForElement(
        'button[type="submit"].btn.btn-primary, input[type="submit"].btn.btn-primary',
        100,
        50,
        (submitBtn) => {
          if (otpSubmitted) {
            console.log("[Content] OTP already submitted. Skipping button click.");
            return;
          }
          console.log("[Content] MFA submit button found. Clicking it.");
          submitBtn.click();
          otpSubmitted = true;
          stopPolling();
        },
        () => {
          console.error("[Content] MFA submit button not found after polling. Stopping retries.");
          stopPolling();
        }
      );
    } catch (e) {
      console.error("[Content] Error generating TOTP:", e);
      stopPolling();
    }
  } catch (err) {
    console.error("[Content] Error retrieving settings from storage:", err);
    stopPolling();
  }
}

// ---------------------------------------------------------------------
// Stage C: Auto-click Student Web Link on Neptun Homepage
// ---------------------------------------------------------------------
if (
  window.location.href.startsWith("https://neptun.elte.hu/") &&
  !window.location.href.includes("Account/Login")
) {
  console.log("[Content] Checking storage for Student Web preference...");
  browser.storage.local.get("neptunAutoLoginSettings").then((result) => {
    console.log("[Content] Retrieved settings:", result);
    if (
      result &&
      result.neptunAutoLoginSettings &&
      result.neptunAutoLoginSettings.studentWeb
    ) {
      console.log("[Content] Student Web auto‑click enabled.");
      // Use polling so that if the nav links load with a delay, we still find them.
      let attempts = 0;
      const maxAttempts = 10;
      function pollStudentWeb() {
        attempts++;
        const links = Array.from(document.querySelectorAll("a.nav-link"));
        console.log("[Content] Found nav links:", links.map(link => link.textContent.trim()));
        const targetLink = links.find((link) => {
          const txt = link.textContent.trim();
          return txt === "Hallgatói web" || txt === "Student web";
        });
        if (targetLink) {
          console.log("[Content] Student web link found. Clicking it.");
          targetLink.click();
        } else if (attempts < maxAttempts) {
          setTimeout(pollStudentWeb, 500);
        } else {
          console.error("[Content] Student web link not found after polling.");
        }
      }
      // Start polling after a short delay.
      setTimeout(pollStudentWeb, 2000);
    } else {
      console.log("[Content] Student Web auto‑click is disabled or not set.");
    }
  }).catch((error) => {
    console.error("[Content] Error retrieving Student Web setting:", error);
  });
}

/* ---------------------------------------------------------------------
// TOTP Generation Helper Functions
// --------------------------------------------------------------------- */

/**
 * Generates a TOTP code using the Web Crypto API.
 * @param {string} base32Secret - The secret key in Base32 format.
 * @param {number} [step=30] - Time step in seconds.
 * @param {number} [digits=6] - Number of digits in the OTP.
 * @returns {Promise<string>} - A promise that resolves to the TOTP code.
 */
async function generateTOTP(base32Secret, step = 30, digits = 6) {
  const keyData = base32ToUint8Array(base32Secret);
  const epoch = Math.floor(Date.now() / 1000);
  let counter = Math.floor(epoch / step);
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);
  for (let i = 7; i >= 0; i--) {
    counterView.setUint8(i, counter & 0xff);
    counter = counter >> 8;
  }
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const hmacBuffer = await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
  const hmac = new Uint8Array(hmacBuffer);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

/**
 * Converts a Base32 string into a Uint8Array.
 * @param {string} base32 - The secret in Base32 format.
 * @returns {Uint8Array} - The corresponding byte array.
 */
function base32ToUint8Array(base32) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  base32 = base32.replace(/=+$/, "").replace(/\s+/g, "");
  let bits = "";
  for (let i = 0; i < base32.length; i++) {
    const char = base32.charAt(i).toUpperCase();
    const val = base32chars.indexOf(char);
    if (val === -1) {
      console.warn(`Skipping invalid Base32 character: ${char}`);
      continue;
    }
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const byte = bits.substring(i, i + 8);
    bytes.push(parseInt(byte, 2));
  }
  return new Uint8Array(bytes);
}
