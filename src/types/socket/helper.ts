import { ErrorFromServer } from '@/utils/error';

type EmitResponse<T> = { data?: T | null; error?: ErrorFromServer };

export type ClientToServerEventsArgument<T, K> = {
  payload: T;
  response: EmitResponse<K>;
};
