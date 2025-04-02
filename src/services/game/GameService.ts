import { GameSocketEvents } from '@/constants/events/socket';
import { DEFAULT_WORD } from '@/constants/game';
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

  public deleteGame: GameServiceInterface['deleteGame'] = async (gameId) => {
    const gameModel = await this._findGameModel(gameId);
    gameModel.reset();
    return this._games.delete(gameId);
  };

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
    informAffectedClients = false,
    extraInfo?: { word: string }
  ) {
    const gameModel = await this._findGameModel(gameId);
    gameModel.setStatus(status);
    if (extraInfo?.word) {
      gameModel.updateOptions({ word: extraInfo.word });
    }
    if (status !== GameStatus.GAME) gameModel.clearCanvasOperations();

    // Inform status change to invloved clients
    const room = await RoomServiceInstance.findRoom(gameModel.roomId);
    if (informAffectedClients) {
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
        this.updateStatus(gameId, GameStatus.TURN_END, true);
      });
    } else if (status === GameStatus.LOBBY) {
      gameModel.resetTimer();
    } else if (status === GameStatus.CHOOSE_WORD) {
      gameModel.addDrawer(room.drawerId);
      gameModel.resetTimer();
      gameModel.startTimer(gameModel.options.timers.chooseWordTime.max, () => {
        this.updateStatus(gameId, GameStatus.GAME, true, { word: 'auto' });
      });
    } else if (status === GameStatus.TURN_END) {
      gameModel.resetTimer();
      // Start turn end cooldown time
      gameModel.startTimer(
        gameModel.options.timers.turnEndCooldownTime.max,
        async () => {
          const { drawerId: newDrawerId } =
            await RoomServiceInstance.changeDrawerTurn(gameModel.roomId);
          const isNewRoundRequired = gameModel.checkNewRound(newDrawerId);
          if (
            gameModel.options.round.current === gameModel.options.round.max &&
            isNewRoundRequired
          ) {
            await RoomServiceInstance.changeDrawerTurn(gameModel.roomId, true);
            this.updateStatus(gameId, GameStatus.RESULT, true);
          } else {
            if (isNewRoundRequired) {
              gameModel.incrementRound();
              this.updateStatus(gameId, GameStatus.ROUND_START, true);
            } else {
              this.updateStatus(gameId, GameStatus.CHOOSE_WORD, true, {
                word: DEFAULT_WORD
              });
            }
          }
        }
      );
    } else if (status === GameStatus.ROUND_START) {
      gameModel.resetTimer();
      // Start the round end cooldown timer
      gameModel.startTimer(
        gameModel.options.timers.roundStartCooldownTime.max,
        () => {
          this.updateStatus(gameId, GameStatus.CHOOSE_WORD, true, {
            word: DEFAULT_WORD
          });
        }
      );
    } else if (status === GameStatus.RESULT) {
      gameModel.resetTimer();
      // Start the result cooldown timer
      gameModel.startTimer(
        gameModel.options.timers.resultCooldownTime.max,
        async () => {
          gameModel.reset();
          const isValid = await RoomServiceInstance.isValidGameRoom(
            gameModel.roomId
          );
          if (isValid) {
            await RoomServiceInstance.changeDrawerTurn(gameModel.roomId);
            this.updateStatus(gameId, GameStatus.ROUND_START, true);
          } else {
            this.updateStatus(gameId, GameStatus.LOBBY, true);
          }
        }
      );
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
