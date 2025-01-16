export class ErrorFromServer extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErrorFromServer';
    this.message = message;
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        stacktrace: this.stack
      }
    };
  }
}
