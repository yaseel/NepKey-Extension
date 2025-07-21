import {sendMessage} from "./messaging.ts";
import {Settings} from "../types.ts";

export async function executeNeptunLogin(settings: Partial<Settings>) {
    try {
        await sendMessage({action: "open", payload: settings});
    } catch (e) {
        console.error("Error sending message 'open' to background.js: ", e);
    }
}
