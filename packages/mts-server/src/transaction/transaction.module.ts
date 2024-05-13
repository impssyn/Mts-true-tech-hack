import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Payment} from "./models/payment.model";
import {Transfer} from "./models/transfer.model";
import {TransactionController} from "./transaction.controller";
import {TransactionService} from "./transaction.service";
import {OperationModule} from "../operation/operation.module";
import {AccountModule} from "../account/account.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Payment, Transfer
    ]),
    OperationModule,
    AccountModule,
    AuthModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {
}