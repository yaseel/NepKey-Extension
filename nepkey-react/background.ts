import {browserApi, onMessage} from "./src/helpers/messaging";

const unsubscribe = onMessage("open", (msg) => {
    browserApi.tabs.create({url: "http://neptun.elte.hu"});
});