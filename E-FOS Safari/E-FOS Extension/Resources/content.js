 (function() {
   // Guard against duplicate injection.
   if (window.autoLoginInitialized) {
     console.log("Auto-login already initialized. Exiting duplicate injection.");
     return;
   }
   window.autoLoginInitialized = true;

   // Use global flags on window so they persist.
   window.neptunLoginAttempted = window.neptunLoginAttempted || false;
   window.totpAttempted = window.totpAttempted || false;
   window.canvasLoginAttempted = window.canvasLoginAttempted || false;
   window.idpLoginAttempted = window.idpLoginAttempted || false;

   // Other global variables
   let otpFilled = false;
   let otpSubmitted = false;
   let pollingActive = true;

   function pollForElement(selector, delayMs, maxAttempts, onFound, onFailure) {
     let attempts = 0;
     let found = false; // local flag: call onFound only once
     function poll() {
       if (!pollingActive || found) return;
       attempts++;
       const el = document.querySelector(selector);
       if (el) {
         found = true;
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
   
   function isAlreadyLoggedIn() {
     return window.location.pathname === "/" || window.location.href.includes("mainpage");
   }
   
   // ----------------- Neptun Login -----------------
   if (window.location.href.includes("Account/Login")) {
     // Check if we've already attempted auto-login this session.
     if (sessionStorage.getItem("neptunAutoLoginAttempted")) {
       console.log("[Content] Neptun auto-login already attempted. Not trying again.");
     } else {
       sessionStorage.setItem("neptunAutoLoginAttempted", "true");
       console.log("[Content] Detected Login page. Attempting auto-fill.");
       (async function autoFillLogin() {
         try {
           const result = await browser.storage.local.get("autoLoginSettings");
           // Check using the new nested structure:
           if (result && result.autoLoginSettings && result.autoLoginSettings.neptun && result.autoLoginSettings.neptun.enabled) {
             const settings = result.autoLoginSettings;
             function fillLogin() {
               if (window.neptunLoginAttempted) {
                 console.log("[Content] Neptun auto-login already attempted (local flag). Skipping further attempts.");
                 return;
               }
               window.neptunLoginAttempted = true;
               const userInput = document.getElementById("LoginName");
               const passInput = document.getElementById("Password");
               if (userInput && passInput) {
                 console.log("[Content] Login fields found. Inserting credentials.");
                 // Use the credentials sub-object:
                 userInput.value = settings.credentials.code;
                 passInput.value = settings.credentials.password;
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
                 console.error("[Content] Login fields not found. Aborting auto-login.");
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
   }
   
   // ----------------- OTP (TOTP) Login -----------------
   if (window.location.href.includes("Account/Login2FA")) {
     if (isAlreadyLoggedIn()) {
       console.log("[Content] Already logged in. Skipping OTP polling.");
       stopPolling();
     } else if (sessionStorage.getItem("totpAutoLoginAttempted")) {
       console.log("[Content] TOTP auto-login already attempted. Not trying again.");
       stopPolling();
     } else {
       sessionStorage.setItem("totpAutoLoginAttempted", "true");
       pollForElement("#TOTPCode", 100, 50, (otpField) => {
         if (!window.totpAttempted) {
           window.totpAttempted = true;  // mark that we have attempted OTP once
           console.log("[Content] OTP field found via polling. Calling fillMFA() once.");
           fillMFA();
           // Let fillMFA() handle stopping polling.
         }
       }, () => {
         console.error("[Content] OTP field (#TOTPCode) not found after polling. Stopping retries.");
         stopPolling();
       });
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
       const settingsResult = await browser.storage.local.get("autoLoginSettings");
       const settings = settingsResult ? settingsResult.autoLoginSettings : null;
       if (!settings || !settings.credentials.otpSecret) {
         console.error("[Content] No OTP secret stored in settings.");
         stopPolling();
         return;
       }
       console.log("[Content] Stored OTP secret (raw):", settings.credentials.otpSecret);
       const normalizedSecret = settings.credentials.otpSecret.trim();
       try {
         const otpCode = await generateTOTP(normalizedSecret);
         console.log("[Content] Generated TOTP code:", otpCode);
         otpField.value = otpCode;
         otpField.dispatchEvent(new Event("input", { bubbles: true }));
         otpFilled = true;
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
   
   // ----------------- Student Web Auto‑Click -----------------
   if (
     window.location.href.startsWith("https://neptun.elte.hu/") &&
     !window.location.href.includes("Account/Login") &&
     sessionStorage.getItem("studentWebClicked") !== "true"
   ) {
     console.log("[Content] Checking storage for Student Web preference...");
     browser.storage.local.get("autoLoginSettings").then((result) => {
       console.log("[Content] Retrieved settings:", result);
       if (
         result &&
         result.autoLoginSettings &&
         result.autoLoginSettings.neptun &&
         result.autoLoginSettings.neptun.studentWeb &&
         result.autoLoginSettings.neptun.enabled
       ) {
         console.log("[Content] Student Web auto‑click enabled.");
         let studentWebClicked = false;
         function clickStudentWebLink() {
           if (studentWebClicked) return true;
           const links = Array.from(document.querySelectorAll("a.nav-link"));
           console.log("[Content] Found nav links:", links.map(link => link.textContent.trim()));
           const targetLink = links.find((link) => {
             const txt = link.textContent.trim();
             return txt === "Hallgatói web" || txt === "Student web";
           });
           if (targetLink) {
             console.log("[Content] Student web link found. Clicking it.");
             targetLink.click();
             studentWebClicked = true;
             sessionStorage.setItem("studentWebClicked", "true");
             return true;
           }
           return false;
         }
         if (!clickStudentWebLink()) {
           console.log("[Content] Student web link not found immediately. Starting MutationObserver...");
           const observer = new MutationObserver((mutations, obs) => {
             if (clickStudentWebLink()) {
               obs.disconnect();
               console.log("[Content] MutationObserver disconnected after clicking Student web link.");
             }
           });
           observer.observe(document.body, { childList: true, subtree: true });
         }
       } else {
         console.log("[Content] Student Web auto‑click is disabled or setting not found.");
       }
     }).catch((error) => {
       console.error("[Content] Error retrieving Student Web setting:", error);
     });
   }
   
   // ----------------- Canvas Auto‑Login -----------------
   if (window.location.host.includes("canvas.elte.hu")) {
     console.log("[Canvas] Canvas page detected.");
     browser.storage.local.get("autoLoginSettings").then(result => {
       const settings = result && result.autoLoginSettings;
       if (settings && settings.canvas && settings.canvas.enabled === true) {
         if (window.canvasLoginAttempted) {
           console.log("[Canvas] Canvas auto-login already attempted. Skipping.");
           return;
         }
         window.canvasLoginAttempted = true;
         console.log("[Canvas] Canvas auto-login enabled. Starting auto-login process for Canvas.");
         pollForElement("a.myButton", 100, 30, () => {
           const allButtons = document.querySelectorAll("a.myButton");
           const targetButton = Array.from(allButtons).find(btn => {
             const text = btn.textContent.trim().toLowerCase();
             return text.includes("neptun hozzáféréssel");
           });
           if (targetButton) {
             console.log("[Canvas] Found Canvas login button. Clicking it.");
             targetButton.click();
             pollForElement("#username_neptun", 100, 30, (usernameField) => {
               usernameField.value = settings.credentials.code || "";
               usernameField.dispatchEvent(new Event("input", { bubbles: true }));
               console.log("[Canvas] Username field filled.");
               pollForElement("#password_neptun", 100, 30, (passwordField) => {
                 passwordField.value = settings.credentials.password || "";
                 passwordField.dispatchEvent(new Event("input", { bubbles: true }));
                 console.log("[Canvas] Password field filled.");
                 pollForElement("input[type='submit'].submit-button", 100, 30, (submitBtn) => {
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
         console.log("[Canvas] Canvas auto-login disabled. Not triggering auto-login.");
       }
     }).catch(err => {
       console.error("[Canvas] Error retrieving settings:", err);
     });
   }
   
   // ----------------- IdP Auto‑Fill for Canvas (Neptun) Login -----------------
   if (
     window.location.href.includes("authpage.php") &&
     window.location.href.includes("LoginType=neptun")
   ) {
     console.log("[Content] Detected IdP login page for Canvas auto-fill.");
     (async function autoFillIdPLogin() {
       try {
         const result = await browser.storage.local.get("autoLoginSettings");
         const settings = result && result.autoLoginSettings;
         if (settings && settings.canvas && settings.canvas.enabled === true) {
           if (window.idpLoginAttempted) {
             console.log("[Content] IdP auto-login already attempted. Skipping further attempts.");
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
               pollForElement('button[type="submit"], input[type="submit"]', 100, 20, (loginBtn) => {
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
           console.log("[Content] Canvas auto-login not enabled or settings not found.");
         }
       } catch (e) {
         console.error("[Content] Error in auto‑fill IdP login:", e);
       }
     })();
   }
   
   /**
    * Generates a TOTP code using the Web Crypto API.
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
   
 })();
