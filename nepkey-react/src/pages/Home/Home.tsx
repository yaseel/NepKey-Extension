import React, { createRef } from "react";
import Button from "../../common/Button/Button.tsx";
import questionMark from "../../../public/images/questionMark.png";
import settings from "../../../public/images/settings.png";
import styles from "./Home.module.css";
import { FOCUS, NEPKEY, SETTINGS_PATH } from "../../constants.ts";
import ShortcutButton from "../../components/ShortcutButton/ShortcutButton.tsx";
import Footer from "../../common/Footer/Footer.tsx";
import { useNavigate } from "react-router-dom";
import { useBodyGlow } from "../../hooks/useBodyGlow";

const Home = () => {
    const navigate = useNavigate();
    const neptunRef = createRef<HTMLButtonElement | null>();
    const canvasRef = createRef<HTMLButtonElement | null>();
    const tmsRef = createRef<HTMLButtonElement | null>();
    useBodyGlow([neptunRef, canvasRef, tmsRef]);
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{NEPKEY}</h1>
                <div>
                    <Button icon={questionMark}/>
                    <Button icon={settings} onClick={() => navigate(SETTINGS_PATH)}/>
                </div>
            </header>
            <main className={styles.main}>
                <ShortcutButton refEl={neptunRef} shortcut="Neptun"/>
                <ShortcutButton refEl={canvasRef} shortcut="Canvas"/>
                <ShortcutButton refEl={tmsRef} shortcut="TMS" extraButton={FOCUS}/>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
