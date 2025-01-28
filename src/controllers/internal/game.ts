import { GameEvents } from '@/constants/events';
import GameServiceInstance from '@/services/game';
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
  public handleGameOnGetGame: ClientToServerEvents[GameEvents.ON_GET_GAME] = (
    gameId,
    respond
  ) => {
    const { data: gameDetailsData, error: gameDetailsError } =
      GameServiceInstance.findGame(gameId);
    if (gameDetailsError || !gameDetailsData) {
      respond({ error: gameDetailsError });
      return;
    }
    const { game } = gameDetailsData;
    // const { data: isValidGameData } = GameService.isValidGame(roomId);
    // // TODO: Check for room is public
    // if (isValidGameData) {
    //   GameServiceInstance.startGame(roomId);
    // }
    respond({ data: game.json });
  };
}

export default GameController;
