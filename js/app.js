import { ASSETS, preloadLevel } from "./assets.js?v=scene-final-core-v12";
import { isSoundEnabled, playSound, setSoundEnabled, toggleSound, unlockAudio } from "./audio.js";
import { createGameState, currentPlayer, restoreGameState, rotateTurn, TOTAL_CORES } from "./game-state.js";
import { createMovementController } from "./input.js?v=grounded-movement-v20";
import { isTaskCorrect, hasResponse } from "./level-engine.js";
import { challengePoints, rankPlayers } from "./scoring.js";
import { clearActiveRun, deleteAllManualSaves, loadActiveRun, loadLastResult, loadManualSaves, resetSavedResults, saveActiveRun, saveCompletedRun, saveManualGame } from "./storage.js";
import { LEVELS, getLevel, getTask } from "./data/levels.js?v=schoolbook-tasks-v16";
import { clear, element, formatSentence, makeButton } from "./ui.js";

const app = document.querySelector("#app");
const modalRoot = document.querySelector("#modal-root");
let state = createGameState();
let movement = null;
let prefilledNames = [];
const warnedMissingAssets = new Set();

function seededShuffle(values, key) {
  const copy = [...values];
  let seed = 2166136261;
  const source = `${state.runId}:${key}`;
  for (let index = 0; index < source.length; index += 1) {
    seed ^= source.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  const random = () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
document.addEventListener("visibilitychange", () => document.body.classList.toggle("page-hidden", document.hidden));

function destroyMovement() {
  if (movement) movement.destroy();
  movement = null;
}

function soundIcon() { return isSoundEnabled() ? "🔊" : "🔇"; }

function makeSoundButton() {
  const button = makeButton(soundIcon(), "btn icon-btn", () => {
    button.textContent = toggleSound() ? "🔊" : "🔇";
    button.setAttribute("aria-label", isSoundEnabled() ? "Mute sound" : "Turn sound on");
    playSound("click");
  }, { "aria-label": isSoundEnabled() ? "Mute sound" : "Turn sound on", title:"Sound" });
  return button;
}

function makeFullscreenButton() {
  return makeButton("⛶", "btn icon-btn", toggleFullscreen, { "aria-label":"Toggle fullscreen", title:"Fullscreen" });
}

function makeHomeButton() {
  return makeButton("⌂ HOME", "btn home-btn", () => {
    playSound("click");
    showConfirmation(
      "Return to the main screen?",
      "Current mission progress will be saved. You can continue it with TECH · LOCATIONS.",
      "MAIN SCREEN",
      () => {
        prefilledNames = state.players.map((player) => player.name);
        saveActiveRun(state);
        renderStart(prefilledNames);
      }
    );
  }, { "aria-label":"Return to main screen", title:"Home" });
}

async function toggleFullscreen() {
  playSound("click");
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
    else document.body.classList.toggle("immersive");
  } catch {
    document.body.classList.toggle("immersive");
  }
}

function renderStart(names = prefilledNames) {
  destroyMovement();
  clear(modalRoot);
  clear(app);
  state.status = "setup";
  const screen = element("section", "start-screen");
  screen.style.setProperty("--start-bg", `url("${ASSETS.backgrounds.citySquare}")`);
  const shell = element("div", "start-shell");
  const brand = element("div", "brand-side");
  const mark = element("div", "brand-mark");
  mark.append(element("span", "brand-crystal"), element("span", "", "EDUCATIONAL ADVENTURE"));
  const title = element("h1", "title");
  title.append(element("span", "", "TIME"), element("span", "", "GLITCH"));
  const mission = element("p", "mission-copy", "A glitch has mixed up ROUTINE and LIVE time signals. Guide the Time Explorer through six locations, recover five Time Cores, and restore the timeline!");
  const pills = element("div", "grammar-pills");
  ["ROUTINE · Present Simple", "LIVE · Present Continuous", "1–7 PLAYERS"].forEach((text) => pills.append(element("span", "grammar-pill", text)));
  brand.append(mark, title, mission, pills);

  const card = element("section", "setup-card");
  const head = element("div", "setup-head");
  const headingWrap = element("div");
  headingWrap.append(element("div", "eyebrow", "PLAYER SETUP"), element("h2", "", "Choose your Time Explorers"));
  const topActions = element("div", "top-actions");
  topActions.append(makeSoundButton(), makeFullscreenButton());
  head.append(headingWrap, topActions);
  const countLabel = element("p", "muted", "Number of players");
  const counts = element("div", "player-count");
  const fields = element("div", "name-fields");
  const error = element("p", "setup-error");
  error.setAttribute("role", "alert");
  let playerCount = Math.min(7, Math.max(1, names.length || 1));

  function currentValues() { return [...fields.querySelectorAll("input")].map((input) => input.value); }
  function renderFields(count, values = []) {
    clear(fields);
    for (let index = 0; index < count; index += 1) {
      const row = element("label", "name-field");
      row.append(element("span", "", String(index + 1)));
      const input = element("input");
      input.type = "text";
      input.maxLength = 16;
      input.autocomplete = "off";
      input.placeholder = `Player ${index + 1}`;
      input.setAttribute("aria-label", `Player ${index + 1} name`);
      input.value = values[index] || names[index] || "";
      row.append(input);
      fields.append(row);
    }
  }
  for (let count = 1; count <= 7; count += 1) {
    const button = makeButton(String(count), `count-btn${count === playerCount ? " selected" : ""}`, () => {
      const values = currentValues();
      playerCount = count;
      counts.querySelectorAll("button").forEach((item, index) => item.classList.toggle("selected", index + 1 === count));
      renderFields(count, values);
      playSound("click");
    }, { "aria-label":`${count} player${count === 1 ? "" : "s"}` });
    counts.append(button);
  }
  renderFields(playerCount, names);

  function validatedNames() {
    const cleanNames = currentValues().map((name) => name.trim());
    if (cleanNames.some((name) => !name)) {
      error.textContent = "Enter a name for every Time Explorer.";
      fields.querySelector("input:placeholder-shown")?.focus();
      return null;
    }
    return cleanNames;
  }

  function beginNewMission(cleanNames) {
    prefilledNames = cleanNames;
    state = createGameState(cleanNames);
    saveActiveRun(state);
    playSound("confirm");
    renderGame();
  }

  const start = makeButton("START MISSION", "btn btn-primary start-btn", () => {
    const cleanNames = validatedNames();
    if (!cleanNames) return;
    if (loadActiveRun()) {
      showConfirmation("Start a new mission?", "The unfinished saved mission will be replaced.", "START NEW MISSION", () => beginNewMission(cleanNames));
    } else beginNewMission(cleanNames);
  });
  card.append(head, countLabel, counts, fields, error, start);
  const activeRun = loadActiveRun();
  const startSaves = [
    ...(activeRun?.players?.length ? [{ ...activeRun, saveKind:"AUTO SAVE" }] : []),
    ...loadManualSaves().filter((saved) => saved?.players?.length).map((saved) => ({ ...saved, saveKind:"MANUAL SAVE" }))
  ].sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
  const savedDropdown = element("details", "saved-games-dropdown");
  const savedSummary = element("summary", "saved-games-summary");
  savedSummary.append(
    element("span", "", "LOAD GAME"),
    element("span", "saved-games-count", `${startSaves.length} SAVE${startSaves.length === 1 ? "" : "S"}`),
    element("span", "saved-games-chevron", "⌄")
  );
  const savedList = element("div", "start-saves-list");
  if (!startSaves.length) {
    savedList.append(element("p", "start-saves-empty", "No unfinished or manually saved games yet."));
  } else {
    startSaves.forEach((saved, index) => {
      const level = getLevel(saved.currentLevel) || LEVELS[0];
      const players = saved.players || [];
      const playerIndex = Math.min(players.length - 1, Math.max(0, Number(saved.currentPlayerIndex) || 0));
      const playerName = players[playerIndex]?.name || players[0]?.name || "Time Explorer";
      const entry = makeButton("", "start-save-entry", () => loadGameSnapshot(saved), { "aria-label":`Load ${playerName}, ${level.title}, ${formattedSaveDate(saved.savedAt)}` });
      const entryTop = element("span", "start-save-top");
      entryTop.append(element("strong", "", playerName), element("small", "", saved.saveKind));
      const location = element("span", "start-save-location", `LEVEL ${level.id} · ${level.title}`);
      const date = element("time", "start-save-date", formattedSaveDate(saved.savedAt));
      date.dateTime = saved.savedAt || "";
      const progress = element("span", "start-save-progress", `${Array.isArray(saved.completedTasks) ? saved.completedTasks.length : 0} tasks · ${saved.collectedCores || 0} / ${TOTAL_CORES} cores${players.length > 1 ? ` · ${players.length} players` : ""}`);
      entry.append(element("span", "start-save-slot", String(index + 1)), entryTop, location, date, progress);
      savedList.append(entry);
    });
    const deleteStartSaves = makeButton("DELETE ALL", "start-saves-delete", () => {
      showConfirmation("Delete all saved games?", "This removes the unfinished autosave and every manual saved game.", "DELETE ALL", () => {
        clearActiveRun();
        deleteAllManualSaves();
        renderStart(currentValues());
      });
    });
    savedList.append(deleteStartSaves);
  }
  savedDropdown.append(savedSummary, savedList);
  card.append(savedDropdown);

  const last = loadLastResult();
  if (last?.players?.length) {
    const preview = element("section", "last-mission");
    preview.append(element("h3", "", "LAST MISSION"));
    last.players.slice(0, 7).forEach((player) => {
      const row = element("div", "last-row");
      row.append(element("span", "", player.name), element("strong", "", String(player.normalizedScore)));
      preview.append(row);
    });
    preview.append(makeButton("RESULTS", "btn btn-ghost btn-small", () => renderResults(last, true)));
    card.append(preview);
  }
  card.append(
    makeButton("TECH · LOCATIONS", "tech-link", () => {
      const saved = loadActiveRun();
      if (saved?.players?.length) {
        state = restoreGameState(saved);
        prefilledNames = state.players.map((player) => player.name);
      } else {
        const cleanNames = validatedNames();
        if (!cleanNames) return;
        state = createGameState(cleanNames);
        prefilledNames = cleanNames;
        saveActiveRun(state);
      }
      showLocationNavigator();
    }, { "aria-label":"Open technical location selector" }),
    makeButton("Reset saved results", "reset-link", showResetConfirmation)
  );
  shell.append(brand, card);
  const authorLink = element("a", "start-author-link", "Автор игры · Speaky Swan");
  authorLink.href = "https://vk.ru/speaky_swan";
  authorLink.target = "_blank";
  authorLink.rel = "noopener noreferrer";
  authorLink.setAttribute("aria-label", "Автор игры Speaky Swan — открыть страницу VK");
  screen.append(shell, authorLink);
  app.append(screen);
}

function makeHud(level) {
  const hud = element("header", "hud");
  const turn = element("div", "hud-panel turn-panel");
  turn.append(element("small", "", "YOUR TURN"), element("div", "turn-name", currentPlayer(state).name));
  const progress = element("div", "hud-panel progress-panel");
  progress.append(element("div", "level-label", `LEVEL ${level.id} · ${level.title}`));
  const cores = element("div", "core-row");
  for (let index = 0; index < TOTAL_CORES; index += 1) cores.append(element("span", `mini-core${index < state.collectedCores ? " on" : ""}`));
  cores.append(element("span", "core-count", `${state.collectedCores} / ${TOTAL_CORES}`));
  progress.append(cores);
  const actions = element("div", "hud-actions");
  actions.append(makeHomeButton(), makeSoundButton(), makeFullscreenButton());
  hud.append(turn, progress, actions);
  return hud;
}

function makeAmbient(level) {
  const ambient = element("div", `ambient ambient-${level.ambience}`);
  const count = matchMedia("(max-width: 560px)").matches ? 6 : 12;
  for (let index = 0; index < count; index += 1) {
    const particle = element("i", "particle");
    particle.style.left = `${7 + (index * 17) % 88}%`;
    particle.style.top = `${30 + (index * 23) % 62}%`;
    particle.style.animationDelay = `${-(index * .43)}s`;
    particle.style.animationDuration = `${4.2 + (index % 4)}s`;
    ambient.append(particle);
  }
  ambient.append(element("i", "scanline"));
  return ambient;
}

function renderGame() {
  destroyMovement();
  clear(modalRoot);
  clear(app);
  state.status = "playing";
  saveActiveRun(state);
  const level = getLevel(state.currentLevel);
  const next = getLevel(state.currentLevel + 1);
  preloadLevel(level, next);
  const shell = element("section", "game-shell");
  const stage = element("div", "game-frame");
  const world = element("div", "scene-world");
  stage.setAttribute("aria-label", `${level.title} game scene`);
  const bg = element("img", "scene-bg");
  bg.src = level.background;
  bg.alt = "";
  bg.addEventListener("error", () => {
    bg.remove();
    console.warn(`[TIME GLITCH] Missing required background: ${level.title}`);
  });
  world.append(bg, element("div", "scene-vignette"), makeAmbient(level));
  stage.append(world, makeHud(level));

  let controller = null;
  level.objects.forEach((object) => {
    const completed = state.completedTasks.has(object.taskId);
    const motionClass = object.motion ? ` motion-${object.motion}` : "";
    const mountClass = ` mount-${object.mount || "floor"}`;
    const embeddedClass = " embedded-hotspot";
    const labelClass = object.labelPosition === "top" ? " label-top" : "";
    const hotspot = makeButton("", `hotspot scene-object${motionClass}${mountClass}${embeddedClass}${labelClass}${completed ? " completed" : ""}`, () => controller?.moveToObject(object), { "aria-label":`${object.label}${completed ? ", completed, review" : ""}` });
    hotspot.style.left = `${object.x}%`;
    hotspot.style.top = `${object.y}%`;
    hotspot.style.width = `${(object.size || 8) * .82}%`;
    if (object.ratio) hotspot.style.aspectRatio = String(object.ratio);
    hotspot.style.zIndex = String(object.depth || 5);
    world.append(hotspot);
  });

  const hero = element("div", "hero");
  const heroImage = element("img");
  heroImage.src = ASSETS.hero.idle;
  heroImage.alt = "Time Explorer";
  heroImage.addEventListener("error", () => console.warn("[TIME GLITCH] Missing required heroine: hero.idle"));
  hero.append(heroImage);
  const destination = element("div", "destination");
  stage.append(destination, hero);

  if (level.id < 6) {
    controller = createMovementController(stage, hero, destination, (object) => openTask(object.taskId), level.objects);
    movement = controller;
  } else {
    hero.style.left = "29%";
    controller = createMovementController(stage, hero, destination, openSpeaking, level.speakingObjects, { initialX:29, initialY:79 });
    movement = controller;
    level.speakingObjects.forEach((object) => {
      const voice = makeButton("", `hotspot scene-object embedded-hotspot chamber-console motion-${object.motion} mount-${object.mount}`, () => controller?.moveToObject(object), { "aria-label":object.label });
      voice.style.left = `${object.x}%`;
      voice.style.top = `${object.y}%`;
      voice.style.width = `${object.size * .82}%`;
      voice.style.zIndex = String(object.depth);
      world.append(voice);
    });
  }

  const tools = element("div", "bottom-tools");
  tools.append(
    makeButton("TIME SCANNER", "btn btn-ghost btn-small", showScanner),
    makeButton("TECH · LOCATIONS", "btn btn-ghost btn-small tech-btn", showLocationNavigator, { "aria-label":"Open technical location selector" })
  );
  const saveTools = element("div", "save-tools");
  const saveButton = makeButton("SAVE GAME", "btn btn-small save-game-btn", saveCurrentGame, { "aria-label":"Save current game", "data-short":"SAVE" });
  const loadButton = makeButton("LOAD GAME", "btn btn-small load-game-btn", showLoadGameHistory, { "aria-label":"Open saved games history", "data-short":"LOAD" });
  saveTools.append(saveButton, loadButton);
  stage.append(tools, saveTools, element("div", "rotate-tip", "Rotate for a bigger game view"));
  shell.append(stage);
  app.append(shell);
}

function responseForTask(task) {
  if (task.type === "mcq") return "";
  if (task.type === "word-order") return [];
  if (task.type === "multi-select") return new Set();
  return new Map();
}

function openTask(taskId) {
  if (!["playing", "task"].includes(state.status)) return;
  const task = getTask(taskId);
  if (!task) return;
  const review = state.completedTasks.has(task.id);
  let runtime = state.taskRuntime.get(task.id);
  if (!runtime) {
    runtime = { attempts:0, hintUsed:false, assignedPlayerIndex:state.currentPlayerIndex, assigned:false };
    state.taskRuntime.set(task.id, runtime);
  }
  if (!review && !runtime.assigned) {
    const player = state.players[runtime.assignedPlayerIndex];
    player.maxPossibleAssignedPoints += 100;
    player.assignedTasks += 1;
    runtime.assigned = true;
  }
  state.status = "task";
  saveActiveRun(state);
  playSound("taskOpen");
  renderTaskModal(task, runtime, review);
}

function renderTaskModal(task, runtime, review) {
  clear(modalRoot);
  const orderedOptions = task.options ? seededShuffle(task.options, `${task.id}:options`) : [];
  const orderedChips = task.chips ? seededShuffle(task.chips.map((chip, index) => ({ chip, index })), `${task.id}:chips`) : [];
  const orderedItems = task.items ? seededShuffle(task.items.map((item, index) => ({ item, index })), `${task.id}:items`) : [];
  let response = responseForTask(task);
  let selectedToken = null;
  if (review) {
    if (task.type === "mcq") response = task.answer;
    else if (task.type === "word-order") response = task.answer.map((_, index) => index);
    else if (task.type === "multi-select") response = new Set(task.answers);
    else response = new Map(task.items.map(([, group], index) => [index, group]));
  }
  const backdrop = element("div", "modal-backdrop");
  const modal = element("section", "task-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "task-title");
  const close = makeButton("×", "modal-close", () => closeTask(false), { "aria-label":"Close task" });
  modal.append(close, element("div", "task-kicker", review ? "REVIEW MODE · ZERO SCORE" : `${currentPlayer(state).name}'S TURN`));
  const title = element("h2", "", task.title);
  title.id = "task-title";
  modal.append(title, element("p", "task-instruction", task.instruction));
  if (task.prompt) {
    const prompt = element("div", "prompt-card");
    task.prompt.split("\n").forEach((line, index) => { if (index) prompt.append(document.createElement("br")); prompt.append(document.createTextNode(line)); });
    if (task.signalWord) prompt.append(element("span", "signal-tag", task.signalWord));
    modal.append(prompt);
  }
  const answerArea = element("div", "task-answer-area");
  const feedback = element("div", "feedback", review ? "Completed task. Review only — no additional points." : "Choose your answer, then press CHECK.");

  function renderAnswers() {
    clear(answerArea);
    if (task.type === "mcq") {
      const grid = element("div", "answer-grid");
      orderedOptions.forEach((option) => {
        const selected = response === option;
        const button = makeButton(option, `answer-card${selected ? " selected" : ""}${review && option === task.answer ? " correct-review" : ""}`, () => {
          if (review) return;
          response = option;
          renderAnswers();
          playSound("click");
        });
        button.setAttribute("aria-pressed", String(selected));
        grid.append(button);
      });
      answerArea.append(grid);
    } else if (task.type === "multi-select") {
      const grid = element("div", "answer-grid");
      orderedOptions.forEach((option) => {
        const selected = response.has(option);
        const button = makeButton(option, `answer-card${selected ? " selected" : ""}${review && task.answers.includes(option) ? " correct-review" : ""}`, () => {
          if (review) return;
          if (response.has(option)) response.delete(option); else response.add(option);
          renderAnswers();
          playSound("click");
        });
        button.setAttribute("aria-pressed", String(selected));
        grid.append(button);
      });
      answerArea.append(grid);
    } else if (task.type === "word-order") {
      const built = element("div", "built-row");
      const order = review ? task.answer.map((_, index) => index) : response;
      order.forEach((index, orderIndex) => built.append(makeButton(task.chips[index], "word-chip", () => {
        if (review) return;
        response.splice(orderIndex, 1);
        renderAnswers();
      }, { "aria-label":`Remove ${task.chips[index]}` })));
      if (!order.length) built.append(element("span", "muted", "Tap words in the correct order…"));
      const bank = element("div", "chip-bank");
      orderedChips.forEach(({ chip, index }) => {
        const used = order.includes(index);
        const button = makeButton(chip, `word-chip${used ? " assigned" : ""}`, () => {
          if (review || used) return;
          response.push(index);
          renderAnswers();
          playSound("click");
        });
        button.disabled = used;
        bank.append(button);
      });
      answerArea.append(element("div", "eyebrow", "YOUR SENTENCE"), built, bank);
    } else {
      const bank = element("div", "chip-bank");
      orderedItems.forEach(({ item:[text], index }) => {
        const assigned = response.has(index);
        const button = makeButton(text, `word-chip${selectedToken === index ? " selected-token" : ""}${assigned ? " assigned" : ""}`, () => {
          if (review) return;
          selectedToken = index;
          renderAnswers();
          playSound("click");
        });
        bank.append(button);
      });
      const zones = element("div", "sort-zone-grid");
      task.groups.forEach((group) => {
        const zone = element("div", "sort-zone");
        zone.setAttribute("role", "button");
        zone.tabIndex = 0;
        zone.setAttribute("aria-label", `Place selected item in ${group}`);
        const assignToZone = () => {
          if (review || selectedToken === null) return;
          response.set(selectedToken, group);
          selectedToken = null;
          renderAnswers();
          playSound("click");
        };
        zone.addEventListener("click", assignToZone);
        zone.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); assignToZone(); }
        });
        zone.append(element("h3", "", group));
        const list = element("div", "sorted-list");
        task.items.forEach(([text], index) => {
          if (response.get(index) === group) list.append(makeButton(text, "word-chip", () => {
            if (review) return;
            response.delete(index);
            selectedToken = index;
            renderAnswers();
          }));
        });
        zone.append(list);
        zones.append(zone);
      });
      answerArea.append(bank, zones);
    }
  }
  renderAnswers();
  modal.append(answerArea, feedback);

  const actions = element("div", "task-actions");
  const hintButton = makeButton("HINT", "btn btn-ghost", () => {
    if (runtime.hintUsed || review) return;
    runtime.hintUsed = true;
    state.players[runtime.assignedPlayerIndex].hintsUsed += 1;
    hintButton.disabled = true;
    feedback.textContent = task.hint;
    feedback.className = "feedback retry";
    saveActiveRun(state);
    playSound("hint");
  });
  hintButton.disabled = runtime.hintUsed || review;
  const right = element("div", "task-actions-right");
  const check = makeButton(review ? "CLOSE" : "CHECK", review ? "btn" : "btn btn-primary", () => {
    if (review) { closeTask(false); return; }
    if (!hasResponse(task, normalizeResponse(task, response))) {
      feedback.textContent = "Choose or place an answer first.";
      feedback.className = "feedback retry";
      return;
    }
    const normalized = normalizeResponse(task, response);
    if (!isTaskCorrect(task, normalized)) {
      runtime.attempts += 1;
      feedback.textContent = runtime.attempts >= 2 ? `${task.hint} Try once more — you can do it.` : "Almost! Look at the signal word or verb pattern and try again.";
      feedback.className = "feedback retry";
      modal.classList.remove("shake");
      requestAnimationFrame(() => modal.classList.add("shake"));
      setTimeout(() => modal.classList.remove("shake"), 320);
      saveActiveRun(state);
      playSound("incorrect");
      return;
    }
    completeTask(task, runtime, modal, feedback, actions);
  });
  right.append(check);
  actions.append(hintButton, right);
  modal.append(actions);
  backdrop.append(modal);
  modalRoot.append(backdrop);
  close.focus();
}

function normalizeResponse(task, response) {
  if (task.type === "word-order") return response.map((index) => task.chips[index]);
  return response;
}

function completeTask(task, runtime, modal, feedback, actions) {
  if (state.completedTasks.has(task.id)) return;
  const points = challengePoints(runtime.attempts, runtime.hintUsed);
  const player = state.players[runtime.assignedPlayerIndex];
  player.earnedPoints += points;
  player.completedTasks += 1;
  player.totalCorrect += 1;
  if (runtime.attempts === 0 && !runtime.hintUsed) player.firstTryCorrect += 1;
  runtime.completed = true;
  state.completedTasks.add(task.id);
  feedback.textContent = task.completionText ? `Correct! ${task.completionText}` : "Correct! The timeline signal is stable again.";
  feedback.append(element("span", "score-pop", `  +${points}`));
  feedback.className = "feedback success";
  modal.classList.add("success");
  playSound("correct");
  rotateTurn(state);
  saveActiveRun(state);
  clear(actions);
  const continueButton = makeButton("CONTINUE", "btn btn-primary", () => {
    clear(modalRoot);
    const level = getLevel(state.currentLevel);
    const complete = level.tasks.every((levelTask) => state.completedTasks.has(levelTask.id));
    if (complete) completeLevel(level);
    else renderGame();
  });
  actions.append(element("span", "score-pop", `+${points} TIME ENERGY`), continueButton);
  continueButton.focus();
}

function closeTask(forceRender) {
  clear(modalRoot);
  state.status = "playing";
  saveActiveRun(state);
  if (forceRender) renderGame();
}

function completeLevel(level) {
  state.status = "exiting";
  const showReward = () => showLevelReward(level);
  if (movement && level.exit) movement.moveToExit(level.exit, showReward);
  else showReward();
}

function showLevelReward(level) {
  state.status = "transition";
  if (level.coreReward) state.collectedCores = Math.min(TOTAL_CORES, state.collectedCores + 1);
  saveActiveRun(state);
  destroyMovement();
  clear(app);
  const screen = element("section", "transition-screen");
  const inner = element("div");
  const core = element("img", "big-core scene-final-core");
  core.src = ASSETS.sceneFinalCore;
  core.alt = "Time Core collected";
  inner.append(core, element("div", "eyebrow", "CORE COLLECTED"), element("h2", "", `TIME CORE ${state.collectedCores} / ${TOTAL_CORES}`), element("p", "muted", level.id === 5 ? "TIME CORE CHAMBER UNLOCKED" : "Timeline route restored"));
  screen.append(inner);
  app.append(screen);
  playSound("collect");
  setTimeout(() => {
    state.currentLevel += 1;
    saveActiveRun(state);
    playSound("portal");
    renderGame();
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 500 : 1900);
}

function speakingPrompts() {
  return getLevel(6)?.speakingPrompts || [];
}

function openSpeaking() {
  if (state.status !== "playing") return;
  const prompts = speakingPrompts();
  const total = prompts.length;
  if (state.speakingIndex >= total) return;
  state.status = "speaking";
  const player = currentPlayer(state);
  const key = `SP-${state.speakingIndex}`;
  let runtime = state.taskRuntime.get(key);
  if (!runtime) {
    runtime = { assignedPlayerIndex:state.currentPlayerIndex, assigned:true };
    state.taskRuntime.set(key, runtime);
    player.maxPossibleAssignedPoints += 150;
    player.assignedTasks += 1;
  }
  saveActiveRun(state);
  const info = prompts[state.speakingIndex];
  clear(modalRoot);
  const backdrop = element("div", "modal-backdrop");
  const modal = element("section", "task-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.append(element("div", "task-kicker", "VOICE ACCESS REQUIRED"), element("h2", "", `${player.name} · ${info.title}`), element("p", "task-instruction", `Prompt ${state.speakingIndex + 1} of ${total} · Speak aloud. A teacher or learner confirms completion.`), element("div", "prompt-card", info.prompt));
  const model = element("div", "feedback", `MODEL: ${info.model}`);
  const actions = element("div", "task-actions");
  actions.append(
    makeButton("TRY AGAIN", "btn btn-ghost", () => { model.textContent = "Take your time, use a signal word, and say both parts again."; playSound("hint"); }),
    makeButton("COMPLETED", "btn btn-primary", () => completeSpeaking(runtime))
  );
  modal.append(model, actions);
  backdrop.append(modal);
  modalRoot.append(backdrop);
  playSound("taskOpen");
}

function completeSpeaking(runtime) {
  const player = state.players[runtime.assignedPlayerIndex];
  if (runtime.completed) return;
  runtime.completed = true;
  player.earnedPoints += 150;
  player.completedTasks += 1;
  player.totalCorrect += 1;
  player.speakingCompleted += 1;
  state.speakingIndex += 1;
  rotateTurn(state);
  saveActiveRun(state);
  playSound("correct");
  clear(modalRoot);
  const total = speakingPrompts().length;
  if (state.speakingIndex >= total) completeFinalScene();
  else {
    renderGame();
    const nextSpeakingObject = getLevel(6)?.speakingObjects[state.speakingIndex];
    setTimeout(() => {
      if (movement && nextSpeakingObject) movement.moveToObject(nextSpeakingObject);
      else openSpeaking();
    }, 350);
  }
}

function completeFinalScene() {
  state.status = "exiting";
  const level = getLevel(6);
  if (movement && level?.exit) movement.moveToExit(level.exit, renderRestoration);
  else renderRestoration();
}

function renderRestoration() {
  state.status = "restoring";
  destroyMovement();
  clear(app);
  const screen = element("section", "victory-screen");
  const ring = element("div", "energy-ring");
  const inner = element("div", "victory-inner");
  const core = element("img", "big-core scene-final-core");
  core.src = ASSETS.sceneFinalCore;
  core.alt = "Restored Time Core";
  inner.append(core, element("div", "eyebrow", "RESTORATION IN PROGRESS"), element("h1", "", "TIME SYSTEM RESTORED"), element("p", "muted", "The timeline is stable again."));
  screen.append(ring, inner);
  app.append(screen);
  playSound("coreCharge");
  setTimeout(() => playSound("energyPulse"), 900);
  setTimeout(() => playSound("energyPulse"), 1800);
  setTimeout(() => playSound("energyPulse"), 2700);
  setTimeout(() => { playSound("restored"); renderVictory(); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 1200 : 4800);
}

function renderVictory() {
  state.status = "victory";
  clear(app);
  const screen = element("section", "victory-screen");
  const ring = element("div", "energy-ring");
  const inner = element("div", "victory-inner");
  inner.append(element("div", "brand-crystal"), element("h1", "", "TIME SYSTEM RESTORED"), element("p", "mission-copy", state.players.length === 1 ? "Great work, Time Explorer!" : "Great work, Time Explorers!"), makeButton("VIEW RESULTS", "btn btn-primary", () => renderResults(buildRunResult())));
  screen.append(ring, inner);
  app.append(screen);
}

function buildRunResult() {
  const result = {
    runId: state.runId,
    completedAt: new Date().toISOString(),
    startedAt: state.startedAt,
    cores: state.collectedCores,
    players: rankPlayers(state.players)
  };
  saveCompletedRun(result);
  clearActiveRun();
  return result;
}

function renderResults(result, savedView = false) {
  destroyMovement();
  clear(modalRoot);
  clear(app);
  state.status = "results";
  const screen = element("section", "results-screen");
  const wrap = element("div", "results-wrap");
  wrap.append(element("div", "eyebrow", savedView ? "LAST MISSION" : "TIMELINE REPORT"), element("h1", "", result.players.length === 1 ? "MISSION COMPLETE" : "TIME EXPLORER RANKING"), element("p", "muted", "Main score is normalized to 0–1000 for fair ranking across shared turns."));
  const table = element("div", "score-table");
  const header = element("div", "score-row header");
  ["RANK","EXPLORER","SCORE","TASKS","FIRST TRY","ACCURACY","HINTS / SPEAKING"].forEach((text) => header.append(element("span", "", text)));
  table.append(header);
  result.players.forEach((player) => {
    const row = element("article", "score-row");
    row.append(
      element("span", "rank-badge", result.players.length === 1 ? "✓" : String(player.rank)),
      element("span", "player-score-name", player.name),
      element("span", "normalized", String(player.normalizedScore)),
      element("span", "", String(player.completedTasks)),
      element("span", "", `${player.firstTryRate}%`),
      element("span", "", `${player.accuracy}%`),
      element("span", "", `${player.hintsUsed} / ${player.speakingCompleted}`)
    );
    table.append(row);
  });
  const card = element("section", "results-card");
  card.append(table);
  const actions = element("div", "result-actions");
  if (!savedView) actions.append(makeButton("PLAY AGAIN", "btn btn-primary", () => showReplayConfirmation(result)));
  actions.append(makeButton("MAIN SCREEN", "btn", () => renderStart([])));
  card.append(actions);
  wrap.append(card);
  screen.append(wrap);
  app.append(screen);
  playSound("resultsOpen");
}

function showScanner() {
  const backdrop = element("div", "modal-backdrop");
  const modal = element("section", "task-modal scanner-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const close = makeButton("×", "modal-close", () => backdrop.remove(), { "aria-label":"Close Time Scanner" });
  modal.append(close, element("div", "task-kicker", "TIME SCANNER"), element("h2", "", "SIGNAL WORDS"));
  const grid = element("div", "scanner-grid");
  const columns = [
    ["ROUTINE","Present Simple",["always","usually","often","sometimes","never","every day","every week","on Mondays"]],
    ["LIVE","Present Continuous",["now","right now","at the moment","Look!","Listen!"]]
  ];
  columns.forEach(([name, tense, words]) => {
    const column = element("section", "scanner-col");
    column.append(element("div", "eyebrow", tense), element("h3", "", name));
    const list = element("ul");
    words.forEach((word) => list.append(element("li", "", word)));
    column.append(list);
    grid.append(column);
  });
  modal.append(grid);
  backdrop.append(modal);
  modalRoot.append(backdrop);
  playSound("taskOpen");
  close.focus();
}

function showLocationNavigator() {
  if (!state.players?.length) return;
  const backdrop = element("div", "modal-backdrop");
  const modal = element("section", "task-modal location-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "location-title");
  const close = makeButton("×", "modal-close", () => backdrop.remove(), { "aria-label":"Close location selector" });
  const title = element("h2", "", "LOCATION SELECTOR");
  title.id = "location-title";
  modal.append(
    close,
    element("div", "task-kicker", "TECHNICAL · SAVED MISSION"),
    title,
    element("p", "task-instruction", "Choose any location. Completed tasks, scores and the current player will be preserved.")
  );
  const grid = element("div", "location-grid");
  LEVELS.forEach((level) => {
    const completed = level.tasks.filter((task) => state.completedTasks.has(task.id)).length;
    let statusText;
    if (level.id <= 5) statusText = `${completed} / ${level.tasks.length} tasks${completed === level.tasks.length ? " · COMPLETE" : ""}`;
    else {
      const totalSpeaking = speakingPrompts().length;
      statusText = `${state.speakingIndex} / ${totalSpeaking} speaking prompts`;
    }
    const card = makeButton("", `location-card${state.currentLevel === level.id ? " current" : ""}`, () => {
      state.currentLevel = level.id;
      state.status = "playing";
      saveActiveRun(state);
      backdrop.remove();
      playSound("portal");
      renderGame();
    }, { "aria-label":`Go to Level ${level.id}, ${level.title}` });
    card.append(
      element("span", "location-number", String(level.id)),
      element("strong", "", level.title),
      element("small", "", level.subtitle),
      element("span", "location-status", statusText)
    );
    if (state.currentLevel === level.id) card.setAttribute("aria-current", "true");
    grid.append(card);
  });
  const footer = element("div", "location-footer");
  footer.append(
    element("span", "", `Current turn: ${currentPlayer(state).name}`),
    element("span", "", `Time Cores: ${state.collectedCores} / ${TOTAL_CORES}`)
  );
  modal.append(grid, footer);
  backdrop.append(modal);
  modalRoot.append(backdrop);
  playSound("taskOpen");
  close.focus();
}

function saveCurrentGame() {
  if (!state.players?.length || !getLevel(state.currentLevel)) return;
  saveActiveRun(state);
  const saved = saveManualGame(state);
  if (!saved) return;
  playSound("confirm");
  showToast(`GAME SAVED · ${getLevel(state.currentLevel).title}`);
}

function loadGameSnapshot(saved) {
  state = restoreGameState(saved);
  prefilledNames = state.players.map((player) => player.name);
  saveActiveRun(state);
  clear(modalRoot);
  playSound("portal");
  renderGame();
}

function showToast(message) {
  document.querySelector(".save-toast")?.remove();
  const toast = element("div", "save-toast", message);
  toast.setAttribute("role", "status");
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 220);
  }, 1800);
}

function formattedSaveDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString(undefined, {
    year:"numeric", month:"2-digit", day:"2-digit",
    hour:"2-digit", minute:"2-digit", second:"2-digit"
  });
}

function showLoadGameHistory() {
  const backdrop = element("div", "modal-backdrop");
  const modal = element("section", "task-modal save-history-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "save-history-title");
  const close = makeButton("×", "modal-close", () => backdrop.remove(), { "aria-label":"Close saved games history" });
  const title = element("h2", "", "LOAD GAME");
  title.id = "save-history-title";
  const toolbar = element("div", "save-history-toolbar");
  const countLabel = element("span", "muted");
  const deleteAll = makeButton("DELETE ALL", "btn btn-ghost btn-small delete-saves-btn", () => {
    showConfirmation("Delete all saved games?", "Every manual save in the history will be permanently removed.", "DELETE ALL", () => {
      deleteAllManualSaves();
      renderHistory();
      showToast("SAVED GAME HISTORY DELETED");
    });
  });
  toolbar.append(countLabel, deleteAll);
  const list = element("div", "save-history-list");

  function renderHistory() {
    clear(list);
    const saves = loadManualSaves();
    countLabel.textContent = `${saves.length} SAVED GAME${saves.length === 1 ? "" : "S"}`;
    deleteAll.disabled = saves.length === 0;
    if (!saves.length) {
      const empty = element("div", "empty-saves");
      empty.append(element("div", "empty-save-icon", "◇"), element("h3", "", "NO SAVED GAMES YET"), element("p", "muted", "Use SAVE GAME inside a location to create a manual checkpoint."));
      list.append(empty);
      return;
    }
    saves.forEach((saved, index) => {
      const level = getLevel(saved.currentLevel) || LEVELS[0];
      const players = Array.isArray(saved.players) ? saved.players : [];
      const currentIndex = Math.min(players.length - 1, Math.max(0, Number(saved.currentPlayerIndex) || 0));
      const currentName = players[currentIndex]?.name || players[0]?.name || "Time Explorer";
      const card = element("article", "save-history-card");
      const number = element("span", "save-slot", String(index + 1));
      const info = element("div", "save-history-info");
      const playerLine = element("div", "save-player-line");
      playerLine.append(element("strong", "", currentName), element("span", "", "CURRENT PLAYER"));
      const locationLine = element("div", "save-location", `LEVEL ${level.id} · ${level.title}`);
      const dateLine = element("time", "save-date", formattedSaveDate(saved.savedAt));
      dateLine.dateTime = saved.savedAt || "";
      const team = players.map((player) => player.name).join(", ");
      const details = element("div", "save-details", `${Array.isArray(saved.completedTasks) ? saved.completedTasks.length : 0} tasks · ${saved.collectedCores || 0} / ${TOTAL_CORES} cores${players.length > 1 ? ` · Team: ${team}` : ""}`);
      info.append(playerLine, locationLine, dateLine, details);
      const load = makeButton("LOAD", "btn btn-primary btn-small", () => {
        backdrop.remove();
        loadGameSnapshot(saved);
      }, { "aria-label":`Load save ${index + 1}: ${currentName}, ${level.title}` });
      card.append(number, info, load);
      list.append(card);
    });
  }

  modal.append(close, element("div", "task-kicker", "MANUAL CHECKPOINT HISTORY"), title, toolbar, list);
  backdrop.append(modal);
  modalRoot.append(backdrop);
  renderHistory();
  playSound("taskOpen");
  close.focus();
}

function showConfirmation(title, message, confirmText, onConfirm) {
  const backdrop = element("div", "modal-backdrop");
  const card = element("section", "confirm-card");
  card.setAttribute("role", "alertdialog");
  card.setAttribute("aria-modal", "true");
  card.append(element("h2", "", title), element("p", "muted", message));
  const actions = element("div", "confirm-actions");
  actions.append(makeButton("CANCEL", "btn btn-ghost", () => backdrop.remove()), makeButton(confirmText, "btn btn-primary", () => { backdrop.remove(); onConfirm(); }));
  card.append(actions);
  backdrop.append(card);
  modalRoot.append(backdrop);
}

function showResetConfirmation() {
  showConfirmation("Reset all saved data?", "This removes result history, manual saved games and the unfinished mission. Sound settings will stay unchanged.", "RESET", () => {
    resetSavedResults();
    renderStart([]);
  });
}

function showReplayConfirmation(result) {
  showConfirmation("Start a new game?", "Player names will be prefilled and can be edited before the next mission.", "YES, START NEW GAME", () => {
    prefilledNames = result.players.map((player) => player.name);
    renderStart(prefilledNames);
  });
}

renderStart();

if (new URLSearchParams(location.search).has("qa")) {
  globalThis.__timeGlitchQA = {
    getState: () => state,
    openTask,
    openSpeaking
  };
  import("../tests/qa-browser.js");
}
