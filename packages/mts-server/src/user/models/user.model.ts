import {Column, CreatedAt, Model, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {hash} from "../../common/utils/hash";

export type UserCreationAttrs = {
  firstName: string;
  lastName: string;
  patronymic: string;
  username: string;
  email: string;
  phoneNumber: string;
  isManager: boolean;
  passwordHash: string;
}

@Table
export class User extends Model<User, UserCreationAttrs> {
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
  firstName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  lastName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  patronymic: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  })
  username: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  })
  phoneNumber: string;


  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  get passwordHash() {
    return this.getDataValue('passwordHash')
  }
  set passwordHash(raw: string) {
    const passwordHash = hash(raw);
    this.setDataValue('passwordHash', passwordHash);
  }

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isManager: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}