import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {Card, CardType} from "../models/card.model";
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class CardDto extends BaseResponseDto<CardDto, Card> {
  @Expose()
  number: string;

  @Expose()
  cv: string;

  @Expose()
  expirationYear: string;

  @Expose()
  expirationMonth: string;

  @Expose()
  cardType: CardType;
}