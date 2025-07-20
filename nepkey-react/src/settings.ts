import {STORAGE_KEYS} from "./constants.ts";
import {Language, Settings} from "./types.ts";
import {getStorage} from "./helpers/getStorage.ts";

export const DEFAULT_SETTINGS: Settings = {
    neptunCode: "",
    password: "",
    tmsPassword: "",
    otpSecret: "",
    autoStudentWeb: true,
    language: 'en'
};

function normalize(raw: Partial<Settings> | undefined): Settings {
    if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS };
    return {
        neptunCode: raw.neptunCode ?? "",
        password: raw.password ?? "",
        tmsPassword: raw.tmsPassword ?? "",
        otpSecret: raw.otpSecret ?? "",
        autoStudentWeb: raw.autoStudentWeb ?? true,
        language: (raw.language as Language) ?? 'en',
    };
}

async function getSettings(): Promise<Settings> {
    const storage = getStorage();
    const { [STORAGE_KEYS.SETTINGS]: stored } = await storage.get(STORAGE_KEYS.SETTINGS);
    return normalize(stored);
}

async function setSettings(next: Settings): Promise<void> {
    const storage = getStorage();
    await storage.set({ [STORAGE_KEYS.SETTINGS]: next });
}

async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
    const current = await getSettings();
    const next: Settings = {
        ...current,
        ...patch
    };
    await setSettings(next);
    return next;
}

export const settingsStore = {
    get: getSettings,
    set: setSettings,
    update: updateSettings
}