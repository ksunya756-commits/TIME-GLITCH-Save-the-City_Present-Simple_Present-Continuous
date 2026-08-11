export function isTaskCorrect(task, response) {
  if (task.type === "mcq") return response === task.answer;
  if (task.type === "word-order") return Array.isArray(response) && response.join("|") === task.answer.join("|");
  if (task.type === "multi-select") {
    if (!(response instanceof Set) || response.size !== task.answers.length) return false;
    return task.answers.every((answer) => response.has(answer));
  }
  if (["tap-sort", "rapid-sort"].includes(task.type)) {
    if (!(response instanceof Map) || response.size !== task.items.length) return false;
    return task.items.every(([, group], index) => response.get(index) === group);
  }
  return false;
}

export function hasResponse(task, response) {
  if (task.type === "mcq") return Boolean(response);
  if (task.type === "word-order") return Array.isArray(response) && response.length > 0;
  if (task.type === "multi-select") return response instanceof Set && response.size > 0;
  if (["tap-sort", "rapid-sort"].includes(task.type)) return response instanceof Map && response.size > 0;
  return false;
}
