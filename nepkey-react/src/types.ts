export type Language = "en" | "hu";

export interface Settings {
    neptunCode: string;
    password: string;
    tmsPassword: string;
    otpSecret: string;
    autoStudentWeb: boolean;
    language: Language;
}

export type Action = "neptunLogin" | "neptunTOTP" | "studentWebClick" | "canvasLogin" | "tmsLogin";

export interface Message<T> {
    action: Action;
    payload?: T;
}