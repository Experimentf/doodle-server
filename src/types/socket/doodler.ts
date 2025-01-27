import { DoodlerEvents } from '@/constants/events';
import { DoodlerModel } from '@/models/Doodler';

import { ClientToServerEventsArgument } from './helper';

export type DoodlerInterface = DoodlerModel['json'];

export interface DoodlerClientToServerEventsArgumentMap {
  [DoodlerEvents.ON_GET_DOODLER]: ClientToServerEventsArgument<
    undefined,
    Pick<DoodlerInterface, 'name'>
  >;
  [DoodlerEvents.ON_SET_DOODLER]: ClientToServerEventsArgument<
    Pick<DoodlerInterface, 'name' | 'avatar'>,
    DoodlerInterface
  >;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DoodlerServerToClientEvents {}
