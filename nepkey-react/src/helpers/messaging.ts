
import {Action, Message} from "../types.ts";

// Use self for service worker, window for others
const _global = typeof self !== "undefined" ? self : window;
export const browserApi = (_global.browser ?? _global.chrome) as unknown as typeof chrome;

export async function sendMessage<T>(message: Message<T>) {
    try {
        await browserApi.runtime.sendMessage({action: message.action, payload: message.payload});
    } catch (e) {
        // Retry once after a short delay
        await new Promise(res => setTimeout(res, 200));
        await browserApi.runtime.sendMessage({action: message.action, payload: message.payload});
        console.error(e);
    }
}

export function onMessage<T>(action: Action, doThis: (msg: Message<T>) => void) {
    const listener = (msg: unknown) => {
        if (
            typeof msg === "object" &&
            msg !== null &&
            (msg as Message<T>).action === action
        ) {
            doThis(msg as Message<T>);
        }
    };
    browserApi.runtime.onMessage.addListener(listener);
    return () => browserApi.runtime.onMessage.removeListener(listener);
}
