import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Command} from "./models/command.model";
import {AtPayloadDto} from "../auth/dto/at-payload.dto";
import {CreateCommandDto} from "./dto/create-command.dto";
import {Transaction} from "sequelize";
import {OperationService} from "../operation/operation.service";
import {RecognizeCommandDto} from "./dto/recognize-command.dto";
import {searchCommandByRawText} from "./command.helpers";
import {AiRecognizedCommandStatus, IAiRecognizedCommand} from "./interfaces/ai-recognized-command.interface";
import {CommandType} from "./command-type.enum";
import {CommandTransferAddressType, ITransferCommandParams} from "./interfaces/transfer-command-params.interface";
import {TransferRecognizedCommandParamsDto} from "./dto/transfer-recognized-command-params.dto";
import {AccountService} from "../account/account.service";
import {getHiddenName} from "../user/user.helpers";
import {RecognizedCommandDto} from "./dto/recognized-command.dto";
import {OperationType} from "../operation/models/operation.model";
import {PaymentRecognizedCommandParamsDto} from "./dto/payment-recognized-command-params.dto";
import {CommandBalanceTargetType, IBalanceCommandParams} from "./interfaces/balance-command-params.interface";
import {BalanceRecognizedCommandParamsDto} from "./dto/balance-recognized-command-params.dto";
import {AiRecognitionService} from "./ai-recognition.service";
import {convert as convertNumberToWordsRu} from 'number-to-words-ru'
import {ProductService} from "../product/product.service";


@Injectable()
export class CommandService {
  constructor(
    @InjectModel(Command) private commandRepo: typeof Command,
    private operationService: OperationService,
    private aiRecognitionService: AiRecognitionService,
    private accountService: AccountService,
    private productService: ProductService
  ) {
  }

  async createCommand(user: AtPayloadDto, dto: CreateCommandDto, transaction?: Transaction) {
    const operation = await this.operationService.getById(dto.operationId)
    if (operation.userId !== user.id)
      throw new BadRequestException('Операция не принадлежит пользователю')

    return this.commandRepo.create({
      userId: user.id,
      operationId: operation.id,
      text: dto.text
    }, {transaction})
  }

  async getUserCommands(userId: number) {
    return this.commandRepo.findAll({
      where: {
        userId
      },
      order: [['createdAt', 'desc']]
    })
  }

  async recognizeCommand(user: AtPayloadDto, dto: RecognizeCommandDto): Promise<RecognizedCommandDto> {
    const userCommands = await this.getUserCommands(user.id)

    const foundCommand = searchCommandByRawText(userCommands, dto.text)
    if (foundCommand) return this.serializeCommand(foundCommand)

    const aiRecognizedCommand = await this.aiRecognitionService.recognizeCommand(dto.text)
    return this.serializeAICommand(user, aiRecognizedCommand)
  }

  async serializeAICommand(user: AtPayloadDto, command: IAiRecognizedCommand): Promise<RecognizedCommandDto> {
    if (command.status === AiRecognizedCommandStatus.OK) {
      if (command.type === CommandType.TRANSFER) {
        const {address, addressType, amount} = command.params as ITransferCommandParams

        if (addressType === CommandTransferAddressType.PHONE_NUMBER) {
          const account = await this.accountService.getAccountByPhoneNumber(address)
          if (!account) {
            return {
              error: true,
              commandType: command.type,
              text: "Я не смог найти клиента с таким номером телефона"
            }
          }

          if (account.userId === user.id) {
            return {
              error: true,
              commandType: command.type,
              text: "Указанный номер телефона является вашим, я не могу перевести деньги вам же"
            }
          }

          return {
            error: false,
            commandType: command.type,
            text: "Открываю страницу для совершения операции перевода",
            params: {
              amount,
              recipient: getHiddenName(account.user),
              billingAccountId: (await this.accountService.getFirstUserAccount(user.id))?.id,
              destAccountId: account.id
            } as TransferRecognizedCommandParamsDto
          }
        }
        if (addressType === CommandTransferAddressType.CARD_NUMBER) {
          const account = await this.accountService.getAccountByCardNumber(address)
          if (!account) {
            return {
              error: true,
              commandType: command.type,
              text: `Получатель с таким номером карты не найден`
            }
          }

          if (account.userId === user.id) {
            return {
              error: true,
              commandType: command.type,
              text: "Данная карта принадлежит вам, я не могу перевести деньги вам же"
            }
          }

          return {
            error: false,
            commandType: command.type,
            text: "Открываю страницу для совершения операции перевода",
            params: {
              amount,
              recipient: getHiddenName(account.user),
              billingAccountId: (await this.accountService.getFirstUserAccount(user.id))?.id,
              destAccountId: account.id
            } as TransferRecognizedCommandParamsDto
          }
        }

        return {
          error: true,
          commandType: command.type,
          text: "Произошла непредвиденная ошибка, скажите еще раз"
        }
      } else if (command.type === CommandType.BALANCE) {
        const {target, targetType} = command.params as IBalanceCommandParams
        if (targetType === CommandBalanceTargetType.FULL) {
          const balance = await this.accountService.getFullBalanceUser(user.id)
          return {
            error: false,
            commandType: command.type,
            params: {
              balance,
              targetType: CommandBalanceTargetType.FULL
            } as BalanceRecognizedCommandParamsDto,
            text: `Ваш общий баланс составляет ${convertNumberToWordsRu((balance / 100).toString())}`
          }
        }

        if (targetType === CommandBalanceTargetType.CARD_NUMBER) {
          const cards = await this.productService.getUserCards(user.id)
          const foundCards =  cards.filter(
            card => card.number.search(target.toLowerCase()) !== -1
          )
          if (!foundCards.length) {
            return {
              error: true,
              commandType: command.type,
              text: "Я не смог найти у вас такую карту, попробуйте еще раз"
            }
          }

          return {
            error: false,
            text: `Баланс вашей карты составляет ${convertNumberToWordsRu((foundCards[0].account.balance / 100).toString())}`,
            params: {
              accountId: foundCards[0].accountId,
              balance: foundCards[0].account.balance,
              targetType
            } as BalanceRecognizedCommandParamsDto
          }
        }

        if (targetType === CommandBalanceTargetType.DEBIT) {
          const card = await this.productService.getUserDebitCard(user.id)
          if (!card) {
            return {
              error: true,
              commandType: command.type,
              text: "Я не вижу у вас дебетовую карту, уточните запрос"
            }
          }

          return {
            error: false,
            text: `Баланс вашей дебетовой карты составляет ${convertNumberToWordsRu(card.account.balance / 100).toString()}`,
            params: {
              accountId: card.accountId,
              balance: card.account.balance,
              targetType
            } as BalanceRecognizedCommandParamsDto
          }
        }

        if (targetType === CommandBalanceTargetType.CREDIT) {
          const card = await this.productService.getUserCreditCard(user.id)
          if (!card) {
            return {
              error: true,
              commandType: command.type,
              text: "Я не смог найти у вас кредитную карту, уточните запрос"
            }
          }

          return {
            error: false,
            text: `Баланс вашей кредитной карты составляет ${convertNumberToWordsRu(card.account.balance / 100).toString()}`,
            params: {
              accountId: card.accountId,
              balance: card.account.balance,
              targetType
            } as BalanceRecognizedCommandParamsDto
          }
        }
      }
    } else {
      // recogn error
      if (command.errorType === "recognition_error") {
        return {
          error: true,
          text: "Я не смог распознать вашу команду"
        }
      }

      // transfer errors
      if (command.type === CommandType.TRANSFER) {
        if (command.errorType === "wrong_address") {
          return {
            error: true,
            commandType: command.type,
            text: "Я не смог понять, куда мне нужно перевести деньги."
          }
        }
        if (command.errorType === 'wrong_amount') {
          return {
            error: true,
            commandType: command.type,
            text: "Я не смог понять, какую сумму мне нужно перевести, повторите пожалуйста."
          }
        }
      }

      if (command.type === CommandType.BALANCE) {
        if (command.errorType === "wrong_target") {
          return {
            error: true,
            commandType: command.type,
            text: "Я не смог понять, на какой карте вы хотите посмотреть баланс, уточните пожалуйста"
          }
        }
      }

      return {
        error: true,
        text: "Я не смог понять вас, повторите пожалуйста"
      }
    }
  }

  serializeCommand(command: Command): RecognizedCommandDto {
    const operation = command.operation
    if (operation.operationType === OperationType.TRANSFER_OUT) {
      return {
        commandType: CommandType.TRANSFER,
        error: false,
        text: "Открываю страницу для совершения операции перевода",
        params: operation.details as TransferRecognizedCommandParamsDto,
      }
    } else if (operation.operationType === OperationType.PAYMENT) {
      return {
        commandType: CommandType.PAYMENT,
        error: false,
        text: "Открываю страницу для совершения операции оплаты",
        params: operation.details as PaymentRecognizedCommandParamsDto
      }
    } else {
      return {
        error: true,
        text: `Возникла непредвиденная ошибка, попробуйте еще раз`
      }
    }
  }
}