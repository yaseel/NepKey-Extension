
import {Action, Message} from "../types.ts";

// Use self for service worker, window for others
const _global = typeof self !== "undefined" ? self : window;
export const browserApi = (_global.browser ?? _global.chrome) as unknown as typeof chrome;

export async function sendBackgroundMessage<T>(message: Message<T>) {
    try {
        await browserApi.runtime.sendMessage({action: message.action, payload: message.payload});
    } catch (e) {
        console.error("Error sending message to background: ", e);
    }
}

export async function sendContentMessage<T>(tabId: number, message: Message<T>) {
    try {
        await browserApi.tabs.sendMessage(tabId, {action: message.action, payload: message.payload});
    } catch (e) {
        console.error("Error sending message to content: ", e);
    }
}

export function onMessage<T, R = void>(action: Action, doThis: (msg: Message<T>, sendResponse: (response: R) => void) => void | Promise<void>) {
    const listener = (msg: unknown, sender: unknown, sendResponse: (response: R) => void) => {
        if (
            typeof msg === "object" &&
            msg !== null &&
            (msg as Message<T>).action === action
        ) {
            // Support async handlers
            const result = doThis(msg as Message<T>, sendResponse);
            if (result instanceof Promise) {
                result.then(); // handler can call sendResponse when ready
                return true; // keep the message channel open for async response
            }
        }
    };
    browserApi.runtime.onMessage.addListener(listener);
    return () => browserApi.runtime.onMessage.removeListener(listener);
}
