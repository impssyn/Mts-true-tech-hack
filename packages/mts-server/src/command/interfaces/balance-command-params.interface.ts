export enum CommandBalanceTargetType {
  CARD_NUMBER = 'card_number',
  FULL = 'full',
  DEBIT = 'debit',
  CREDIT = 'credit'
}


export interface IBalanceCommandParams {
  target?: string;
  targetType?: CommandBalanceTargetType;
}