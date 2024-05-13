import {Module} from "@nestjs/common";
import {CommandController} from "./command.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Command} from "./models/command.model";
import {AuthModule} from "../auth/auth.module";
import {AccountModule} from "../account/account.module";
import {OperationModule} from "../operation/operation.module";
import {CommandService} from "./command.service";
import {AiRecognitionService} from "./ai-recognition.service";
import {ConfigModule} from "@nestjs/config";
import {ProductModule} from "../product/product.module";

@Module({
  imports: [SequelizeModule.forFeature([
    Command
  ]), AuthModule, AccountModule, OperationModule, ConfigModule, ProductModule],
  controllers: [CommandController],
  providers: [CommandService, AiRecognitionService],
  exports: [CommandService, AiRecognitionService]
})
export class CommandModule {}