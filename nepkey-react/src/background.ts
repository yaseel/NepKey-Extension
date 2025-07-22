import {onMessage, sendContentMessage} from "./helpers/messaging.ts";
import {openTabAndWait, waitForTabLoad} from "./helpers/tab.ts";
import { Settings } from "./types.ts";
import {QUERY_SELECTORS} from "./constants.ts";

const unsubscribeNeptunLogin = onMessage<Settings>("neptunLogin", async (msg) => {
    try {
        const tab = await openTabAndWait("http://neptun.elte.hu/Account/Login");

        await waitForTabLoad(tab.id!, false, [`#${QUERY_SELECTORS.NEPTUN_CODE_INPUT}`, `#${QUERY_SELECTORS.NEPTUN_PASSWORD_INPUT}`, QUERY_SELECTORS.NEPTUN_LOGIN_SUBMIT]);

        const loginRes = await sendContentMessage(tab.id!, {
            action: "neptunLogin", 
            payload: msg.payload
        });

        if (loginRes && !loginRes.ok) {
            console.error("Login failed:", loginRes.message);
            return;
        }

        await waitForTabLoad(tab.id!, true, [QUERY_SELECTORS.TOTP_CODE_INPUT, QUERY_SELECTORS.TOTP_LOGIN_SUBMIT]);

        const totpRes = await sendContentMessage(tab.id!, {
            action: "neptunTOTP", 
            payload: msg.payload
        });

        if (totpRes && !totpRes.ok) {
            console.error("TOTP submission failed:", totpRes.message);
            return;
        }

    } catch (error) {
        console.error("Error in neptunLogin handler:", error);
    }
});