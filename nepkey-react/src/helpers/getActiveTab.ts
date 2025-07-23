import Tab = chrome.tabs.Tab;
import {browserApi} from "./message.ts";

export async function getActiveTab(): Promise<Tab> {
    const [tab] = await browserApi.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");
    return tab;
}