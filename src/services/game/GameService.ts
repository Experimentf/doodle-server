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
    const game = this._games.get(gameId);
    if (!game) throw new DoodleServerError('Could not find game!');
    return { game: game.json };
  }

  /**
   *
   * @param gameId - Game that needs to be moved to lobby
   */
  public async moveToLobby(gameId: string) {
    const { game } = await this._findGameModel(gameId);
    game.setStatus(GameStatus.LOBBY);
  }

  /**
   *
   * @param gameId - Game that needs to be moved to game
   */
  public async moveToGame(gameId: string) {
    const { game } = await this._findGameModel(gameId);
    game.setStatus(GameStatus.GAME);
  }

  /**
   *
   * @param gameId - Game that needs to be moved to game
   */
  public async moveToEnd(gameId: string) {
    const { game } = await this._findGameModel(gameId);
    game.setStatus(GameStatus.END);
  }

  // PRIVATE METHODS
  private async _findGameModel(gameId: string) {
    const game = this._games.get(gameId);
    if (!game) throw new DoodleServerError('Could not find game!');
    return { game };
  }

  /**
   *
   * @param gameId - Game ID
   * @param status - The new status
   */
  private async _setStatus(gameId: string, status: GameStatus) {
    const { game } = await this._findGameModel(gameId);
    game.setStatus(status);
  }
}

const GameServiceInstance = new GameService();
export default GameServiceInstance;
