import React, { useState, useRef, useEffect } from "react";
import {LanguageSelectProps} from "./LanguageSelect.types.ts";
import dropdown from "../../../public/images/dropdown.png";
import {i18n_KEYS, LANGUAGE_OPTIONS} from "../../constants.ts";
import styles from "./LanguageSelect.module.css";
import {Language} from "../../types.ts";
import {useTranslation} from "react-i18next";

const LanguageSelect: React.FC<LanguageSelectProps> = ({value, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {t} = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (lang: Language) => {
        onChange(lang);
        setIsOpen(false);
    };

    const selectedOption = LANGUAGE_OPTIONS.find(opt => opt.value === value);

    return (
        <div className={styles.customSelect} ref={dropdownRef}>
            <button 
                className={styles.trigger} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t(i18n_KEYS.LANGUAGE)}
            >
                <span>{selectedOption?.label || value}</span>
                <img 
                    src={dropdown} 
                    alt={t(i18n_KEYS.DROPDOWN)}
                    className={`${styles.icon} ${isOpen ? styles.iconRotated : ''}`}
                />
            </button>

            {isOpen && (
                <div className={styles.content}>
                    <div className={styles.viewport}>
                        {LANGUAGE_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                className={`${styles.item} ${opt.value === value ? styles.itemSelected : ''}`}
                                onClick={() => handleSelect(opt.value)}
                            >
                                <span>{opt.label}</span>
                                {opt.value === value && <span className={styles.indicator}>•</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelect;