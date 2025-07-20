export type Language = "en" | "hu";

export interface Settings {
    neptunCode: string;
    password: string;
    tmsPassword: string;
    otpSecret: string;
    autoStudentWeb: boolean;
    language: Language;
}