import React, { createRef } from "react";
import styles from "./Home.module.css";
import {i18n_KEYS} from "../../constants.ts";
import ShortcutButton from "../../components/ShortcutButton/ShortcutButton.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { useBodyGlow } from "../../hooks/useBodyGlow";
import Header from "../../components/Header/Header.tsx";
import {useTranslation} from "react-i18next";
import {useSettings} from "../../hooks/useSettings.ts";
import {executeNeptunLogin} from "../../helpers/executeNeptunLogin.ts";

const Home = () => {
    const neptunRef = createRef<HTMLButtonElement | null>();
    const canvasRef = createRef<HTMLButtonElement | null>();
    const tmsRef = createRef<HTMLButtonElement | null>();
    useBodyGlow([neptunRef, canvasRef, tmsRef]);
    const {t} = useTranslation();
    const {settings} = useSettings();

    const handleShortcut = async (platform: "Neptun" | "Canvas" | "TMS") => {
        if (platform === "Neptun") await executeNeptunLogin(settings);
        else if (platform === "Canvas") await executeNeptunLogin(settings);
        else await executeNeptunLogin(settings);
    };

    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <ShortcutButton refEl={neptunRef} shortcut="Neptun" onClick={() => handleShortcut("Neptun")}/>
                <ShortcutButton refEl={canvasRef} shortcut="Canvas" onClick={() => handleShortcut("Neptun")}/>
                <ShortcutButton refEl={tmsRef} shortcut="TMS" onClick={() => handleShortcut("Neptun")} extraButton={t(i18n_KEYS.FOCUS)}/>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
