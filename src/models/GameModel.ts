import { DEFAULT_GAME_OPTIONS } from '@/constants/game';
import { CanvasOperation, GameOptions, GameStatus } from '@/types/game';
import Stack from '@/utils/stack';
import { generateId } from '@/utils/unique';

/**
 * FOR USE INSIDE GAME SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE GAME INTERFACE INSTEAD
 */
class GameModel {
  public readonly id: string;
  private _status: GameStatus = GameStatus.LOBBY;
  private _options: GameOptions = DEFAULT_GAME_OPTIONS;
  private _canvasOperationsStack = new Stack<CanvasOperation>();

  constructor(options?: Partial<GameOptions>) {
    this.id = generateId();
    this._options = this._createOptions(options);
  }

  // Options
  public get options() {
    return this._options;
  }

  public setOptions(options: Partial<GameOptions>) {
    this._options = this._createOptions(options);
  }

  // Status
  public get status() {
    return this._status;
  }

  public setStatus(status: GameStatus) {
    this._status = status;
  }

  // Canvas Operations
  public addCanvasOperation(canvasOperation: CanvasOperation) {
    this._canvasOperationsStack.push(canvasOperation);
  }

  // Doodler Interface
  public get json() {
    return {
      id: this.id,
      status: this._status,
      options: this._options,
      canvasOperations: this._canvasOperationsStack.toArray()
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
