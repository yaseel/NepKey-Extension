import shown from "../../../public/images/shown.png";
import hidden from "../../../public/images/hidden.png";
import {TEXT_HIDE, TEXT_SHOW} from "../../constants.ts";
import Button from "../Button/Button.tsx";
import {ShowHideProps} from "./ShowHide.types.ts";
import styles from "./ShowHide.module.css";

const ShowHide: React.FC<ShowHideProps> = ({type, setType}) => {

    return (
        <div className={styles.container}>
            {
                type === "password"
                    ? (
                        <Button icon={hidden} alt={TEXT_SHOW} onClick={() => setType("text")}/>
                    ) : (
                        <Button icon={shown} alt={TEXT_HIDE} onClick={() => setType("password")}/>
                    )
            }
        </div>
    );}

export default ShowHide;