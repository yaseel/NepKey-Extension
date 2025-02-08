// Detect Dark Mode and Apply Styles
function applyDarkMode() {
  const isDarkMode =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}
document.addEventListener("DOMContentLoaded", applyDarkMode);

// URLs for the buttons
const urls = {
  neptun: "https://neptun.elte.hu",
  canvas: "https://canvas.elte.hu",
  tms: "https://tms.inf.elte.hu"
};

// Function to open a new tab (not updating the current one)
function openNewTab(url) {
  chrome.tabs.create({ url: url });
}

// Event listeners for the main link buttons
document.getElementById("neptunButton").addEventListener("click", function () {
  openNewTab(urls.neptun);
});
document.getElementById("canvasButton").addEventListener("click", function () {
  openNewTab(urls.canvas);
});
document.getElementById("tmsButton").addEventListener("click", function () {
  openNewTab(urls.tms);
});

// Function to inject the Focus Mode code into the active tab
function injectFocusMode() {
  const code = `
    (function(){
      document.documentElement.style.width = "100vw";
      document.documentElement.style.overflowX = "hidden";
      document.body.style.width = "100vw";
      document.body.style.overflowX = "hidden";
      document.querySelectorAll(".row").forEach(el => el.style.display = "inline");
      document.querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-bottom")
             .forEach(el => el.remove());
      document.querySelectorAll(".col-xl-10, .col-md-9").forEach(el => el.style.maxWidth = "97%");
    })();
  `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.executeScript(tabs[0].id, { code: code }, function () {
        alert("Focus Mode Activated");
      });
    }
  });
}

// TMS Focus Mode row button event listeners
document.getElementById("activateFocusButton").addEventListener("click", function () {
  injectFocusMode();
});
document.getElementById("infoFocusButton").addEventListener("click", function () {
  openModal();
});

// Modal functionality with animation
const modal = document.getElementById("infoModal");
const closeModalBtn = document.getElementById("closeModal");

function openModal() {
  modal.style.display = "block";
  // Allow a tick for display change, then animate in
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("closing");
  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("closing");
  }, 300);
}

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    closeModal();
  }
});
