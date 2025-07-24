import React from "react";
import { ToggleProps } from "./Toggle.types.ts";
import { styled } from "@mui/material/styles";
import MuiSwitch from "@mui/material/Switch";
import styles from "./Toggle.module.css";

const CustomSwitch = styled(MuiSwitch)(({ theme }) => ({
    width: 44,
    height: 24,
    padding: 0,
    display: "flex",
    '& .MuiSwitch-switchBase': {
        padding: 2,
        transitionDuration: '300ms',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.08)',
        },
        '@media (hover: none)': {
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-checked': {
            '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.08)',
            },
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                background: 'var(--primary-blue)',
                opacity: 1,
            },
        },
    },
    '& .MuiSwitch-track': {
        borderRadius: 999,
        background: 'var(--frosted-gray-30)',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 250,
        }),
    },
})) as typeof MuiSwitch;

const Toggle: React.FC<ToggleProps> = (props) => {
    return (
        <label className={styles.switch}>
            <span>{props.text}</span>
            <CustomSwitch
                disableRipple
                checked={props.checked}
                onChange={props.onChange}
                onBlur={props.onBlur}
                slotProps={{ input: { 'aria-label': props.text } }}
            />
        </label>
    );
}

export default Toggle;