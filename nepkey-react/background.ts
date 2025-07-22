import {onMessage, sendContentMessage} from "./src/helpers/messaging";
import {openTabAndWait} from "./src/helpers/openTab";
import { Settings } from "./src/types";

const unsubscribe = onMessage<Settings>("neptunLogin", async (msg) => {

    const tab = await openTabAndWait("http://neptun.elte.hu/Account/Login");

    await sendContentMessage(tab.id, {action: "neptunLogin", payload: msg.payload});
    await sendContentMessage(tab.id, {action: "neptunTOTP", payload: msg.payload});

});