import {BadRequestException, Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER, Cache} from "@nestjs/cache-manager";
import {LoginDto} from "./dto/login.dto";
import {UserService} from "../user/user.service";
import {compare} from "../common/utils/hash";
import {JwtService} from "./jwt.service";
import {AtPayloadDto} from "./dto/at-payload.dto";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async login(dto: LoginDto) {
    const candidate = await this.userService.getUserByLpe(dto.lpe)
    if (!candidate || !compare(dto.pwd, candidate.passwordHash)) {
      throw new BadRequestException('Пользователь с такими данными не найден')
    }

    const payload: AtPayloadDto = {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      patronymic: candidate.patronymic,
      email: candidate.email,
      phone: candidate.phoneNumber,
      isManager: candidate.isManager
    }
    const token = this.createAccessToken(payload)

    return {
      token,
      payload
    }
  }

  createAccessToken(payload: AtPayloadDto): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('base.access_token_ttl_ms') / 1000
    })
  }
}