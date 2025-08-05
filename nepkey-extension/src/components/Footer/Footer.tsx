import Hyperlink from "../../common/Hyperlink/Hyperlink.tsx";
import {GITHUB_LINK, i18n_KEYS} from "../../constants.ts";
import github from "../../../public/images/github.svg";
import styles from "./Footer.module.css";
import {useTranslation} from "react-i18next";


const Footer: React.FC = () => {
    const {t} = useTranslation();
    return (
        <footer className={styles.footer}>

            <hr/>

            <div className={styles.div}>
                <Hyperlink text={t(i18n_KEYS.GITHUB)} icon={github} link={GITHUB_LINK}/>
            </div>
        </footer>
    );}

export default Footer;