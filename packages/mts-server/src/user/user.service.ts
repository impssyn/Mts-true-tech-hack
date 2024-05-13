import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Op, WhereOptions} from "sequelize";
import {BadRequestException} from "@nestjs/common";

export class UserService {
  constructor(
    @InjectModel(User) private userRepo: typeof User
  ) {}

  async createUser(dto: CreateUserDto) {
    const isExist = !!(await this.userRepo.count({
      where: {
        [Op.or]: [{
          email: dto.email,
        }, {
          phoneNumber: dto.phone
        }, {
          username: dto.username
        }],
      }
    }))

    if (isExist) {
      throw new BadRequestException('session is exist')
    }

    return this.userRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      patronymic: dto.patronymic,
      username: dto.username,
      email: dto.email,
      phoneNumber: dto.phone,
      isManager: dto.isManager,
      passwordHash: dto.pwd
    })
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    return this.userRepo.update( {
      firstName: dto.firstName,
      lastName: dto.lastName,
      patronymic: dto.patronymic,
      email: dto.email,
      phoneNumber: dto.phone,
      isManager: dto.isManager
    }, {
      where: {
        id: userId
      }
    })
  }

  async getUserByLpe(lpe: string) {
    return this.userRepo.findOne({
      where: {
        [Op.or]: [{
          email: lpe,
        }, {
          phoneNumber: lpe
        }, {
          username: lpe
        }],
      }
    })
  }

  async getUserByIdOrThrow(userId: number) {
    const user = await this.userRepo.findByPk(userId)
    if (!user) throw new BadRequestException('Пользователь не найден')
    return user
  }
}