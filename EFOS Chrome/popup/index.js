import TranslationManager from "./TranslationManager.js";
import SettingsManager from "./SettingsManager.js";
import ModalManager from "./ModalManager.js";
import UIManager from "./UIManager.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("[Popup] index.js loaded");

  // Cross-browser compatibility.
  const browserAPI = (typeof browser === "undefined") ? chrome : browser;

  // Instantiate managers.
  const translationManager = new TranslationManager();
  const settingsManager = new SettingsManager(browserAPI.storage.local);
  const modalManager = new ModalManager(document.getElementById("infoModal"));
  const uiManager = new UIManager(browserAPI);

  // Language handling.
  const languageResult = await browserAPI.storage.local.get("language");
  if (!languageResult.language) {
    // Show language selector view and hide others.
    const languageSelectorView = document.getElementById("languageSelectorView");
    const mainView = document.getElementById("mainView");
    const settingsView = document.getElementById("settingsView");

    if (languageSelectorView) {
      languageSelectorView.classList.remove("hidden");
      languageSelectorView.classList.add("visible");
    }
    if (mainView) {
      mainView.classList.remove("visible");
      mainView.classList.add("hidden");
    }
    if (settingsView) {
      settingsView.classList.remove("visible");
      settingsView.classList.add("hidden");
    }

    // Bind language buttons.
    document.querySelectorAll("#languageSelectorView .lang-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const selectedLang = e.currentTarget.getAttribute("data-lang");
        await browserAPI.storage.local.set({ language: selectedLang });
        languageSelectorView.classList.remove("visible");
        languageSelectorView.classList.add("hidden");
        mainView.classList.remove("hidden");
        mainView.classList.add("visible");
        translationManager.apply(selectedLang);
      });
    });
  } else {
    translationManager.apply(languageResult.language);
  }

  // Settings language selector in settings view.
  const settingsLangSelector = document.getElementById("settingsLanguageSelector");
  if (settingsLangSelector) {
    settingsLangSelector.querySelectorAll(".lang-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const selectedLang = e.currentTarget.getAttribute("data-lang");
        await browserAPI.storage.local.set({ language: selectedLang });
        translationManager.apply(selectedLang);
      });
    });
  }

  // Load and apply settings.
  const settings = await settingsManager.loadSettings();
  uiManager.applySettingsToUI(settings);

  // Event listeners for auto-save toggles.
  document.getElementById("neptunToggle").addEventListener("change", () => {
    uiManager.updateAutoLoginLabel();
    const newSettings = uiManager.collectSettingsFromUI();
    settingsManager.saveSettings(newSettings);
  });
  document.getElementById("canvasToggle").addEventListener("change", () => {
    uiManager.updateAutoLoginLabel();
    const newSettings = uiManager.collectSettingsFromUI();
    settingsManager.saveSettings(newSettings);
  });
  document.getElementById("tmsToggle").addEventListener("change", () => {
    uiManager.updateAutoLoginLabel();
    const newSettings = uiManager.collectSettingsFromUI();
    settingsManager.saveSettings(newSettings);
  });
  document.getElementById("directStudentWebToggle").addEventListener("change", () => {
    const newSettings = uiManager.collectSettingsFromUI();
    settingsManager.saveSettings(newSettings);
  });

  // Save settings on OTP blur.
  document.getElementById("otpSecret").addEventListener("blur", () => {
    const newSettings = uiManager.collectSettingsFromUI();
    settingsManager.saveSettings(newSettings);
  });

  // Settings toggle (Gear/Back Button)
  document.getElementById("settingsButton").addEventListener("click", (e) => {
    e.preventDefault();
    const mainView = document.getElementById("mainView");
    const settingsView = document.getElementById("settingsView");
    if (settingsView.classList.contains("visible")) {
      // Return to main view.
      settingsView.classList.remove("visible");
      settingsView.classList.add("hidden");
      mainView.classList.remove("hidden");
      mainView.classList.add("visible");
      uiManager.updateGearImage(false);
      const newSettings = uiManager.collectSettingsFromUI();
      settingsManager.saveSettings(newSettings);
    } else {
      // Open settings view.
      mainView.classList.remove("visible");
      mainView.classList.add("hidden");
      settingsView.classList.remove("hidden");
      settingsView.classList.add("visible");
      settingsManager.loadSettings().then(storedSettings => {
        uiManager.applySettingsToUI(storedSettings);
      });
      uiManager.updateGearImage(true);
    }
  });

  // OTP Secret Eye Toggle.
  document.getElementById("toggleOtpSecret").addEventListener("click", function () {
    const otpInput = document.getElementById("otpSecret");
    const isDark = document.body.classList.contains("dark-mode");
    if (otpInput.type === "password") {
      otpInput.type = "text";
      this.querySelector("img").src = isDark ? "images/eye_dark.png" : "images/eye_light.png";
    } else {
      otpInput.type = "password";
      this.querySelector("img").src = isDark ? "images/hidden_dark.png" : "images/hidden_light.png";
    }
  });

  // Main View Button Handlers.
  document.getElementById("neptunButton").addEventListener("click", () => {
    browserAPI.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.neptun && settings.neptun.enabled) {
        console.log("[Popup] Neptun auto‑login enabled. Sending message to background.");
        browserAPI.runtime.sendMessage({ action: "openNeptunLogin", settings: settings });
      } else {
        console.log("[Popup] Neptun auto‑login disabled. Opening default homepage.");
        uiManager.openNewTab("https://neptun.elte.hu");
      }
    });
  });

  document.getElementById("canvasButton").addEventListener("click", () => {
    browserAPI.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.canvas && settings.canvas.enabled) {
        console.log("[Popup] Canvas auto‑login enabled. Sending message to background.");
        browserAPI.runtime.sendMessage({ action: "openNeptunLogin", settings: settings.credentials, site: "canvas" });
      } else {
        console.log("[Popup] Canvas auto‑login disabled. Opening Canvas homepage.");
        uiManager.openNewTab("https://canvas.elte.hu");
      }
    });
  });

  document.getElementById("tmsButton").addEventListener("click", () => {
    browserAPI.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.tms && settings.tms.enabled) {
        console.log("[Popup] TMS auto‑login enabled. Sending message to background.");
        browserAPI.runtime.sendMessage({ action: "openTMSLogin", settings: settings.credentials });
      } else {
        uiManager.openNewTab("https://tms.inf.elte.hu");
      }
    });
  });

  // Focus Mode Buttons.
  document.getElementById("activateFocusButton").addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("[Popup] Activate Focus Mode clicked.");
    browserAPI.runtime.sendMessage({ action: "activateFocusMode" });
  });
  document.getElementById("infoFocusButton").addEventListener("click", (e) => {
    e.stopPropagation();
    modalManager.open();
  });

  // Prevent clicks on toggle containers from propagating.
  document.querySelectorAll(".toggle-container").forEach(tc => {
    tc.addEventListener("click", e => e.stopPropagation());
  });

  // Save settings on visibility change.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      const newSettings = uiManager.collectSettingsFromUI();
      settingsManager.saveSettings(newSettings);
    }
  });
});
