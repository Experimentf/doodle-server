import GameServiceInstance from '@/services/game';

import { GameControllerInterface } from './interface';

class GameController implements GameControllerInterface {
  /**
   * Handle when the client requests the game details
   * @param roomId
   * @param respond
   */
  public handleGameOnGetGame: GameControllerInterface['handleGameOnGetGame'] =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_socket) => (payload, respond) => {
      const gameId = payload;
      const gameDetailsData = GameServiceInstance.findGame(gameId);
      const { game } = gameDetailsData;
      // const { data: isValidGameData } = GameService.isValidGame(roomId);
      // // TODO: Check for room is public
      // if (isValidGameData) {
      //   GameServiceInstance.startGame(roomId);
      // }

      respond({ data: { game: game.json } });
    };
}

export default GameController;
