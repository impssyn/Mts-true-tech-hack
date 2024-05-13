import {BadRequestException, Injectable} from "@nestjs/common";
import {Operation, OperationType} from "./models/operation.model";
import {Transaction} from "sequelize";
import {InjectModel} from "@nestjs/sequelize";
import {Transfer} from "../transaction/models/transfer.model";
import {getHiddenName} from "../user/user.helpers";
import {Payment} from "../transaction/models/payment.model";
import {ITransferOutOperationDetails} from "./interfaces/transfer-out-operation-details.interface";
import {IPaymentOperationDetails} from "./interfaces/payment-operation-details.interface";

@Injectable()
export class OperationService {
  constructor(
    @InjectModel(Operation) private operationRepo: typeof Operation
  ) {}

  async createTransferInOperation(params: {
    userId: number,
    transfer: Transfer,
  }, transaction?: Transaction) {
    const {userId, transfer} = params
    const details = {
      transferId: transfer.id,
      amount: transfer.amount,
      sender: getHiddenName(transfer.billingAccount.user),
      senderCardNumber: transfer.billingAccount.card.number
    }

    return this.operationRepo.create({
      userId,
      details,
      operationType: OperationType.TRANSFER_IN,
    }, {transaction})
  }

  async createTransferOutOperation(params: {
    userId: number,
    transfer: Transfer,
  }, transaction?: Transaction) {
    const {userId, transfer} = params
    const details: ITransferOutOperationDetails = {
      transferId: transfer.id,
      amount: transfer.amount,
      recipient: getHiddenName(transfer.destAccount.user),
      recipientCardNumber: transfer.destAccount.card.number,
      destAccountId: transfer.destAccountId,
      billingAccountId: transfer.billingAccountId
    }

    return this.operationRepo.create({
      userId,
      details,
      operationType: OperationType.TRANSFER_OUT,
    }, {transaction})
  }

  async createPaymentOperation(params: {
    userId: number,
    payment: Payment,
  }, transaction?: Transaction) {
    const {userId, payment} = params
    const details = {
      paymentId: payment.id,
      amount: payment.amount,
      paymentType: payment.paymentType,
      accountId: payment.accountId
    } as IPaymentOperationDetails

    return this.operationRepo.create({
      userId,
      details,
      operationType: OperationType.PAYMENT,
    }, {transaction})
  }

  async getUserOperations(userId: number) {
    return this.operationRepo.findAll({
      where: {
        userId
      },
      order: [['createdAt', 'desc']]
    })
  }

  async getById(id: number) {
    const op = await this.operationRepo.findByPk(id)
    if (!op) throw new BadRequestException('Операция не найдена')
    return op
  }
}