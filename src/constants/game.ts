import { GameOptions } from '@/types/game';

export const DEFAULT_MAX_ROUNDS = 3;
export const DEFAULT_MAX_TIME = 120;
export const DEFAULT_CAPACITY = 3;
export const MINIMUM_VALID_SIZE = 2;
export const DEFAULT_GAME_OPTIONS: GameOptions = {
  round: { current: 1, max: DEFAULT_MAX_ROUNDS },
  time: { current: 0, max: DEFAULT_MAX_TIME },
  word: ''
};
