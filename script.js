const config = {
  initialDays: 0,
  initialSavings: 0,
  dailyWage: 100,
  currencyUnit: "dollars",
  travelExpenses: 1000,
};

class GameController {
  constructor(options) {
    this.dayUnit = "days";
    this.currencyUnit = options?.currencyUnit ?? "coins";
    this.days = options?.initialDays ?? 0;
    this.savings = options?.initialSavings ?? 0;
    this.dailyWage = options?.dailyWage ?? 100;
    this.travelExpenses = options?.travelExpenses ?? 1000;
    this.warningText = "";
    this.updateHtml();
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
    if (dest === "west" || dest === "east") {
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
    document.querySelector("#days").textContent = `${this.days} ${this.dayUnit}`;
    document.querySelector("#savings").textContent = `${this.savings} ${this.currencyUnit}`;
    document.querySelector("#warning").textContent = `${this.warningText}`;
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
        if (id === "west" || id === "east") {
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
    this.warningText = "";
    this.updateHtml();
    currentScene.classList.remove("active");
    destScene.classList.add("active");
  }
}

const gc = new GameController(config);
