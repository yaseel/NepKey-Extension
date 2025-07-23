import {browserApi} from "./messaging";

// Helper function to wait for specific elements in the page with retry logic
async function waitForElements(tabId: number, selectors: string[], maxRetries = 30, interval = 100): Promise<boolean> {
    return new Promise((resolve) => {
        let retryCount = 0;
        
        const check = async () => {
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
                } else if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(check, interval);
                } else {
                    resolve(false);
                }
            } catch (error) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(check, interval);
                } else {
                    console.warn("Error checking elements:", error);
                    resolve(false);
                }
            }
        };

        check();
    });
}

export async function isUserLoggedIn(tabId: number): Promise<boolean> {
    try {
        // Wait for tab to be fully loaded first
        const tab = await browserApi.tabs.get(tabId);
        if (tab.status !== 'complete') {
            await new Promise(resolve => {
                const listener = (updatedId: number, info: chrome.tabs.OnUpdatedInfo) => {
                    if (updatedId === tabId && info.status === 'complete') {
                        browserApi.tabs.onUpdated.removeListener(listener);
                        resolve(true);
                    }
                };
                browserApi.tabs.onUpdated.addListener(listener);
            });
        }

        // Check for the account dropdown element by ID
        const results = await browserApi.scripting.executeScript({
            target: { tabId },
            func: () => {
                return document.getElementById('layoutNavbarDropdownAccount') !== null;
            }
        });
        
        return results[0]?.result === true;
    } catch (error) {
        console.warn("Error checking login status:", error);
        return false;
    }
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