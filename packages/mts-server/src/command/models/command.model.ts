import {BelongsTo, Column, CreatedAt, DefaultScope, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {User} from "../../user/models/user.model";
import {Transfer} from "../../transaction/models/transfer.model";
import {Operation} from "../../operation/models/operation.model";


export type CommandCreationAttrs = {
  text: string;
  operationId: number;
  userId: number;
}

@Table
@DefaultScope(() => ({
  include: [User, Operation]
}))
export class Command extends Model<Command, CommandCreationAttrs> {
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  text: string;

  @ForeignKey(() => Operation)
  operationId: number;

  @BelongsTo(() => Operation, 'operationId')
  operation: Operation;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}