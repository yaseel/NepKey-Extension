// Generic input tooltip logic and HTML helper for use across any input field.
import { useRef, useState, RefObject, Dispatch, SetStateAction } from "react";
import { TFunction } from "i18next";
import {GITHUB_README_LINK} from "../constants.ts";

export interface UseInputTooltipParams {
    tooltipWidth?: number;
}

export interface UseInputTooltipResult {
    tooltipVisible: boolean;
    tooltipExiting: boolean;
    focused: boolean;
    tooltipAreaHovered: boolean;
    setTooltipAreaHovered: Dispatch<SetStateAction<boolean>>;
    tooltipWidth: number;
    wrapperRef: RefObject<HTMLDivElement | null>;
    handleFocus: () => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>, handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void) => void;
    handleMouseEnter: () => void;
    handleWrapperMouseLeave: () => void;
}

export function useInputTooltip({ tooltipWidth = 220 }: UseInputTooltipParams = {}): UseInputTooltipResult {
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipExiting, setTooltipExiting] = useState(false);
    const [focused, setFocused] = useState(false);
    const [tooltipAreaHovered, setTooltipAreaHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const showTooltip = () => {
        setTooltipVisible(true);
        setTooltipExiting(false);
    };
    const hideTooltip = () => {
        setTooltipExiting(true);
        setTimeout(() => {
            setTooltipVisible(false);
            setTooltipExiting(false);
        }, 140);
    };
    const handleFocus = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setFocused(true);
        showTooltip();
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void) => {
        handleInputBlur(e);
        setFocused(false);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hideTooltip();
    };
    const handleMouseEnter = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        if (!tooltipVisible && !focused) {
            hoverTimeout.current = setTimeout(() => {
                if (!focused) showTooltip();
            }, 1000);
        }
    };
    const handleWrapperMouseLeave = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        if (!focused && !tooltipAreaHovered) hideTooltip();
    };

    return {
        tooltipVisible,
        tooltipExiting,
        focused,
        tooltipAreaHovered,
        setTooltipAreaHovered,
        tooltipWidth,
        wrapperRef,
        handleFocus,
        handleBlur,
        handleMouseEnter,
        handleWrapperMouseLeave,
    };
}

export interface GetInputTooltipHtmlParams {
    i18n: { language: string };
    t: TFunction;
    i18n_KEYS: Record<string, string>;
    tooltipKey: string;
    linkText?: string;
    linkUrl?: string;
}

export function getInputTooltipHtml({ i18n, t, i18n_KEYS, tooltipKey, linkText, linkUrl }: GetInputTooltipHtmlParams): string {
    const lang = i18n.language;
    const raw = t(i18n_KEYS[tooltipKey]);
    const url = linkUrl || GITHUB_README_LINK;
    if (lang === 'hu') {
        // Hungarian: replace linkText or fallback
        const text = linkText || 'GitHub README-t';
        return raw.replace(
            text,
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        );
    } else {
        // English: replace linkText or fallback
        const text = linkText || 'GitHub README';
        return raw.replace(
            text,
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        );
    }
}