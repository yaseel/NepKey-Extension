
export interface ShortcutButtonProps {
    shortcut: "Neptun" | "Canvas" | "TMS";
    onClick: () => void;
    extraButton?: string;
    extraButtonOnClick?: () => void;
    refEl: React.RefObject<HTMLButtonElement | null>;
}