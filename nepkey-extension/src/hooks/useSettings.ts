import { useEffect, useState } from "react";
import { Settings } from "../types";
import { DEFAULT_SETTINGS, settingsStore } from "../settings";

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState<boolean>(false);

    const reloadSettings = () => {
        settingsStore.get().then(s => {
            setSettings(s);
            setLoaded(true);
        });
    };

    useEffect(() => {
        reloadSettings();
    }, []);

    return { settings, loaded, reloadSettings };
}