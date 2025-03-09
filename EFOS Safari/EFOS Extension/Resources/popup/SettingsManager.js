export default class SettingsManager {
    constructor(storage) {
        this.storage = storage;
        this.defaultSettings = {
            neptun: { enabled: false, studentWeb: false },
            canvas: { enabled: false },
            tms: { enabled: false },
            credentials: { code: "", password: "", tmspassword: "", otpSecret: "" }
        };
    }

    async loadSettings() {
        try {
            const result = await this.storage.get("autoLoginSettings");
            return result.autoLoginSettings || this.defaultSettings;
        } catch (err) {
            console.error("[Popup] loadSettings error:", err);
            return this.defaultSettings;
        }
    }

    async saveSettings(settings) {
        try {
            await this.storage.set({ autoLoginSettings: settings });
        } catch (err) {
            console.error("[Popup] saveSettings error:", err);
        }
    }
}
