export const getGlowColor = (shortcut: string) => {
    const root = document.getElementById('root');
    if (!root) return "0,180,255"; // fallback

    const styles = getComputedStyle(root);
    if (shortcut === "Canvas") return styles.getPropertyValue('--glow-color-canvas') || "255,140,0";
    if (shortcut === "TMS") return styles.getPropertyValue('--glow-color-tms') || "255,255,255";
    return styles.getPropertyValue('--glow-color-neptun') || "0,180,255"; // Neptun default
};