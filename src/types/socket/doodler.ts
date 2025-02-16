import { DoodlerSocketEvents } from '@/constants/events/socket';
import { DoodlerModel } from '@/models/DoodlerModel';

import { ClientToServerEventsArgument } from './helper';

export type DoodlerInterface = DoodlerModel['json'];

export interface DoodlerClientToServerEventsArgumentMap {
  [DoodlerSocketEvents.ON_GET_DOODLER]: ClientToServerEventsArgument<
    undefined,
    DoodlerInterface
  >;
  [DoodlerSocketEvents.ON_SET_DOODLER]: ClientToServerEventsArgument<
    Pick<DoodlerInterface, 'name' | 'avatar'>,
    Pick<DoodlerInterface, 'id'>
  >;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DoodlerServerToClientEvents {}
