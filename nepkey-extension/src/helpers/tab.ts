import {browserApi} from "./message.ts";

function delay(ms: number): Promise<void> {
    return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}

async function waitForElements(tabId: number, selectors: string[]): Promise<void> {
    const maxAttempts = 100;
    const interval = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const results = await browserApi.scripting.executeScript({
                target: { tabId },
                func: (sel: string[]) => sel.every(s => document.querySelector(s) !== null),
                args: [selectors]
            });

            if (results[0]?.result) {
                return;
            }
        } catch {
            // Script execution failed, page might still be loading
        }

        await delay(interval);
    }

    throw new Error(`Elements not found after ${maxAttempts} attempts: ${selectors.join(', ')}`);
}

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

export async function waitForTabLoad(tabId: number, waitForRedirect = false, requiredElements?: string[]): Promise<chrome.tabs.Tab> {
    if (waitForRedirect) {
        await waitForTabComplete(tabId);
    }

    if (requiredElements) {
        await waitForElements(tabId, requiredElements);
    }

    return browserApi.tabs.get(tabId);
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