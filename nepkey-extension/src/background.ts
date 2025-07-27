import {browserApi, onMessage, sendContentMessage} from "./helpers/message.ts";
import {openTabAndWait, waitForTabLoad} from "./helpers/tab.ts";
import {MessageResponse, Settings} from "./types.ts";
import {CANVAS_LOGIN_LINK, NEPTUN_LOGIN_LINK, QUERY_SELECTORS, TMS_LOGIN_LINK} from "./constants.ts";
import {loggedInCanvas, loggedInNeptun, loggedInTms} from "./helpers/loggedIn.ts";
import {getActiveTab} from "./helpers/getActiveTab.ts";
import {applyTmsFocusMode} from "./helpers/tmsFocusMode.ts";
import {migrateSettings} from "./helpers/migrateSettings.ts";

browserApi.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "update") {
        try {
            await migrateSettings();
        } catch (e) {
            console.warn("Settings migration failed:", e);
        }
    }
});

function ensureOk(res: MessageResponse | void) {
    if (res && !res.ok) throw new Error(res.message);
}

onMessage<Settings>("neptunLogin", async (msg) => {
    try {
        const tab = await openTabAndWait(NEPTUN_LOGIN_LINK);

        const loggedIn = await loggedInNeptun(tab.id!);

        if (!loggedIn) {
            await waitForTabLoad(tab.id!, false, [QUERY_SELECTORS.NEPTUN_CODE_INPUT, QUERY_SELECTORS.NEPTUN_PASSWORD_INPUT, QUERY_SELECTORS.NEPTUN_LOGIN_SUBMIT]);

            const loginRes = await sendContentMessage(tab.id!, {
                action: "neptunLogin",
                payload: msg.payload
            });

            ensureOk(loginRes);

            await waitForTabLoad(tab.id!, true, [QUERY_SELECTORS.TOTP_CODE_INPUT, QUERY_SELECTORS.TOTP_LOGIN_SUBMIT]);

            const totpRes = await sendContentMessage(tab.id!, {
                action: "neptunTOTP",
                payload: msg.payload
            });

            ensureOk(totpRes);
        }

        if (msg.payload.autoStudentWeb) {
            await waitForTabLoad(tab.id!, true, [QUERY_SELECTORS.NEPTUN_SWEB_LINK]);

            const swebRes = await sendContentMessage(tab.id!, {
                action: "studentWebClick",
                payload: null
            });

            ensureOk(swebRes);
        }

    } catch (e) {
        console.error("Error in neptunLogin handler:", e);
    }
});

onMessage<Settings>("canvasLogin", async (msg) => {
    try {
        const tab = await openTabAndWait(CANVAS_LOGIN_LINK);

        const loggedIn = await loggedInCanvas(tab.id!);

        if (!loggedIn) {
            await waitForTabLoad(tab.id!, true, [QUERY_SELECTORS.LOGIN_WITH_NEPTUN_LINK]);

            const loginWithNeptunRes = await sendContentMessage(tab.id!, {
                action: "loginWithNeptun",
                payload: null
            });

            ensureOk(loginWithNeptunRes);

            await waitForTabLoad(tab.id!, true, [QUERY_SELECTORS.IDP_CODE_INPUT, QUERY_SELECTORS.IDP_PASSWORD_INPUT, QUERY_SELECTORS.IDP_LOGIN_SUBMIT]);

            const idpLoginRes = await sendContentMessage(tab.id!, {
                action: "idpLogin",
                payload: msg.payload
            });

            ensureOk(idpLoginRes);

        }


    } catch (e) {
        console.error("Error in canvasLogin handler: ", e);
    }
});

onMessage("tmsLogin", async (msg) => {
    try {
        const tab = await openTabAndWait(TMS_LOGIN_LINK);

        const loggedIn = await loggedInTms(tab.id!);

        if (!loggedIn) {
            await waitForTabLoad(tab.id!, false, [QUERY_SELECTORS.TMS_CODE_INPUT, QUERY_SELECTORS.TMS_PASSWORD_INPUT, QUERY_SELECTORS.TMS_LOGIN_BUTTON]);

            const tmsLoginRes = await sendContentMessage(tab.id!, {
                action: "tmsLogin",
                payload: msg.payload
            });

            ensureOk(tmsLoginRes);
        }

    } catch (e) {
        console.error("Error in tmsLogin handler: ", e);
    }
});

onMessage("tmsFocus", async (msg, sendResponse) => {
    try {
        const tab = await getActiveTab();

        if (tab.url && tab.url.startsWith(TMS_LOGIN_LINK)) {
            await applyTmsFocusMode(tab.id!);
            sendResponse({ok: true});
        } else {
            sendResponse({ok: false});
        }

    } catch (e) {
        console.error("Error in tmsFocus handler: ", e);
    }
})