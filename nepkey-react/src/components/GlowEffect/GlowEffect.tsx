import { useEffect, useRef } from "react";
import { GlowEffectProps } from "./GlowEffect.types.ts";

const OUTER_RADIUS = 3.0; // start button aura farther out
const INTENSITY_INSIDE = 1.0;
const INTENSITY_EDGE = 0.85;
const INTENSITY_OUTER = 0.25;

const getGlowColor = (shortcut: string) => {
    const root = document.getElementById('root');
    if (!root) return "0,180,255"; // fallback
    
    const styles = getComputedStyle(root);
    if (shortcut === "Canvas") return styles.getPropertyValue('--glow-color-canvas') || "226,62,41";
    if (shortcut === "TMS") return styles.getPropertyValue('--glow-color-tms') || "255,255,255";
    return styles.getPropertyValue('--glow-color-neptun') || "0,125,198"; // Neptun default
};

const GlowEffect: React.FC<GlowEffectProps & { shortcut: string }> = ({ ref, scale = OUTER_RADIUS, shortcut }) => {
    const active = useRef(false);

    useEffect(() => {
        // Set --glow-color on the button for aura/edge
        const btn = ref.current;
        if (!btn) return;
        btn.style.setProperty('--glow-color', getGlowColor(shortcut));
    }, [ref, shortcut]);

    useEffect(() => {
        function setButtonAura(mx: number, my: number, intensity: number, edge: number) {
            const btn = ref.current;
            if (!btn) return;
            btn.style.setProperty("--mx", mx.toFixed(3));
            btn.style.setProperty("--my", my.toFixed(3));
            btn.style.setProperty("--intensity", intensity.toFixed(3));
            btn.style.setProperty("--edgeBoost", edge.toFixed(3));
        }

        function clearButtonAura() {
            const btn = ref.current;
            if (!btn) return;
            btn.style.setProperty("--intensity", "0");
            btn.style.setProperty("--edgeBoost", "0");
        }

        function setBodyGlow(xPercent: number, yPercent: number, intensity: number) {
            const root = document.getElementById('root');
            if (!root) return;
            root.style.setProperty("--body-glow-x", `${xPercent}%`);
            root.style.setProperty("--body-glow-y", `${yPercent}%`);
            root.style.setProperty("--body-glow-intensity", intensity.toFixed(3));
        }

        function handleMove(e: MouseEvent) {
            const btn = ref.current;
            if (!btn) return;
            const root = document.getElementById('root');
            if (!root) return;
            const rootRect = root.getBoundingClientRect();
            const xPercent = ((e.clientX - rootRect.left) / rootRect.width) * 100;
            const yPercent = ((e.clientY - rootRect.top) / rootRect.height) * 100;

            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - rect.left;
            const dy = e.clientY - rect.top;
            const mx = dx / rect.width;
            const my = dy / rect.height;
            const distX = (e.clientX - cx) / (rect.width / 2);
            const distY = (e.clientY - cy) / (rect.height / 2);
            const distNorm = Math.hypot(distX, distY);

            // DEBUG: Always set body glow intensity to 0.5
            setBodyGlow(xPercent, yPercent, 0.5);

            // Button aura: only update if within OUTER_RADIUS
            if (distNorm <= scale) {
                active.current = true;
                let edge = 0;
                if (distNorm <= 1) {
                    const edgeFalloff = Math.exp(-Math.abs(distNorm - 1) * 8);
                    edge = edgeFalloff;
                } else {
                    const edgeProximity = 1 - (distNorm - 1) / (scale - 1);
                    const edgeFalloff = Math.exp(-Math.abs(distNorm - 1) * 8);
                    edge = Math.max(0, edgeProximity * edgeFalloff);
                }
                let intensity = 0;
                if (distNorm <= 1) {
                    intensity = INTENSITY_EDGE + (1 - distNorm) * (INTENSITY_INSIDE - INTENSITY_EDGE);
                } else {
                    intensity = INTENSITY_OUTER * (1 - (distNorm - 1) / (scale - 1));
                }
                intensity = Math.max(0, Math.min(1, intensity));
                setButtonAura(Math.min(1, Math.max(0, mx)), Math.min(1, Math.max(0, my)), intensity, edge);
            } else {
                clearButtonAura();
                active.current = false;
            }
        }

        window.addEventListener("mousemove", handleMove);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            clearButtonAura();
            setBodyGlow(50, 50, 0);
        };
    }, [ref, scale]);

    return null;
};

export default GlowEffect;