import { GameEvents, RoomEvents } from '@/constants/events';
import DoodlerServiceInstance from '@/services/doodler';
import { GameService } from '@/services/game';
import RoomServiceInstance from '@/services/room';

import { SocketControllerInterface } from './types';

class SocketController implements SocketControllerInterface {
  /**
   * Handle the socket disconnecting event
   */
  public handleSocketOnDisconnecting: SocketControllerInterface['handleSocketOnDisconnecting'] =
    (socket) => {
      socket.rooms.forEach((roomId) => {
        const doodlerId = socket.id;
        RoomServiceInstance.removeDoodlerFromRoom(roomId, doodlerId); // TODO: Handle Error
        socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_LEAVE, {
          doodler: {
            id: doodlerId,
            name: socket.data.name,
            avatar: socket.data.avatar
          }
        });
        const { data: isValidGame } = GameService.isValidGame(roomId); // TODO: Handle Error
        if (!isValidGame) {
          socket.to(roomId).emit(GameEvents.EMIT_GAME_LOBBY);
        }
        DoodlerServiceInstance.removeDoodler(socket.id); // TODO: Handle Error
      });
    };

  /**
   * Handle the socket disconnect event
   */
  public handleSocketOnDisconnect: SocketControllerInterface['handleSocketOnDisconnect'] =
    (socket) => {
      console.log('User disconnected :', socket.id);
    };
}

export default SocketController;
