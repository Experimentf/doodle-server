import { GameSocketEvents, RoomSocketEvents } from '@/constants/events/socket';
import DoodlerServiceInstance from '@/services/doodler/DoodlerService';
import RoomServiceInstance from '@/services/room/RoomService';

import { SocketControllerInterface } from './interface';

class SocketController implements SocketControllerInterface {
  /**
   * Handle the socket disconnecting event
   */
  public handleSocketOnDisconnecting: SocketControllerInterface['handleSocketOnDisconnecting'] =
    (socket) => async () => {
      const roomIds: string[] = [];
      socket.rooms.forEach((id) => id != socket.id && roomIds.push(id));
      Promise.all(
        roomIds.map(async (roomId) => {
          const doodlerId = socket.id;
          await RoomServiceInstance.removeDoodlerFromRoom(roomId, doodlerId);
          socket.to(roomId).emit(RoomSocketEvents.EMIT_DOODLER_LEAVE, {
            doodlerId
          });
          const isValidGameRoom =
            await RoomServiceInstance.isValidGameRoom(roomId);
          if (!isValidGameRoom) {
            socket.to(roomId).emit(GameSocketEvents.EMIT_GAME_LOBBY);
          }
        })
      ).finally(async () => {
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
