import { GameOptions } from '@/types/game';

export const DEFAULT_CAPACITY = 3;
export const MINIMUM_VALID_SIZE = 2;

export const DEFAULT_MAX_ROUNDS = 3;
export const DEFAULT_DRAWING_TIME = 10;
export const DEFAULT_COOLDOWN_TIME = 5;
export const DEFAULT_CHOOSE_WORD_TIME = 10;
export const DEFAULT_RESULT_COOLDOWN_TIME = 10;
export const DEFAULT_WORD = '_';

export const DEFAULT_GAME_OPTIONS: GameOptions = {
  round: { current: 1, max: DEFAULT_MAX_ROUNDS },
  timers: {
    drawing: { current: 0, max: DEFAULT_DRAWING_TIME },
    turnEndCooldownTime: {
      current: 0,
      max: DEFAULT_COOLDOWN_TIME
    },
    roundStartCooldownTime: {
      current: 0,
      max: DEFAULT_COOLDOWN_TIME
    },
    chooseWordTime: { current: 0, max: DEFAULT_CHOOSE_WORD_TIME },
    resultCooldownTime: { current: 0, max: DEFAULT_RESULT_COOLDOWN_TIME }
  },
  word: DEFAULT_WORD
};
