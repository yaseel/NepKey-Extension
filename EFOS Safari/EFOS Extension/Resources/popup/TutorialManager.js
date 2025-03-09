export default class TutorialManager {
    constructor(translationManager) {
        this.translationManager = translationManager;

        this.tutorialView = document.getElementById("tutorialView");
        this.tutorialGif = document.getElementById("tutorialGif");
        this.tutorialText = document.getElementById("tutorialText");
        this.prevButton = document.getElementById("prevButton");
        this.nextButton = document.getElementById("nextButton");
        this.backButton = document.getElementById("tutorialBack");
        this.tutorialDots = document.getElementById("tutorialDots");

        this.steps = [
            { gif: "images/tutorial1.gif", textKey: "tutorialStep1" },
            { gif: "images/tutorial2.gif", textKey: "tutorialStep2" },
            { gif: "images/tutorial3.gif", textKey: "tutorialStep3" },
            { gif: "images/tutorial4.gif", textKey: "tutorialStep4" },
            { gif: "images/tutorial5.gif", textKey: "tutorialStep5" }
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
        this.tutorialText.innerText = this.translationManager.translations[this.translationManager.currentLang][step.textKey];

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
