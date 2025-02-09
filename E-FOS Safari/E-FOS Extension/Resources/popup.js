document.addEventListener("DOMContentLoaded", () => {
  console.log("[Popup] popup.js loaded");

  // --- UI Helpers ---
  function isSettingsVisible() {
    return document.getElementById("settingsView").classList.contains("visible");
  }
  function updateGearImage(isSettings) {
    const gearImg = document.getElementById("settingsButton").querySelector("img");
    const isDark = document.body.classList.contains("dark-mode");
    // Use the back icon when settings are visible; otherwise, use the gear icon.
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
  otpToggleIcon.src = isDark ? "images/eye_dark.png" : "images/eye_light.png";

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
    browser.storage.local.get("neptunAutoLoginSettings").then(result => {
      let settings = {};
      if (result && result.neptunAutoLoginSettings) {
        settings = result.neptunAutoLoginSettings;
      }
      // Update main view toggles (default false if not set)
      document.getElementById("neptunToggle").checked = !!settings.enabled;
      document.getElementById("canvasToggle").checked = !!settings.canvasEnabled;
      document.getElementById("tmsToggle").checked = !!settings.tmsEnabled;
      // Update settings view toggle (Direct Student Web)
      document.getElementById("directStudentWebToggle").checked = !!settings.studentWeb;
      // Load credential fields
      document.getElementById("neptunCode").value = settings.code || "";
      document.getElementById("neptunPassword").value = settings.password || "";
      document.getElementById("otpSecret").value = settings.otpSecret || "";
    }).catch(err => console.error("[Popup] loadSettings error:", err));
  }

  function saveSettings(silent = false, callback) {
    const settings = {
      enabled: document.getElementById("neptunToggle").checked,
      canvasEnabled: document.getElementById("canvasToggle").checked,
      tmsEnabled: document.getElementById("tmsToggle").checked,
      studentWeb: document.getElementById("directStudentWebToggle").checked,
      code: document.getElementById("neptunCode").value,
      password: document.getElementById("neptunPassword").value,
      otpSecret: document.getElementById("otpSecret").value
    };
    browser.storage.local.set({ neptunAutoLoginSettings: settings }).then(() => {
      console.log("[Popup] Settings saved:", settings);
      if (!silent) openSavedModal();
      if (callback) callback();
    }).catch(err => console.error("[Popup] saveSettings error:", err));
  }

  // Auto-save main view toggle changes silently.
  document.getElementById("neptunToggle").addEventListener("change", () => { saveSettings(true); });
  document.getElementById("canvasToggle").addEventListener("change", () => { saveSettings(true); });
  document.getElementById("tmsToggle").addEventListener("change", () => { saveSettings(true); });
  document.getElementById("directStudentWebToggle").addEventListener("change", () => { saveSettings(true); });

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
      // Immediately switch back to main view…
      settingsView.classList.remove("visible");
      settingsView.classList.add("hidden");
      mainView.classList.remove("hidden");
      mainView.classList.add("visible");
      updateGearImage(false);
      // …then save the settings without Saved! modal
      saveSettings(true);
    } else {
      // Switch to settings view
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
        // Optionally update the icon (if you have a different image for visible state)
        this.querySelector("img").src = isDark ? "images/hidden_dark.png" : "images/hidden_light.png";
      } else {
        otpInput.type = "password";
        // Revert back to the original icon:
        this.querySelector("img").src = isDark ? "images/eye_dark.png" : "images/eye_light.png";
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
    browser.storage.local.get("neptunAutoLoginSettings").then(result => {
      const settings = (result && result.neptunAutoLoginSettings) || {};
      if (settings.enabled) {
        console.log("[Popup] Neptun auto‑login enabled. Sending message to background.");
        browser.runtime.sendMessage({ action: "openNeptunLogin", settings });
      } else {
        console.log("[Popup] Neptun auto‑login disabled. Opening default homepage.");
        openNewTab(urls.neptun);
      }
    });
  });

  document.getElementById("canvasButton").addEventListener("click", (e) => {
    if (e.target.closest(".toggle-container")) return;
    browser.storage.local.get("neptunAutoLoginSettings").then(result => {
      const settings = (result && result.neptunAutoLoginSettings) || {};
      if (settings.canvasEnabled) {
        console.log("[Popup] Canvas auto‑login enabled. Sending message to background.");
        browser.runtime.sendMessage({ action: "openNeptunLogin", settings, site: "canvas" });
      } else {
        openNewTab(urls.canvas);
      }
    });
  });

  document.getElementById("tmsButton").addEventListener("click", (e) => {
    if (e.target.closest(".toggle-container")) return;
    browser.storage.local.get("neptunAutoLoginSettings").then(result => {
      const settings = (result && result.neptunAutoLoginSettings) || {};
      if (settings.tmsEnabled) {
        console.log("[Popup] TMS auto‑login enabled. Sending message to background.");
        browser.runtime.sendMessage({ action: "openTMSLogin", settings });
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

  // --- Initial Load ---
  loadSettings();
});
