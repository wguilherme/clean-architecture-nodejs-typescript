import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

// factory
const makeSut = (): SutTypes => {
  // email validator mock
  // stub type
  // garante que o stub está respeitando o protocolo
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return false
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // sut =  system under test
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
  test('Should return 400 if no password is provided', () => {
    // sut =  system under test
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'any@app.com',
        // password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no password is provided', () => {
    // sut =  system under test
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'any@app.com',
        password: '12345678'
        // passwordConfirmation: '12345678'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('Should return 400 if an invalid is provided', () => {
    // sut =  system under test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'INVALID_EMAIL',
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
