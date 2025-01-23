import DoodlerServiceInstance from '@/services/doodler';
import RoomServiceInstance from '@/services/room';
import { ClientToServerEvents, SocketType } from '@/types/socket';
import { RoomEvents } from '@/types/socket/events';

import { RoomControllerInterface } from './types';

class RoomController implements RoomControllerInterface {
  private socket?: SocketType;

  /**
   * Set the socket variable
   * @param socket
   */
  public setSocket(socket: SocketType) {
    this.socket = socket;
  }

  /**
   * Handle when the client wants to play a public game
   * @param respond - Respond to the client
   */
  public handleRoomOnAddDoodlerToPublicRoom: ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM] =
    (respond) => {
      if (!this.socket) return;
      const socket = this.socket;
      const { data: doodlerData, error: findDoodlerError } =
        DoodlerServiceInstance.findDooder(socket.id);
      if (findDoodlerError || doodlerData === undefined) {
        respond(null, findDoodlerError);
        return;
      }
      const { doodler } = doodlerData;
      const { data: roomAssignmentData, error: roomAssignmentError } =
        RoomServiceInstance.assignDoodlerToPublicRoom(doodler);
      if (roomAssignmentError || roomAssignmentData === undefined) {
        respond(null, roomAssignmentError);
        return;
      }
      const { roomId } = roomAssignmentData;

      // Join the new room
      socket.join(roomId);

      // Let other users in the room know
      socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_JOIN, doodler);

      respond({ roomId });
    };
}

export default RoomController;
