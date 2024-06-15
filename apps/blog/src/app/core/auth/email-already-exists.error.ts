export class EmailAlreadyExistsError extends Error {
  public readonly mailElreadyExists = true;

  constructor() {
    super('Email already exists, please use another one.');
    this.name = this.constructor.name; // Donne un nom à l'erreur
  }
}
