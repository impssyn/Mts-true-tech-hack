import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Account} from "./models/account.model";
import {Op, Transaction, WhereOptions} from "sequelize";
import {Card} from "../product/models/card.model";
import {User} from "../user/models/user.model";

const NOT_FOUND_ERR = 'Получатель не найден'

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account) private accountRepo: typeof Account
  ) {}

  async createAccount(params: {
    userId: number,
    balance: number
  }, transaction?: Transaction) {
    return this.accountRepo.create({
      userId: params.userId,
      balance: params.balance
    }, {transaction})
  }

  async getAccountById(id: number) {
    const account = await this.accountRepo.findByPk(id)

    if (!account)
      throw new BadRequestException(NOT_FOUND_ERR)
    return account
  }

  async getAccountByCardNumber(cardNumber: string) {
    return this.accountRepo.findOne({
      include: {
        model: Card,
        where: {
          number: cardNumber
        }
      }
    })
  }

  async getAccountByCardNumberOrThrow(cardNumber: string) {
    const account = await this.getAccountByCardNumber(cardNumber)
    if (!account)
      throw new BadRequestException(NOT_FOUND_ERR)
    return account
  }

  async getAccountByPhoneNumber(phoneNumber: string) {
    const availableAccounts = await this.accountRepo.findAll({
      include: {
        model: User,
        where: {
          phoneNumber
        } as WhereOptions<User>
      }
    })

    // todo: пока просто возвращается первый попавшийся счет пользователя
    if (!availableAccounts.length)
      return null
    return availableAccounts[0]
  }

  async getAccountByPhoneNumberOrThrow(phoneNumber: string) {
    const account = await this.getAccountByPhoneNumber(phoneNumber)

    if (!account)
      throw new BadRequestException(NOT_FOUND_ERR)
    return account
  }

  async getFullBalanceUser(userId: number) {
    const accounts = await this.accountRepo.findAll({
      where: {
        userId
      }
    })
    return accounts.reduce((accumulator, account) => account.balance + accumulator, 0,);
  }

  async getFirstUserAccount(userId: number) {
    const accounts = await this.accountRepo.findAll({
      where: {
        userId
      }
    })
    if (accounts.length) {
      return accounts[0]
    }
    return null
  }
}