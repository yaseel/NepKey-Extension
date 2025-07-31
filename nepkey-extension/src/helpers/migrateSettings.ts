import {getStorage} from "./getStorage.ts";
import {Language, Settings} from "../types.ts";
import {STORAGE_KEYS} from "../constants.ts";

export async function migrateSettings() {

    const storage = getStorage();

    const {[STORAGE_KEYS.SETTINGS]: stored} = await storage.get(STORAGE_KEYS.SETTINGS);
    const settingsFound = stored !== undefined;

    if (!settingsFound) {
        const {autoLoginSettings: oldAutoLoginSettings} = await storage.get("autoLoginSettings");

        const {language: oldLang} = await storage.get("language");

        const language = (
            typeof oldLang === "string" ? oldLang : "en"
        ) as Language;

        const oldCredentials = oldAutoLoginSettings?.credentials || {};
        const oldNeptunSettings = oldAutoLoginSettings?.neptun || {};

        const oldSettings: Settings = {
            neptunCode: oldCredentials.code || "",
            password: oldCredentials.password || "",
            tmsPassword: oldCredentials.tmspassword || "",
            otpSecret: oldCredentials.otpSecret || "",
            autoStudentWeb:
                typeof oldNeptunSettings.studentWeb === "boolean"
                    ? oldNeptunSettings.studentWeb
                    : true,
            language
        };

        await storage.set({ [STORAGE_KEYS.SETTINGS]: oldSettings });
        await storage.remove(["autoLoginSettings", "language"]);
    }


}