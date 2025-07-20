import shown from "../../../public/images/shown.png";
import hidden from "../../../public/images/hidden.png";
import {i18nKeys} from "../../constants.ts";
import Button from "../Button/Button.tsx";
import {ShowHideProps} from "./ShowHide.types.ts";
import styles from "./ShowHide.module.css";
import {useTranslation} from "react-i18next";

const ShowHide: React.FC<ShowHideProps> = ({type, setType}) => {
    const {t} = useTranslation();
    return (
        <div className={styles.container}>
            {
                type === "password"
                    ? (
                        <Button icon={hidden} alt={t(i18nKeys.SHOW)} onClick={() => setType("text")}/>
                    ) : (
                        <Button icon={shown} alt={t(i18nKeys.HIDE)} onClick={() => setType("password")}/>
                    )
            }
        </div>
    );}

export default ShowHide;