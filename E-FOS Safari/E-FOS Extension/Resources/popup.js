document.addEventListener("DOMContentLoaded", () => {
  console.log("[Popup] popup.js loaded");

  // --- UI Helpers ---
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

  // --- Dark Mode Detection ---
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = darkModeQuery.matches;
  console.log("[Popup] Dark mode (on load):", isDark);
  if (isDark) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateGearImage(isSettingsVisible());

  // --- URL Configuration ---
  const urls = {
    neptun: "https://neptun.elte.hu",
    canvas: "https://canvas.elte.hu",
    tms: "https://tms.inf.elte.hu"
  };

  function openNewTab(url) {
    browser.tabs.create({ url });
  }

  // --- Neptun Button Click Handler ---
  document.getElementById("neptunButton").addEventListener("click", () => {
    console.log("[Popup] Neptun button clicked.");

    browser.storage.local.get("neptunAutoLoginSettings").then((result) => {
      console.log("[Popup] Retrieved settings:", result);
      if (result && result.neptunAutoLoginSettings) {
        const settings = result.neptunAutoLoginSettings;
        if (settings.enabled) {
          console.log("[Popup] Auto-login enabled. Sending message to background.");
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
  });

  // --- Other Buttons ---
  document.getElementById("canvasButton").addEventListener("click", () => {
    openNewTab(urls.canvas);
  });
  document.getElementById("tmsButton").addEventListener("click", () => {
    openNewTab(urls.tms);
  });
  document.getElementById("activateFocusButton").addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "activateFocusMode" });
    alert("Focus Mode Activated – implement content script handling as needed.");
  });

  // --- Modal Functionality ---
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

  // --- Saved Modal Functionality ---
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

  // --- Settings Toggle ---
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

  // --- Neptun Auto‑Login Settings (including OTP secret and Student Web option) ---
  document.getElementById("neptunAutoLoginCheckbox").addEventListener("change", function() {
    const enabled = this.checked;
    document.getElementById("neptunCode").disabled = !enabled;
    document.getElementById("neptunPassword").disabled = !enabled;
    document.getElementById("otpSecret").disabled = !enabled;
    document.getElementById("directStudentWebCheckbox").disabled = !enabled;
  });
  document.getElementById("saveNeptunSettings").addEventListener("click", () => {
    const enabled = document.getElementById("neptunAutoLoginCheckbox").checked;
    const code = document.getElementById("neptunCode").value;
    const password = document.getElementById("neptunPassword").value;
    const otpSecret = document.getElementById("otpSecret").value;
    const studentWeb = document.getElementById("directStudentWebCheckbox").checked;  // NEW!
    
    const settings = { enabled, code, password, otpSecret, studentWeb }; // Include studentWeb
    
    browser.storage.local.set({ neptunAutoLoginSettings: settings }).then(() => {
      console.log("[Popup] Settings saved to storage.");
      openSavedModal();
    });
  });
  
  function loadNeptunSettings() {
    browser.storage.local.get("neptunAutoLoginSettings").then((result) => {
      if (result && result.neptunAutoLoginSettings) {
        const settings = result.neptunAutoLoginSettings;
        document.getElementById("neptunAutoLoginCheckbox").checked = settings.enabled;
        document.getElementById("neptunCode").value = settings.code;
        document.getElementById("neptunPassword").value = settings.password;
        document.getElementById("otpSecret").value = settings.otpSecret || "";
        document.getElementById("directStudentWebCheckbox").checked = settings.studentWeb || false;
        
        document.getElementById("neptunCode").disabled = !settings.enabled;
        document.getElementById("neptunPassword").disabled = !settings.enabled;
        document.getElementById("otpSecret").disabled = !settings.enabled;
      }
    });
  }
});
