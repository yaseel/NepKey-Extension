import {ButtonProps} from "./Button.types.ts";
import styles from "./Button.module.css";


const Button: React.FC<ButtonProps> = (props) => {

    const content = props.text ? props.text : <img src={props.icon} alt={props.icon}/>

    const style = props.text ? [styles.text] : [styles.icon];


    return (
        <>
            <button className={[...style, styles.button].join(" ")} onClick={props.onClick}>{content}</button>
        </>
    );}

export default Button;