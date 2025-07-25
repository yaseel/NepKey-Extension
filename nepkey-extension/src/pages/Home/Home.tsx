import React, { createRef, useState } from "react";
import styles from "./Home.module.css";
import {i18n_KEYS} from "../../constants.ts";
import ShortcutButton from "../../components/ShortcutButton/ShortcutButton.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { useBodyGlow } from "../../hooks/useBodyGlow";
import Header from "../../components/Header/Header.tsx";
import {useTranslation} from "react-i18next";
import {useSettings} from "../../hooks/useSettings.ts";
import {executeLogin} from "../../helpers/executeLogin.ts";
import {Platform} from "../../types.ts";
import {sendBackgroundMessage} from "../../helpers/message.ts";

const Home = () => {
    const neptunRef = createRef<HTMLButtonElement | null>();
    const canvasRef = createRef<HTMLButtonElement | null>();
    const tmsRef = createRef<HTMLButtonElement | null>();
    const [focusTooltip, setFocusTooltip] = useState("");
    useBodyGlow([neptunRef, canvasRef, tmsRef]);
    const {t} = useTranslation();
    const {settings} = useSettings();


    const handleShortcut = async (platform: Platform) => {
        await executeLogin(settings, platform);
    };

    const handleTmsFocus = async () => {
        const tmsFocusRes = await sendBackgroundMessage({action: "tmsFocus", payload: null});

        if (tmsFocusRes && !tmsFocusRes.ok) {
            setFocusTooltip(t(i18n_KEYS.TMS_FOCUS_TOOLTIP));
        }
    };

    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <ShortcutButton refEl={neptunRef} shortcut="Neptun" onClick={() => handleShortcut("Neptun")}/>
                <ShortcutButton refEl={canvasRef} shortcut="Canvas" onClick={() => handleShortcut("Canvas")}/>
                <ShortcutButton
                    refEl={tmsRef}
                    shortcut="TMS"
                    onClick={() => handleShortcut("TMS")}
                    extraButton={t(i18n_KEYS.FOCUS)}
                    extraButtonOnClick={handleTmsFocus}
                    extraButtonTooltip={focusTooltip}
                />
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
