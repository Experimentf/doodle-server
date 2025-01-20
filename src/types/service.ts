import { ErrorFromServer } from '@/utils/error';

export type ServiceResponse<T> = {
  data?: T;
  error?: ErrorFromServer;
};
