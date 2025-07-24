import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    alt?: string;
    text?: string;
    link?: string;
    onClick?: () => void;
    extra?: boolean;

}