import { GameEvents } from '@/constants/events';
import GameServiceInstance, { GameService } from '@/services/game';
import { ClientToServerEvents, SocketType } from '@/types/socket';

import { GameControllerInterface } from './types';

class GameController implements GameControllerInterface {
  private socket?: SocketType;

  /**
   * Set the socket variable
   * @param socket
   */
  public setSocket(socket: SocketType) {
    this.socket = socket;
  }

  /**
   * Handle when the client requests the game details
   * @param roomId
   * @param respond
   */
  public handleGameOnGetGameDetails: ClientToServerEvents[GameEvents.ON_GET_GAME_DETAILS] =
    (roomId, respond) => {
      const { data: gameDetailsData, error: gameDetailsError } =
        GameServiceInstance.getGameDetails(roomId);
      if (gameDetailsError || gameDetailsData === undefined) {
        respond(null, gameDetailsError);
        return;
      }
      const { game } = gameDetailsData;
      const { data: isValidGameData } = GameService.isValidGame(roomId);
      // TODO: Check for room is public
      if (isValidGameData) {
        GameServiceInstance.startGame(roomId);
      }
      respond(game);
    };
}

export default GameController;
