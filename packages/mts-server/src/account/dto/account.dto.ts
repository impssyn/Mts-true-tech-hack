import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {Account} from "../models/account.model";
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class AccountDto extends BaseResponseDto<AccountDto, Account> {
  @Expose()
  id: number;

  @Expose()
  balance: number;
}