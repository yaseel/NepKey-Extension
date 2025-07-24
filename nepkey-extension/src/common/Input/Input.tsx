import {InputProps} from "./Input.types.ts";
import styles from "./Input.module.css";
import ShowHide from "../ShowHide/ShowHide.tsx";
import {forwardRef, useState} from "react";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const [type, setType] = useState(props.type);
    const {
        value, onChange, onBlur, onFocus, type: originalType,
        id, placeholder, labelText, className: _, style: __, ...rest
    } = props;

    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={id}>{labelText}</label>
            <input
                ref={ref}
                className={styles.input}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                {...rest}
            />

            {originalType === "password" && <ShowHide type={type} setType={setType}/>}
        </div>
    );
});


export default Input;