export const TOTAL_CORES = 5;

export function makePlayer(name, index) {
  return {
    id: `p${index + 1}`,
    name,
    earnedPoints: 0,
    maxPossibleAssignedPoints: 0,
    assignedTasks: 0,
    completedTasks: 0,
    firstTryCorrect: 0,
    totalCorrect: 0,
    hintsUsed: 0,
    speakingCompleted: 0
  };
}

export function createGameState(names = []) {
  return {
    status: names.length ? "playing" : "setup",
    currentLevel: 1,
    currentPlayerIndex: 0,
    collectedCores: 0,
    players: names.map(makePlayer),
    completedTasks: new Set(),
    taskRuntime: new Map(),
    speakingIndex: 0,
    speakingPlan: [],
    runId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: new Date().toISOString()
  };
}

export function currentPlayer(state) { return state.players[state.currentPlayerIndex]; }
export function rotateTurn(state) { state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length; }

export function restoreGameState(snapshot) {
  if (!snapshot?.players?.length) return createGameState();
  return {
    status: "playing",
    currentLevel: Math.min(6, Math.max(1, Number(snapshot.currentLevel) || 1)),
    currentPlayerIndex: Math.min(snapshot.players.length - 1, Math.max(0, Number(snapshot.currentPlayerIndex) || 0)),
    collectedCores: Math.min(TOTAL_CORES, Math.max(0, Number(snapshot.collectedCores) || 0)),
    players: snapshot.players.map((player, index) => ({ ...makePlayer(String(player.name || `Player ${index + 1}`), index), ...player })),
    completedTasks: new Set(Array.isArray(snapshot.completedTasks) ? snapshot.completedTasks : []),
    taskRuntime: new Map(Array.isArray(snapshot.taskRuntime) ? snapshot.taskRuntime : []),
    speakingIndex: Number(snapshot.speakingIndex) || 0,
    speakingPlan: Array.isArray(snapshot.speakingPlan) ? snapshot.speakingPlan : [],
    runId: snapshot.runId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: snapshot.startedAt || new Date().toISOString()
  };
}
