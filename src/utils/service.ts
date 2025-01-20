import { ErrorFromServer } from './error';

export const SuccessResponse = <T>(data: T) => ({ data, error: undefined });

export const ErrorResponse = (error?: ErrorFromServer) => ({
  data: undefined,
  error: error ?? new ErrorFromServer()
});
