import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/useCases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'

// factories
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@app.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  // email validator mock
  // stub type
  // garante que o stub está respeitando o protocolo
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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
  test('Should return 400 if no password confirmation is provided', () => {
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
  test('Should return 400 if no password confirmation fails', () => {
    // sut =  system under test
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'any@app.com',
        password: '12345678',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'any_email@email.com',
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('Should return 500 ifEmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    // pegamos o factory original e alteramos o seu comportamento,
    // retornando um error
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'any_email@app.com',
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    const httpResponse: any = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest: any = {
      body: {
        name: 'Any name',
        email: 'any_email@email.com',
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Any name',
      email: 'any_email@email.com',
      password: '12345678'
    })
  })
})
