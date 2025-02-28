export default class UIManager {
    constructor(browserAPI) {
        this.browserAPI = browserAPI;
        this.initDarkMode();
        this.initEnergySurge();
    }

    initDarkMode() {
        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        if (darkModeQuery.matches) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        this.updateGearImage(this.isSettingsVisible());
        this.updateTutorialIcon();
        this.updateTutorialBackIcon();
        this.updateOtpToggleIcon();
    }

    updateGearImage(isSettings) {
        const gearButton = document.getElementById("settingsButton");
        if (!gearButton) return;
        const gearImg = gearButton.querySelector("img");
        const isDark = document.body.classList.contains("dark-mode");
        gearImg.src = isSettings
            ? (isDark ? "images/back_dark.png" : "images/back_light.png")
            : (isDark ? "images/gear_dark.png" : "images/gear_light.png");
    }

    updateTutorialIcon() {
        const tutorialButton = document.getElementById("tutorialButton");
        if (!tutorialButton) return;
        const isDark = document.body.classList.contains("dark-mode");
        const tutorialImg = tutorialButton.querySelector("img");
        tutorialImg.src = isDark ? "images/question_dark.png" : "images/question_light.png";
    }

    updateTutorialBackIcon() {
        const tutorialBack = document.getElementById("tutorialBack");
        if (!tutorialBack) return;
        const isDark = document.body.classList.contains("dark-mode");
        const img = tutorialBack.querySelector("img");
        img.src = isDark ? "images/back_dark.png" : "images/back_light.png";
    }

    updateOtpToggleIcon() {
        const otpToggle = document.getElementById("toggleOtpSecret");
        if (!otpToggle) return;
        const isDark = document.body.classList.contains("dark-mode");
        const img = otpToggle.querySelector("img");
        img.src = isDark ? "images/hidden_dark.png" : "images/hidden_light.png";
    }

    isSettingsVisible() {
        const settingsView = document.getElementById("settingsView");
        return settingsView.classList.contains("visible");
    }

    updateAutoLoginLabel() {
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

    collectSettingsFromUI() {
        return {
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
    }

    applySettingsToUI(settings) {
        document.getElementById("neptunToggle").checked = settings.neptun.enabled;
        document.getElementById("canvasToggle").checked = settings.canvas.enabled;
        document.getElementById("tmsToggle").checked = settings.tms.enabled;
        document.getElementById("directStudentWebToggle").checked = settings.neptun.studentWeb;
        document.getElementById("neptunCode").value = settings.credentials.code || "";
        document.getElementById("neptunPassword").value = settings.credentials.password || "";
        document.getElementById("TMSPassword").value = settings.credentials.tmspassword || "";
        document.getElementById("otpSecret").value = settings.credentials.otpSecret || "";
        this.updateAutoLoginLabel();
    }

    openNewTab(url) {
        this.browserAPI.tabs.create({ url });
    }

    initEnergySurge() {
        document.querySelectorAll('.main-toggle').forEach((input) => {
            input.addEventListener('change', function () {
                const menuButton = this.closest('.menu-button');
                if (this.checked && menuButton) {
                    menuButton.classList.add('energy-surge');
                    setTimeout(() => menuButton.classList.remove('energy-surge'), 1000);
                }
            });
        });
    }
}
