document.addEventListener("DOMContentLoaded", () => {
  console.log("[Popup] popup.js loaded");

  // For cross-browser compatibility.
  if (typeof browser === "undefined") {
    var browser = chrome;
  }

  // Translation Data
  const translations = {
    en: {
      title: "EFOS",
      subtitle: "ELTE Friendly Open-Source Support",
      autoLogin: "Auto Log In",
      settingsTitle: "Settings",
      neptunLabel: "Neptun",
      canvasLabel: "Canvas",
      tmsLabel: "TMS",
      focusModeLabel: "TMS Focus Mode",
      activateFocus: "Activate",
      infoFocus: "ⓘ",
      neptunCodeLabel: "Neptun Code:",
      passwordLabel: "Password:",
      tmsPasswordLabel: "TMS Password:",
      otpSecretLabel: "OTP Secret:",
      languageSelectorTitle: "Select Your Language",
      otpPlaceholder: "Enter OTP secret",
      neptunPlaceholder: "Enter Neptun code",
      passwordPlaceholder: "Enter password",
      goDirectLabel: "Go Direct to Student web",
      activateButtonText: "Activate",
      infoModalContent: "First, open TMS in your browser, then open your task, and finally click Activate. To undo the effect, refresh the page."
    },
    hu: {
      title: "EFOS",
      subtitle: "ELTE Felhasználóbarát Open-Source Segéd",
      autoLogin: "Auto Log In",
      settingsTitle: "Beállítások",
      neptunLabel: "Neptun",
      canvasLabel: "Canvas",
      tmsLabel: "TMS",
      focusModeLabel: "TMS Fókusz Mód",
      activateFocus: "Aktiválás",
      infoFocus: "ⓘ",
      neptunCodeLabel: "Neptun Kód:",
      passwordLabel: "Jelszó:",
      tmsPasswordLabel: "TMS Jelszó:",
      otpSecretLabel: "OTP Titok:",
      languageSelectorTitle: "Válaszd ki a nyelvet",
      otpPlaceholder: "Írd be az OTP titkot",
      neptunPlaceholder: "Írd be a Neptun kódot",
      passwordPlaceholder: "Írd be a jelszót",
      goDirectLabel: "Ugrás a Hallgatói webre",
      activateButtonText: "Aktiválás",
      infoModalContent: "Először nyisd meg a TMS-t a böngésződben, majd a feladatodat, végül kattints az Aktiválásra. A hatás visszavonásához frissítsd az oldalt."
    }
  };

  // Function to Apply Translations
  function applyTranslations(lang) {
    const texts = translations[lang] || translations.en;

    // Main View
    const mainH1 = document.querySelector("#mainView h1");
    if (mainH1) mainH1.innerText = texts.title;

    const subtitle = document.querySelector("#mainView .subtitle");
    if (subtitle) subtitle.innerText = texts.subtitle;

    const autoLoginLabel = document.querySelector("#mainView .auto-login-label");
    if (autoLoginLabel) autoLoginLabel.innerText = texts.autoLogin;

    // Menu Buttons
    const neptunSpan = document.querySelector("#neptunButton .button-text");
    if (neptunSpan) neptunSpan.innerText = texts.neptunLabel;

    const canvasSpan = document.querySelector("#canvasButton .button-text");
    if (canvasSpan) canvasSpan.innerText = texts.canvasLabel;

    const tmsSpan = document.querySelector("#tmsButton .button-text");
    if (tmsSpan) tmsSpan.innerText = texts.tmsLabel;

    const focusSpan = document.querySelector("#tmsFocusRow .button-text");
    if (focusSpan) focusSpan.innerText = texts.focusModeLabel;

    // Settings View
    const settingsTitle = document.querySelector("#settingsView h2");
    if (settingsTitle) settingsTitle.innerText = texts.settingsTitle;

    const neptunCodeLabel = document.querySelector("#settingsView label[for='neptunCode']");
    if (neptunCodeLabel) neptunCodeLabel.innerText = texts.neptunCodeLabel;

    const neptunPasswordLabel = document.querySelector("#settingsView label[for='neptunPassword']");
    if (neptunPasswordLabel) neptunPasswordLabel.innerText = texts.passwordLabel;

    const tmsPasswordLabel = document.querySelector("#settingsView label[for='TMSPassword']");
    if (tmsPasswordLabel) tmsPasswordLabel.innerText = texts.tmsPasswordLabel;

    const otpSecretLabel = document.querySelector("#settingsView label[for='otpSecret']");
    if (otpSecretLabel) otpSecretLabel.innerText = texts.otpSecretLabel;

    // Update Placeholders for Input Fields
    const neptunInput = document.getElementById("neptunCode");
    if (neptunInput) neptunInput.placeholder = texts.neptunPlaceholder;

    const neptunPasswordInput = document.getElementById("neptunPassword");
    if (neptunPasswordInput) neptunPasswordInput.placeholder = texts.passwordPlaceholder;

    const tmsPasswordInput = document.getElementById("TMSPassword");
    if (tmsPasswordInput) tmsPasswordInput.placeholder = texts.passwordPlaceholder;

    const otpInput = document.getElementById("otpSecret");
    if (otpInput) otpInput.placeholder = texts.otpPlaceholder;

    // Update "Go Direct to Student web" Label
    const goDirectLabel = document.querySelector("#settingsView .setting-label");
    if (goDirectLabel) goDirectLabel.innerText = texts.goDirectLabel;

    // Update Activate Button Text
    const activateButton = document.getElementById("activateFocusButton");
    if (activateButton) activateButton.innerText = texts.activateButtonText;

    // Language Selector Title (in initial view)
    const langTitle = document.querySelector("#languageSelectorView h1");
    if (langTitle) langTitle.innerText = texts.languageSelectorTitle;

    // Info Modal Content
    const modalContent = document.querySelector("#infoModal .guide-text");
    if (modalContent) modalContent.innerText = texts.infoModalContent;
  }

  // Global Language Selector (if language not set yet)
  browser.storage.local.get("language").then(result => {
    if (!result.language) {
      // Show language selector and hide other views if language is not set.
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

      // Attach event listeners for language buttons in the global selector.
      document.querySelectorAll("#languageSelectorView .lang-btn").forEach(button => {
        button.addEventListener("click", (e) => {
          const selectedLang = e.currentTarget.getAttribute("data-lang");
          browser.storage.local.set({ language: selectedLang }).then(() => {
            // Hide global language selector and show main view.
            languageSelectorView.classList.remove("visible");
            languageSelectorView.classList.add("hidden");
            mainView.classList.remove("hidden");
            mainView.classList.add("visible");

            // Apply translations based on the selected language.
            applyTranslations(selectedLang);
          });
        });
      });
    } else {
      // Apply translations if language is already set.
      applyTranslations(result.language);
    }
  });

  // Settings Language Selector (in settings view)
  // This will allow changing language from within settings without switching views.
  const settingsLangSelector = document.getElementById("settingsLanguageSelector");
  if (settingsLangSelector) {
    settingsLangSelector.querySelectorAll(".lang-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const selectedLang = e.currentTarget.getAttribute("data-lang");
        browser.storage.local.set({ language: selectedLang }).then(() => {
          // Apply translations based on the selected language.
          applyTranslations(selectedLang);
        });
      });
    });
  }

  // UI Helpers
  function isSettingsVisible() {
    return document.getElementById("settingsView").classList.contains("visible");
  }

  function updateGearImage(isSettings) {
    const gearImg = document.getElementById("settingsButton").querySelector("img");
    const isDark = document.body.classList.contains("dark-mode");
    gearImg.src = isSettings
        ? (isDark ? "images/back_dark.png" : "images/back_light.png")
        : (isDark ? "images/gear_dark.png" : "images/gear_light.png");
  }

  // Dark Mode
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkModeQuery.matches) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateGearImage(isSettingsVisible());

  // Update OTP show/hide icon for dark mode.
  const isDark = document.body.classList.contains("dark-mode");
  const otpToggleIcon = document.getElementById("toggleOtpSecret").querySelector("img");
  otpToggleIcon.src = isDark ? "images/hidden_dark.png" : "images/hidden_light.png";

  // URL Configuration
  const urls = {
    neptun: "https://neptun.elte.hu",
    canvas: "https://canvas.elte.hu",
    tms: "https://tms.inf.elte.hu"
  };

  function openNewTab(url) {
    browser.tabs.create({ url });
  }

  // Prevent clicks on toggle containers from propagating.
  document.querySelectorAll(".toggle-container").forEach(tc => {
    tc.addEventListener("click", e => e.stopPropagation());
  });

  // Settings Storage Functions
  function loadSettings() {
    browser.storage.local.get("autoLoginSettings").then(result => {
      let settings = {
        neptun: { enabled: false, studentWeb: false },
        canvas: { enabled: false },
        tms: { enabled: false },
        credentials: { code: "", password: "", tmspassword: "", otpSecret: "" }
      };
      if (result && result.autoLoginSettings) {
        settings = result.autoLoginSettings;
      }
      // Update toggle states.
      document.getElementById("neptunToggle").checked = settings.neptun.enabled;
      document.getElementById("canvasToggle").checked = settings.canvas.enabled;
      document.getElementById("tmsToggle").checked = settings.tms.enabled;
      document.getElementById("directStudentWebToggle").checked = settings.neptun.studentWeb;
      // Update credential fields.
      document.getElementById("neptunCode").value = settings.credentials.code || "";
      document.getElementById("neptunPassword").value = settings.credentials.password || "";
      document.getElementById("TMSPassword").value = settings.credentials.tmspassword || "";
      document.getElementById("otpSecret").value = settings.credentials.otpSecret || "";
      updateAutoLoginLabel();
    }).catch(err => console.error("[Popup] loadSettings error:", err));
  }

  function saveSettings(silent = false, callback) {
    const settings = {
      neptun: {
        enabled: document.getElementById("neptunToggle").checked,
        studentWeb: document.getElementById("directStudentWebToggle").checked
      },
      canvas: {
        enabled: document.getElementById("canvasToggle").checked
      },
      tms: {
        enabled: document.getElementById("tmsToggle").checked
      },
      credentials: {
        code: document.getElementById("neptunCode").value,
        password: document.getElementById("neptunPassword").value,
        tmspassword: document.getElementById("TMSPassword").value,
        otpSecret: document.getElementById("otpSecret").value
      }
    };

    browser.storage.local.set({ autoLoginSettings: settings }).then(() => {
      console.log("[Popup] Settings saved:", settings);
      if (callback) callback();
      updateAutoLoginLabel();
    }).catch(err => console.error("[Popup] saveSettings error:", err));
  }

  // Auto-save toggles when changed.
  document.getElementById("neptunToggle").addEventListener("change", () => saveSettings(true));
  document.getElementById("canvasToggle").addEventListener("change", () => saveSettings(true));
  document.getElementById("tmsToggle").addEventListener("change", () => saveSettings(true));
  document.getElementById("directStudentWebToggle").addEventListener("change", () => saveSettings(true));

  // Auto-Login Label Update
  function updateAutoLoginLabel() {
    const neptunChecked = document.getElementById("neptunToggle").checked;
    const canvasChecked = document.getElementById("canvasToggle").checked;
    const tmsChecked = document.getElementById("tmsToggle").checked;
    const label = document.querySelector(".auto-login-label");
    if (neptunChecked || canvasChecked || tmsChecked) {
      label.classList.add("active");
    } else {
      label.classList.remove("active");
    }
  }
  document.getElementById("neptunToggle").addEventListener("change", updateAutoLoginLabel);
  document.getElementById("canvasToggle").addEventListener("change", updateAutoLoginLabel);
  document.getElementById("tmsToggle").addEventListener("change", updateAutoLoginLabel);

  // Settings Toggle (Gear/Back Button)
  document.getElementById("settingsButton").addEventListener("click", (e) => {
    e.preventDefault();
    const mainView = document.getElementById("mainView");
    const settingsView = document.getElementById("settingsView");
    if (settingsView.classList.contains("visible")) {
      settingsView.classList.remove("visible");
      settingsView.classList.add("hidden");
      mainView.classList.remove("hidden");
      mainView.classList.add("visible");
      updateGearImage(false);
      saveSettings(true);
    } else {
      mainView.classList.remove("visible");
      mainView.classList.add("hidden");
      settingsView.classList.remove("hidden");
      settingsView.classList.add("visible");
      loadSettings();
      updateGearImage(true);
    }
  });

  // OTP Secret Eye Toggle
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
  document.getElementById("otpSecret").addEventListener("blur", () => saveSettings(true));

  // Main View Button Handlers
  document.getElementById("neptunButton").addEventListener("click", (e) => {
    if (e.target.closest(".toggle-container")) return;
    browser.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.neptun && settings.neptun.enabled) {
        console.log("[Popup] Neptun auto‑login enabled. Sending message to background.");
        browser.runtime.sendMessage({ action: "openNeptunLogin", settings: settings });
      } else {
        console.log("[Popup] Neptun auto‑login disabled. Opening default homepage.");
        openNewTab(urls.neptun);
      }
    });
  });

  document.getElementById("canvasButton").addEventListener("click", (e) => {
    if (e.target.closest(".toggle-container")) return;
    browser.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.canvas && settings.canvas.enabled) {
        console.log("[Popup] Canvas auto‑login enabled. Sending message to background.");
        browser.runtime.sendMessage({ action: "openNeptunLogin", settings: settings.credentials, site: "canvas" });
      } else {
        console.log("[Popup] Canvas auto‑login disabled. Opening Canvas homepage.");
        openNewTab(urls.canvas);
      }
    });
  });

  document.getElementById("tmsButton").addEventListener("click", (e) => {
    if (e.target.closest(".toggle-container")) return;
    browser.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.tms && settings.tms.enabled) {
        console.log("[Popup] TMS auto‑login enabled. Sending message to background.");
        browser.runtime.sendMessage({ action: "openTMSLogin", settings: settings.credentials });
      } else {
        openNewTab(urls.tms);
      }
    });
  });

  // Focus Mode Buttons
  document.getElementById("activateFocusButton").addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("[Popup] Activate Focus Mode clicked.");
    browser.runtime.sendMessage({ action: "activateFocusMode" });
  });

  document.getElementById("infoFocusButton").addEventListener("click", (e) => {
    e.stopPropagation();
    openModal();
  });

  // Modal Functionality
  const modalEl = document.getElementById("infoModal");
  const closeModalBtn = document.getElementById("closeModal");

  function openModal() {
    modalEl.style.display = "block";
    setTimeout(() => modalEl.classList.add("show"), 10);
  }

  function closeModal() {
    modalEl.classList.remove("show");
    modalEl.classList.add("closing");
    setTimeout(() => {
      modalEl.style.display = "none";
      modalEl.classList.remove("closing");
    }, 300);
  }

  closeModalBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });
  window.addEventListener("click", (event) => {
    if (event.target === modalEl) closeModal();
  });

  // Energy Surge Animation
  document.querySelectorAll('.main-toggle').forEach((input) => {
    input.addEventListener('change', function () {
      const menuButton = this.closest('.menu-button');
      if (this.checked && menuButton) {
        menuButton.classList.add('energy-surge');
        setTimeout(() => menuButton.classList.remove('energy-surge'), 1000);
      }
    });
  });

  // Save Settings on Visibility Change
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      saveSettings(true);
    }
  });

  // Initial Load of Settings
  loadSettings();
});