import {Language} from "./types.ts";

export const i18n_KEYS = {
    NEPKEY: "nepkey",
    SETTINGS: "settings",
    FOCUS: "focus",
    ASEEL: "aseel",
    GITHUB: "github",
    NEPTUN_CODE: "neptun_code",
    NEPTUN_CODE_PLACEHOLDER: "neptun_code_placeholder",
    PASSWORD: "password",
    PASSWORD_PLACEHOLDER: "password_placeholder",
    TMS_PASSWORD: "tms_password",
    TMS_PASSWORD_PLACEHOLDER: "tms_password_placeholder",
    OTP_SECRET: "otp_secret",
    OTP_SECRET_PLACEHOLDER: "otp_secret_placeholder",
    AUTO_STUDENT_WEB: "auto_student_web",
    SHOW: "show",
    HIDE: "hide",
    HELP: "help",
    BACK: "back",
    DROPDOWN: "dropdown",
    LANGUAGE: "language",
}

export const STORAGE_KEYS = {
    SETTINGS: "settings"
}

export const LINKEDIN_LINK = "https://www.linkedin.com/in/yaseel";
export const GITHUB_LINK = "https://github.com/NepKeyUni/NepKey-Extension";
export const SETTINGS_PATH = "/settings";

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
    { value: 'en', label: "English" },
    { value: 'hu', label: "Magyar" }
];