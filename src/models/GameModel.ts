import { DEFAULT_GAME_OPTIONS } from '@/constants/game';
import { GameOptions, GameStatus } from '@/types/game';
import { generateId } from '@/utils/unique';

/**
 * FOR USE INSIDE GAME SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE GAME INTERFACE INSTEAD
 */
class GameModel {
  public readonly id: string;
  private _status: GameStatus = GameStatus.LOBBY;
  private _options: GameOptions = DEFAULT_GAME_OPTIONS;

  constructor(options?: Partial<GameOptions>) {
    this.id = generateId();
    this._options = this._createOptions(options);
  }

  public updateStatus(status: GameStatus) {
    this._status = status;
  }

  public get json() {
    return {
      id: this.id,
      status: this._status,
      options: this._options
    };
  }

  // PRIVATE METHODS
  private _createOptions(options?: Partial<GameOptions>) {
    const newOptions: GameOptions = DEFAULT_GAME_OPTIONS;
    if (options?.round?.max) newOptions.round.max = options.round.max;
    if (options?.time?.max) newOptions.time.max = options.time.max;
    return newOptions;
  }
}

export default GameModel;
