import {browserApi} from "./message.ts";

function waitForTabComplete(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
        const listener = (
            updatedId: number,
            changeInfo: chrome.tabs.OnUpdatedInfo,
            tab: chrome.tabs.Tab
        ) => {
            if (updatedId === tabId && changeInfo.status === "complete") {
                browserApi.tabs.onUpdated.removeListener(listener);
                resolve(tab);
            }
        };
        browserApi.tabs.onUpdated.addListener(listener);
    });
}

export async function waitForTabLoad(tabId: number): Promise<chrome.tabs.Tab> {
    return waitForTabComplete(tabId);
}

export async function openTabAndWait(url: string): Promise<chrome.tabs.Tab> {
    return new Promise(async (resolve) => {
        let tabId: number | undefined;

        const listener = (
            updatedId: number,
            changeInfo: chrome.tabs.OnUpdatedInfo,
            tab: chrome.tabs.Tab
        ) => {
            if (updatedId === tabId && changeInfo.status === "complete") {
                browserApi.tabs.onUpdated.removeListener(listener);
                resolve(tab);
            }
        };

        browserApi.tabs.onUpdated.addListener(listener);
        const tab = await browserApi.tabs.create({ url });
        tabId = tab.id!;
    });
}