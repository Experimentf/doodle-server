import { MINIMUM_VALID_SIZE } from '@/constants/game';
import GameModel from '@/models/Game';
import { GameInfoMapType } from '@/types/game';
import { ServiceResponse } from '@/types/service';
import { ErrorFromServer } from '@/utils/error';
import { ErrorResponse, SuccessResponse } from '@/utils/service';

import RoomServiceInstance from './room';

interface GameServiceInterface {
  findGame: (roomId: string) => ServiceResponse<{ game: GameModel }>;
  startGame: (roomId: string) => ServiceResponse<boolean>;
  createGame: (roomId: string) => ServiceResponse<{ game: GameModel }>;
}

export class GameService implements GameServiceInterface {
  public gameDetailMap: GameInfoMapType = new Map<string, GameModel>(); // GAME ID -> GAME DETAILS

  /**
   *
   * @param roomId RoomID to check validity for game
   * @returns true if valid, false if invalid
   */
  public static isValidGame(roomId: string) {
    const { data, error } = RoomServiceInstance.findRoom(roomId);
    if (error || data === undefined) return ErrorResponse(error);
    const { room } = data;
    return SuccessResponse(room.currentSize >= MINIMUM_VALID_SIZE);
  }

  /**
   *
   * @param gameId Game ID for which game needs to be started
   * @returns
   */
  public startGame(gameId: string) {
    const { data, error } = this.findGame(gameId);
    if (error || data === undefined) return ErrorResponse(error);
    // TODO: Finish implementation
    return SuccessResponse(true);
  }

  /**
   *
   * @returns id - New game's id
   */
  public createGame() {
    const newGame = new GameModel();
    this.gameDetailMap.set(newGame.id, newGame);
    const { data, error } = this.findGame(newGame.id);
    if (error || data === undefined) return ErrorResponse(error);
    return SuccessResponse({ game: data.game });
  }

  /**
   * Finds a game for a room
   * @param gameId Game ID whose game needs to be found
   * @returns
   */
  public findGame(gameId: string) {
    const game = this.gameDetailMap.get(gameId);
    if (!game) return ErrorResponse(new ErrorFromServer());
    return SuccessResponse({ game });
  }
}

const GameServiceInstance = new GameService();
export default GameServiceInstance;
