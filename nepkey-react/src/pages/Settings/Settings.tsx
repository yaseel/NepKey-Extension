import React from "react";
import styles from "./Settings.module.css";
import {
    i18nKeys
} from "../../constants.ts";
import Input from "../../common/Input/Input.tsx";
import Header from "../../common/Header/Header.tsx";
import Footer from "../../common/Footer/Footer.tsx";
import Toggle from "../../common/Toggle/Toggle.tsx";
import LanguageSelect from "../../components/LanguageSelect/LanguageSelect.tsx";
import {useTranslation} from "react-i18next";

import {Language} from "../../types.ts";

const Settings = () => {
    const {i18n, t} = useTranslation();

    const handleChangeLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
    }

    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <Input id="neptunCode" type="text" labelText={t(i18nKeys.NEPTUN_CODE)} placeholder={t(i18nKeys.NEPTUN_CODE_PLACEHOLDER)}/>
                <Input id="password" type="password" labelText={t(i18nKeys.PASSWORD)} placeholder={t(i18nKeys.PASSWORD_PLACEHOLDER)}/>
                <Input id="tmsPassword" type="password" labelText={t(i18nKeys.TMS_PASSWORD)} placeholder={t(i18nKeys.TMS_PASSWORD_PLACEHOLDER)}/>
                <Input id="otpSecret" type="password" labelText={t(i18nKeys.OTP_SECRET)} placeholder={t(i18nKeys.OTP_SECRET_PLACEHOLDER)}/>

                <hr className={styles.hr}/>

                <Toggle text={t(i18nKeys.AUTO_STUDENT_WEB)}/>

                <hr className={styles.hr}/>

                <LanguageSelect value={i18n.language} onChange={handleChangeLanguage}/>
            </main>

            <Footer/>
        </div>
    );
};

export default Settings;
