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
    OTP_SECRET_TOOLTIP: "otp_secret_tooltip",
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
export const GITHUB_LINK = "https://github.com/yaseel/NepKey-Extension";
export const GITHUB_README_LINK = "https://github.com/yaseel/NepKey-Extension/blob/main/README.md";
export const NEPTUN_LOGIN_LINK = "https://neptun.elte.hu/Account/Login";
export const CANVAS_LOGIN_LINK = "https://canvas.elte.hu";
export const TMS_LOGIN_LINK = "https://tms.inf.elte.hu";
export const SETTINGS_PATH = "/settings";

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
    { value: 'en', label: "English" },
    { value: 'hu', label: "Magyar" }
];

export const QUERY_SELECTORS = {
    NEPTUN_CODE_INPUT: '#LoginName',
    NEPTUN_PASSWORD_INPUT: '#Password',
    NEPTUN_LOGIN_SUBMIT: 'input[type=submit]',
    TOTP_CODE_INPUT: 'input[name=TOTPCode]',
    TOTP_LOGIN_SUBMIT: 'button[type="submit"].btn.btn-primary',
    NEPTUN_SWEB_LINK: 'a[href="/ToNeptunWeb/ToNeptunHWeb"]',
    LOGIN_WITH_NEPTUN_LINK: 'a[href="/login/saml"]',
    IDP_CODE_INPUT: '#username_neptun',
    IDP_PASSWORD_INPUT: '#password_neptun',
    IDP_LOGIN_SUBMIT: 'input[type=submit]',
    TMS_CODE_INPUT: 'input[name="username"]',
    TMS_PASSWORD_INPUT: 'input[name="password"]',
    TMS_LOGIN_BUTTON: 'button[type="submit"]'
}