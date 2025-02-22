import AutoLoginManager from "./AutoLoginManager.js";
import NeptunLogin from "./NeptunLogin.js";
import CanvasLogin from "./CanvasLogin.js";
import TMSLogin from "./TMSLogin.js";
import IdPLogin from "./IdPLogin.js";
import Utils from "./Utils.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[Content] index.js loaded");

  const browserAPI = (typeof browser === "undefined") ? chrome : browser;

  // Initialize auto-login: set flags and guard duplicate injections.
  const autoLoginManager = new AutoLoginManager();
  if (!autoLoginManager.isAutoLoginEnabled()) {
    return;
  }
  try {
    autoLoginManager.guardDuplicateInjection();
  } catch (e) {
    // Duplicate injection detected; abort.
    return;
  }

  const hostname = window.location.hostname;
  const href = window.location.href;

  // Handle Neptun Login (without 2FA)
  if (
      hostname === "neptun.elte.hu" &&
      href.includes("Account/Login") &&
      !href.includes("Account/Login2FA")
  ) {
    NeptunLogin.handleLogin(browserAPI);
    return;
  }

  // Handle Neptun OTP (2FA) Login
  if (hostname === "neptun.elte.hu" && href.includes("Account/Login2FA")) {
    NeptunLogin.handleOTP(browserAPI);
    return;
  }

  // Handle TMS Auto‑Login
  if (href.includes("tms.inf.elte.hu")) {
    TMSLogin.handleLogin(browserAPI);
    return;
  }

  // Handle Canvas Auto‑Login (requires "fromExt" flag)
  if (hostname === "canvas.elte.hu" && window.location.search.includes("fromExt=1")) {
    CanvasLogin.handleLogin(browserAPI);
    return;
  }

  // Handle IdP Auto‑Fill for Canvas Login
  if (
      hostname.includes("idp.elte.hu") &&
      href.includes("authpage.php") &&
      href.includes("LoginType=neptun")
  ) {
    IdPLogin.handleLogin(browserAPI);
    return;
  }

  // If on Neptun but not a login page, trigger Student Web auto‑click if needed.
  if (hostname === "neptun.elte.hu" && !href.includes("Account/Login")) {
    if (Utils.isAlreadyLoggedIn() === true) {
      Utils.triggerStudentWebAutoClick();
    }
  }
});
