import {STORAGE_KEYS} from "./constants.ts";
import {Settings} from "./types.ts";
import {getStorage} from "./helpers/getStorage.ts";

export const DEFAULT_SETTINGS: Settings = {
    neptunCode: "",
    password: "",
    tmsPassword: "",
    otpSecret: "",
    autoStudentWeb: true,
    language: 'en'
};

async function getSettings(): Promise<Settings> {
    const storage = getStorage();
    const { [STORAGE_KEYS.SETTINGS]: stored } = await storage.get(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...stored };
}

async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
    const current = await getSettings();
    const next: Settings = {
        ...current,
        ...patch
    };
    const storage = getStorage();
    await storage.set({ [STORAGE_KEYS.SETTINGS]: next });
    return next;
}

export const settingsStore = {
    get: getSettings,
    update: updateSettings
};