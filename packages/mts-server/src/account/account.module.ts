import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Account} from "./models/account.model";
import {AccountService} from "./account.service";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Account
    ])
  ],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}