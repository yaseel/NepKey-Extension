export default class Utils {
    static isAlreadyLoggedIn() {
        const navLinks = Array.from(document.querySelectorAll("a.nav-link"));
        return navLinks.some(link => {
            const text = link.textContent.trim().toLowerCase();
            return text === "student web" || text === "hallgatói web";
        });
    }

    static triggerStudentWebAutoClick() {
        if (sessionStorage.getItem("studentWebClicked") === "true") return;
        console.log("[Content] Triggering Student Web auto‑click.");
        let studentWebClicked = false;
        const clickStudentWebLink = () => {
            if (studentWebClicked) return true;
            const links = Array.from(document.querySelectorAll("a.nav-link"));
            console.log("[Content] Found nav links:", links.map(link => link.textContent.trim()));
            const targetLink = links.find(link => {
                const txt = link.textContent.trim().toLowerCase();
                return txt === "student web" || txt === "hallgatói web";
            });
            if (targetLink) {
                console.log("[Content] Student web link found. Clicking it.");
                targetLink.click();
                studentWebClicked = true;
                sessionStorage.setItem("studentWebClicked", "true");
                return true;
            }
            return false;
        };

        if (!clickStudentWebLink()) {
            console.log("[Content] Student web link not found immediately. Starting MutationObserver...");
            const observer = new MutationObserver((mutations, obs) => {
                if (clickStudentWebLink()) {
                    obs.disconnect();
                    console.log("[Content] MutationObserver disconnected after clicking Student web link.");
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
}
