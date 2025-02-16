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
    (socket) => async (_payload, respond) => {
      const doodlerData = await DoodlerServiceInstance.findDooder(socket.id);
      const { doodler } = doodlerData;
      const { roomId } = await RoomServiceInstance.assignDoodlerToPublicRoom(
        doodler.id
      );

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
    (socket) => async (payload, respond) => {
      const roomId = payload;
      const { room } = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      const getDoodlersData = await DoodlerServiceInstance.getDoodlers(
        room.doodlers
      );
      const doodlers = getDoodlersData.map((d) => d.json);
      respond({ data: { room: room.json, doodlers } });
    };
}

export default RoomController;
