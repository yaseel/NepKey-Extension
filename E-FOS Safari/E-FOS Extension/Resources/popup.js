// popup.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Popup] popup.js loaded");

  // Helper functions for settings view and gear image
  function isSettingsVisible() {
    const settingsView = document.getElementById("settingsView");
    return settingsView && settingsView.classList.contains("visible");
  }

  function updateGearImage(isSettings) {
    const settingsButton = document.getElementById("settingsButton");
    if (settingsButton) {
      const gearImg = settingsButton.querySelector("img");
      const isDark = document.body.classList.contains("dark-mode");
      gearImg.src = isSettings
        ? (isDark ? "images/back_dark.png" : "images/back_light.png")
        : (isDark ? "images/gear_dark.png" : "images/gear_light.png");
    }
  }

  // Dark mode detection
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = darkModeQuery.matches;
  console.log("[Popup] Dark mode (on load):", isDark);
  if (isDark) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateGearImage(isSettingsVisible());

  // Main URLs
  const urls = {
    neptun: "https://neptun.elte.hu",
    canvas: "https://canvas.elte.hu",
    tms: "https://tms.inf.elte.hu"
  };

  // Open new tab using browser.tabs.create
  function openNewTab(url) {
    browser.tabs.create({ url });
  }

  // Neptun button listener
  document.getElementById("neptunButton").addEventListener("click", () => {
    console.log("[Popup] Neptun button clicked.");
    const settingsStr = localStorage.getItem("neptunAutoLoginSettings");
    console.log("[Popup] Retrieved settings:", settingsStr);
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      if (settings.enabled) {
        console.log("[Popup] Auto-login enabled. Sending message to background.");
        // Delegate tab opening and credential filling to the background.
        browser.runtime.sendMessage({ action: "openNeptunLogin", settings });
        return;
      } else {
        console.log("[Popup] Auto-login not enabled.");
      }
    } else {
      console.log("[Popup] No auto-login settings found.");
    }
    console.log("[Popup] Opening default Neptun homepage.");
    openNewTab(urls.neptun);
  });

  // Other buttons
  document.getElementById("canvasButton").addEventListener("click", () => {
    openNewTab(urls.canvas);
  });
  document.getElementById("tmsButton").addEventListener("click", () => {
    openNewTab(urls.tms);
  });

  // Focus mode injection (send message to background)
  document.getElementById("activateFocusButton").addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "activateFocusMode" });
    alert("Focus Mode Activated – implement content script handling as needed.");
  });

  // Info modal
  document.getElementById("infoFocusButton").addEventListener("click", () => {
    openModal();
  });
  const modalEl = document.getElementById("infoModal");
  const closeModalBtn = document.getElementById("closeModal");
  function openModal() {
    modalEl.style.display = "block";
    setTimeout(() => {
      modalEl.classList.add("show");
    }, 10);
  }
  function closeModal() {
    modalEl.classList.remove("show");
    modalEl.classList.add("closing");
    setTimeout(() => {
      modalEl.style.display = "none";
      modalEl.classList.remove("closing");
    }, 300);
  }
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (event) => {
    if (event.target === modalEl) {
      closeModal();
    }
  });

  // Saved modal functionality
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
    setTimeout(() => {
      savedModal.classList.add("show");
    }, 10);
    const autoCloseTimer = setTimeout(() => {
      closeSavedModal();
    }, 1500);
    savedModal.onclick = () => {
      clearTimeout(autoCloseTimer);
      closeSavedModal();
    };
  }

  // Settings view toggle
  document.getElementById("settingsButton").addEventListener("click", () => {
    const mainView = document.getElementById("mainView");
    const settingsView = document.getElementById("settingsView");
    if (isSettingsVisible()) {
      settingsView.classList.remove("visible");
      settingsView.classList.add("hidden");
      mainView.classList.remove("hidden");
      mainView.classList.add("visible");
      updateGearImage(false);
    } else {
      mainView.classList.remove("visible");
      mainView.classList.add("hidden");
      settingsView.classList.remove("hidden");
      settingsView.classList.add("visible");
      loadNeptunSettings();
      updateGearImage(true);
    }
  });

  // Neptun auto‑login settings
  document.getElementById("neptunAutoLoginCheckbox").addEventListener("change", function() {
    const enabled = this.checked;
    document.getElementById("neptunCode").disabled = !enabled;
    document.getElementById("neptunPassword").disabled = !enabled;
  });
  document.getElementById("saveNeptunSettings").addEventListener("click", () => {
    const enabled = document.getElementById("neptunAutoLoginCheckbox").checked;
    const code = document.getElementById("neptunCode").value;
    const password = document.getElementById("neptunPassword").value;
    const settings = { enabled, code, password };
    localStorage.setItem("neptunAutoLoginSettings", JSON.stringify(settings));
    openSavedModal();
  });
  function loadNeptunSettings() {
    const settingsStr = localStorage.getItem("neptunAutoLoginSettings");
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      document.getElementById("neptunAutoLoginCheckbox").checked = settings.enabled;
      document.getElementById("neptunCode").value = settings.code;
      document.getElementById("neptunPassword").value = settings.password;
      document.getElementById("neptunCode").disabled = !settings.enabled;
      document.getElementById("neptunPassword").disabled = !settings.enabled;
    }
  }
});
