export default class ModalManager {
    constructor(modalEl) {
        this.modalEl = modalEl;
        this.closeBtn = modalEl.querySelector("#closeModal");
        this.init();
    }

    init() {
        this.closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.close();
        });
        window.addEventListener("click", (e) => {
            if (e.target === this.modalEl) this.close();
        });
    }

    open() {
        this.modalEl.style.display = "block";
        setTimeout(() => this.modalEl.classList.add("show"), 10);
    }

    close() {
        this.modalEl.classList.remove("show");
        this.modalEl.classList.add("closing");
        setTimeout(() => {
            this.modalEl.style.display = "none";
            this.modalEl.classList.remove("closing");
        }, 300);
    }
}
