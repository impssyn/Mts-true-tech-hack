import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Transfer, transferDefaultScope} from "./models/transfer.model";
import {Payment, paymentDefaultScope} from "./models/payment.model";
import {AtPayloadDto} from "../auth/dto/at-payload.dto";
import {TransferDto} from "./dto/transfer.dto";
import {Op, Transaction, WhereOptions} from "sequelize";
import {AccountService} from "../account/account.service";
import {PayDto} from "./dto/pay.dto";
import {OperationService} from "../operation/operation.service";
import {User} from "../user/models/user.model";
import {Card} from "../product/models/card.model";
import {TransferCheckDto} from "./dto/transfer-check.dto";
import {Account} from "../account/models/account.model";

const INCORRECT_ADDR_ERR = 'Некорректно указан адрес перевода'
const WRONG_ACCOUNT_ERR = 'Братан ты чего-то перепутал'
const WRONG_AMOUNT_LIMIT_ERR = 'Сумма не должна превышать текущий баланс'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transfer) private transferRepo: typeof Transfer,
    @InjectModel(Payment) private paymentRepo: typeof Payment,
    private accountService: AccountService,
    private operationService: OperationService
  ) {}

  async transferCheck(user: AtPayloadDto, dto: TransferCheckDto) {
    if (!dto.cardNumber && !dto.phoneNumber || dto.cardNumber && dto.phoneNumber)
      throw new BadRequestException(INCORRECT_ADDR_ERR)
    const billingAccount = await this.accountService.getAccountById(dto.accountId)
    const destAccount = dto.phoneNumber
      ? await this.accountService.getAccountByPhoneNumberOrThrow(dto.phoneNumber)
      : await this.accountService.getAccountByCardNumberOrThrow(dto.cardNumber)

    if (billingAccount.userId !== user.id) {
      throw new BadRequestException(WRONG_ACCOUNT_ERR)
    }

    if (dto.amount > billingAccount.balance) {
      throw new BadRequestException(WRONG_AMOUNT_LIMIT_ERR)
    }

    return destAccount
  }

  async transfer(user: AtPayloadDto, dto: TransferDto, transaction?: Transaction) {
    const billingAccount = await this.accountService.getAccountById(dto.billingAccountId)
    const destAccount = await this.accountService.getAccountById(dto.destAccountId)

    if (billingAccount.userId !== user.id) {
      throw new BadRequestException(WRONG_ACCOUNT_ERR)
    }

    if (dto.amount > billingAccount.balance) {
      throw new BadRequestException(WRONG_AMOUNT_LIMIT_ERR)
    }

    const {id: trId} = await this.transferRepo.create({
      billingAccountId: billingAccount.id,
      destAccountId: destAccount.id,
      amount: dto.amount
    }, {
      transaction,
    })

    const createdTransfer = await this.transferRepo.findByPk(trId, {
      transaction
    })
    console.log(createdTransfer)
    await billingAccount.update({
      balance: billingAccount.balance - dto.amount
    }, {where: undefined, transaction})

    await destAccount.update({
      balance: billingAccount.balance + dto.amount
    }, {where: undefined, transaction})

    await this.operationService.createTransferInOperation({
      userId: destAccount.userId,
      transfer: createdTransfer
    }, transaction)

    await this.operationService.createTransferOutOperation({
      userId: billingAccount.userId,
      transfer: createdTransfer
    }, transaction)
  }

  async pay(user: AtPayloadDto, dto: PayDto, transaction?: Transaction){
    const billingAccount = await this.accountService.getAccountById(dto.accountId)
    if (billingAccount.userId !== user.id) {
      throw new BadRequestException(WRONG_ACCOUNT_ERR)
    }

    if (dto.amount > billingAccount.balance) {
      throw new BadRequestException(WRONG_AMOUNT_LIMIT_ERR)
    }

    const createdPayment = await this.paymentRepo.create({
      accountId: billingAccount.id,
      amount: dto.amount,
      paymentType: dto.paymentType,
      data: dto.data
    }, {transaction, ...paymentDefaultScope})

    await billingAccount.update({
      balance: billingAccount.balance - dto.amount
    }, {where: undefined, transaction})

    await this.operationService.createPaymentOperation({
      userId: user.id,
      payment: createdPayment
    }, transaction)
  }

  async getUserBilateralTransfers(userId: number) {
    return this.transferRepo.findAll({
      where: {
        [Op.or]: [
          {'$billingAccount.userId$': userId},
          {'$destAccount.userId$': userId},
        ]
      } as WhereOptions<Transfer>
    })
  }

  async getUserOutTransfers(userId: number) {
    return this.transferRepo.findAll({
      where: {
        '$billingAccount.userId$': userId
      } as WhereOptions<Transfer>
    })
  }

  async getUserPayments(userId: number) {
    return this.paymentRepo.findAll({
      include: {
        model: Account,
        where: {
          userId
        }
      }
    })
  }

  async userSpentInMonth(userId: number) {
    const transfers = await this.getUserOutTransfers(userId)
    const payments = await this.getUserPayments(userId)

    const transfersSum = transfers.reduce((acc, transfer) => acc + transfer.amount, 0)
    const paymentsSum = payments.reduce((acc, payment) => acc + payment.amount, 0)
    return transfersSum + paymentsSum
  }
}