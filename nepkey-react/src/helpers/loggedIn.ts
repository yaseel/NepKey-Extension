import {browserApi} from "./messaging.ts";

export async function loggedInNeptun(tabId: number): Promise<boolean> {
    try {
        const results = await browserApi.scripting.executeScript({
            target: {tabId},
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

export async function loggedInCanvas(tabId: number): Promise<boolean> {
    try {
        const results = await browserApi.scripting.executeScript({
            target: {tabId},
            func: () => {
                return document.getElementById('global_nav_profile_link') !== null;
            }
        });

        return results[0]?.result === true;
    } catch (error) {
        console.warn("Error checking login status:", error);
        return false;
    }
}

export async function loggedInTms(tabId: number): Promise<boolean> {
    try {
        const results = await browserApi.scripting.executeScript({
            target: {tabId},
            func: () => {
                return document.getElementById('a[href="/settings"]') !== null;
            }
        });

        return results[0]?.result === true;
    } catch (error) {
        console.warn("Error checking login status:", error);
        return false;
    }
}