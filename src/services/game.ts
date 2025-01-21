import { MINIMUM_VALID_SIZE } from '@/constants/game';
import GameModel from '@/models/Game';
import { GameInfoMapType } from '@/types/game';
import { ServiceResponse } from '@/types/service';
import { ErrorFromServer } from '@/utils/error';
import { ErrorResponse, SuccessResponse } from '@/utils/service';

import RoomServiceInstance from './room';

interface GameServiceInterface {
  getGameDetails: (roomId: string) => ServiceResponse<{ game: GameModel }>;
  startGame: (roomId: string) => ServiceResponse<boolean>;
}

export class GameService implements GameServiceInterface {
  private gameDetailMap: GameInfoMapType = new Map<string, GameModel>();

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
   * @param roomId Room id for which game detail is needed
   * @returns
   */
  public getGameDetails(roomId: string) {
    const { data, error } = this.findGame(roomId);
    if (error || data === undefined) return ErrorResponse(error);
    return SuccessResponse({ game: data.game });
  }

  /**
   *
   * @param roomId Room for which game needs to be started
   * @returns
   */
  public startGame(roomId: string) {
    const { data, error } = this.findGame(roomId);
    if (error || data === undefined) return ErrorResponse(error);
    // TODO: Finish implementation
    return SuccessResponse(true);
  }

  // PRIVATE METHODS
  /**
   * Finds a game for a room
   * @param roomId RoomID whose game needs to be found
   * @returns
   */
  private findGame(roomId: string) {
    const game = this.gameDetailMap.get(roomId);
    if (!game) return ErrorResponse(new ErrorFromServer());
    return SuccessResponse({ game });
  }
}

const GameServiceInstance = new GameService();
export default GameServiceInstance;
