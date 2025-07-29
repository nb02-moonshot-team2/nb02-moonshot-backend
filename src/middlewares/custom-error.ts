export class CustomError extends Error {
  status: number;
  validationErrors?: Record<string, unknown> | unknown[];

  constructor(
    status = 500,
    message: string,
    validationErrors?: Record<string, unknown> | unknown[]
  ) {
    super(message);
    this.status = status;
    this.validationErrors = validationErrors;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
