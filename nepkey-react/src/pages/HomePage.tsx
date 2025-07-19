import React from "react";

import Button from "../common/Button/Button.tsx";

import questionMark from "../../public/images/questionMark.png";
import settings from "../../public/images/settings.png";


import styles from "./HomePage.module.css"
import {FOCUS, NEPKEY} from "../constants.ts";
import ShortcutButton from "../components/ShortcutButton/ShortcutButton.tsx";
import Footer from "../common/Footer/Footer.tsx";


const HomePage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{NEPKEY}</h1>
                <div>
                    <Button icon={questionMark}/>
                    <Button icon={settings}/>
                </div>
            </header>

            <main className={styles.main}>
                <ShortcutButton shortcut="Neptun"/>
                <ShortcutButton shortcut="Canvas"/>
                <ShortcutButton shortcut="TMS" extraButton={FOCUS}/>
            </main>

            <Footer/>
        </div>
    );
};

export default HomePage;
