import { MINIMUM_VALID_SIZE } from '@/constants/game';
import { ErrorResponse, SuccessResponse } from '@/utils/service';

import RoomServiceInstance from './room';

class GameService {
  // Private Variables
  private roomId: string;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

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
}

export default GameService;
