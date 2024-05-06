const config = {
  initialDays: 0,
  initialSavings: 0,
  digitNumber: 6,
  dailyWageMin: 100,
  dailyWageMax: 200,
  currencyUnit: "Dunaris",
  dayUnit: "days",
  travelExpensesMax: 1000,
  travelExpensesmin: 800,
  soundUrls: { northDest: "assets/oasis.mp3", westDest: "assets/sea.mp3", eastDest: "assets/busy-mall.mp3", aboard: "assets/aboard-train.mp3", desert: "assets/desert.mp3", startingSound: "assets/flipping-pages.mp3" },
  soundEffectUrls: { starting: "assets/flipping-pages.mp3", switching: "assets/flipping-page.mp3" },
};

class GameController {
  constructor(options) {
    this.dayUnit = options?.dayUnit ?? "days";
    this.currencyUnit = options?.currencyUnit ?? "coins";
    this.initialDays = options?.initialDays ?? 0;
    this.initialSavings = options?.initialSavings ?? 0;
    this.digitNumber = options?.digitNumber ?? 6;
    this.dailyWageMin = options?.dailyWageMin ?? 100;
    this.dailyWageMax = options?.dailyWageMax ?? 200;
    this.travelExpensesMin = options?.travelExpensesMin ?? 800;
    this.travelExpensesMax = options?.travelExpensesMax ?? 1000;
    this.infoTextInsufficientFund = options?.infoTextInsufficientFund ?? `Minimum savings for traveling: ${this.travelExpensesMax} ${this.currencyUnit}`;
    this.soundUrls = options?.soundUrls ?? {};
    this.soundEffectUrls = options?.soundEffectUrls ?? {};
    this.uiElement = document.querySelector(".ui");
    this.daysElement = document.querySelector("#days");
    this.savingsElement = document.querySelector("#savings");
    this.infoElement = document.querySelector("#info");
    this.secretButtonElement = document.querySelector("button.secret");
    this.infoText = "";

    this.sounds = {};
    for (const name of Object.keys(this.soundUrls)) {
      const url = this.soundUrls[name];
      const sound = new Audio(url);
      sound.setAttribute("loop", "");
      this.sounds[name] = sound;
    }

    this.soundEffects = {};
    for (const name of Object.keys(this.soundEffectUrls)) {
      const url = this.soundEffectUrls[name];
      const sound = new Audio(url);
      this.soundEffects[name] = sound;
    }
    this.soundEnabled = localStorage.getItem("soundEnabled") !== "false";
    this.updateSoundStatus(this.soundEnabled);

    const systemDarkEnabled = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.darkModeEnabled = systemDarkEnabled && localStorage.getItem("darkModeEnabled") !== "false";
    this.updateDarkMode(this.darkModeEnabled);

    this.hasPlayed = localStorage.getItem("hasPlayed") === "true";
    const startingScene = this.hasPlayed ? document.querySelector(".scene#welcomeBack") : document.querySelector(".scene#welcome");
    this.startWithScene(startingScene);
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
    this.playSoundEffect("starting");
  }
  restart() {
    this.init();
    this.updateLocalStorage();
    localStorage.setItem("hasPlayed", false);
    this.secretButtonElement.classList.add("hidden");
    this.playSoundEffect("starting");
  }
  updateLocalStorage() {
    localStorage.setItem("days", this.days);
    localStorage.setItem("savings", this.savings);
    localStorage.setItem("hasReachedWestDestination", this.hasReachedWestDestination);
    localStorage.setItem("hasReachedEastDestination", this.hasReachedEastDestination);
    localStorage.setItem("hasReachedNorthDestination", this.hasReachedNorthDestination);
  }
  work() {
    const wage = this.getRandomIntBetween(this.dailyWageMin, this.dailyWageMax);
    this.savings += wage;
    this.infoText = `${wage} ${this.currencyUnit} earned`;
  }
  sleep() {
    this.days++;
    this.updateLocalStorage();
    localStorage.setItem("hasPlayed", true);
  }
  travel(dest) {
    if (dest === "westJourney" || dest === "eastJourney") {
      if (this.savings >= this.travelExpensesMax) {
        const travelExpenses = this.getRandomIntBetween(this.travelExpensesMin, this.travelExpensesMax);
        this.savings -= travelExpenses;
        this.infoText = `${travelExpenses} ${this.currencyUnit} spent`;
        return true;
      }
      this.infoText = this.infoTextInsufficientFund;
      return false;
    }
    return true;
  }

  set days(n) {
    this._days = n;
    this.daysElement.textContent = `${n.toString().padStart(this.digitNumber, "0")} ${this.dayUnit}`;
  }

  get days() {
    return this._days;
  }

  set savings(amount) {
    this._savings = amount;
    this.savingsElement.textContent = `${amount.toString().padStart(this.digitNumber, "0")} ${this.currencyUnit}`;
  }

  get savings() {
    return this._savings;
  }

  set infoText(text) {
    this._infoText = text;
    this.infoElement.textContent = `${text}`;
  }

  get infoText() {
    return this._infoText;
  }

  set hasReachedWestDestination(bool) {
    this._hasReachedWestDestination = bool;
    if (bool && this.hasReachedEastDestination) {
      this.secretButtonElement.classList.remove("hidden");
    } else {
      this.secretButtonElement.classList.add("hidden");
    }
  }

  get hasReachedWestDestination() {
    return this._hasReachedWestDestination;
  }

  set hasReachedEastDestination(bool) {
    this._hasReachedEastDestination = bool;
    if (this.hasReachedWestDestination && bool) {
      this.secretButtonElement.classList.remove("hidden");
    } else {
      this.secretButtonElement.classList.add("hidden");
    }
  }

  get hasReachedEastDestination() {
    return this._hasReachedEastDestination;
  }

  set hasReachedNorthDestination(bool) {
    this._hasReachedNorthDestination = bool;
  }

  get hasReachedNorthDestination() {
    return this._hasReachedNorthDestination;
  }

  goToSceneWithId(element, id, action) {
    this.infoText = "";
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
          if (!this.travel(id)) return false;
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
    this.infoText = "";
    const currentScene = element.closest(".scene");
    const destScene = document.querySelectorAll(".scene")[n];
    this.switchActiveScene(currentScene, destScene);
    return true;
  }

  goToNextScene(element) {
    this.infoText = "";
    const currentScene = element.closest(".scene");
    const destScene = currentScene.nextElementSibling;
    this.switchActiveScene(currentScene, destScene);
    this.playSoundEffect("switching");
    return true;
  }

  goToPrevScene(element) {
    this.infoText = "";
    const currentScene = element.closest(".scene");
    const destScene = currentScene.previousElementSibling;
    this.switchActiveScene(currentScene, destScene);
    return true;
  }

  startWithScene(scene) {
    this.infoText = "";
    scene.classList.add("active");
  }

  switchActiveScene(currentScene, destScene) {
    switch (destScene.id) {
      case "introduction":
        this.switchSoundTo("desert");
        break;
      case "home":
        this.switchSoundTo("desert");
        break;
      case "westJourney":
        this.switchSoundTo("aboard");
        break;
      case "eastJourney":
        this.switchSoundTo("aboard");
        break;
      case "postTravel":
        this.switchSoundTo("desert");
        break;
      case "westDestination":
        this.hasReachedWestDestination = true;
        this.switchSoundTo("westDest");
        break;
      case "eastDestination":
        this.hasReachedEastDestination = true;
        this.switchSoundTo("eastDest");
        break;
      case "northDestination":
        this.hasReachedNorthDestination = true;
        this.switchSoundTo("northDest");
        break;
    }
    this.showRandomScenario(destScene);
    currentScene.classList.remove("active");
    destScene.classList.add("active");
  }
  showRandomScenario(scene) {
    const scenarios = scene.querySelectorAll("div.scenario");
    const randomIndex = Math.floor(Math.random() * scenarios.length);
    scenarios.forEach((scenario, index) => {
      if (index === randomIndex) {
        scenarios[index].classList.remove("hidden");
      } else {
        scenarios[index].classList.add("hidden");
      }
    });
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
    localStorage.setItem("darkModeEnabled", this.darkModeEnabled);
  }
  toggleCredits() {
    this.uiElement.classList.toggle("showCredits");
  }
  toggleSound(element) {
    this.soundEnabled = !this.soundEnabled;
    this.updateSoundStatus(this.soundEnabled);
    localStorage.setItem("soundEnabled", this.soundEnabled);
  }
  switchSoundTo(activeName) {
    for (const name of Object.keys(this.sounds)) {
      if (name === activeName) {
        this.sounds[name].play();
      } else {
        this.sounds[name].pause();
      }
    }
  }
  playSoundEffect(name) {
    this.soundEffects[name].currentTime = 0;
    this.soundEffects[name].play();
  }
  updateSoundStatus(soundEnabled) {
    if (soundEnabled) {
      for (const name of Object.keys(this.sounds)) {
        this.sounds[name].volume = 1;
      }
      for (const name of Object.keys(this.soundEffects)) {
        this.soundEffects[name].volume = 1;
      }
      document.body.classList.add("soundOn");
      document.body.classList.remove("soundOff");
    } else {
      for (const name of Object.keys(this.sounds)) {
        this.sounds[name].volume = 0;
      }
      for (const name of Object.keys(this.soundEffects)) {
        this.soundEffects[name].volume = 0;
      }
      document.body.classList.remove("soundOn");
      document.body.classList.add("soundOff");
    }
  }
  getRandomIntBetween(min, max) {
    const offsetMax = max - min;
    const randomOffset = Math.random() * offsetMax;
    const randomValue = Math.floor(min + randomOffset);
    return randomValue;
  }
}

const gc = new GameController(config);
