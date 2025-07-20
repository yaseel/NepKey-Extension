import { useEffect, useState } from "react";
import { Settings } from "../types";
import { DEFAULT_SETTINGS, settingsStore } from "../settings";

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

    const reloadSettings = () => {
        settingsStore.get().then(setSettings);
    };

    useEffect(() => {
        reloadSettings();
    }, []);

    return { settings, reloadSettings };
}