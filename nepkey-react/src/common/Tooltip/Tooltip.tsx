import React, { useRef, useEffect } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  exit?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ children, style, className, exit, onMouseEnter, onMouseLeave }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tooltipEl = tooltipRef.current;
    if (!tooltipEl) return;
    const handleMouseDown = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      // Traverse up in case the click is on a child of <a>
      while (target && target !== tooltipEl) {
        if (target.tagName === 'A') {
          const href = (target as HTMLAnchorElement).href;
          if (href) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
              chrome.tabs.create({ url: href });
            } else {
              window.open(href, '_blank');
            }
          }
          break;
        }
        target = target.parentElement;
      }
    };
    tooltipEl.addEventListener('mousedown', handleMouseDown);
    return () => {
      tooltipEl.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${exit ? styles["tooltip-exit"] : ""} ${className || ""}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.arrow}>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="1,10 9,2 17,10" fill="rgba(0,0,10,0.55)" />
        </svg>
      </div>
      {children}
    </div>
  );
};

export default Tooltip; 