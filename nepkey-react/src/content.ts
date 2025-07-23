import {onMessage} from "./helpers/messaging.ts";
import {Settings} from "./types.ts";
import {generateTOTP} from "./helpers/generateTOTP.ts";
import {QUERY_SELECTORS} from "./constants.ts";

onMessage<Settings>("neptunLogin", (msg, sendResponse) => {

    const userInput = document.getElementById(QUERY_SELECTORS.NEPTUN_CODE_INPUT) as HTMLInputElement;
    const passInput = document.getElementById(QUERY_SELECTORS.NEPTUN_PASSWORD_INPUT) as HTMLInputElement;
    const loginButton = document.querySelector<HTMLInputElement>(QUERY_SELECTORS.NEPTUN_LOGIN_SUBMIT);

    if (!userInput || !passInput || !loginButton) {
        sendResponse({ok: false, message: "Login fields not found."});
        return;
    }

    userInput.value = msg.payload.neptunCode;
    passInput.value = msg.payload.password;

    userInput.dispatchEvent(new Event("input", {bubbles: true}));
    passInput.dispatchEvent(new Event("input", {bubbles: true}));

    loginButton.click();

    sendResponse({ok: true});
});

onMessage<Settings>("neptunTOTP", async (msg, sendResponse) => {

    const totpInput = document.querySelector<HTMLInputElement>(QUERY_SELECTORS.TOTP_CODE_INPUT);
    const loginButton = document.querySelector<HTMLButtonElement>(QUERY_SELECTORS.TOTP_LOGIN_SUBMIT);


    if (!totpInput || !loginButton) {
        sendResponse({ok: false, message: "TOTP field not found."});
        return;
    }

    totpInput.value = await generateTOTP(msg.payload.otpSecret.trim());
    totpInput.dispatchEvent(new Event("input", {bubbles: true}));

    loginButton.click();

    sendResponse({ok: true});
});

onMessage("studentWebClick", (_, sendResponse) => {

    const swebLink = document.querySelector<HTMLAnchorElement>(QUERY_SELECTORS.NEPTUN_SWEB_LINK);

    if (!swebLink) {
        sendResponse({ok: false, message: "Student Web link not found."});
        return;
    }

    swebLink.click();
    sendResponse({ok: true});
});