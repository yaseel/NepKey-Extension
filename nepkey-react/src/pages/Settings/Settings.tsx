import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "../Home/Home.module.css";
import {SETTINGS} from "../../constants.ts";
import Button from "../../common/Button/Button.tsx";
import back from "../../../public/images/back.png";

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div>
            <header className={styles.header}>
                <h1>{SETTINGS}</h1>
                <div>
                    <Button icon={back} onClick={() => navigate(-1)}/>
                </div>
            </header>
        </div>
    );
};

export default Settings;
