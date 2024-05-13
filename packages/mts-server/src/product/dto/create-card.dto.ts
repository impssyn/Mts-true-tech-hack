import {CardType} from "../models/card.model";

export class CreateCardDto {
  userId: number;
  number: string
  cv: string;
  expirationYear: string;
  expirationMonth: string;
  cardType: CardType;
  balance: number;
}