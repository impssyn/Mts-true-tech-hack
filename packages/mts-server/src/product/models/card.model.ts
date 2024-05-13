import {BelongsTo, Column, CreatedAt, DefaultScope, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {User} from "../../user/models/user.model";
import {Account} from "../../account/models/account.model";

export enum CardType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export type CardCreationAttrs = {
  number: string;
  cv: string;
  expirationYear: string;
  expirationMonth: string;
  cardType: CardType;
  accountId: number;
}

@Table
@DefaultScope(() => ({
  // include: [Account]
}))
export class Card extends Model<Card, CardCreationAttrs> {
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  })
  number: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  cv: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  expirationYear: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  expirationMonth: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: CardType.DEBIT
  })
  cardType: CardType;

  @ForeignKey(() => Account)
  accountId: number;
  @BelongsTo(() => Account, 'accountId')
  account: Account;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}