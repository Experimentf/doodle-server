export class DoodleServerError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DoodleServerError';
    this.message = message ?? 'Something went wrong!';
  }

  toJSON() {
    return {
      message: this.message
    };
  }
}
