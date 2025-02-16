/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameEvents, RoomEvents } from '@/constants/events';
import DoodlerServiceInstance from '@/services/DoodlerService';
import GameServiceInstance from '@/services/GameService';
import RoomServiceInstance from '@/services/RoomService';
import { GameStatus } from '@/types/game';
import { GameInterface } from '@/types/socket/game';

import { RoomControllerInterface } from './interface';

class RoomController implements RoomControllerInterface {
  /**
   * Handle when the client wants to be added to a public room
   */
  public handleRoomOnAddDoodlerToPublicRoom: RoomControllerInterface['handleRoomOnAddDoodlerToPublicRoom'] =
    (socket) => async (_payload, respond) => {
      const { doodler } = await DoodlerServiceInstance.findDooder(socket.id);
      const { id: roomId, gameId } =
        await RoomServiceInstance.assignDoodlerToPublicRoom(doodler.id);

      // Join the new room
      socket.join(roomId);

      // Let other users in the room know
      socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_JOIN, { doodler });

      let game: GameInterface | undefined = undefined;
      if (!gameId) {
        const { game: gameInterface } = await GameServiceInstance.createGame();
        await RoomServiceInstance.assignGameToRoom(roomId, gameInterface.id);
        game = gameInterface;
      } else {
        const { game: gameInterface } =
          await GameServiceInstance.findGame(gameId);
        game = gameInterface;
      }

      const isValidGameRoom = await RoomServiceInstance.isValidGameRoom(roomId);
      if (!gameId || !isValidGameRoom) {
        await GameServiceInstance.moveToLobby(game.id);
        socket.to(roomId).emit(GameEvents.EMIT_GAME_LOBBY);
      } else if (game.status === GameStatus.LOBBY && isValidGameRoom) {
        await GameServiceInstance.moveToGame(game.id);
        const drawerId = await RoomServiceInstance.changeDrawerTurn(roomId);
        socket.to(roomId).emit(GameEvents.EMIT_GAME_START, { drawerId });
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
      const { room } = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      const doodlers = await DoodlerServiceInstance.getDoodlers(room.doodlers);
      respond({ data: { room, doodlers } });
    };
}

export default RoomController;
