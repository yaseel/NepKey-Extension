import {ButtonProps} from "./Button.types.ts";
import styles from "./Button.module.css";


const Button: React.FC<ButtonProps> = (props) => {

    const content = props.text ? props.text : <img src={props.icon} alt={props.alt}/>

    const style = props.text ? [styles.text] : [styles.icon];
    const extraStyle = props.extra ? [styles.extra] : [];

    const openLink = () => {
        window.open(props.link, "_blank")
    };

    return (
        <>
            <button className={[...style, ...extraStyle, styles.button].join(" ")} onClick={props.link ? openLink : props.onClick}>
                {content}
            </button>
        </>
    );}

export default Button;