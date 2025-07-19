import Hyperlink from "../Hyperlink/Hyperlink.tsx";
import {TEXT_ASEEL, TEXT_GITHUB, GITHUB_LINK, LINKEDIN_LINK} from "../../constants.ts";
import github from "../../../public/images/github.svg";
import linkedin from "../../../public/images/linkedin.svg";
import styles from "./Footer.module.css";


const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>

            <hr/>

            <div className={styles.div}>
                <Hyperlink text={TEXT_ASEEL} icon={linkedin} link={LINKEDIN_LINK}/>
                <Hyperlink text={TEXT_GITHUB} icon={github} link={GITHUB_LINK}/>
            </div>
        </footer>
    );}

export default Footer;