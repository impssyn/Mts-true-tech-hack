import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as jwt from "jsonwebtoken";


@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  sign(payload: NonNullable<unknown>, options: jwt.SignOptions) {
    return jwt.sign(payload, this.configService.getOrThrow('base.jwt_secret'), options)
  }

  verify<T = any>(token: string): T | null {
    try {
      return jwt.verify(token, this.configService.getOrThrow('base.jwt_secret')) as T
    } catch (e) {
      return null
    }
  }
}