import { GameSocketEvents } from '@/constants/events/socket';
import GameServiceInstance from '@/services/game/GameService';
import RoomServiceInstance from '@/services/room/RoomService';
import { GameStatus } from '@/types/game';
import { DoodleServerError } from '@/utils/error';

import { GameControllerInterface } from './interface';

class GameController implements GameControllerInterface {
  /**
   * Handle when the client requests the game details
   * @param roomId
   * @param respond
   */
  public handleGameOnGetGame: GameControllerInterface['handleGameOnGetGame'] =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_socket) => async (payload, respond) => {
      const gameId = payload;
      const game = await GameServiceInstance.findGame(gameId);
      // const { data: isValidGameData } = GameService.isValidGame(roomId);
      // // TODO: Check for room is public
      // if (isValidGameData) {
      //   GameServiceInstance.startGame(roomId);
      // }

      respond({ data: { game } });
    };

  /**
   * Handle when the clients sends a canvas based operation
   * @param socket
   * @returns
   */
  public handleGameOnGameCanvasOperation: GameControllerInterface['handleGameOnGameCanvasOperation'] =
    (socket) => async (payload, respond) => {
      const { roomId, canvasOperation } = payload;
      const { gameId } = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      if (!gameId) throw new DoodleServerError('Game not found!');
      const game = await GameServiceInstance.updateCanvasOperations(
        gameId,
        canvasOperation
      );
      socket
        .to(roomId)
        .emit(GameSocketEvents.EMIT_GAME_CANVAS_OPERATION, { canvasOperation });
      respond({ data: { game } });
    };

  public handleGameOnChooseWord: GameControllerInterface['handleGameOnChooseWord'] =
    (socket) => async (payload, respond) => {
      const { roomId, word } = payload;
      const { gameId } = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      if (!gameId) throw new DoodleServerError('Game not found!');
      const game = await GameServiceInstance.updateStatus(
        gameId,
        GameStatus.GAME,
        true,
        { word }
      );
      respond({ data: { game } });
    };
}

export default GameController;
