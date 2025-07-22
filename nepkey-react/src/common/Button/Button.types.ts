export interface ButtonProps {
    icon?: string;
    alt?: string;
    text?: string;
    link?: string;
    onClick?: () => void;
    extra?: boolean;
}