export type Language = "en" | "hu";

export interface Settings {
    neptunCode: string;
    password: string;
    tmsPassword: string;
    otpSecret: string;
    autoStudentWeb: boolean;
    language: Language;
}

export type Platform = "Neptun" | "Canvas" | "TMS";

export type Action = "neptunLogin" | "neptunTOTP" | "studentWebClick" | "canvasLogin" | "loginWithNeptun" | "idpLogin" | "tmsLogin";

export interface Message<T> {
    action: Action;
    payload: T;
}

export interface MessageResponse {
    ok: boolean;
    message?: string;
}