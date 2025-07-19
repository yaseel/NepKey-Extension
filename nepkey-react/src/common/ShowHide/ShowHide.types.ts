import {HTMLInputTypeAttribute} from "react";

export interface ShowHideProps {
    type: HTMLInputTypeAttribute;
    setType: React.Dispatch<React.SetStateAction<HTMLInputTypeAttribute>>;
}