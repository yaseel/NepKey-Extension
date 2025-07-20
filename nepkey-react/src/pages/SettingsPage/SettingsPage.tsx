import React from "react";
import styles from "./Settings.module.css";
import {
    i18n_KEYS
} from "../../constants.ts";
import Input from "../../common/Input/Input.tsx";
import Header from "../../common/Header/Header.tsx";
import Footer from "../../common/Footer/Footer.tsx";
import Toggle from "../../common/Toggle/Toggle.tsx";
import LanguageSelect from "../../components/LanguageSelect/LanguageSelect.tsx";
import {useTranslation} from "react-i18next";

import {Language} from "../../types.ts";
import {useSettings} from "../../hooks/useSettings.ts";

const SettingsPage = () => {
    const {i18n, t} = useTranslation();
    const {settings, setLanguage} = useSettings();

    const handleChangeLanguage = async (lang: Language) => {
        await i18n.changeLanguage(lang);
        await setLanguage(lang);
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <Input id="neptunCode" type="text" labelText={t(i18n_KEYS.NEPTUN_CODE)} placeholder={t(i18n_KEYS.NEPTUN_CODE_PLACEHOLDER)}/>
                <Input id="password" type="password" labelText={t(i18n_KEYS.PASSWORD)} placeholder={t(i18n_KEYS.PASSWORD_PLACEHOLDER)}/>
                <Input id="tmsPassword" type="password" labelText={t(i18n_KEYS.TMS_PASSWORD)} placeholder={t(i18n_KEYS.TMS_PASSWORD_PLACEHOLDER)}/>
                <Input id="otpSecret" type="password" labelText={t(i18n_KEYS.OTP_SECRET)} placeholder={t(i18n_KEYS.OTP_SECRET_PLACEHOLDER)}/>

                <hr className={styles.hr}/>

                <Toggle text={t(i18n_KEYS.AUTO_STUDENT_WEB)}/>

                <hr className={styles.hr}/>

                <LanguageSelect value={i18n.language} onChange={handleChangeLanguage}/>
            </main>

            <Footer/>
        </div>
    );
};

export default SettingsPage;
