import GameModel from '@/models/GameModel';
import { GameInfoMapType, GameOptions, GameStatus } from '@/types/game';
import { DoodleServerError } from '@/utils/error';

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
  public async createGame(options?: Partial<GameOptions>) {
    const newGame = new GameModel(options);
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
   *
   * @param gameId - Game that needs to be moved to lobby
   * @param status - New status of the game
   */
  public async updateStatus(gameId: string, status: GameStatus) {
    const gameModel = await this._findGameModel(gameId);
    gameModel.setStatus(status);
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
