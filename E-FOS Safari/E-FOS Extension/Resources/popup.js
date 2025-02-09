document.addEventListener("DOMContentLoaded", () => {
  console.log("[Popup] popup.js loaded");

  // --- UI Helpers ---
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

  // --- Dark Mode Detection ---
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkModeQuery.matches) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateGearImage(isSettingsVisible());
  
  // Dark Mode for OTP Show/Hide Eye Icon
  const isDark = document.body.classList.contains("dark-mode");
  const otpToggleIcon = document.getElementById("toggleOtpSecret").querySelector("img");
  otpToggleIcon.src = isDark ? "images/hidden_dark.png" : "images/hidden_light.png";

  // --- URL Configuration ---
  const urls = {
    neptun: "https://neptun.elte.hu",
    canvas: "https://canvas.elte.hu",
    tms: "https://tms.inf.elte.hu"
  };

  function openNewTab(url) {
    browser.tabs.create({ url });
  }

  // Prevent clicks on toggle containers from propagating to parent buttons.
  document.querySelectorAll(".toggle-container").forEach(tc => {
    tc.addEventListener("click", e => e.stopPropagation());
  });

  // --- Settings Storage Functions ---
  function loadSettings() {
    browser.storage.local.get("autoLoginSettings").then(result => {
      // Provide defaults if no settings saved.
      let settings = {
        neptun: { enabled: false, studentWeb: false },
        canvas: { enabled: false },
        tms: { enabled: false },
        credentials: { code: "", password: "", otpSecret: "" }
      };
      if (result && result.autoLoginSettings) {
        settings = result.autoLoginSettings;
      }
      // Update toggles.
      document.getElementById("neptunToggle").checked = settings.neptun.enabled;
      document.getElementById("canvasToggle").checked = settings.canvas.enabled;
      document.getElementById("tmsToggle").checked = settings.tms.enabled;
      document.getElementById("directStudentWebToggle").checked = settings.neptun.studentWeb;
      // Update credential fields.
      document.getElementById("neptunCode").value = settings.credentials.code || "";
      document.getElementById("neptunPassword").value = settings.credentials.password || "";
      document.getElementById("otpSecret").value = settings.credentials.otpSecret || "";
      // NEW: Update auto-login label based on toggle states.
      updateAutoLoginLabel();
    }).catch(err => console.error("[Popup] loadSettings error:", err));
  }

  function saveSettings(silent = false, callback) {
    // Build new settings object.
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
        otpSecret: document.getElementById("otpSecret").value
      }
    };
    browser.storage.local.set({ autoLoginSettings: settings }).then(() => {
      console.log("[Popup] Settings saved:", settings);
      if (!silent) openSavedModal();
      if (callback) callback();
      // NEW: Update auto-login label on save.
      updateAutoLoginLabel();
    }).catch(err => console.error("[Popup] saveSettings error:", err));
  }

  // Auto-save toggles silently.
  document.getElementById("neptunToggle").addEventListener("change", () => { saveSettings(true); });
  document.getElementById("canvasToggle").addEventListener("change", () => { saveSettings(true); });
  document.getElementById("tmsToggle").addEventListener("change", () => { saveSettings(true); });
  document.getElementById("directStudentWebToggle").addEventListener("change", () => { saveSettings(true); });
  
  // --- NEW: Auto-Login Label Update Function ---
  function updateAutoLoginLabel() {
    // Check if any of the main toggles (Neptun, Canvas, TMS) are on.
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
  
  // Attach updateAutoLoginLabel to toggle changes.
  document.getElementById("neptunToggle").addEventListener("change", updateAutoLoginLabel);
  document.getElementById("canvasToggle").addEventListener("change", updateAutoLoginLabel);
  document.getElementById("tmsToggle").addEventListener("change", updateAutoLoginLabel);

  // --- Saved Modal Functions ---
  function closeSavedModal() {
    const savedModal = document.getElementById("savedModal");
    savedModal.classList.remove("show");
    savedModal.classList.add("closing");
    setTimeout(() => {
      savedModal.style.display = "none";
      savedModal.classList.remove("closing");
    }, 300);
  }
  function openSavedModal() {
    const savedModal = document.getElementById("savedModal");
    savedModal.style.display = "block";
    setTimeout(() => savedModal.classList.add("show"), 10);
    const autoCloseTimer = setTimeout(() => closeSavedModal(), 1500);
    savedModal.onclick = () => { clearTimeout(autoCloseTimer); closeSavedModal(); };
  }

  // --- Settings Toggle (Gear/Back Button) ---
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
  
  // --- OTP Secret Eye Toggle ---
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

  // --- Save Settings Button in Settings View ---
  document.getElementById("saveSettingsButton").addEventListener("click", (e) => {
    e.preventDefault();
    saveSettings();
  });

  // --- Main View Button Handlers ---
  document.getElementById("neptunButton").addEventListener("click", (e) => {
    if (e.target.closest(".toggle-container")) return;
    browser.storage.local.get("autoLoginSettings").then(result => {
      const settings = (result && result.autoLoginSettings) || {};
      if (settings.neptun && settings.neptun.enabled) {
        console.log("[Popup] Neptun auto‑login enabled. Sending message to background.");
        // Send only the credentials.
        browser.runtime.sendMessage({ action: "openNeptunLogin", settings: settings.credentials });
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
      console.log("[Popup] Canvas settings:", settings);
      if (settings.canvas && settings.canvas.enabled === true) {
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

  // --- Focus Mode Buttons (TMS Focus Mode Row) ---
  document.getElementById("activateFocusButton").addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("[Popup] Activate Focus Mode clicked.");
    browser.runtime.sendMessage({ action: "activateFocusMode" });
    alert("Focus Mode Activated");
  });
  document.getElementById("infoFocusButton").addEventListener("click", (e) => {
    e.stopPropagation();
    openModal();
  });

  // --- Modal Functionality (for TMS Focus Mode Info) ---
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

  // --- Energy Surge Animation on Main Toggle Buttons ---
  document.querySelectorAll('.main-toggle').forEach((input) => {
    input.addEventListener('change', function () {
      const menuButton = this.closest('.menu-button');
      if (this.checked && menuButton) {
        menuButton.classList.add('energy-surge');
        setTimeout(() => {
          menuButton.classList.remove('energy-surge');
        }, 1000);
      }
    });
  });

  // --- Initial Load ---
  loadSettings();
});
