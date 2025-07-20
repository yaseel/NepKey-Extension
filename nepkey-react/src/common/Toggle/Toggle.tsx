import {ToggleProps} from "./Toggle.types.ts";
import styles from "./Toggle.module.css";

const Toggle: React.FC<ToggleProps> = (props) => {
    return (
        <label className={styles.switch}>
            <span>{props.text}</span>
            <input type="checkbox" checked={props.checked} onChange={props.onChange} onBlur={props.onBlur}/>
            <span className={styles.track}></span>
        </label>
    );}

export default Toggle;