import {BelongsTo, Column, CreatedAt, DefaultScope, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {hash} from "../../common/utils/hash";
import {User} from "../../user/models/user.model";
import {Account} from "../../account/models/account.model";


export type TransferCreationAttrs = {
  amount: number;
  destAccountId: number;
  billingAccountId: number;
}

export const transferDefaultScope = {
  include: [{
    model: Account,
    as: 'destAccount'
  }, {
    model: Account,
    as: 'billingAccount'
  }]
}

@Table
@DefaultScope(() => transferDefaultScope)
export class Transfer extends Model<Transfer, TransferCreationAttrs> {
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

  @ForeignKey(() => Account)
  billingAccountId: number;
  @BelongsTo(() => Account, 'billingAccountId')
  billingAccount: Account;

  @ForeignKey(() => Account)
  destAccountId: number;
  @BelongsTo(() => Account, 'destAccountId')
  destAccount: Account;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}