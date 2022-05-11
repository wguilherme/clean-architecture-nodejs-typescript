export class InvalidParamError extends Error {
  constructor (paramName: string) {
    // use super to call the parent class constructor
    super(`Invalid param: ${paramName}`)
    // set the name of the error
    this.name = 'InvalidParamError'
  }
}
