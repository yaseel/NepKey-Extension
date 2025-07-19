
export interface ShortcutButtonProps {
    shortcut: "Neptun" | "Canvas" | "TMS";
    extraButton?: string;
    refEl: React.RefObject<HTMLButtonElement | null>;
}