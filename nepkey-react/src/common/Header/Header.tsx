import styles from "./Header.module.css";
import {i18nKeys, SETTINGS_PATH} from "../../constants.ts";
import Button from "../Button/Button.tsx";
import back from "../../../public/images/back.png";
import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import questionMark from "../../../public/images/questionMark.png";
import settings from "../../../public/images/settings.png";
import {useTranslation} from "react-i18next";




const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();
    const isHome = location.pathname === "/";

    return (
        <header className={styles.header}>
            <h1>{ isHome ? t(i18nKeys.NEPKEY) : t(i18nKeys.SETTINGS)}</h1>
            <div>
                { isHome
                    ? (
                        <>
                            <Button icon={questionMark} alt={t(i18nKeys.HELP)}/>
                            <Button icon={settings} alt={t(i18nKeys.SETTINGS)} onClick={() => navigate(SETTINGS_PATH)}/>
                        </>
                    ) : (
                        <Button icon={back} alt={t(i18nKeys.BACK)} onClick={() => navigate(-1)}/>
                    )
                }
            </div>
        </header>
    );}

export default Header;
