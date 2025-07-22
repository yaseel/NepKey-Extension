import {browserApi} from "./messaging";

// Helper function to wait for specific elements in the page
async function waitForElements(tabId: number, selectors: string[], timeout = 10000): Promise<boolean> {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const checkElements = async () => {
            try {
                const results = await browserApi.scripting.executeScript({
                    target: { tabId },
                    func: (sel: string[]) => {
                        return sel.every(selector => document.querySelector(selector) !== null);
                    },
                    args: [selectors]
                });

                if (results[0]?.result) {
                    resolve(true);
                } else if (Date.now() - startTime >= timeout) {
                    console.warn(`Timeout waiting for elements: ${selectors.join(', ')}`);
                    resolve(false);
                } else {
                    setTimeout(checkElements, 100);
                }
            } catch (error) {
                console.error("Error checking elements:", error);
                resolve(false);
            }
        };
        checkElements();
    });
}

export async function waitForTabLoad(tabId: number, waitForRedirect = false, requiredElements?: string[]): Promise<chrome.tabs.Tab> {
    // First check if tab is already loaded
    const tab = await browserApi.tabs.get(tabId);
    if (tab && tab.status === 'complete' && (!waitForRedirect || tab.url)) {
        if (requiredElements) {
            const elementsReady = await waitForElements(tabId, requiredElements);
            if (elementsReady) {
                return tab;
            }
        } else {
            return tab;
        }
    }

    return new Promise<chrome.tabs.Tab>((resolve) => {
        const listener = async (
            updatedId: number,
            changeInfo: chrome.tabs.OnUpdatedInfo,
            updatedTab: chrome.tabs.Tab
        ) => {
            if (updatedId !== tabId) return;

            if (changeInfo.status === "complete") {
                if (!waitForRedirect || (waitForRedirect && updatedTab.url && updatedTab.url !== tab?.url)) {
                    if (requiredElements) {
                        const elementsReady = await waitForElements(tabId, requiredElements);
                        if (elementsReady) {
                            browserApi.tabs.onUpdated.removeListener(listener);
                            resolve(updatedTab);
                        }
                    } else {
                        browserApi.tabs.onUpdated.removeListener(listener);
                        resolve(updatedTab);
                    }
                }
            }
        };

        browserApi.tabs.onUpdated.addListener(listener);
    });
}

export async function openTabAndWait(url: string): Promise<chrome.tabs.Tab> {
    const tab = await browserApi.tabs.create({ url });
    return waitForTabLoad(tab.id!, false);
}