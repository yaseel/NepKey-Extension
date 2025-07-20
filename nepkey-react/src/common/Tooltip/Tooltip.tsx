import React from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  exit?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ children, style, className, exit, onMouseEnter, onMouseLeave }) => (
  <div
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

export default Tooltip; 