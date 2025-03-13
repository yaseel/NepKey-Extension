export default class TranslationManager {
    constructor() {
        this.translations = {
            en: {
                title: "NepKey",
                subtitle: "University Toolkit",
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
                infoModalContent: "First, open TMS in your browser, then open your task, and finally click Activate. To undo the effect, refresh the page.",
                tutorialStep1: "Click the menu buttons to open the respective websites.",
                tutorialStep2: "Before enabling auto log in, input your credentials in settings.",
                tutorialStep3: "Enable auto log in using the toggles.",
                tutorialStep4: "For full TOTP login, log into Neptun, select 'New TOTP pairing', copy the secret, then paste it in NepKey OTP settings and add it to your authenticator.",
                tutorialStep5: "Auto log in only works when websites are opened from the extension."
            },
            hu: {
                title: "NepKey",
                subtitle: "University Toolkit",
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
                infoModalContent: "Először nyisd meg a TMS-t a böngésződben, majd a feladatodat, végül kattints az Aktiválásra. A hatás visszavonásához frissítsd az oldalt.",
                tutorialStep1: "Kattints a menü gombokra, hogy megnyisd a megfelelő weboldalakat.",
                tutorialStep2: "Mielőtt bekapcsolod az automatikus bejelentkezést, add meg a hitelesítő adataid a beállításokban.",
                tutorialStep3: "Kapcsold be az automatikus bejelentkezést a kapcsolókkal.",
                tutorialStep4: "A teljes TOTP bejelentkezéshez: jelentkezz be Neptunba, válaszd az 'Új TOTP párosítás'-t, másold ki a titkot, majd illeszd be a NepKey OTP beállításaiba, és add hozzá az authenticatorhoz.",
                tutorialStep5: "Az automatikus bejelentkezés csak az extensionből megnyitott oldalakon működik."
            }
        };
    }

    apply(lang) {
        this.currentLang = lang;
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
