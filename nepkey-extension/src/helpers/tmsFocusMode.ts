import {browserApi} from "./message.ts";

export async function applyTmsFocusMode(tabId: number) {
    const [res] = await browserApi.scripting.executeScript({
        target: { tabId },
        func: cleanupTms,
    });
    return res?.result;
}

function cleanupTms() {
    document.documentElement.style.width = "100vw";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.width = "100vw";
    document.body.style.overflowX = "hidden";

    document.querySelectorAll(".row").forEach(el => (el as HTMLElement).style.display = "inline");

    document
        .querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-primary")
        .forEach(el => el.remove());

    document.querySelectorAll(".col-xl-10, .col-md-9")
        .forEach(el => (el as HTMLElement).style.maxWidth = "97%");
}