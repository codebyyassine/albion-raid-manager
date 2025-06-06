export enum ErrorCodes {
  SLOT_TAKEN,
  RAID_NOT_OPEN,
  USER_NOT_SIGNED,
}

export class ClientError extends Error {
  public readonly errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, message: string) {
    super(message);
    this.name = "ClientError";
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
