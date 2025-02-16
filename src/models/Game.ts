import { DEFAULT_MAX_ROUNDS, DEFAULT_MAX_TIME } from '@/constants/game';
import { GameOptions, GameStatus } from '@/types/game';
import { generateId } from '@/utils/unique';

/**
 * FOR USE INSIDE GAME SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE GAME INTERFACE INSTEAD
 */
class GameModel {
  public readonly id: string;
  private _status: GameStatus = GameStatus.LOBBY;
  private _options: GameOptions = {
    round: { current: 1, max: DEFAULT_MAX_ROUNDS },
    time: { current: 0, max: DEFAULT_MAX_TIME },
    word: ''
  };

  constructor() {
    this.id = generateId();
  }

  public get json() {
    return {
      id: this.id,
      status: this._status,
      options: this._options
    };
  }
}

export default GameModel;
