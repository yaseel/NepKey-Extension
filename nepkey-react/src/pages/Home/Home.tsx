import React, { createRef } from "react";
import styles from "./Home.module.css";
import {i18n_KEYS} from "../../constants.ts";
import ShortcutButton from "../../components/ShortcutButton/ShortcutButton.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { useBodyGlow } from "../../hooks/useBodyGlow";
import Header from "../../components/Header/Header.tsx";
import {useTranslation} from "react-i18next";

const Home = () => {
    const neptunRef = createRef<HTMLButtonElement | null>();
    const canvasRef = createRef<HTMLButtonElement | null>();
    const tmsRef = createRef<HTMLButtonElement | null>();
    useBodyGlow([neptunRef, canvasRef, tmsRef]);
    const {t} = useTranslation();

    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <ShortcutButton refEl={neptunRef} shortcut="Neptun"/>
                <ShortcutButton refEl={canvasRef} shortcut="Canvas"/>
                <ShortcutButton refEl={tmsRef} shortcut="TMS" extraButton={t(i18n_KEYS.FOCUS)}/>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
