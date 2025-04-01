import { GameOptions } from '@/types/game';

export const DEFAULT_MAX_ROUNDS = 3;
export const DEFAULT_MAX_TIME = 5;
export const DEFAULT_MAX_TURN_END_COOLDOWN_TIME = 8;
export const DEFAULT_MAX_CHOOSE_WORD_TIME = 10;
export const DEFAULT_CAPACITY = 3;
export const MINIMUM_VALID_SIZE = 2;
export const DEFAULT_WORD = '_';
export const DEFAULT_GAME_OPTIONS: GameOptions = {
  round: { current: 1, max: DEFAULT_MAX_ROUNDS },
  timers: {
    drawing: { current: 0, max: DEFAULT_MAX_TIME },
    turnEndCooldownTime: {
      current: 0,
      max: DEFAULT_MAX_TURN_END_COOLDOWN_TIME
    },
    chooseWordTime: { current: 0, max: DEFAULT_MAX_CHOOSE_WORD_TIME }
  },
  word: DEFAULT_WORD
};
