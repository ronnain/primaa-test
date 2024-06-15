export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email already exists, please use another one.');
  }
}
