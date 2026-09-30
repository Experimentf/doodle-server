// Tunable turn scoring. Guessers earn for speed and for being early; the
// drawer earns for a drawing that many players guessed quickly.

// A correct guess is worth GUESS_MIN at the buzzer up to GUESS_MAX instantly.
export const GUESS_MIN = 50;
export const GUESS_MAX = 300;
// >1 curves the reward toward early guesses rather than a straight line.
export const GUESS_SPEED_CURVE = 1.5;
// Extra points for the 1st, 2nd and 3rd correct guessers.
export const GUESS_ORDER_BONUS = [50, 30, 15];

export const DRAWER_MAX = 200;
// Share of the drawer's points that comes from how fast guessers were (the
// rest comes from how many guessed at all).
export const DRAWER_SPEED_WEIGHT = 0.6;
export const DRAWER_ALL_GUESSED_BONUS = 50;

// Scores read nicer as multiples of 5.
const SCORE_STEP = 5;

export interface CorrectGuess {
  doodlerId: string;
  timestamp: number;
}

export interface TurnScoreInput {
  guesses: CorrectGuess[];
  drawerId?: string;
  turnStartedAt: number;
  turnDurationMs: number;
  // Players who could have guessed this turn (everyone but the drawer).
  eligibleGuessers: number;
}

const roundScore = (value: number) =>
  Math.round(value / SCORE_STEP) * SCORE_STEP;

// 1 for an instant guess, 0 at (or after) the end of the turn.
const speedOf = (timestamp: number, start: number, durationMs: number) =>
  durationMs > 0
    ? Math.min(1, Math.max(0, 1 - (timestamp - start) / durationMs))
    : 0;

export const calculateTurnScores = ({
  guesses,
  drawerId,
  turnStartedAt,
  turnDurationMs,
  eligibleGuessers
}: TurnScoreInput): Record<string, number> => {
  const scores: Record<string, number> = {};
  if (guesses.length === 0) return scores;

  const ordered = [...guesses].sort((a, b) => a.timestamp - b.timestamp);
  const speeds = ordered.map(({ timestamp }) =>
    speedOf(timestamp, turnStartedAt, turnDurationMs)
  );

  ordered.forEach(({ doodlerId }, index) => {
    const speedPoints =
      GUESS_MIN +
      (GUESS_MAX - GUESS_MIN) * Math.pow(speeds[index], GUESS_SPEED_CURVE);
    scores[doodlerId] = roundScore(
      speedPoints + (GUESS_ORDER_BONUS[index] ?? 0)
    );
  });

  if (drawerId) {
    // Guessers can leave mid-turn, so the share is capped at 1.
    const guessedShare = Math.min(
      1,
      ordered.length / Math.max(1, eligibleGuessers)
    );
    const averageSpeed =
      speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const quality =
      guessedShare *
      (1 - DRAWER_SPEED_WEIGHT + DRAWER_SPEED_WEIGHT * averageSpeed);
    const allGuessedBonus =
      ordered.length >= eligibleGuessers ? DRAWER_ALL_GUESSED_BONUS : 0;
    scores[drawerId] = roundScore(DRAWER_MAX * quality + allGuessedBonus);
  }

  return scores;
};
