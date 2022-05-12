export class ServerError extends Error {
  constructor () {
    // use super to call the parent class constructor
    super('Internal server error')
    // set the name of the error
    this.name = 'ServerError'
  }
}
