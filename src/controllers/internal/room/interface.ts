import { RoomEvents } from '@/constants/events';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface RoomControllerInterface {
  handleRoomOnAddDoodlerToPublicRoom: (
    socket: SocketType,
    ...args: Parameters<
      ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM]
    >
  ) => void;
}
