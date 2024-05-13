import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Card, CardType} from "./models/card.model";
import {CreateCardDto} from "./dto/create-card.dto";
import {Transaction} from "sequelize";
import {AccountService} from "../account/account.service";
import {Account} from "../account/models/account.model";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Card) private cardRepo: typeof Card,
    private accountService: AccountService
  ) {}

  async createCard(dto: CreateCardDto, transaction?: Transaction) {
    const account = await this.accountService.createAccount({
      userId: dto.userId,
      balance: dto.balance
    }, transaction)

    return this.cardRepo.create({
      number: dto.number,
      cv: dto.cv,
      cardType: dto.cardType,
      expirationYear: dto.expirationYear,
      expirationMonth: dto.expirationMonth,
      accountId: account.id
    }, {transaction})
  }

  async getUserCards(userId: number) {
    return this.cardRepo.findAll({
      include: [{
        model: Account,
        where: {
          userId
        }
      }]
    })
  }

  async getUserDebitCard(userId: number) {
    return this.cardRepo.findOne({
      include: [{
        model: Account,
        where: {
          userId
        }
      }],
      where: {
        cardType: CardType.DEBIT
      }
    })
  }

  async getUserCreditCard(userId: number) {
    return this.cardRepo.findOne({
      include: [{
        model: Account,
        where: {
          userId
        }
      }],
      where: {
        cardType: CardType.CREDIT
      }
    })
  }
}