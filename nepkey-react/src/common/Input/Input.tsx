import {InputProps} from "./Input.types.ts";
import styles from "./Input.module.css";
import ShowHide from "../ShowHide/ShowHide.tsx";
import {useState} from "react";

const Input: React.FC<InputProps> = (props) => {
    const [type, setType] = useState(props.type);

    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={props.id}>{props.labelText}</label>
            <input className={styles.input} value={props.value} onChange={props.onChange} onBlur={props.onBlur} type={type} id={props.id} name={props.id} placeholder={props.placeholder}/>
            {props.type === "password"
                ? <ShowHide type={type} setType={setType}/>
                : <></>
            }
        </div>
    );}

export default Input;