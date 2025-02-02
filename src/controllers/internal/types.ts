import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/events';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface DoodlerControllerInterface {
  handleDoodlerOnGet: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[DoodlerEvents.ON_GET_DOODLER]>
  ) => void;
  handleDoodlerOnSet: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER]>
  ) => void;
}

export interface GameControllerInterface {
  handleGameOnGetGame: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[GameEvents.ON_GET_GAME]>
  ) => void;
}

export interface RoomControllerInterface {
  handleRoomOnAddDoodlerToPublicRoom: (
    socket: SocketType,
    ...args: Parameters<
      ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM]
    >
  ) => void;
}

export interface SocketControllerInterface {
  handleSocketOnDisconnecting: (socket: SocketType) => void;
  handleSocketOnDisconnect: (socket: SocketType) => void;
}
