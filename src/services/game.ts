import { MINIMUM_VALID_SIZE } from '@/constants/game';
import GameModel from '@/models/Game';
import { GameInfoMapType } from '@/types/game';
import { ErrorFromServer } from '@/utils/error';

import RoomServiceInstance from './room';

interface GameServiceInterface {
  findGame: (gameId: string) => { game: GameModel };
  startGame: (gameId: string) => void;
  createGame: () => { game: GameModel };
}

export class GameService implements GameServiceInterface {
  public gameDetailMap: GameInfoMapType = new Map<string, GameModel>(); // GAME ID -> GAME DETAILS

  /**
   *
   * @param roomId RoomID to check validity for game
   * @returns true if valid, false if invalid
   */
  public static isValidGame(roomId: string) {
    const data = RoomServiceInstance.findRoom(roomId);
    const { room } = data;
    return room.currentSize >= MINIMUM_VALID_SIZE;
  }

  /**
   *
   * @param gameId Game ID for which game needs to be started
   * @returns
   */
  public startGame(gameId: string) {
    this.findGame(gameId);
    // TODO: Finish implementation
  }

  /**
   *
   * @returns id - New game's id
   */
  public createGame() {
    const newGame = new GameModel();
    this.gameDetailMap.set(newGame.id, newGame);
    const data = this.findGame(newGame.id);
    return { game: data.game };
  }

  /**
   * Finds a game for a room
   * @param gameId Game ID whose game needs to be found
   * @returns
   */
  public findGame(gameId: string) {
    const game = this.gameDetailMap.get(gameId);
    if (!game) throw new ErrorFromServer('Could not find game!');
    return { game };
  }
}

const GameServiceInstance = new GameService();
export default GameServiceInstance;
