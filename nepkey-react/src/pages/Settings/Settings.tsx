import React from "react";
import styles from "./Settings.module.css";
import {
    TEXT_NEPTUN_CODE,
    TEXT_NEPTUN_CODE_PLACEHOLDER, TEXT_OTP_SECRET, TEXT_OTP_SECRET_PLACEHOLDER, TEXT_PASSWORD,
    TEXT_PASSWORD_PLACEHOLDER, TEXT_TMS_PASSWORD, TEXT_TMS_PASSWORD_PLACEHOLDER
} from "../../constants.ts";
import Input from "../../common/Input/Input.tsx";
import Header from "../../common/Header/Header.tsx";
import Footer from "../../common/Footer/Footer.tsx";

const Settings = () => {

    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <Input id="neptunCode" type="text" labelText={TEXT_NEPTUN_CODE} placeholder={TEXT_NEPTUN_CODE_PLACEHOLDER}/>
                <Input id="password" type="password" labelText={TEXT_PASSWORD} placeholder={TEXT_PASSWORD_PLACEHOLDER}/>
                <Input id="tmsPassword" type="password" labelText={TEXT_TMS_PASSWORD} placeholder={TEXT_TMS_PASSWORD_PLACEHOLDER}/>
                <Input id="otpSecret" type="password" labelText={TEXT_OTP_SECRET} placeholder={TEXT_OTP_SECRET_PLACEHOLDER}/>
            </main>

            <Footer/>
        </div>
    );
};

export default Settings;
