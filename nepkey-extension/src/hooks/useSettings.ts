import { useEffect, useState } from "react";
import { Settings } from "../types";
import { settingsStore } from "../settings";
import {EMPTY_SETTINGS} from "../constants.ts";

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(EMPTY_SETTINGS);
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