import i18n from "../i18n.ts";
import {Language} from "../types.ts";

export async function applyLanguage(lang: Language) {
    try {
        await i18n.changeLanguage(lang);
    } catch (e) {
        console.error("Failed to change language", e);
    }
}