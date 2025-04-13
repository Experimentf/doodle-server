import { RoomSocketEvents } from '@/constants/events/socket';
import { RoomModel } from '@/models/RoomModel';

import { DoodlerInterface } from './doodler';
import { ClientToServerEventsArgument } from './helper';

export type RoomInterface = RoomModel['json'];

export interface RoomClientToServerEventsArgumentMap {
  [RoomSocketEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM]: ClientToServerEventsArgument<
    undefined,
    { roomId: RoomInterface['id'] }
  >;
  [RoomSocketEvents.ON_ADD_DOODLER_TO_PRIVATE_ROOM]: ClientToServerEventsArgument<
    { roomId: string },
    { room: RoomInterface }
  >;
  [RoomSocketEvents.ON_CREATE_PRIVATE_ROOM]: ClientToServerEventsArgument<
    undefined,
    { roomId: RoomInterface['id'] }
  >;
  [RoomSocketEvents.ON_GET_ROOM]: ClientToServerEventsArgument<
    string,
    { room: RoomInterface; doodlers: DoodlerInterface[] }
  >;
}

export interface RoomServerToClientEvents {
  [RoomSocketEvents.EMIT_DOODLER_JOIN]: (args: {
    doodler: DoodlerInterface;
  }) => void;
  [RoomSocketEvents.EMIT_DOODLER_LEAVE]: (args: {
    doodlerId: DoodlerInterface['id'];
  }) => void;
}
