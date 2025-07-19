import styles from "./Header.module.css";
import {SETTINGS_PATH, TEXT_BACK, TEXT_HELP, TEXT_NEPKEY, TEXT_SETTINGS} from "../../constants.ts";
import Button from "../Button/Button.tsx";
import back from "../../../public/images/back.png";
import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import questionMark from "../../../public/images/questionMark.png";
import settings from "../../../public/images/settings.png";




const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <header className={styles.header}>
            <h1>{ isHome ? TEXT_NEPKEY : TEXT_SETTINGS}</h1>
            <div>
                { isHome
                    ? (
                        <>
                            <Button icon={questionMark} alt={TEXT_HELP}/>
                            <Button icon={settings} alt={TEXT_SETTINGS} onClick={() => navigate(SETTINGS_PATH)}/>
                        </>
                    ) : (
                        <Button icon={back} alt={TEXT_BACK} onClick={() => navigate(-1)}/>
                    )
                }
            </div>
        </header>
    );}

export default Header;
