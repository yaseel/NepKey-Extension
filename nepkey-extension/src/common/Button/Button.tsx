import React, { forwardRef } from "react";
import { ButtonProps } from "./Button.types.ts";
import styles from "./Button.module.css";


const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { text, icon, alt, link, onClick, extra, className: _, style: __, ...rest } = props;

    const content = text ? text : <img src={icon} alt={alt}/> 

    const style = text ? [styles.text] : [styles.icon];
    const extraStyle = extra ? [styles.extra] : [];

    const openLink = () => {
        if (link) window.open(link, "_blank");
    };

    return (
        <button
            ref={ref}
            className={[...style, ...extraStyle, styles.button].join(" ")}
            onClick={link ? openLink : onClick}
            {...rest}
        >
            {content}
        </button>
    );});

export default Button;