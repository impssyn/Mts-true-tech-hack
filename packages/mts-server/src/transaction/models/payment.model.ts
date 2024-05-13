import {BelongsTo, Column, CreatedAt, DefaultScope, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {hash} from "../../common/utils/hash";
import {User} from "../../user/models/user.model";
import {Account} from "../../account/models/account.model";

export enum PaymentType {
  MOBILE = 'mobile',
}

export type PaymentCreationAttrs = {
  amount: number;
  accountId: number;
  paymentType: PaymentType;
  data: any;
}

export const paymentDefaultScope = {
  include: [Account]
}

@Table
@DefaultScope(() => paymentDefaultScope)
export class Payment extends Model<Payment, PaymentCreationAttrs> {
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false
  })
  amount: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: PaymentType.MOBILE
  })
  paymentType: PaymentType;

  @Column({
    type: DataTypes.JSON,
    allowNull: true
  })
  get data() {
    const raw = this.getDataValue('data') as string
    return JSON.parse(raw)
  }
  set data(value: any) {
    this.setDataValue('data', JSON.stringify(value))
  }


  @ForeignKey(() => Account)
  accountId: number;

  @BelongsTo(() => Account, 'accountId')
  account: Account;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}