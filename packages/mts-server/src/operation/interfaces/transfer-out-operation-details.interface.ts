import {getHiddenName} from "../../user/user.helpers";

export interface ITransferOutOperationDetails {
  transferId?: number;
  amount: number;
  recipient: string;
  recipientCardNumber: string;
  destAccountId: number;
  billingAccountId: number;
}