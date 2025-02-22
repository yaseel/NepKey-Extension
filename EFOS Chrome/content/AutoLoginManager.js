export default class AutoLoginManager {
    constructor() {
        console.log("[AutoLoginManager] Loaded as module via import.meta.url:", import.meta.url);
        this.setAutoLoginFlag();
    }

    setAutoLoginFlag() {
        const urlParams = new URLSearchParams(window.location.search);
        if (window.location.hostname.includes("idp.elte.hu")) {
            window.name = "autoLoginFromExt";
        } else if (window.name === "autoLoginFromExt") {
            // already set
        } else if (urlParams.has("fromExt")) {
            window.name = "autoLoginFromExt";
        }
    }

    isAutoLoginEnabled() {
        const urlParams = new URLSearchParams(window.location.search);
        return window.location.hostname.includes("idp.elte.hu") ||
            window.name === "autoLoginFromExt" ||
            urlParams.has("fromExt");
    }

    guardDuplicateInjection() {
        if (window.autoLoginInitialized) {
            console.log("Auto-login already initialized. Exiting duplicate injection.");
            throw new Error("DuplicateInjection");
        }
        window.autoLoginInitialized = true;

        // Initialize global flags if not already set.
        window.neptunLoginAttempted = window.neptunLoginAttempted || false;
        window.totpAttempted = window.totpAttempted || false;
        window.canvasLoginAttempted = window.canvasLoginAttempted || false;
        window.idpLoginAttempted = window.idpLoginAttempted || false;
        window.tmsLoginAttempted = window.tmsLoginAttempted || false;
    }
}
