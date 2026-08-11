import { LEVELS } from "../js/data/levels.js";

const failures = [];
const uncaught = [];
const qaMode = new URLSearchParams(location.search).get("mode") || "perfect";
const previewMode = new URLSearchParams(location.search).get("preview") || "";
window.addEventListener("error", (event) => uncaught.push(event.message));
window.addEventListener("unhandledrejection", (event) => uncaught.push(String(event.reason)));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const byText = (selector, text) => [...document.querySelectorAll(selector)].find((node) => node.textContent.trim() === text);
function assert(condition, message) { if (!condition) failures.push(message); }

async function answerTask(task) {
  globalThis.__timeGlitchQA.openTask(task.id);
  await wait(35);
  assert(Boolean(document.querySelector(".task-modal")), `${task.id}: modal did not open`);
  if (previewMode === "task" && task.id === "L1-T1") await new Promise(() => {});
  if (qaMode === "scoring" && task.id === "L1-T3") byText(".task-actions .btn", "HINT")?.click();
  if (task.type === "mcq") {
    if (qaMode === "scoring" && task.id === "L1-T2") {
      const wrong = task.options.find((option) => option !== task.answer);
      byText(".answer-card", wrong)?.click();
      byText(".task-actions .btn", "CHECK")?.click();
      await wait(20);
      assert(document.querySelector(".feedback")?.classList.contains("retry"), "Wrong-answer retry feedback did not appear");
    }
    byText(".answer-card", task.answer)?.click();
  } else if (task.type === "multi-select") {
    task.answers.forEach((answer) => byText(".answer-card", answer)?.click());
  } else if (task.type === "word-order") {
    task.answer.forEach((word) => byText(".chip-bank .word-chip:not(:disabled)", word)?.click());
  } else {
    task.items.forEach(([text, group]) => {
      byText(".chip-bank .word-chip", text)?.click();
      const zone = [...document.querySelectorAll(".sort-zone")].find((item) => item.querySelector("h3")?.textContent === group);
      zone?.click();
    });
  }
  byText(".task-actions .btn", "CHECK")?.click();
  await wait(35);
  assert(document.querySelector(".feedback")?.classList.contains("success"), `${task.id}: correct answer was not accepted`);
  byText(".task-actions .btn", "CONTINUE")?.click();
  await wait(70);
}

async function run() {
  const manualResumeOnly = new URLSearchParams(location.search).has("manual-resume");
  if (manualResumeOnly) {
    document.querySelector(".saved-games-summary")?.click();
    await wait(30);
    const savedCard = [...document.querySelectorAll(".start-save-entry")].find((entry) => entry.textContent.includes("MANUAL SAVE"));
    assert(Boolean(savedCard), "Dropdown manual save did not survive a browser reload");
    assert(savedCard?.textContent.includes("QA Explorer 1"), "Manual save lost the player name");
    assert(savedCard?.textContent.includes("CITY SQUARE"), "Manual save lost the location name");
    assert(Boolean(savedCard?.querySelector("time")?.dateTime), "Manual save lost its date and time");
    savedCard?.click();
    await wait(40);
    assert(globalThis.__timeGlitchQA.getState().currentLevel === 1, "Clicking the dropdown save did not restore its exact location");
    const report = document.createElement("pre");
    report.id = "qa-report";
    report.dataset.status = failures.length ? "fail" : "pass";
    report.textContent = JSON.stringify({ status:report.dataset.status, failures, uncaught, restoredLevel:globalThis.__timeGlitchQA.getState().currentLevel }, null, 2);
    document.body.append(report);
    document.title = failures.length ? "QA FAIL" : "QA PASS";
    return;
  }
  const resumeOnly = new URLSearchParams(location.search).has("resume");
  if (resumeOnly) {
    assert(Boolean(document.querySelector(".saved-games-dropdown")), "Saved-game dropdown did not survive a browser reload");
    document.querySelector(".saved-games-summary")?.click();
    await wait(30);
    const autosave = [...document.querySelectorAll(".start-save-entry")].find((entry) => entry.textContent.includes("AUTO SAVE"));
    assert(Boolean(autosave), "Unfinished autosave is missing from the dropdown");
    assert(autosave?.textContent.includes("QA Explorer 1") && autosave?.textContent.includes("CITY SQUARE"), "Autosave dropdown metadata is incomplete");
    assert(Boolean(autosave?.querySelector("time")?.dateTime), "Autosave dropdown date and time are missing");
    autosave?.click();
    await wait(40);
    const resumedState = globalThis.__timeGlitchQA.getState();
    assert(resumedState.currentLevel === 1, "Clicking the autosave did not restore its exact location");
    assert(resumedState.players[0]?.name === "QA Explorer 1", "Saved player data was not restored");
    const report = document.createElement("pre");
    report.id = "qa-report";
    report.dataset.status = failures.length ? "fail" : "pass";
    report.textContent = JSON.stringify({ status:report.dataset.status, failures, uncaught, resumedLevel:resumedState.currentLevel, player:resumedState.players[0]?.name }, null, 2);
    document.body.append(report);
    document.title = failures.length ? "QA FAIL" : "QA PASS";
    return;
  }
  const requestedPlayers = Math.min(7, Math.max(1, Number(new URLSearchParams(location.search).get("players")) || 1));
  document.querySelectorAll(".count-btn")[requestedPlayers - 1].click();
  document.querySelectorAll(".name-field input").forEach((input, index) => { input.value = `QA Explorer ${index + 1}`; });
  byText("button", "START MISSION").click();
  await wait(80);
  assert(Boolean(document.querySelector(".game-frame")), "Game stage did not load");
  assert(globalThis.__timeGlitchQA.getState().players.length === requestedPlayers, `${requestedPlayers}-player setup failed`);
  document.querySelector('[aria-label="Save current game"]')?.click();
  await wait(30);
  assert(JSON.parse(localStorage.getItem("timeGlitch:manualSaves") || "[]").length === 1, "SAVE GAME did not create a manual checkpoint");
  if (previewMode === "manual") await new Promise(() => {});
  document.querySelector('.save-tools [aria-label="Open saved games history"]')?.click();
  await wait(30);
  const firstSavedCard = document.querySelector(".save-history-card");
  assert(Boolean(firstSavedCard), "LOAD GAME did not show the saved checkpoint");
  assert(firstSavedCard?.textContent.includes("QA Explorer 1"), "Saved checkpoint does not display the player name");
  assert(firstSavedCard?.textContent.includes("CITY SQUARE"), "Saved checkpoint does not display the location");
  assert(Boolean(firstSavedCard?.querySelector("time")?.dateTime), "Saved checkpoint does not display date and time");
  if (previewMode === "manual-history") await new Promise(() => {});
  document.querySelector('[aria-label="Close saved games history"]')?.click();
  await wait(20);
  const homeButton = document.querySelector('[aria-label="Return to main screen"]');
  assert(Boolean(homeButton), "HOME button is missing from the location HUD");
  homeButton?.click();
  await wait(20);
  assert(Boolean(document.querySelector(".confirm-card")), "HOME confirmation did not open");
  byText(".confirm-actions .btn", "CANCEL")?.click();
  await wait(20);
  assert(Boolean(document.querySelector(".game-frame")), "Cancelling HOME did not preserve the mission");
  document.querySelector('[aria-label="Return to main screen"]')?.click();
  await wait(20);
  byText(".confirm-actions .btn", "MAIN SCREEN")?.click();
  await wait(30);
  const startDropdown = document.querySelector(".saved-games-dropdown");
  assert(Boolean(startDropdown), "Saved-game dropdown is not shown on the main screen");
  document.querySelector(".saved-games-summary")?.click();
  await wait(25);
  const startEntry = document.querySelector(".start-save-entry");
  assert(Boolean(startEntry), "Saved-game dropdown is empty");
  assert(startEntry?.textContent.includes("QA Explorer 1") && startEntry?.textContent.includes("CITY SQUARE"), "Dropdown save does not show player and location");
  assert(Boolean(startEntry?.querySelector("time")?.dateTime), "Dropdown save does not show date and time");
  if (previewMode === "start-dropdown") await new Promise(() => {});
  startEntry?.click();
  await wait(40);
  assert(globalThis.__timeGlitchQA.getState().currentLevel === 1, "Clicking a main-screen save did not restore the saved moment");
  document.querySelector('[aria-label="Return to main screen"]')?.click();
  await wait(20);
  byText(".confirm-actions .btn", "MAIN SCREEN")?.click();
  await wait(30);
  document.querySelector('.tech-link[aria-label="Open technical location selector"]')?.click();
  await wait(30);
  assert(document.querySelectorAll(".location-card").length === 6, "Main-screen location selector does not show six locations");
  if (previewMode === "locations") await new Promise(() => {});
  document.querySelector('[aria-label="Go to Level 3, SHOPPING MALL"]')?.click();
  await wait(40);
  assert(globalThis.__timeGlitchQA.getState().currentLevel === 3, "Technical selector did not switch to Level 3");
  document.querySelector('[aria-label="Save current game"]')?.click();
  await wait(25);
  document.querySelector('.save-tools [aria-label="Open saved games history"]')?.click();
  await wait(30);
  assert(document.querySelectorAll(".save-history-card").length === 2, "Manual save history did not retain both checkpoints");
  const citySave = [...document.querySelectorAll(".save-history-card")].find((card) => card.textContent.includes("CITY SQUARE"));
  citySave?.querySelector("button")?.click();
  await wait(40);
  assert(globalThis.__timeGlitchQA.getState().currentLevel === 1, "LOAD GAME did not restore the saved City Square checkpoint");
  document.querySelector('.save-tools [aria-label="Open saved games history"]')?.click();
  await wait(25);
  byText(".save-history-toolbar .btn", "DELETE ALL")?.click();
  await wait(20);
  byText(".confirm-actions .btn", "DELETE ALL")?.click();
  await wait(30);
  assert(document.querySelectorAll(".save-history-card").length === 0, "DELETE ALL did not clear manual save history");
  document.querySelector('[aria-label="Close saved games history"]')?.click();
  await wait(20);
  if (previewMode === "stage") await new Promise(() => {});
  for (const level of LEVELS.slice(0, 5)) {
    for (const task of level.tasks) await answerTask(task);
    await wait(4500);
    assert(globalThis.__timeGlitchQA.getState().currentLevel === level.id + 1, `Level ${level.id}: transition failed`);
  }
  const state = globalThis.__timeGlitchQA.getState();
  assert(state.collectedCores === 5, "Five Time Cores were not collected");
  const speakingTotal = LEVELS[5].speakingPrompts.length;
  for (let index = 0; index < speakingTotal; index += 1) {
    if (!document.querySelector(".task-modal")) globalThis.__timeGlitchQA.openSpeaking();
    await wait(50);
    byText(".task-actions .btn", "COMPLETED")?.click();
    await wait(index === speakingTotal - 1 ? 0 : 450);
  }
  await wait(5100);
  byText("button", "VIEW RESULTS")?.click();
  await wait(100);
  const finalState = globalThis.__timeGlitchQA.getState();
  assert(Boolean(document.querySelector(".results-screen")), "Results screen did not open");
  const expectedNormalized = qaMode === "scoring" ? "982" : "1000";
  assert([...document.querySelectorAll(".normalized")].every((item) => item.textContent === expectedNormalized), `Run did not normalize every player to ${expectedNormalized}`);
  assert(finalState.players.reduce((sum, player) => sum + player.completedTasks, 0) === 35 + speakingTotal, "Written + speaking completion total is incorrect");
  assert(finalState.players.reduce((sum, player) => sum + player.maxPossibleAssignedPoints, 0) === 3500 + speakingTotal * 150, "Maximum assigned score total is incorrect");
  const speakingCounts = finalState.players.map((player) => player.speakingCompleted);
  assert(speakingCounts.reduce((sum, count) => sum + count, 0) === speakingTotal && Math.max(...speakingCounts) - Math.min(...speakingCounts) <= 1, "Speaking prompts were not distributed in balanced turns");
  if (qaMode === "scoring") {
    assert(finalState.players[0].earnedPoints === 4470, "100/70/50 scoring integration is incorrect");
    assert(finalState.players[0].hintsUsed === 1, "Hint usage was not tracked");
  }
  assert(Boolean(localStorage.getItem("timeGlitch:lastCompletedRun")), "Latest completed result was not persisted");
  assert(!localStorage.getItem("timeGlitch:activeRun"), "Completed mission was not removed from active saves");
  assert(uncaught.length === 0, `Uncaught browser errors: ${uncaught.join(" | ")}`);
  const report = document.createElement("pre");
  report.id = "qa-report";
  report.dataset.status = failures.length ? "fail" : "pass";
  report.textContent = JSON.stringify({ status:report.dataset.status, failures, uncaught, mode:qaMode, players:requestedPlayers, cores:finalState.collectedCores, completedTasks:finalState.players.reduce((sum, player) => sum + player.completedTasks, 0), normalized:[...document.querySelectorAll(".normalized")].map((item) => item.textContent) }, null, 2);
  document.body.append(report);
  document.title = failures.length ? "QA FAIL" : "QA PASS";
}

run().catch((error) => {
  const report = document.createElement("pre");
  report.id = "qa-report";
  report.dataset.status = "fail";
  report.textContent = JSON.stringify({ status:"fail", fatal:String(error), failures, uncaught }, null, 2);
  document.body.append(report);
  document.title = "QA FAIL";
});
