import {ToggleProps} from "./Toggle.types.ts";
import styles from "./Toggle.module.css";

const Toggle: React.FC<ToggleProps> = ({text}) => {
    return (
        <label className={styles.switch}>
            <span>{text}</span>
            <input type="checkbox"/>
            <span className={styles.track}></span>
        </label>
    );}

export default Toggle;