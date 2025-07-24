
export interface ShortcutButtonProps {
    shortcut: "Neptun" | "Canvas" | "TMS";
    onClick: () => void;
    extraButton?: string;
    extraButtonOnClick?: () => void;
    extraButtonTooltip?: React.ReactNode;
    refEl: React.RefObject<HTMLButtonElement | null>;
}