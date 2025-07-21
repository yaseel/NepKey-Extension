
export interface ShortcutButtonProps {
    shortcut: "Neptun" | "Canvas" | "TMS";
    onClick: () => void;
    extraButton?: string;
    refEl: React.RefObject<HTMLButtonElement | null>;
}