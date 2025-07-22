import styles from "./Header.module.css";
import {GITHUB_README_LINK, i18n_KEYS, SETTINGS_PATH} from "../../constants.ts";
import Button from "../../common/Button/Button.tsx";
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
            <h1>{ isHome ? t(i18n_KEYS.NEPKEY) : t(i18n_KEYS.SETTINGS)}</h1>
            <div>
                { isHome
                    ? (
                        <>
                            <Button icon={questionMark} alt={t(i18n_KEYS.HELP)} link={GITHUB_README_LINK}/>
                            <Button icon={settings} alt={t(i18n_KEYS.SETTINGS)} onClick={() => navigate(SETTINGS_PATH)}/>
                        </>
                    ) : (
                        <Button icon={back} alt={t(i18n_KEYS.BACK)} onClick={() => navigate(-1)}/>
                    )
                }
            </div>
        </header>
    );}

export default Header;
