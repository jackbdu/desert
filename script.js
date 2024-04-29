const config = {
  initialDays: 0,
  initialSavings: 11000,
  dailyWage: 100,
  currencyUnit: "dollars",
  dayUnit: "days",
  travelExpenses: 1000,
};

class GameController {
  constructor(options) {
    this.dayUnit = options?.dayUnit ?? "days";
    this.currencyUnit = options?.currencyUnit ?? "coins";
    this.days = options?.initialDays ?? 0;
    this.savings = options?.initialSavings ?? 0;
    this.dailyWage = options?.dailyWage ?? 100;
    this.travelExpenses = options?.travelExpenses ?? 1000;
    this.daysElement = document.querySelector("#days");
    this.savingsElement = document.querySelector("#savings");
    this.warningElement = document.querySelector("#warning");
    this.secretButtonElement = document.querySelector("button.secret");
    this.warningText = "";
    this.hasReachedNorthDestination = false;
    this.hasReachedWestDestination = false;
    this.hasReachedEastDestination = false;
    this.updateHtml();
    this.initColor();
  }
  work() {
    this.savings += this.dailyWage;
    this.updateHtml();
  }
  sleep() {
    this.days++;
    this.updateHtml();
  }
  travel(dest) {
    if (dest === "westJourney" || dest === "eastJourney") {
      if (this.savings - this.travelExpenses >= 0) {
        this.savings -= this.travelExpenses;
        this.updateHtml();
        return true;
      }
      return false;
    }
    return true;
  }
  updateHtml() {
    this.daysElement.textContent = `${this.days} ${this.dayUnit}`;
    this.savingsElement.textContent = `${this.savings} ${this.currencyUnit}`;
    this.warningElement.textContent = `${this.warningText}`;
    if (this.hasReachedWestDestination && this.hasReachedEastDestination) {
      this.secretButtonElement.classList.remove("hidden");
    }
  }

  goToSceneWithId(element, id, action) {
    const currentScene = element.closest(".scene");
    const destScene = document.querySelector(`#${id}`);
    switch (action) {
      case "sleep":
        this.sleep();
        break;
      case "work":
        this.work();
        break;
      case "travel":
        if (id === "westJourney" || id === "eastJourney") {
          if (!this.travel(id)) {
            this.warningText = "Insufficient funds :(";
            this.updateHtml();
            return false;
          }
        }
        break;
    }
    this.switchActiveScene(currentScene, destScene);
    return true;
  }

  goToNthScene(element, n) {
    const currentScene = element.closest(".scene");
    const destScene = document.querySelectorAll(".scene")[n];
    this.switchActiveScene(currentScene, destScene);
    return true;
  }

  goToNextScene(element) {
    const currentScene = element.closest(".scene");
    const destScene = currentScene.nextElementSibling;
    this.switchActiveScene(currentScene, destScene);
    return true;
  }

  goToPrevScene(element) {
    const currentScene = element.closest(".scene");
    const destScene = currentScene.previousElementSibling;
    this.switchActiveScene(currentScene, destScene);
    return true;
  }

  switchActiveScene(currentScene, destScene) {
    switch (destScene.id) {
      case "westDestination":
        this.hasReachedWestDestination = true;
        break;
      case "eastDestination":
        this.hasReachedEastDestination = true;
        break;
      case "northDestination":
        this.hasReachedNorthDestination = true;
        break;
    }
    this.warningText = "";
    this.updateHtml();
    currentScene.classList.remove("active");
    destScene.classList.add("active");
  }
  initColor() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
  toggleColor() {
    document.body.classList.toggle("dark");
  }
}

const gc = new GameController(config);
