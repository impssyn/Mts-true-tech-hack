import {PaymentType} from "../models/payment.model";

export class PayDto {
  accountId: number;
  amount: number;
  paymentType: PaymentType;
  data: any;
}