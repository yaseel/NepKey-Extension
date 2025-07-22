import {onMessage} from "./src/helpers/messaging";
import { Settings } from "./src/types";

const unsubscribe = onMessage<Settings>("neptunLogin", (msg, sendResponse) => {

    const userInput = document.getElementById("LoginName") as HTMLInputElement;
    const passInput = document.getElementById("Password") as HTMLInputElement;
    const loginButton = document.querySelector("input[type=submit]") as HTMLInputElement;

    if (userInput && passInput && loginButton) {
        userInput.value = msg.payload.neptunCode;
        passInput.value = msg.payload.password;

        userInput.dispatchEvent(new Event("input", {bubbles: true}));
        passInput.dispatchEvent(new Event("input", {bubbles: true}));

        loginButton.click();
        console.log("Clicked login button.");

    } else {
        console.log("Login fields not found.");
    }

    sendResponse();
});

const unsubscribe2 = onMessage("neptunTOTP", (_, sendResponse) => {


});