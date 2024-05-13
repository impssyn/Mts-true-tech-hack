import {PaymentType} from "../../transaction/models/payment.model";

export interface IPaymentOperationDetails {
  paymentId: number;
  amount: number;
  paymentType: PaymentType;
  accountId: number;
}