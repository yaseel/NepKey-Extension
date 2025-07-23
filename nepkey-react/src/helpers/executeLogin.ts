import {sendBackgroundMessage} from "./message.ts";
import {Platform, Settings} from "../types.ts";

export async function executeLogin(settings: Partial<Settings>, platform: Platform) {
    try {

        if (platform === "Neptun") await sendBackgroundMessage({action: "neptunLogin", payload: settings});
        else if (platform === "Canvas") await sendBackgroundMessage({action: "canvasLogin", payload: settings});
        else await sendBackgroundMessage({action: "tmsLogin", payload: settings});

    } catch (e) {
        console.error("Error sending login message to background.js: ", e);
    }
}
