import {Module} from "@nestjs/common";
import {ProductModule} from "../product/product.module";
import {ProductController} from "../product/product.controller";
import {TransactionService} from "../transaction/transaction.service";
import {OperationService} from "./operation.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Operation} from "./models/operation.model";
import {OperationController} from "./operation.controller";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Operation
    ]),
    AuthModule
  ],
  controllers: [OperationController],
  providers: [OperationService],
  exports: [OperationService]
})
export class OperationModule {}