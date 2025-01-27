import { DEFAULT_MAX_ROUNDS, DEFAULT_MAX_TIME } from '@/constants/game';
import { GameOptions, GameStatus } from '@/types/game';

class GameModel {
  private status: GameStatus = GameStatus.LOBBY;
  private options: GameOptions = {
    round: { current: 1, max: DEFAULT_MAX_ROUNDS },
    time: { current: 0, max: DEFAULT_MAX_TIME },
    word: ''
  };

  constructor() {}
}

export default GameModel;
