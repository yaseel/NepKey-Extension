import {HyperlinkProps} from "./Hyperlink.types.ts";
import styles from "./Hyperlink.module.css";


const Hyperlink: React.FC<HyperlinkProps> = ({text, icon, link}) => {
    return (
        <a href={link} target="_blank" className={styles.container}>
            <img src={icon} alt={icon}/>
            <span>{text}</span>
        </a>
    );}

export default Hyperlink;