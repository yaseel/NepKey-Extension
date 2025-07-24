import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

type WrapperProps = TooltipProps & { className?: string };

const TooltipWrapper = styled(
    ({ className, ...props }: WrapperProps) => (
        <Tooltip {...props} arrow classes={{ popper: className! }} />
    )
)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "var(--overlay-background)",
            color: "var(--text-color)",
            maxWidth: 220,
            fontSize: "1rem",
            fontFamily: "'Instrument Sans', sans-serif",
            border: "none",
            backdropFilter: "var(--overlay-backdrop-filter)",
            borderRadius: "var(--overlay-border-radius)",
            padding: "8px 10px"
        },
        [`& .${tooltipClasses.tooltip} a`]: {
            color: "var(--primary-blue)",
        },
        [`& .${tooltipClasses.tooltip} a:hover`]: {
            color: "var(--primary-blue-55)",
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: "var(--overlay-background)",
        },
    })
);

export default TooltipWrapper;
