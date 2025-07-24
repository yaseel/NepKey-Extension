import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./Settings.module.css";
import {GITHUB_README_LINK, i18n_KEYS} from "../../constants.ts";
import Input from "../../common/Input/Input.tsx";
import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import Toggle from "../../common/Toggle/Toggle.tsx";
import LanguageSelect from "../../components/LanguageSelect/LanguageSelect.tsx";
import { useTranslation } from "react-i18next";
import { Language } from "../../types.ts";
import { useSettings } from "../../hooks/useSettings.ts";
import { settingsStore } from "../../settings.ts";
import TooltipWrapper from "../../common/TooltipWrapper/TooltipWrapper.tsx";
import Spinner from "../../common/Spinner/Spinner.tsx";

const SettingsPage = () => {
    const { i18n, t } = useTranslation();
    const { settings, loaded } = useSettings();
    const [formData, setFormData] = useState({ ...settings });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!isDirty) setFormData({ ...settings });
    }, [isDirty, settings]);

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        settingsStore.update({ [id]: value });
    };

    const handleToggleBlur = () => {
        settingsStore.update({ autoStudentWeb: formData.autoStudentWeb });
    };

    const handleChangeLanguage = async (lang: Language) => {
        await i18n.changeLanguage(lang);
        await settingsStore.update({ language: lang });
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsDirty(true);
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleToggleChange = (checked: boolean) => {
        setIsDirty(true);
        setFormData(prev => ({ ...prev, autoStudentWeb: checked }));
    };

    const otpTooltipTitle = (
        <span>
            {t(i18n_KEYS.OTP_SECRET_TOOLTIP_TEXT)}
            <a href={GITHUB_README_LINK} target="_blank">{t(i18n_KEYS.OTP_SECRET_TOOLTIP_ANCHOR)}</a>
        </span>
    );

    if (!loaded) {
        return (
            <div className={styles.container}>
                <Header />
                <main className={[styles.main, styles.spinnerContainer].join(" ")}>
                    <Spinner />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <Input id="neptunCode"
                    value={formData.neptunCode}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    type="text" labelText={t(i18n_KEYS.NEPTUN_CODE)}
                    placeholder={t(i18n_KEYS.NEPTUN_CODE_PLACEHOLDER)}
                />
                <Input id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    type="password"
                    labelText={t(i18n_KEYS.PASSWORD)}
                    placeholder={t(i18n_KEYS.PASSWORD_PLACEHOLDER)}
                />
                <Input id="tmsPassword"
                    value={formData.tmsPassword}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    type="password"
                    labelText={t(i18n_KEYS.TMS_PASSWORD)}
                    placeholder={t(i18n_KEYS.TMS_PASSWORD_PLACEHOLDER)}
                />
                <TooltipWrapper title={otpTooltipTitle}>
                    <Input id="otpSecret"
                           value={formData.otpSecret}
                           onChange={handleInputChange}
                           onBlur={handleInputBlur}
                           type="password"
                           labelText={t(i18n_KEYS.OTP_SECRET)}
                           placeholder={t(i18n_KEYS.OTP_SECRET_PLACEHOLDER)}
                    />

                </TooltipWrapper>

                <hr className={styles.hr} />
                <Toggle
                    text={t(i18n_KEYS.AUTO_STUDENT_WEB)}
                    checked={formData.autoStudentWeb}
                    onChange={e => handleToggleChange(e.target.checked)}
                    onBlur={handleToggleBlur}
                />
                <hr className={styles.hr} />
                <LanguageSelect value={i18n.language} onChange={handleChangeLanguage} />
            </main>
            <Footer />
        </div>
    );
};

export default SettingsPage;
