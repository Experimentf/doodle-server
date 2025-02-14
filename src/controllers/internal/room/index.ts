/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoomEvents } from '@/constants/events';
import DoodlerServiceInstance from '@/services/doodler';
import RoomServiceInstance from '@/services/room';

import { RoomControllerInterface } from './interface';

class RoomController implements RoomControllerInterface {
  /**
   * Handle when the client wants to be added to a public room
   */
  public handleRoomOnAddDoodlerToPublicRoom: RoomControllerInterface['handleRoomOnAddDoodlerToPublicRoom'] =
    (socket) => (_payload, respond) => {
      const { data: doodlerData, error: findDoodlerError } =
        DoodlerServiceInstance.findDooder(socket.id);
      if (findDoodlerError || doodlerData === undefined) {
        respond({ data: null, error: findDoodlerError });
        return;
      }
      const { doodler } = doodlerData;
      const { data: roomAssignmentData, error: roomAssignmentError } =
        RoomServiceInstance.assignDoodlerToPublicRoom(doodler.id);
      if (roomAssignmentError || roomAssignmentData === undefined) {
        respond({ data: null, error: roomAssignmentError });
        return;
      }
      const { roomId } = roomAssignmentData;

      // Join the new room
      socket.join(roomId);

      // Let other users in the room know
      socket
        .to(roomId)
        .emit(RoomEvents.EMIT_DOODLER_JOIN, { doodler: doodler.json });

      respond({ data: { roomId } });
    };

  /**
   * Handle when the client wants to be added to a private room
   */
  public handleRoomOnAddDoodlerToPrivateRoom: RoomControllerInterface['handleRoomOnAddDoodlerToPrivateRoom'] =
    (socket) => (_payload, _respond) => {};

  /**
   * Handle when the client wants to create a private room
   */
  public handleRoomOnCreatePrivateRoom: RoomControllerInterface['handleRoomOnCreatePrivateRoom'] =
    (socket) => (_payload, _respond) => {};

  /**
   * Handle when the client wants to get room details
   */
  public handleRoomOnGetRoom: RoomControllerInterface['handleRoomOnGetRoom'] =
    (socket) => (payload, respond) => {
      const roomId = payload;
      const { data: findRoomData, error: findRoomError } =
        RoomServiceInstance.findRoomWithDoodler(roomId, socket.id);
      if (findRoomError || findRoomData === undefined) {
        respond({ error: findRoomError });
        return;
      }
      const room = findRoomData.room.json;
      const { data: getDoodlersData, error: getDoodlersError } =
        DoodlerServiceInstance.getDoodlers(room.doodlers);
      if (getDoodlersError || getDoodlersData === undefined) {
        respond({ error: getDoodlersError });
        return;
      }
      const doodlers = getDoodlersData.map((d) => d.json);
      respond({ data: { room, doodlers } });
    };
}

export default RoomController;
