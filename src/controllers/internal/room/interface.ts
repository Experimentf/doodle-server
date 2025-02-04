import { RoomEvents } from '@/constants/events';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface RoomControllerInterface {
  handleRoomOnAddDoodlerToPublicRoom: (
    socket: SocketType,
    ...args: Parameters<
      ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM]
    >
  ) => void;
  handleRoomOnAddDoodlerToPrivateRoom: (
    socket: SocketType,
    ...args: Parameters<
      ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PRIVATE_ROOM]
    >
  ) => void;
  handleRoomOnCreatePrivateRoom: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[RoomEvents.ON_CREATE_PRIVATE_ROOM]>
  ) => void;
  handleRoomOnGetRoom: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[RoomEvents.ON_GET_ROOM]>
  ) => void;
}
