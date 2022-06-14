import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account: any = await accountCollection.insertOne(accountData)

    const getAccount: any = await this.show(account.insertedId)
    const { _id, ...rest } = getAccount

    const accountResponse = {
      ...rest,
      id: _id
    }

    return accountResponse
  }

  async show (id: string): Promise<any> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ _id: id })
    console.log('pass here', id, account)
    return account
  }
}
