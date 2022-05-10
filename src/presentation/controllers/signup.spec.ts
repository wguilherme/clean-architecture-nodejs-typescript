import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // sut =  system under test
    const sut = new SignUpController()
    const httpRequest: any = {
      body: {
        // name: 'NO_NAME',
        email: 'app@app.com',
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    // sut =  system under test
    const sut = new SignUpController()
    const httpRequest: any = {
      body: {
        name: 'Any name',
        // email: 'NO_EMAIL',
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
