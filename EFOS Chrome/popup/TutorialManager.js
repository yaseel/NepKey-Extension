export default class TutorialManager {
    constructor() {
        // Get elements from the tutorial view.
        this.tutorialView = document.getElementById("tutorialView");
        this.tutorialGif = document.getElementById("tutorialGif");
        this.tutorialText = document.getElementById("tutorialText");
        this.prevButton = document.getElementById("prevButton");
        this.nextButton = document.getElementById("nextButton");
        this.backButton = document.getElementById("tutorialBack");
        this.tutorialDots = document.getElementById("tutorialDots");

        this.steps = [
            { gif: "images/tutorial1.gif", text: "Click the menu buttons to open the respective websites." },
            { gif: "images/tutorial2.gif", text: "Before enabling auto log in, input your credentials in the settings." },
            { gif: "images/tutorial3.gif", text: "Enable auto log in using the toggles." },
            { gif: "images/tutorial4.gif", text: "To use full TOTP login for Neptun, you need an OTP secret. Log in to Neptun, select 'New TOTP pairing', and copy the secret key. Paste it in EFOS OTP settings and add it to your authenticator." },
            { gif: "images/tutorial5.gif", text: "Auto log in only works when websites are opened from the extension—opening via URL or regular browsing won't activate auto log in." }
        ];
        this.currentStep = 0;

        this.nextButton.addEventListener("click", () => this.nextStep());
        this.prevButton.addEventListener("click", () => this.prevStep());
        this.backButton.addEventListener("click", () => this.close());
    }

    open() {
        this.currentStep = 0;
        this.updateContent();

        document.getElementById("settingsButton").classList.add("hidden");

        const mainView = document.getElementById("mainView");
        mainView.classList.remove("visible");
        mainView.classList.add("hidden");

        this.tutorialView.classList.remove("hidden");
        this.tutorialView.classList.add("visible");
    }

    close() {
        this.tutorialView.classList.remove("visible");
        this.tutorialView.classList.add("hidden");

        document.getElementById("settingsButton").classList.remove("hidden");

        const mainView = document.getElementById("mainView");
        mainView.classList.remove("hidden");
        mainView.classList.add("visible");
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateContent();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateContent();
        }
    }

    updateContent() {
        const step = this.steps[this.currentStep];
        this.tutorialGif.src = step.gif;
        this.tutorialText.innerText = step.text;

        if (this.currentStep === 0) {
            this.prevButton.classList.add("disabled");
        } else {
            this.prevButton.classList.remove("disabled");
        }
        if (this.currentStep === this.steps.length - 1) {
            this.nextButton.classList.add("disabled");
        } else {
            this.nextButton.classList.remove("disabled");
        }

        this.updateDots();
    }

    updateDots() {
        this.tutorialDots.innerHTML = "";
        for (let i = 0; i < this.steps.length; i++) {
            const dot = document.createElement("span");
            if (i === this.currentStep) {
                dot.classList.add("active");
            }
            this.tutorialDots.appendChild(dot);
        }
    }
}
