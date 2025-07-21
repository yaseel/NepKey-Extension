import {ShortcutButtonProps} from "./ShortcutButton.types.ts";

import styles from "./ShortcutButton.module.css";
import Button from "../../common/Button/Button.tsx";

import neptun from "../../../public/images/neptun.png";
import canvas from "../../../public/images/canvas.png";
import tms from "../../../public/images/tms.png";
import {useEffect} from "react";
import GlowEffect from "../GlowEffect/GlowEffect.tsx";
import {getGlowColor} from "../../helpers/getGlowColor.ts";

const ShortcutButton: React.FC<ShortcutButtonProps> = (props) => {
    let imgSrc;
    if (props.shortcut === "Neptun") imgSrc = neptun;
    else if (props.shortcut === "Canvas") imgSrc = canvas;
    else if (props.shortcut === "TMS") imgSrc = tms;

    useEffect(() => {
        const btn = props.refEl.current;
        if (!btn) return;
        const onEnter = () => btn.classList.add(styles.isHovering);
        const onLeave = () => {
            btn.classList.remove(styles.isHovering);
            btn.style.setProperty("--intensity", "0");
        };
        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mouseleave", onLeave);
        return () => {
            btn.removeEventListener("mouseenter", onEnter);
            btn.removeEventListener("mouseleave", onLeave);
        }
    }, [props.refEl]);

    // Set body glow color on hover
    useEffect(() => {
        const btn = props.refEl.current;
        if (!btn) return;
        const root = document.getElementById('root');
        if (!root) return;
        const color = getGlowColor(props.shortcut);
        const defaultColor = getGlowColor("Neptun"); // use Neptun as default
        const handleEnter = () => root.style.setProperty('--body-glow-color', color);
        const handleLeave = () => root.style.setProperty('--body-glow-color', defaultColor);
        btn.addEventListener('mouseenter', handleEnter);
        btn.addEventListener('mouseleave', handleLeave);
        return () => {
            btn.removeEventListener('mouseenter', handleEnter);
            btn.removeEventListener('mouseleave', handleLeave);
        };
    }, [props.refEl, props.shortcut]);

    return (
        <div className={styles.relative}>
            <button ref={props.refEl} className={styles.button} onClick={props.onClick}>
                <img src={imgSrc} alt={props.shortcut}/>
                {props.shortcut}
            </button>

            <GlowEffect ref={props.refEl} shortcut={props.shortcut} />

            {props.extraButton
                ? (
                    <Button text={props.extraButton} extra={true}/>
                ) : (
                    <></>
                )}
        </div>
    );}

export default ShortcutButton;