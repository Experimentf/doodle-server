import { MINIMUM_VALID_SIZE } from '@/constants/game';
import GameModel from '@/models/Game';
import { GameInfoMapType } from '@/types/game';
import { ErrorFromServer } from '@/utils/error';

import RoomServiceInstance from './room';

interface GameServiceInterface {
  findGame: (gameId: string) => Promise<{ game: GameModel }>;
  startGame: (gameId: string) => Promise<void>;
  createGame: () => Promise<{ game: GameModel }>;
}

export class GameService implements GameServiceInterface {
  public gameDetailMap: GameInfoMapType = new Map<string, GameModel>(); // GAME ID -> GAME DETAILS

  /**
   *
   * @param roomId RoomID to check validity for game
   * @returns true if valid, false if invalid
   */
  public static async isValidGame(roomId: string) {
    try {
      const { room } = await RoomServiceInstance.findRoom(roomId);
      return room.currentSize >= MINIMUM_VALID_SIZE;
    } catch (e) {
      return false;
    }
  }

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
  public async createGame() {
    const newGame = new GameModel();
    this.gameDetailMap.set(newGame.id, newGame);
    const data = await this.findGame(newGame.id);
    return { game: data.game };
  }

  /**
   * Finds a game for a room
   * @param gameId Game ID whose game needs to be found
   * @returns
   */
  public async findGame(gameId: string) {
    const game = this.gameDetailMap.get(gameId);
    if (!game) throw new ErrorFromServer('Could not find game!');
    return { game };
  }
}

const GameServiceInstance = new GameService();
export default GameServiceInstance;
