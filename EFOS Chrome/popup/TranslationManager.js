export default class TranslationManager {
    constructor() {
        this.translations = {
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
    }

    apply(lang) {
        const texts = this.translations[lang] || this.translations.en;
        const selectors = [
            { selector: "#mainView h1", text: texts.title },
            { selector: "#mainView .subtitle", text: texts.subtitle },
            { selector: "#mainView .auto-login-label", text: texts.autoLogin },
            { selector: "#neptunButton .button-text", text: texts.neptunLabel },
            { selector: "#canvasButton .button-text", text: texts.canvasLabel },
            { selector: "#tmsButton .button-text", text: texts.tmsLabel },
            { selector: "#tmsFocusRow .button-text", text: texts.focusModeLabel },
            { selector: "#settingsView h2", text: texts.settingsTitle },
            { selector: "#settingsView label[for='neptunCode']", text: texts.neptunCodeLabel },
            { selector: "#settingsView label[for='neptunPassword']", text: texts.passwordLabel },
            { selector: "#settingsView label[for='TMSPassword']", text: texts.tmsPasswordLabel },
            { selector: "#settingsView label[for='otpSecret']", text: texts.otpSecretLabel },
            { selector: "#languageSelectorView h1", text: texts.languageSelectorTitle },
            { selector: "#settingsView .setting-label", text: texts.goDirectLabel },
            { selector: "#activateFocusButton", text: texts.activateButtonText },
            { selector: "#infoModal .guide-text", text: texts.infoModalContent }
        ];

        selectors.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.innerText = item.text;
            }
        });

        // Set placeholders
        const placeholders = [
            { id: "neptunCode", placeholder: texts.neptunPlaceholder },
            { id: "neptunPassword", placeholder: texts.passwordPlaceholder },
            { id: "TMSPassword", placeholder: texts.passwordPlaceholder },
            { id: "otpSecret", placeholder: texts.otpPlaceholder }
        ];

        placeholders.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) {
                el.placeholder = item.placeholder;
            }
        });
    }
}
