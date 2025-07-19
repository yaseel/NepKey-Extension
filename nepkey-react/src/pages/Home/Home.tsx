import React, { createRef } from "react";
import styles from "./Home.module.css";
import { TEXT_FOCUS} from "../../constants.ts";
import ShortcutButton from "../../components/ShortcutButton/ShortcutButton.tsx";
import Footer from "../../common/Footer/Footer.tsx";
import { useBodyGlow } from "../../hooks/useBodyGlow";
import Header from "../../common/Header/Header.tsx";

const Home = () => {
    const neptunRef = createRef<HTMLButtonElement | null>();
    const canvasRef = createRef<HTMLButtonElement | null>();
    const tmsRef = createRef<HTMLButtonElement | null>();
    useBodyGlow([neptunRef, canvasRef, tmsRef]);
    return (
        <div className={styles.container}>
            <Header/>

            <main className={styles.main}>
                <ShortcutButton refEl={neptunRef} shortcut="Neptun"/>
                <ShortcutButton refEl={canvasRef} shortcut="Canvas"/>
                <ShortcutButton refEl={tmsRef} shortcut="TMS" extraButton={TEXT_FOCUS}/>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
