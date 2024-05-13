import {BelongsTo, Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {User} from "../../user/models/user.model";
import {Transfer} from "../../transaction/models/transfer.model";

export enum OperationType {
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
  PAYMENT = 'payment',
  COMMAND = 'command'
  // ...other
}

export type OperationCreationAttrs = {
  operationType: OperationType;
  userId: number;
  details: any;
}

@Table
export class Operation extends Model<Operation, OperationCreationAttrs> {
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
  operationType: OperationType;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  // поле нужно лишь для простоты получения и вывода информации
  @Column({
    type: DataTypes.JSON,
    allowNull: true
  })
  get details() {
    const raw = this.getDataValue('details') as string
    return JSON.parse(raw)
  }
  set details(value: any) {
    this.setDataValue('details', JSON.stringify(value))
  }

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}