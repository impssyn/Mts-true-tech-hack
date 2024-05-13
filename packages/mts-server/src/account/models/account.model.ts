import {
  BelongsTo,
  Column,
  CreatedAt,
  DefaultScope,
  ForeignKey,
  HasOne, Model,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {User} from "../../user/models/user.model";
import {Card} from "../../product/models/card.model";

export type AccountCreationAttrs = {
  balance: number;
  userId: number;
}

@Table
@DefaultScope(() => ({
  include: [User, Card]
}))
export class Account extends Model<Account, AccountCreationAttrs> {
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
  balance: number;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasOne(() => Card, 'accountId')
  card: Card;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}