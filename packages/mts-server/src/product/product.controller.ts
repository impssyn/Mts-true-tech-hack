import {Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors} from "@nestjs/common";
import {TransactionInterceptor} from "../common/interceptors/transaction.interceptor";
import {CreateCardDto} from "./dto/create-card.dto";
import {ProductService} from "./product.service";
import {TransactionParams} from "../common/decorators/transaction-params.decorator";
import {Transaction} from "sequelize";
import {SuccessDto} from "../common/dto/success.dto";
import {Auth} from "../auth/decorators/auth.decorator";
import {GetUser} from "../auth/decorators/get-user.decorator";
import {AtPayloadDto} from "../auth/dto/at-payload.dto";
import {ProductsDto} from "./dto/products.dto";
import {ProductCardDto} from "./dto/product-card.dto";
import {CardDto} from "./dto/card.dto";
import {AccountDto} from "../account/dto/account.dto";
import {AccountService} from "../account/account.service";
import {TransactionService} from "../transaction/transaction.service";

@Controller('/products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  @Post('/cards')
  @UseInterceptors(TransactionInterceptor)
  async createUserCard(
    @Body() dto: CreateCardDto,
    @TransactionParams() transaction: Transaction
  ): Promise<SuccessDto> {
    await this.productService.createCard(
      dto,
      transaction
    )

    return {
      success: true
    }
  }

  @Get('/my')
  @Auth()
  async getMyProducts(
    @GetUser() user: AtPayloadDto
  ): Promise<ProductsDto> {
    const cards = await this.productService.getUserCards(user.id)

    const productCardsDto: ProductCardDto[] = cards.map(card => ({
      card: new CardDto(card.toJSON()),
      account: new AccountDto(card.account.toJSON())
    }))

    const totalBalance = await this.accountService.getFullBalanceUser(user.id)
    const spentInMonth = await this.transactionService.userSpentInMonth(user.id)
    return new ProductsDto({
      cards: productCardsDto,
      totalBalance,
      spentInMonth
    })
  }
}