import {Language} from "../../types.ts";

export interface LanguageSelectProps {
    value: string;
    onChange: (lang: Language) => void;
}

