console.log("Content script loaded on: " + window.location.href);

/**
 * pollForElement(selector, delayMs, maxAttempts, onFound, onFailure)
 * Repeatedly checks for an element matching the selector.
 */
function pollForElement(selector, delayMs, maxAttempts, onFound, onFailure) {
  let attempts = 0;
  function poll() {
    // For MFA, if already submitted, cancel further polling.
    if (typeof mfaFilled !== "undefined" && mfaFilled) return;
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

/* ---------- Stage 1: Initial Login Page ---------- */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillCredentials") {
    console.log("Received 'fillCredentials' message for initial login.");
    function fillLogin() {
      const userInput = document.getElementById("LoginName");
      const passInput = document.getElementById("Password");
      if (userInput && passInput) {
        console.log("Login fields found. Inserting credentials.");
        userInput.value = request.code;
        passInput.value = request.password;
        userInput.dispatchEvent(new Event("input", { bubbles: true }));
        passInput.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("Credentials filled. Polling for login button...");
        // Use a combined selector in case the button is either an input or a button.
        pollForElement(
          'button[type="submit"].btn.btn-primary, input[type="submit"].btn.btn-primary',
          100,
          20,
          (loginBtn) => {
            console.log("Login button found. Clicking it.");
            loginBtn.click();
            sendResponse({ success: true });
          },
          () => {
            console.error("Login button not found after polling.");
            sendResponse({ success: false });
          }
        );
      } else {
        console.log("Login fields not found. Retrying in 100ms...");
        setTimeout(fillLogin, 100);
      }
    }
    fillLogin();
    return true;
  }
});

/* ============================================================
   Stage 2: MFA/TOTP Page – Helper Functions
   ============================================================ */

/**
 * Converts a Base32 string into a Uint8Array.
 * Uses the standard Base32 alphabet "A–Z234567".
 */
function base32ToUint8Array(base32) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  // Remove any padding (=) and whitespace.
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
  // Process the bit string in 8-bit chunks.
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const byte = bits.substring(i, i + 8);
    bytes.push(parseInt(byte, 2));
  }
  return new Uint8Array(bytes);
}

/**
 * Generates a TOTP code (as a string) using the Web Crypto API.
 * @param {string} base32Secret - The secret key in Base32 format.
 * @param {number} [step=30] - The time step in seconds (default is 30).
 * @param {number} [digits=6] - The number of digits in the OTP (default is 6).
 * @returns {Promise<string>} - A promise that resolves to the TOTP code.
 */
async function generateTOTP(base32Secret, step = 30, digits = 6) {
  // Convert the Base32 secret to a byte array.
  const keyData = base32ToUint8Array(base32Secret);
  
  // Calculate the current time counter (an 8-byte big-endian integer).
  let epoch = Math.floor(Date.now() / 1000);
  let counter = Math.floor(epoch / step);
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);
  for (let i = 7; i >= 0; i--) {
    counterView.setUint8(i, counter & 0xff);
    counter = counter >> 8;
  }
  
  // Import the key for HMAC-SHA1.
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  
  // Generate the HMAC signature.
  const hmacBuffer = await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
  const hmac = new Uint8Array(hmacBuffer);
  
  // Perform dynamic truncation per RFC 6238.
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  
  // Compute the OTP.
  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

/* ============================================================
   Stage 3: MFA/TOTP Field Handling
   ============================================================ */

// Flag to ensure the MFA submission happens only once.
let otpSubmitted = false;

/**
 * fillMFA - Looks for the OTP input field, generates a TOTP code, fills it,
 * and then polls for the MFA submit button to click it.
 */
async function fillMFA() {
  if (otpSubmitted) return; // Prevent multiple submissions

  const otpField = document.getElementById("TOTPCode");
  if (otpField) {
    console.log("Detected OTP field (id='TOTPCode').");

    // Retrieve settings from storage.
    let settingsResult;
    try {
      settingsResult = await browser.storage.local.get("neptunAutoLoginSettings");
    } catch (err) {
      console.error("Error retrieving settings from storage:", err);
      return;
    }
    const settings = settingsResult ? settingsResult.neptunAutoLoginSettings : null;
    
    if (settings && settings.otpSecret) {
      console.log("Stored OTP secret (raw):", settings.otpSecret);
      // Normalize the secret (trim spaces). Add any padding if required.
      const normalizedSecret = settings.otpSecret.trim();
      console.log("Normalized OTP secret:", normalizedSecret);
      try {
        const otpCode = await generateTOTP(normalizedSecret);
        console.log("Generated TOTP code:", otpCode);
        otpField.value = otpCode;
        otpField.dispatchEvent(new Event("input", { bubbles: true }));
        
        // Poll for the MFA submit button once.
        pollForElement(
          'button[type="submit"].btn.btn-primary, input[type="submit"].btn.btn-primary',
          100,
          50,
          (submitBtn) => {
            console.log("MFA submit button found. Clicking it.");
            submitBtn.click();
            otpSubmitted = true;
          },
          () => {
            console.error("MFA submit button not found after polling.");
          }
        );
      } catch (e) {
        console.error("Error generating TOTP:", e);
      }
    } else {
      console.error("No OTP secret stored in settings.");
    }
  } else {
    setTimeout(fillMFA, 100);
  }
}

/* ============================================================
   Stage 4: Start Polling for the OTP Field on the MFA/TOTP Page
   ============================================================ */
pollForElement(
  "#TOTPCode",
  100,
  50,
  (otpField) => {
    console.log("OTP field found via polling.");
    fillMFA();
  },
  () => {
    console.error("OTP field (#TOTPCode) not found after polling.");
  }
);
