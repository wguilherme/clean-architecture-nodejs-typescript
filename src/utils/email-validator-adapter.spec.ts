import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(true)
  })
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmaiLSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('invalid_email@email.com')
    expect(isEmaiLSpy).toBeCalledWith('invalid_email@email.com')
  })
})
