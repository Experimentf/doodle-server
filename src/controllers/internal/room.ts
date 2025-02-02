import { RoomEvents } from '@/constants/events';
import DoodlerServiceInstance from '@/services/doodler';
import RoomServiceInstance from '@/services/room';

import { RoomControllerInterface } from './types';

class RoomController implements RoomControllerInterface {
  /**
   * Handle when the client wants to play a public game
   * @param respond - Respond to the client
   */
  public handleRoomOnAddDoodlerToPublicRoom: RoomControllerInterface['handleRoomOnAddDoodlerToPublicRoom'] =
    (socket, _payload, respond) => {
      const { data: doodlerData, error: findDoodlerError } =
        DoodlerServiceInstance.findDooder(socket.id);
      if (findDoodlerError || doodlerData === undefined) {
        respond({ data: null, error: findDoodlerError });
        return;
      }
      const { doodler } = doodlerData;
      const { data: roomAssignmentData, error: roomAssignmentError } =
        RoomServiceInstance.assignDoodlerToPublicRoom(doodler);
      if (roomAssignmentError || roomAssignmentData === undefined) {
        respond({ data: null, error: roomAssignmentError });
        return;
      }
      const { roomId } = roomAssignmentData;

      // Join the new room
      socket.join(roomId);

      // Let other users in the room know
      socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_JOIN, { doodler });

      respond({ data: { roomId } });
    };
}

export default RoomController;
