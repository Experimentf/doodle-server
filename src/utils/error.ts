export class ErrorFromServer extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorFromServer';
    this.message = message ?? 'Something went wrong!';
  }

  toJSON() {
    return {
      message: this.message
    };
  }
}
