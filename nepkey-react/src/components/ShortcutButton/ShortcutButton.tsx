import {ShortcutButtonProps} from "./ShortcutButton.types.ts";

import styles from "./ShortcutButton.module.css";
import Button from "../../common/Button/Button.tsx";

import neptun from "../../../public/images/neptun.png";
import canvas from "../../../public/images/canvas.png";
import tms from "../../../public/images/tms.png";


const ShortcutButton: React.FC<ShortcutButtonProps> = (props) => {

    let imgSrc;
    if (props.shortcut === "Neptun") imgSrc = neptun;
    else if (props.shortcut === "Canvas") imgSrc = canvas;
    else if (props.shortcut === "TMS") imgSrc = tms;

    return (
        <div className={styles.relative}>
            <button className={styles.button}>
                <img src={imgSrc} alt={props.shortcut}/>
                {props.shortcut}
            </button>

            {props.extraButton
                ? (
                    <Button text={props.extraButton} extra={true}/>
                ) : (
                    <></>
                )}
        </div>
    );}

export default ShortcutButton;