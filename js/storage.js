const KEYS = {
  settings: "timeGlitch:settings",
  last: "timeGlitch:lastCompletedRun",
  history: "timeGlitch:resultHistory",
  active: "timeGlitch:activeRun",
  manualSaves: "timeGlitch:manualSaves"
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`[TIME GLITCH] Could not read ${key}`, error);
    return fallback;
  }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (error) { console.warn(`[TIME GLITCH] Could not save ${key}`, error); }
}

export function loadSettings() { return read(KEYS.settings, { soundEnabled: true }); }
export function saveSettings(value) { write(KEYS.settings, value); }
export function loadLastResult() { return read(KEYS.last, null); }
export function loadHistory() { return read(KEYS.history, []); }
export function loadActiveRun() { return read(KEYS.active, null); }

function stateSnapshot(state) {
  if (!state?.players?.length) return null;
  return {
    status: state.status,
    currentLevel: state.currentLevel,
    currentPlayerIndex: state.currentPlayerIndex,
    collectedCores: state.collectedCores,
    players: state.players,
    completedTasks: [...state.completedTasks],
    taskRuntime: [...state.taskRuntime.entries()],
    speakingIndex: state.speakingIndex,
    speakingPlan: state.speakingPlan,
    runId: state.runId,
    startedAt: state.startedAt
  };
}

export function saveActiveRun(state) {
  const snapshot = stateSnapshot(state);
  if (!snapshot) return;
  write(KEYS.active, { ...snapshot, savedAt: new Date().toISOString() });
}

export function clearActiveRun() {
  try { localStorage.removeItem(KEYS.active); }
  catch (error) { console.warn("[TIME GLITCH] Could not clear active mission", error); }
}

export function loadManualSaves() { return read(KEYS.manualSaves, []); }

export function saveManualGame(state) {
  const snapshot = stateSnapshot(state);
  if (!snapshot) return null;
  const savedAt = new Date().toISOString();
  const entry = {
    ...snapshot,
    saveId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt
  };
  const saves = loadManualSaves();
  saves.unshift(entry);
  write(KEYS.manualSaves, saves.slice(0, 30));
  return entry;
}

export function deleteAllManualSaves() {
  try { localStorage.removeItem(KEYS.manualSaves); }
  catch (error) { console.warn("[TIME GLITCH] Could not delete manual saves", error); }
}

export function saveCompletedRun(result) {
  write(KEYS.last, result);
  const history = loadHistory().filter((entry) => entry.runId !== result.runId);
  history.unshift(result);
  write(KEYS.history, history.slice(0, 10));
}

export function resetSavedResults() {
  try {
    localStorage.removeItem(KEYS.last);
    localStorage.removeItem(KEYS.history);
    localStorage.removeItem(KEYS.active);
    localStorage.removeItem(KEYS.manualSaves);
  } catch (error) { console.warn("[TIME GLITCH] Could not reset saved results", error); }
}
