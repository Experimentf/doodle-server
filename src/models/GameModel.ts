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
  private _timer: NodeJS.Timer | null = null;
  private _roomId: string;

  constructor(roomId: string, options?: Partial<GameOptions>) {
    this.id = generateId();
    this._options = this._createOptions(options);
    this._roomId = roomId;
  }

  // Options
  public get options() {
    return this._options;
  }

  public setOptions(options: Partial<GameOptions>) {
    this._options = this._createOptions(options);
  }

  public updateOptions(options: Partial<GameOptions>) {
    this._options = { ...this._options, ...options };
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

  public clearCanvasOperations() {
    this._canvasOperationsStack.clear();
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

  public get roomId() {
    return this._roomId;
  }

  public startTimer(timeInSeconds: number, callback: () => void) {
    this._timer = setInterval(() => {
      callback();
    }, timeInSeconds * 1000);
  }

  public resetTimer() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
  }

  // PRIVATE METHODS
  private _createOptions(options?: Partial<GameOptions>) {
    const newOptions: GameOptions = DEFAULT_GAME_OPTIONS;
    if (options?.round?.max) newOptions.round.max = options.round.max;
    if (options?.timers?.drawing?.max)
      newOptions.timers.drawing.max = options.timers.drawing.max;
    if (options?.timers?.turnEndCooldownTime?.max)
      newOptions.timers.turnEndCooldownTime.max =
        options.timers.turnEndCooldownTime.max;
    if (options?.timers?.chooseWordTime?.max)
      newOptions.timers.chooseWordTime.max = options.timers.chooseWordTime.max;
    return newOptions;
  }
}

export default GameModel;
