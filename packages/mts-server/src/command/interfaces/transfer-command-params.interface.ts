export enum CommandTransferAddressType {
  PHONE_NUMBER='phone_number',
  CARD_NUMBER='card_number'
}

export interface ITransferCommandParams {
  address: string;
  addressType: CommandTransferAddressType;
  amount: number;
}