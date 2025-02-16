import { RoomEvents } from '@/constants/events';
import { RoomModel } from '@/models/RoomModel';

import { DoodlerInterface } from './doodler';
import { ClientToServerEventsArgument } from './helper';

export type RoomInterface = RoomModel['json'];

export interface RoomClientToServerEventsArgumentMap {
  [RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM]: ClientToServerEventsArgument<
    undefined,
    { roomId: RoomInterface['id'] }
  >;
  [RoomEvents.ON_ADD_DOODLER_TO_PRIVATE_ROOM]: ClientToServerEventsArgument<
    undefined,
    { roomId: RoomInterface['id'] }
  >;
  [RoomEvents.ON_CREATE_PRIVATE_ROOM]: ClientToServerEventsArgument<
    undefined,
    { roomId: RoomInterface['id'] }
  >;
  [RoomEvents.ON_GET_ROOM]: ClientToServerEventsArgument<
    string,
    { room: RoomInterface; doodlers: DoodlerInterface[] }
  >;
}

export interface RoomServerToClientEvents {
  [RoomEvents.EMIT_DOODLER_JOIN]: (args: { doodler: DoodlerInterface }) => void;
  [RoomEvents.EMIT_DOODLER_LEAVE]: (args: {
    doodlerId: DoodlerInterface['id'];
  }) => void;
}
