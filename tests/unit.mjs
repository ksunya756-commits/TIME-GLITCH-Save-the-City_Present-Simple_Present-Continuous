import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { LEVELS } from "../js/data/levels.js";
import { ASSETS } from "../js/assets.js";
import { isTaskCorrect } from "../js/level-engine.js";
import { challengePoints, normalizedScore, rankPlayers } from "../js/scoring.js";

assert.equal(LEVELS.length, 6, "Exactly six canonical levels are required");
assert.equal(LEVELS.slice(0, 5).flatMap((level) => level.tasks).length, 35, "Levels 1–5 need 35 written challenges");
assert.deepEqual(LEVELS.slice(0, 5).map((level) => level.tasks.length), [7,7,7,7,7]);
assert.deepEqual(LEVELS.slice(0, 5).map((level) => level.objects.length), [7,7,7,7,7]);
assert.equal(LEVELS[5].speakingPrompts.length, 7, "The separate speaking location needs seven prompts");
assert.equal(LEVELS[5].speakingObjects.length, 7, "The speaking location needs seven visual interaction positions");
assert.equal(LEVELS[5].speakingObjects.every((object) => object.image), true, "Speaking interaction positions need existing visual assets");
assert.deepEqual(LEVELS.map((level) => level.coreReward), [true,true,true,true,true,false]);

for (const level of LEVELS.slice(0, 5)) {
  assert.equal(level.objects.every((object) => (object.image || object.embedded) && object.taskId), true, `${level.title} needs image-based or scene-embedded interactive objects`);
  assert.deepEqual(new Set(level.objects.map((object) => object.taskId)), new Set(level.tasks.map((task) => task.id)), `${level.title} objects and tasks must match`);
}

for (const task of LEVELS.slice(0, 5).flatMap((level) => level.tasks)) {
  let answer;
  if (task.type === "mcq") answer = task.answer;
  else if (task.type === "word-order") answer = task.answer;
  else if (task.type === "multi-select") answer = new Set(task.answers);
  else answer = new Map(task.items.map(([, group], index) => [index, group]));
  assert.equal(isTaskCorrect(task, answer), true, `${task.id} canonical answer should validate`);
}

assert.equal(challengePoints(0, false), 100);
assert.equal(challengePoints(1, false), 70);
assert.equal(challengePoints(2, false), 50);
assert.equal(challengePoints(0, true), 50);
assert.equal(normalizedScore({ earnedPoints:700, maxPossibleAssignedPoints:1000 }), 700);
const ranked = rankPlayers([
  { name:"A",earnedPoints:700,maxPossibleAssignedPoints:1000,firstTryCorrect:5,completedTasks:8,hintsUsed:0,totalCorrect:8 },
  { name:"B",earnedPoints:800,maxPossibleAssignedPoints:1000,firstTryCorrect:5,completedTasks:8,hintsUsed:0,totalCorrect:8 }
]);
assert.equal(ranked[0].name, "B");
assert.equal(ranked[0].rank, 1);

function assetUrls(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(assetUrls);
  if (value && typeof value === "object") return Object.values(value).flatMap(assetUrls);
  return [];
}
for (const url of assetUrls(ASSETS)) {
  assert.equal(url.startsWith("/"), false, `${url} must be repository-subpath relative`);
  assert.equal(fs.existsSync(path.resolve(url)), true, `${url} must exist on disk`);
}

console.log("TIME GLITCH unit QA passed: 6 levels, 35 written tasks, 7 speaking prompts, scoring, ranking, and asset paths verified.");
