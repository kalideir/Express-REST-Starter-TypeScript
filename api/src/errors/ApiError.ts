class ApiError extends Error {
  public status: number;
  public message: string;
  public stack: string;
  public errors: unknown;

  constructor({ status, message, stack, errors }) {
    super(message);
    this.status = status;
    this.message = message;
    this.stack = stack;
    this.errors = errors;
  }
}

export default ApiError;
