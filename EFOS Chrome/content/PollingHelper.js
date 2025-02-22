export default class PollingHelper {
    constructor() {
        this.pollingActive = true;
    }

    pollForElement(selector, delayMs, maxAttempts, onFound, onFailure) {
        let attempts = 0;
        let found = false;
        const poll = () => {
            if (!this.pollingActive || found) return;
            attempts++;
            const el = document.querySelector(selector);
            if (el) {
                found = true;
                console.log(`Element "${selector}" found on attempt ${attempts}`);
                onFound(el);
            } else if (attempts < maxAttempts) {
                setTimeout(poll, delayMs);
            } else {
                console.error(`Element "${selector}" not found after ${attempts} attempts`);
                if (onFailure) onFailure();
            }
        };
        poll();
    }

    stopPolling() {
        console.log("Stopping all further polling.");
        this.pollingActive = false;
    }
}
