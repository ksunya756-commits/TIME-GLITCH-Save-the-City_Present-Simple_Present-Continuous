export function challengePoints(attempts, hintUsed) {
  if (hintUsed || attempts > 1) return 50;
  if (attempts === 1) return 70;
  return 100;
}

export function normalizedScore(player) {
  if (!player.maxPossibleAssignedPoints) return 0;
  return Math.round(1000 * player.earnedPoints / player.maxPossibleAssignedPoints);
}

export function percentage(numerator, denominator) {
  return denominator ? Math.round(100 * numerator / denominator) : 0;
}

export function rankPlayers(players) {
  const enriched = players.map((player) => ({
    ...player,
    normalizedScore: normalizedScore(player),
    firstTryRate: percentage(player.firstTryCorrect, player.completedTasks),
    accuracy: percentage(player.totalCorrect, player.completedTasks)
  }));
  enriched.sort((a, b) =>
    b.normalizedScore - a.normalizedScore ||
    b.firstTryRate - a.firstTryRate ||
    a.hintsUsed - b.hintsUsed
  );
  let shownRank = 1;
  return enriched.map((player, index, list) => {
    if (index > 0) {
      const previous = list[index - 1];
      const tied = player.normalizedScore === previous.normalizedScore && player.firstTryRate === previous.firstTryRate && player.hintsUsed === previous.hintsUsed;
      if (!tied) shownRank = index + 1;
    }
    return { ...player, rank: shownRank };
  });
}
