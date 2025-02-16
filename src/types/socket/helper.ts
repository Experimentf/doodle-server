import { DoodleServerError } from '@/utils/error';

type EmitResponse<T> = { data?: T | null; error?: DoodleServerError };

export type ClientToServerEventsArgument<T, K> = {
  payload: T;
  response: EmitResponse<K>;
};
