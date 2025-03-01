export default class TutorialManager {
    constructor() {
        this.tutorialView = document.getElementById("tutorialView");
        this.tutorialGif = document.getElementById("tutorialGif");
        this.tutorialText = document.getElementById("tutorialText");
        this.nextButton = document.getElementById("nextButton");
        this.prevButton = document.getElementById("prevButton");
        this.backButton = document.getElementById("tutorialBack");

        this.steps = [
            {
                gif: "images/tutorial1.gif",
                text: "Click the menu buttons to open the respective websites."
            },
            {
                gif: "images/tutorial2.gif",
                text: "Before enabling auto log in, input your credentials in the settings."
            },
            {
                gif: "images/tutorial3.gif",
                text: "Enable auto log in using the toggles."
            },
            {
                gif: "images/tutorial4.gif",
                text: "To use full TOTP login for Neptun, you need an OTP secret."
            },
            {
                gif: "images/tutorial5.gif",
                text: "Auto log in only works when websites are opened from the extension—opening via URL or regular browsing won't activate auto log in."
            }
        ];
        this.currentStep = 0;

        this.nextButton.addEventListener("click", () => this.nextStep());
        this.prevButton.addEventListener("click", () => this.prevStep());
        this.backButton.addEventListener("click", () => this.close());
    }

    open() {
        this.currentStep = 0;
        this.updateContent();

        document.getElementById("mainView").classList.remove("visible");
        document.getElementById("mainView").classList.add("hidden");

        document.getElementById("settingsButton").classList.add("hidden");

        this.tutorialView.classList.remove("hidden");
        this.tutorialView.classList.add("visible");
    }

    close() {
        this.tutorialView.classList.remove("visible");
        this.tutorialView.classList.add("hidden");

        document.getElementById("mainView").classList.remove("hidden");
        document.getElementById("mainView").classList.add("visible");

        document.getElementById("settingsButton").classList.remove("hidden");
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
            this.prevButton.style.display = "none";
        } else {
            this.prevButton.style.display = "inline-block";
        }

        if (this.currentStep === this.steps.length - 1) {
            this.nextButton.style.display = "none";
        } else {
            this.nextButton.style.display = "inline-block";
        }
    }
}