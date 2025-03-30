import { GameSocketEvents } from '@/constants/events/socket';
import GameModel from '@/models/GameModel';
import {
  CanvasOperation,
  GameInfoMapType,
  GameOptions,
  GameStatus
} from '@/types/game';
import { DoodleServerError } from '@/utils/error';

import RoomServiceInstance from '../room/RoomService';
import SocketServiceInstance from '../socket/SocketService';
import { GameServiceInterface } from './interface';

class GameService implements GameServiceInterface {
  private _games: GameInfoMapType = new Map<string, GameModel>(); // GAME ID -> GAME DETAILS

  /**
   *
   * @param gameId Game ID for which game needs to be started
   * @returns
   */
  public async startGame(gameId: string) {
    await this.findGame(gameId);
    // TODO: Finish implementation
  }

  /**
   *
   * @returns id - New game's id
   */
  public async createGame(roomId: string, options?: Partial<GameOptions>) {
    const newGame = new GameModel(roomId, options);
    this._games.set(newGame.id, newGame);
    const game = await this.findGame(newGame.id);
    return game;
  }

  /**
   * Finds a game for a room
   * @param gameId Game ID whose game needs to be found
   * @returns
   */
  public async findGame(gameId: string) {
    const gameModel = this._games.get(gameId);
    if (!gameModel) throw new DoodleServerError('Could not find game!');
    return gameModel.json;
  }

  /**
   * Updates the game status
   * Starts and resets game timers accordingly
   * Calls the RoomService for room functionality changes on status change
   * Calls the SocketService to inform the client of status change
   * @param gameId - Game ID whose status is to be changed
   * @param status - New status of the game
   */
  public async updateStatus(
    gameId: string,
    status: GameStatus,
    informAffectedClients = false
  ) {
    const gameModel = await this._findGameModel(gameId);
    gameModel.setStatus(status);

    // Inform status change to invloved clients
    if (informAffectedClients) {
      const room = await RoomServiceInstance.findRoom(gameModel.roomId);
      SocketServiceInstance.emitEventToClientRoom(
        gameModel.roomId,
        GameSocketEvents.EMIT_GAME_STATUS_UPDATED,
        [{ room, game: gameModel.json }]
      );
    }

    if (status === GameStatus.GAME) {
      gameModel.resetTimer();
      // Start drawing time
      gameModel.startTimer(gameModel.options.timers.drawing.max, async () => {
        this.updateStatus(gameId, GameStatus.ROUND_END, true);
      });
    } else if (status === GameStatus.LOBBY) {
      gameModel.resetTimer();
    } else if (status === GameStatus.CHOOSE_WORD) {
      gameModel.resetTimer();
    } else if (status === GameStatus.ROUND_END) {
      gameModel.resetTimer();
      // Start round end cooldown time
      gameModel.startTimer(
        gameModel.options.timers.roundEndCooldownTime.max,
        async () => {
          await RoomServiceInstance.changeDrawerTurn(gameModel.roomId);
          this.updateStatus(gameId, GameStatus.CHOOSE_WORD, true);
        }
      );
    } else if (status === GameStatus.RESULT) {
      gameModel.resetTimer();
    }
    return gameModel.json;
  }

  /**
   *
   * @param gameId Game ID
   * @param canvasOperation Operation made on canvas
   * @returns
   */
  public async updateCanvasOperations(
    gameId: string,
    canvasOperation: CanvasOperation
  ) {
    const gameModel = await this._findGameModel(gameId);
    gameModel.addCanvasOperation(canvasOperation);
    return gameModel.json;
  }

  // PRIVATE METHODS
  private async _findGameModel(gameId: string) {
    const gameModel = this._games.get(gameId);
    if (!gameModel) throw new DoodleServerError('Could not find game!');
    return gameModel;
  }

  /**
   *
   * @param gameId - Game ID
   * @param status - The new status
   */
  private async _setStatus(gameId: string, status: GameStatus) {
    const gameModel = await this._findGameModel(gameId);
    gameModel.setStatus(status);
  }
}

const GameServiceInstance = new GameService();
export default GameServiceInstance;
