import {onMessage, sendContentMessage} from "./helpers/messaging.ts";
import {openTabAndWait, waitForTabLoad} from "./helpers/tab.ts";
import { Settings } from "./types.ts";

const unsubscribeNeptunLogin = onMessage<Settings>("neptunLogin", async (msg) => {
    try {
        // Open the login page and wait for it to load
        const tab = await openTabAndWait("http://neptun.elte.hu/Account/Login");

        // Wait for login form to be interactive
        await waitForTabLoad(tab.id!, false, ["#LoginName", "#Password", 'input[type="submit"]']);

        // Send login credentials
        const loginRes = await sendContentMessage(tab.id!, {
            action: "neptunLogin", 
            payload: msg.payload
        });

        if (loginRes && !loginRes.ok) {
            console.error("Login failed:", loginRes.message);
            return;
        }

        // Wait for the TOTP page to load and the TOTP input to be present
        await waitForTabLoad(tab.id!, true, ['input[name="TOTPCode"]', 'button[type="submit"].btn.btn-primary']);

        // Send TOTP to the updated tab
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