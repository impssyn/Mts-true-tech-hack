import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Card} from "./models/card.model";
import {AccountModule} from "../account/account.module";
import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {AuthModule} from "../auth/auth.module";
import {TransactionModule} from "../transaction/transaction.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Card
    ]),
    AccountModule,
    TransactionModule,
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}