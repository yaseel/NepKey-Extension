import {onMessage, sendContentMessage} from "./helpers/messaging.ts";
import {isUserLoggedIn, openTabAndWait, waitForTabLoad} from "./helpers/tab.ts";
import { Settings } from "./types.ts";
import {NEPTUN_LOGIN_LINK, QUERY_SELECTORS} from "./constants.ts";

onMessage<Settings>("neptunLogin", async (msg) => {
    try {
        const tab = await openTabAndWait(NEPTUN_LOGIN_LINK);

        const loggedIn = await isUserLoggedIn(tab.id!);

        if (!loggedIn) {
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
        }

        if (msg.payload.autoStudentWeb) {
            await waitForTabLoad(tab.id!, true, [QUERY_SELECTORS.NEPTUN_SWEB_LINK]);

            const swebRes = await sendContentMessage(tab.id!, {
                action: "studentWebClick",
                payload: null
            });

            if (swebRes && !swebRes.ok) {
                console.error("Student Web click failed: ", swebRes.message);
                return;
            }
        }

    } catch (error) {
        console.error("Error in neptunLogin handler:", error);
    }
});