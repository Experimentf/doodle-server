/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameSocketEvents, RoomSocketEvents } from '@/constants/events/socket';
import DoodlerServiceInstance from '@/services/doodler/DoodlerService';
import GameServiceInstance from '@/services/game/GameService';
import RoomServiceInstance from '@/services/room/RoomService';
import { GameStatus } from '@/types/game';
import { GameInterface } from '@/types/socket/game';

import { RoomControllerInterface } from './interface';

class RoomController implements RoomControllerInterface {
  /**
   * Handle when the client wants to be added to a public room
   */
  public handleRoomOnAddDoodlerToPublicRoom: RoomControllerInterface['handleRoomOnAddDoodlerToPublicRoom'] =
    (socket) => async (_payload, respond) => {
      const doodler = await DoodlerServiceInstance.findDooder(socket.id);
      const { id: roomId, gameId } =
        await RoomServiceInstance.assignDoodlerToPublicRoom(doodler.id);

      // Join the new room
      socket.join(roomId);
      socket.to(roomId).emit(RoomSocketEvents.EMIT_DOODLER_JOIN, { doodler });

      let game: GameInterface | undefined = undefined;
      if (!gameId) {
        const gameInterface = await GameServiceInstance.createGame(roomId);
        await RoomServiceInstance.assignGameToRoom(roomId, gameInterface.id);
        game = gameInterface;
      } else {
        const gameInterface = await GameServiceInstance.findGame(gameId);
        game = gameInterface;
      }

      const isValidGameRoom = await RoomServiceInstance.isValidGameRoom(roomId);
      if (!gameId || !isValidGameRoom) {
        await RoomServiceInstance.changeDrawerTurn(roomId, true);
        await GameServiceInstance.updateStatus(game.id, GameStatus.LOBBY, true);
      } else if (game.status === GameStatus.LOBBY && isValidGameRoom) {
        await RoomServiceInstance.changeDrawerTurn(roomId);
        await GameServiceInstance.updateStatus(
          game.id,
          GameStatus.CHOOSE_WORD,
          true
        );
      }

      respond({ data: { roomId } });
    };

  /**
   * Handle when the client wants to be added to a private room
   */
  public handleRoomOnAddDoodlerToPrivateRoom: RoomControllerInterface['handleRoomOnAddDoodlerToPrivateRoom'] =
    (socket) => async (_payload, _respond) => {};

  /**
   * Handle when the client wants to create a private room
   */
  public handleRoomOnCreatePrivateRoom: RoomControllerInterface['handleRoomOnCreatePrivateRoom'] =
    (socket) => async (_payload, _respond) => {};

  /**
   * Handle when the client wants to get room details
   */
  public handleRoomOnGetRoom: RoomControllerInterface['handleRoomOnGetRoom'] =
    (socket) => async (payload, respond) => {
      const roomId = payload;
      const room = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      const doodlers = await DoodlerServiceInstance.getDoodlers(room.doodlers);
      respond({ data: { room, doodlers } });
    };
}

export default RoomController;
