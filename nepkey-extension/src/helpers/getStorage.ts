export function getStorage() {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        return browser.storage.local;
    }
    else {
        return chrome.storage.local;
    }
}