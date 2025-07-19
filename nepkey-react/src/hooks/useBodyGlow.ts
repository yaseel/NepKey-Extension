import { useEffect, RefObject } from "react";

/**
 * Parse a CSS rgb string (e.g. '255,140,0') into an array of numbers.
 */
function parseRGB(str: string): number[] {
    return str.split(',').map(s => parseInt(s.trim(), 10));
}

/**
 * Custom hook to handle body glow color and position based on proximity to buttons.
 * @param buttonRefs Array of refs to the buttons
 */
export function useBodyGlow(buttonRefs: RefObject<HTMLButtonElement | null>[]) {
    useEffect(() => {
        const root = document.getElementById('root');
        if (!root) return;
        // Set default glow position and color
        root.style.setProperty('--body-glow-x', '50%');
        root.style.setProperty('--body-glow-y', '50%');
        root.style.setProperty('--body-glow-intensity', '0');
        /**
         * Get the current button glow colors from CSS variables.
         */
        function getGlowColors() {
            if (!root) return [[0,180,255],[255,140,0],[255,255,255]];
            const styles = getComputedStyle(root as Element);
            return [
                parseRGB(styles.getPropertyValue('--glow-color-neptun') || '0,125,198'),
                parseRGB(styles.getPropertyValue('--glow-color-canvas') || '226,62,41'),
                parseRGB(styles.getPropertyValue('--glow-color-tms') || '255,255,255')
            ];
        }
        /**
         * Blend two RGB colors by a ratio (0 = all c1, 1 = all c2)
         */
        function blendColors(c1: number[], c2: number[], ratio: number) {
            return [
                Math.round(c1[0] * (1 - ratio) + c2[0] * ratio),
                Math.round(c1[1] * (1 - ratio) + c2[1] * ratio),
                Math.round(c1[2] * (1 - ratio) + c2[2] * ratio)
            ];
        }
        function handleMove(e: MouseEvent) {
            if (!root) return;
            const buttonColors = getGlowColors();
            // Get all button centers
            const centers = buttonRefs.map(ref => {
                const btn = ref.current;
                if (!btn) return null;
                const rect = btn.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            });
            // Get pointer position
            const px = e.clientX;
            const py = e.clientY;
            // Find two closest buttons
            const dists = centers.map(c => c ? Math.hypot(px - c.x, py - c.y) : Infinity);
            const sorted = dists
                .map((d, i) => ({ d, i }))
                .sort((a, b) => a.d - b.d);
            const i1 = sorted[0]?.i ?? 0;
            const i2 = sorted[1]?.i ?? 0;
            const d1 = sorted[0]?.d ?? 1;
            const d2 = sorted[1]?.d ?? 1;
            // Blend colors based on distance
            let ratio = d1 + d2 === 0 ? 0 : d2 / (d1 + d2);
            if (d1 === 0) ratio = 0; // exactly on a button: use its color
            const blended = blendColors(buttonColors[i1], buttonColors[i2], ratio);
            root.style.setProperty('--body-glow-color', blended.join(","));
            // Set glow position as percentage of root
            const rootRect = root.getBoundingClientRect();
            const xPercent = ((px - rootRect.left) / rootRect.width) * 100;
            const yPercent = ((py - rootRect.top) / rootRect.height) * 100;
            root.style.setProperty('--body-glow-x', `${xPercent}%`);
            root.style.setProperty('--body-glow-y', `${yPercent}%`);
        }
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [buttonRefs]);
} 