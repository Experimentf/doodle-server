import DoodlerServiceInstance from '@/services/doodler';
import { GameService } from '@/services/game';
import RoomServiceInstance from '@/services/room';
import { SocketType } from '@/types/socket';
import { GameEvents, RoomEvents } from '@/types/socket/events';

import { SocketControllerInterface } from './types';

class SocketController implements SocketControllerInterface {
  private socket?: SocketType;

  /**
   * Set the socket variable
   * @param socket
   */
  public setSocket(socket: SocketType) {
    this.socket = socket;
  }

  /**
   * Handle the socket disconnecting event
   * @param socket
   */
  public handleSocketOnDisconnecting() {
    if (!this.socket) return;
    const socket = this.socket;
    socket.rooms.forEach((roomId) => {
      const doodlerId = socket.id;
      RoomServiceInstance.removeDoodlerFromRoom(roomId, doodlerId); // TODO: Handle Error
      socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_LEAVE, {
        id: doodlerId,
        name: socket.data.name
      });
      const { data: isValidGame } = GameService.isValidGame(roomId); // TODO: Handle Error
      if (!isValidGame) {
        socket.to(roomId).emit(GameEvents.EMIT_GAME_LOBBY);
      }
      DoodlerServiceInstance.removeDoodler(socket.id); // TODO: Handle Error
    });
  }

  /**
   * Handle the socket disconnect event
   * @param socket
   */
  public handleSocketOnDisconnect() {
    if (!this.socket) return;
    const socket = this.socket;
    console.log('User disconnected :', socket.id);
  }
}

export default SocketController;
