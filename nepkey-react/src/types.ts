export type Language = "en" | "hu";

export interface Settings {
    neptunCode: string;
    password: string;
    tmsPassword: string;
    otpSecret: string;
    autoStudentWeb: boolean;
    language: Language;
}

export type Action = "open";

export interface Message<T> {
    action: Action;
    payload: T;
}