import { GameSocketEvents, RoomSocketEvents } from '@/constants/events/socket';
import DoodlerServiceInstance from '@/services/doodler/DoodlerService';
import GameServiceInstance from '@/services/game/GameService';
import RoomServiceInstance from '@/services/room/RoomService';
import { GameStatus } from '@/types/game';

import { SocketControllerInterface } from './interface';

class SocketController implements SocketControllerInterface {
  /**
   * Handle the socket disconnecting event
   */
  public handleSocketOnDisconnecting: SocketControllerInterface['handleSocketOnDisconnecting'] =
    (socket) => async () => {
      const roomIds: string[] = [];
      socket.rooms.forEach((id) => id !== socket.id && roomIds.push(id));
      Promise.all(
        roomIds.map(async (roomId) => {
          const doodlerId = socket.id;

          // Remove doodler from their room
          const room = await RoomServiceInstance.removeDoodlerFromRoom(
            roomId,
            doodlerId
          );
          socket.to(roomId).emit(RoomSocketEvents.EMIT_DOODLER_LEAVE, {
            doodlerId
          });

          // Check for game validity in the room after removing the doodler
          const isValidGameRoom =
            await RoomServiceInstance.isValidGameRoom(roomId);

          // Update the game status if room exists and the game is not valid anymore
          if (!isValidGameRoom && room) {
            const game = !room.gameId
              ? undefined
              : await GameServiceInstance.updateStatus(
                  room.gameId,
                  GameStatus.RESULT
                );
            const updatedRoom = await RoomServiceInstance.changeDrawerTurn(
              roomId,
              true
            );
            socket.to(roomId).emit(GameSocketEvents.EMIT_GAME_STATUS_UPDATED, {
              room: updatedRoom,
              game
            });
          }
        })
      ).finally(async () => {
        // Remove the doodler from the doodler service
        DoodlerServiceInstance.removeDoodler(socket.id);
      });
    };

  /**
   * Handle the socket disconnect event
   */
  public handleSocketOnDisconnect: SocketControllerInterface['handleSocketOnDisconnect'] =
    (socket) => async () => {
      console.log('User disconnected :', socket.id);
    };
}

export default SocketController;
