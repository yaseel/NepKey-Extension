import {browserApi} from "./messaging";

export async function openTabAndWait(url: string): Promise<chrome.tabs.Tab> {

    const tab = await browserApi.tabs.create({ url });

    await new Promise<chrome.tabs.Tab>((resolve) => {
        function listener(
            updatedId: number,
            changeInfo: chrome.tabs.OnUpdatedInfo,
            updatedTab: chrome.tabs.Tab
        ) {
            if (updatedId === tab.id && changeInfo.status === "complete") {
                browserApi.tabs.onUpdated.removeListener(listener);
                resolve(updatedTab);
            }
        }
        browserApi.tabs.onUpdated.addListener(listener);
    });

    return tab;
}