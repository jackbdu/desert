const config = {
  initialDays: 0,
  initialSavings: 0,
  dailyWage: 110,
  currencyUnit: "dollars",
  dayUnit: "days",
  travelExpenses: 900,
};

class GameController {
  constructor(options) {
    this.dayUnit = options?.dayUnit ?? "days";
    this.currencyUnit = options?.currencyUnit ?? "coins";
    this.initialDays = options?.initialDays ?? 0;
    this.initialSavings = options?.initialSavings ?? 0;
    this.dailyWage = options?.dailyWage ?? 100;
    this.travelExpenses = options?.travelExpenses ?? 1000;
    this.daysElement = document.querySelector("#days");
    this.savingsElement = document.querySelector("#savings");
    this.warningElement = document.querySelector("#warning");
    this.secretButtonElement = document.querySelector("button.secret");
    this.warningText = "";

    const systemDarkEnabled = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.darkModeEnabled = systemDarkEnabled && localStorage.getItem("isDarkMode") !== "false";

    this.hasPlayed = localStorage.getItem("hasPlayed") === "true";
    const startingScene = this.hasPlayed ? document.querySelector(".scene#welcomeBack") : document.querySelector(".scene#welcome");
    this.startWithScene(startingScene);

    this.updateDarkMode(this.darkModeEnabled);
  }
  init() {
    this.days = this.initialDays;
    this.savings = this.initialSavings;
    this.hasReachedWestDestination = false;
    this.hasReachedEastDestination = false;
    this.hasReachedNorthDestination = false;
    document.body.classList.add("playing");
  }
  resume() {
    this.init();
    const loadedSavings = parseInt(localStorage.getItem("savings"));
    const loadedDays = parseInt(localStorage.getItem("days"));
    if (loadedDays > 0) this.days = loadedDays;
    if (loadedSavings > 0) this.savings = loadedSavings;
    this.hasReachedWestDestination = localStorage.getItem("hasReachedWestDestination") === "true";
    this.hasReachedEastDestination = localStorage.getItem("hasReachedEastDestination") === "true";
    this.hasReachedNorthDestination = localStorage.getItem("hasReachedNorthDestination") === "true";
    this.updateHtml();
  }
  restart() {
    this.init();
    this.updateLocalStorage();
    localStorage.setItem("hasPlayed", false);
    this.secretButtonElement.classList.add("hidden");
    this.updateHtml();
  }
  updateLocalStorage() {
    localStorage.setItem("days", this.days);
    localStorage.setItem("savings", this.savings);
    localStorage.setItem("hasReachedWestDestination", this.hasReachedWestDestination);
    localStorage.setItem("hasReachedEastDestination", this.hasReachedEastDestination);
    localStorage.setItem("hasReachedNorthDestination", this.hasReachedNorthDestination);
  }
  work() {
    this.savings += this.dailyWage;
    this.updateHtml();
  }
  sleep() {
    this.days++;
    this.updateLocalStorage();
    localStorage.setItem("hasPlayed", true);
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
      case "restart":
        this.restart();
        break;
      case "resume":
        this.resume();
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

  startWithScene(scene) {
    scene.classList.add("active");
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
  updateDarkMode(darkModeEnabled) {
    if (darkModeEnabled) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    this.updateDarkMode(this.darkModeEnabled);
    localStorage.setItem("isDarkMode", this.darkModeEnabled);
  }
}

const gc = new GameController(config);
