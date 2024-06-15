export class AccountNotFoundError extends Error {
  public readonly mailElreadyExists = true;

  constructor() {
    super('Email or password is not correct.');
  }
}
