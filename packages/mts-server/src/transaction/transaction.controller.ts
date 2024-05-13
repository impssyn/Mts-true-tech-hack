import {Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors} from "@nestjs/common";
import {TransactionInterceptor} from "../common/interceptors/transaction.interceptor";
import {TransactionParams} from "../common/decorators/transaction-params.decorator";
import {Transaction} from "sequelize";
import {SuccessDto} from "../common/dto/success.dto";
import {TransactionService} from "./transaction.service";
import {Auth} from "../auth/decorators/auth.decorator";
import {GetUser} from "../auth/decorators/get-user.decorator";
import {AtPayloadDto} from "../auth/dto/at-payload.dto";
import {TransferDto} from "./dto/transfer.dto";
import {PayDto} from "./dto/pay.dto";
import {TransferCheckDto} from "./dto/transfer-check.dto";
import {TransferCheckResponseDto} from "./dto/transfer-check-response.dto";
import {getHiddenName} from "../user/user.helpers";

@Controller('/transaction')
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionController {
  constructor(
    private transactionService: TransactionService
  ) {}

  @Post('/transfer/check')
  @Auth()
  @UseInterceptors(TransactionInterceptor)
  async transferCheck(
    @GetUser() user: AtPayloadDto,
    @Body() dto: TransferCheckDto,
    @TransactionParams() transaction: Transaction
  ): Promise<TransferCheckResponseDto> {
    const account = await this.transactionService.transferCheck(
      user,
      dto
    )

    return {
      recipient: getHiddenName(account.user),
      destAccountId: account.id
    }
  }

  @Post('/transfer')
  @Auth()
  @UseInterceptors(TransactionInterceptor)
  async transfer(
    @GetUser() user: AtPayloadDto,
    @Body() dto: TransferDto,
    @TransactionParams() transaction: Transaction
  ): Promise<SuccessDto> {
    await this.transactionService.transfer(
      user,
      dto,
      transaction
    )

    return {
      success: true
    }
  }

  @Post('/pay')
  @Auth()
  @UseInterceptors(TransactionInterceptor)
  async pay(
    @GetUser() user: AtPayloadDto,
    @Body() dto: PayDto,
    @TransactionParams() transaction: Transaction
  ): Promise<SuccessDto> {
    await this.transactionService.pay(
      user,
      dto,
      transaction
    )

    return {
      success: true
    }
  }
}