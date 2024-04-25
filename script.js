function goToSceneWithId(element, id) {
  const currentScene = element.closest(".scene");
  const destScene = document.querySelector(`#${id}`);
  switchActiveScene(currentScene, destScene);
}

function goToNthScene(element, n) {
  const currentScene = element.closest(".scene");
  const destScene = document.querySelectorAll(".scene")[n];
  switchActiveScene(currentScene, destScene);
}

function goToNextScene(element) {
  const currentScene = element.closest(".scene");
  const destScene = currentScene.nextElementSibling;
  switchActiveScene(currentScene, destScene);
}

function goToPrevScene(element) {
  const currentScene = element.closest(".scene");
  const destScene = currentScene.previousElementSibling;
  switchActiveScene(currentScene, destScene);
}

function switchActiveScene(currentScene, destScene) {
  currentScene.classList.remove("active");
  destScene.classList.add("active");
}
