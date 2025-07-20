import { useEffect, useState, useCallback } from "react";
import { Language, Settings } from "../types";
import { DEFAULT_SETTINGS, settingsStore } from "../settings";

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        settingsStore.get()
            .then(s => {
                setSettings(s);
                setError(null);
            })
            .catch(e => setError(e))
            .finally(() => setLoading(false));
    }, []);

    const updateSetting = useCallback(
        async (settingKey: keyof Settings, setting: Settings[keyof Settings], errorEnding: string) => {
            setLoading(true);
            try {
                await settingsStore.update({ [settingKey]: setting });
                setSettings(prev => ({
                    ...prev,
                    [settingKey]: setting
                }));
                setError(null);
            } catch (e) {
                setError(new Error(`Failed to save ${errorEnding}: ${e}`));
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const setNeptunCode = (neptunCode: string) => updateSetting("neptunCode", neptunCode, "Neptun Code");
    const setPassword = (password: string) => updateSetting("password", password, "password");
    const setTmsPassword = (tmsPassword: string) => updateSetting("tmsPassword", tmsPassword, "TMS password");
    const setOtpSecret = (otpSecret: string) => updateSetting("otpSecret", otpSecret, "OTP secret");
    const setLanguage = (lang: Language) => updateSetting("language", lang, "language preference");

    return { settings, setNeptunCode, setPassword, setTmsPassword, setOtpSecret, setLanguage, loading, error };
}