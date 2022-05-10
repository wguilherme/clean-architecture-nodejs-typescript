export class MissingParamError extends Error {
  constructor (paramName: string) {
    // use super to call the parent class constructor
    super(`Missing param: ${paramName}`)
    // set the name of the error
    this.name = 'MissingParamError'
  }
}
