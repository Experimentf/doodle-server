import { DoodleServerError } from '@/utils/error';

export type ServiceResponse<T> = {
  data?: T;
  error?: DoodleServerError;
};
