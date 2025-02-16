import { DoodleServerError } from './error';

export const SuccessResponse = <T>(data: T) => ({ data, error: undefined });

export const ErrorResponse = (error?: DoodleServerError) => ({
  data: undefined,
  error: error ?? new DoodleServerError()
});
