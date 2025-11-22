import {browserApi} from "./message.ts";

async function waitForElements(tabId: number, selectors: string[]): Promise<void> {
    for (let i = 0; i < 50; i++) {
        try {
            const results = await browserApi.scripting.executeScript({
                target: { tabId },
                func: (sel: string[]) => sel.every(s => document.querySelector(s) !== null),
                args: [selectors]
            });
            if (results[0]?.result) return;
        } catch {}
        await new Promise(r => setTimeout(r, 100));
    }
    throw new Error("Elements not found");
}

export async function waitForTabLoad(tabId: number, requiredElements?: string[]): Promise<void> {
    // If we have elements to wait for, just wait for elements (page already loaded)
    // Otherwise wait for navigation complete
    if (requiredElements) {
        await waitForElements(tabId, requiredElements);
    } else {
        await new Promise<void>((resolve) => {
            const listener = (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
                if (details.tabId === tabId && details.frameId === 0) {
                    browserApi.webNavigation.onCompleted.removeListener(listener);
                    resolve();
                }
            };
            browserApi.webNavigation.onCompleted.addListener(listener);
        });
    }
}

export async function openTabAndWait(url: string): Promise<chrome.tabs.Tab> {
    const tab = await browserApi.tabs.create({ url });
    await waitForTabLoad(tab.id!);
    return tab;
}