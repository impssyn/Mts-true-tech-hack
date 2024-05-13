import {Type} from "class-transformer";
import {CardDto} from "./card.dto";
import {AccountDto} from "../../account/dto/account.dto";

export class ProductCardDto {
  @Type(() => CardDto)
  card: CardDto;

  @Type(() => AccountDto)
  account: AccountDto;
}